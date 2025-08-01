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
    
    // Base product price in cents
    const bookPrice = 2399; // $23.99
    
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
    
    // Add shipping cost if not pickup
    if (!isPickup) {
      const shippingCost = calculateShipping(parseInt(quantity), data.country);
      lineItems.push({
        price_data: {
          currency: 'usd',
          product_data: {
            name: 'Shipping',
            description: 'Standard shipping'
          },
          unit_amount: shippingCost,
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
      cancel_url: `${process.env.URL}/preorders`,
      metadata: {
        orderId: orderId.toString()
      }
    });
    
    // Update the order with the Stripe session ID
    await orders.updateOne(
      { _id: orderId },
      { $set: { stripeSessionId: session.id } }
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
