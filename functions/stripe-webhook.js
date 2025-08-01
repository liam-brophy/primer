const { MongoClient, ObjectId } = require('mongodb');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

exports.handler = async (event, context) => {
  // Only accept POST requests
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  // Get the signature from the headers
  const signature = event.headers['stripe-signature'];
  
  let stripeEvent;
  
  try {
    // Verify the webhook signature
    stripeEvent = stripe.webhooks.constructEvent(
      event.body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (error) {
    return {
      statusCode: 400,
      body: `Webhook Error: ${error.message}`
    };
  }
  
  const client = new MongoClient(process.env.MONGODB_URI);
  
  try {
    await client.connect();
    const db = client.db('primerdb');
    const orders = db.collection('orders');
    
    // Handle the event
    switch (stripeEvent.type) {
      case 'checkout.session.completed': {
        const session = stripeEvent.data.object;
        
        // Update the order status in the database
        await orders.updateOne(
          { stripeSessionId: session.id },
          { 
            $set: { 
              paymentStatus: 'paid',
              status: 'processing',
              paymentDate: new Date(),
              paymentAmount: session.amount_total / 100, // Convert cents to dollars
              stripePaymentId: session.payment_intent
            } 
          }
        );
        
        // Here you could also send a confirmation email to the customer
        // using a service like SendGrid, Mailgun, etc.
        
        break;
      }
      case 'checkout.session.expired': {
        const session = stripeEvent.data.object;
        
        // Update the order status to expired
        await orders.updateOne(
          { stripeSessionId: session.id },
          { $set: { paymentStatus: 'expired' } }
        );
        
        break;
      }
    }
    
    return {
      statusCode: 200,
      body: JSON.stringify({ received: true })
    };
  } catch (error) {
    console.error('Error processing webhook:', error);
    return {
      statusCode: 500,
      body: `Webhook Error: ${error.message}`
    };
  } finally {
    await client.close();
  }
};
