// Functions to create a Stripe payment intent
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const { MongoClient } = require('mongodb');

// MongoDB connection
const client = new MongoClient(process.env.MONGODB_URI);
const dbName = 'primerdb';
const ordersCollection = 'orders';

exports.handler = async (event, context) => {
  // Only allow POST requests
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: JSON.stringify({ error: 'Method not allowed' }) };
  }

  try {
    // Parse the incoming JSON
    const data = JSON.parse(event.body);
    
    // Validate required fields
    if (!data.name || !data.email || !data.quantity) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Missing required fields' })
      };
    }

    // Calculate the price
    const unitPrice = 2399; // $23.99 in cents
    const quantity = parseInt(data.quantity, 10);
    const amount = unitPrice * quantity;
    
    // Calculate shipping
    let shipping = 0;
    if (!data.isPickup) {
      // Example shipping calculation - you can make this more sophisticated
      shipping = data.country === 'US' ? 499 : 1999; // $4.99 domestic, $19.99 international
    }

    // Create a payment intent with Stripe
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount,
      currency: 'usd',
      // Save customer information for later reference
      metadata: {
        name: data.name,
        email: data.email,
        phone: data.phone || '',
        address: data.formattedAddress || 'In-store pickup',
        quantity: quantity.toString(),
        isPickup: data.isPickup ? 'true' : 'false',
        notes: data.notes || '',
        shipping: shipping.toString()
      }
    });

    // Store preliminary order in MongoDB
    await client.connect();
    const db = client.db(dbName);
    const collection = db.collection(ordersCollection);
    
    const orderRecord = {
      paymentIntentId: paymentIntent.id,
      customerInfo: {
        name: data.name,
        email: data.email,
        phone: data.phone || '',
        address: data.formattedAddress || 'In-store pickup',
      },
      orderDetails: {
        quantity: quantity,
        amount: amount,
        shipping: shipping,
        total: amount + shipping,
        isPickup: data.isPickup,
        notes: data.notes || '',
        products: [{
          productId: 'primer-volume-one',
          name: 'Primer - Volume One',
          price: unitPrice,
          quantity: quantity
        }]
      },
      status: 'pending',
      paymentStatus: 'pending',
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    await collection.insertOne(orderRecord);

    // Return the client secret and other info
    return {
      statusCode: 200,
      body: JSON.stringify({
        clientSecret: paymentIntent.client_secret,
        amount: amount,
        shipping: shipping,
        orderId: orderRecord._id
      })
    };

  } catch (error) {
    console.error('Error creating payment intent:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message })
    };
  } finally {
    // Close the MongoDB connection
    if (client) {
      await client.close();
    }
  }
};
