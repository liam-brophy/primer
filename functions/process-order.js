const { MongoClient, ObjectId } = require('mongodb');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

// Function to calculate shipping cost based on quantity and location
const calculateShipping = (quantity, country) => {
  // Base shipping cost
  let baseCost = 5.00;
  
  // Additional cost per book
  const additionalCostPerBook = 2.00;
  
  // International shipping surcharge
  const internationalSurcharge = country !== 'US' ? 10.00 : 0;
  
  // Calculate total shipping cost
  const shippingCost = baseCost + (additionalCostPerBook * (quantity - 1)) + internationalSurcharge;
  
  return Math.round(shippingCost * 100); // Convert to cents for Stripe
};

const { computeOrderAmounts } = require('./price-utils');

exports.handler = async (event, context) => {
  // Only accept POST requests
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: JSON.stringify({ error: 'Method Not Allowed' }) };
  }

  const client = new MongoClient(process.env.MONGODB_URI);
  
  try {
    // Parse the request body
    const data = JSON.parse(event.body);
    const { name, email, quantity, isPickup } = data;
    
    // Validate required fields
    if (!name || !email || !quantity) {
      return { 
        statusCode: 400, 
        body: JSON.stringify({ error: 'Missing required fields' }) 
      };
    }

    // Connect to MongoDB
    await client.connect();
    const db = client.db('primer');
    const orders = db.collection('orders');
    
    // Determine pricing (supports discount codes)
    const pricing = computeOrderAmounts(quantity, isPickup, data.discountCode);
    // Base product price in cents (may be overridden by discount)
    const bookPrice = pricing.unitPrice;
    
    // Create an order in MongoDB
    const order = {
      name,
      email,
      quantity: parseInt(quantity),
      isPickup,
      orderDate: new Date(),
      status: 'pending',
      paymentStatus: 'unpaid',
      ...(!isPickup && {
        address: data.address,
        city: data.city,
        state: data.state,
        zipCode: data.zipCode,
        country: data.country,
        formattedAddress: data.formattedAddress
      }),
      notes: data.notes || ''
    };
    
    const result = await orders.insertOne(order);
    const orderId = result.insertedId;

    // Create line items for Stripe
    const lineItems = [
      {
        price_data: {
          currency: 'usd',
          product_data: {
            name: 'Primer Volume One',
            description: 'Limited first edition'
          },
          unit_amount: bookPrice,
        },
        quantity: parseInt(quantity),
      }
    ];

    // Add shipping cost if not pickup and shipping is > 0
    if (!isPickup && pricing.shippingAmount > 0) {
      lineItems.push({
        price_data: {
          currency: 'usd',
          product_data: {
            name: 'Shipping',
            description: 'Standard shipping'
          },
          unit_amount: pricing.shippingAmount,
        },
        quantity: 1,
      });
    }
    
    // Create a Stripe Checkout Session
    const session = await stripe.checkout.sessions.create({
      customer_email: email,
      line_items: lineItems,
      mode: 'payment',
      success_url: `${process.env.URL}/order-confirmation?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.URL}/orders`,
      metadata: {
        orderId: orderId.toString(),
        discount_code: pricing.discountCode || ''
      }
    });
    
    // Update the order with the Stripe session ID
    await orders.updateOne(
      { _id: orderId },
      { $set: { stripeSessionId: session.id, pricing } }
    );
    
    // Return the session URL for redirect
    return {
      statusCode: 200,
      body: JSON.stringify({ 
        success: true, 
        orderId: orderId.toString(),
        sessionId: session.id,
        url: session.url
      })
    };
  } catch (error) {
    console.error('Error processing order:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message })
    };
  } finally {
    // Close the database connection
    await client.close();
  }
};
