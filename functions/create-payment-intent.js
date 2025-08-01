// Functions to create a Stripe payment intent
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const { MongoClient } = require('mongodb');

// MongoDB connection
const client = new MongoClient(process.env.MONGODB_URI);
const dbName = 'primerdb';
const ordersCollection = 'orders';

exports.handler = async (event, context) => {
  // Enable CORS
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS'
  };

  // Handle preflight requests
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers,
      body: ''
    };
  }

  // Only allow POST requests
  if (event.httpMethod !== 'POST') {
    return { 
      statusCode: 405, 
      headers,
      body: JSON.stringify({ error: 'Method not allowed' }) 
    };
  }

  try {
    // Check for required environment variables
    if (!process.env.STRIPE_SECRET_KEY) {
      throw new Error('Stripe secret key is not configured');
    }
    
    if (!process.env.MONGODB_URI) {
      throw new Error('MongoDB URI is not configured');
    }

    // Parse the incoming JSON
    const data = JSON.parse(event.body);
    
    // Validate required fields
    if (!data.name || !data.email || !data.quantity) {
      return {
        statusCode: 400,
        headers,
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

    // TODO: Temporarily skip MongoDB due to connection issues
    // Store preliminary order in MongoDB
    /*
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
    */

    // For now, log the order details and use a temporary order ID
    console.log('Order details (MongoDB connection issue, not stored in DB):', {
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
        notes: data.notes || ''
      }
    });

    // Return the client secret and other info
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        clientSecret: paymentIntent.client_secret,
        amount: amount,
        shipping: shipping,
        orderId: 'temp-' + paymentIntent.id // temporary order ID until MongoDB is fixed
      })
    };

  } catch (error) {
    console.error('Error creating payment intent:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: error.message })
    };
  }
  // Note: MongoDB connection temporarily commented out due to connection issues
  // finally {
  //   // Close the MongoDB connection
  //   if (client) {
  //     await client.close();
  //   }
  // }
};
