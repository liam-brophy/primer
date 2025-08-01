const { MongoClient, ObjectId } = require('mongodb');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

exports.handler = async (event, context) => {
  // Get the session ID from query parameters
  const { session_id } = event.queryStringParameters || {};
  
  if (!session_id) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: 'Missing session_id parameter' })
    };
  }
  
  const client = new MongoClient(process.env.MONGODB_URI);
  
  try {
    // Connect to MongoDB
    await client.connect();
    const db = client.db('primer');
    const orders = db.collection('orders');
    
    // Find the order with this Stripe session ID
    const order = await orders.findOne({ stripeSessionId: session_id });
    
    if (!order) {
      return {
        statusCode: 404,
        body: JSON.stringify({ error: 'Order not found' })
      };
    }
    
    // Retrieve the checkout session from Stripe
    const session = await stripe.checkout.sessions.retrieve(session_id);
    
    // Return order details with payment information
    return {
      statusCode: 200,
      body: JSON.stringify({
        success: true,
        order: {
          id: order._id,
          name: order.name,
          email: order.email,
          quantity: order.quantity,
          isPickup: order.isPickup,
          address: order.isPickup ? 'Pickup in store' : order.formattedAddress,
          status: order.status,
          paymentStatus: order.paymentStatus,
          orderDate: order.orderDate,
          paymentAmount: session.amount_total / 100, // Convert cents to dollars
          notes: order.notes
        }
      })
    };
  } catch (error) {
    console.error('Error retrieving order:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message })
    };
  } finally {
    await client.close();
  }
};
