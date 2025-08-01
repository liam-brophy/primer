// Function to update order status when payment is completed
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const { MongoClient, ObjectId } = require('mongodb');

// MongoDB connection
const client = new MongoClient(process.env.MONGODB_URI);
const dbName = 'primerdb';
const ordersCollection = 'orders';

exports.handler = async (event, context) => {
  // This function is called when a payment is completed
  // It updates the order status in MongoDB and sends a confirmation email
  
  if (event.httpMethod !== 'GET') {
    return { statusCode: 405, body: JSON.stringify({ error: 'Method not allowed' }) };
  }

  const params = event.queryStringParameters;
  if (!params || !params.payment_intent) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: 'Missing payment intent ID' })
    };
  }

  const paymentIntentId = params.payment_intent;

  try {
    // Verify the payment with Stripe
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);
    
    if (paymentIntent.status !== 'succeeded') {
      return {
        statusCode: 400,
        body: JSON.stringify({ 
          error: 'Payment has not been completed',
          status: paymentIntent.status
        })
      };
    }

    // Update order status in MongoDB
    await client.connect();
    const db = client.db(dbName);
    const collection = db.collection(ordersCollection);
    
    const result = await collection.updateOne(
      { paymentIntentId: paymentIntentId },
      { 
        $set: { 
          status: 'processing',
          paymentStatus: 'paid',
          paidAt: new Date(),
          updatedAt: new Date(),
          // Add the Stripe charge ID if available
          stripeChargeId: paymentIntent.latest_charge || '',
          // Add the payment method details
          paymentMethod: paymentIntent.payment_method_details ? paymentIntent.payment_method_details.type : 'card'
        } 
      }
    );

    if (result.matchedCount === 0) {
      return {
        statusCode: 404,
        body: JSON.stringify({ error: 'Order not found' })
      };
    }

    // Get the updated order
    const order = await collection.findOne({ paymentIntentId: paymentIntentId });

    // Return the confirmation details
    return {
      statusCode: 200,
      body: JSON.stringify({
        success: true,
        message: 'Payment confirmed',
        orderDetails: {
          orderNumber: order._id,
          customerName: order.customerInfo.name,
          customerEmail: order.customerInfo.email,
          amount: paymentIntent.amount / 100, // Convert cents to dollars
          quantity: order.orderDetails.quantity,
          isPickup: order.orderDetails.isPickup
        }
      })
    };

  } catch (error) {
    console.error('Error confirming payment:', error);
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
