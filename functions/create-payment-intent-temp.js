// Temporary version without MongoDB for testing
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

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
    
    // Calculate shipping - fixed rate of $4.99
    const shippingAmount = data.isPickup ? 0 : 499; // $4.99 in cents

    // Calculate total amount including shipping
    const totalAmount = amount + shippingAmount;

    // Create a payment intent with Stripe
    const paymentIntent = await stripe.paymentIntents.create({
      amount: totalAmount,
      currency: 'usd',
      shipping: data.isPickup ? undefined : {
        name: data.name,
        address: {
          line1: data.address || '',
          city: data.city || '',
          state: data.state || '',
          postal_code: data.zipCode || '',
          country: data.country || 'US'
        }
      },
      // Save customer information for later reference
      metadata: {
        name: data.name,
        email: data.email,
        phone: data.phone || '',
        address: data.formattedAddress || 'In-store pickup',
        quantity: quantity.toString(),
        isPickup: data.isPickup ? 'true' : 'false',
        notes: data.notes || '',
        shipping_amount: shippingAmount.toString(),
        subtotal: amount.toString(),
        shipping_rate: data.isPickup ? 'pickup' : 'fixed_4_99'
      }
    });

    console.log('Payment intent created successfully:', paymentIntent.id);
    
    // TODO: Store order in MongoDB when connection is fixed
    // For now, just log the order details
    console.log('Order details (not stored in DB yet):', {
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
        shipping: shippingAmount,
        total: totalAmount,
        isPickup: data.isPickup,
        notes: data.notes || '',
        shipping_rate_id: data.isPickup ? '' : 'shr_1S8qGFAr0WKar8jbC8LVSO2b'
      }
    });

    // Return the client secret and other info
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        clientSecret: paymentIntent.client_secret,
        amount: amount,
        shipping: shippingAmount,
        total: totalAmount,
        shippingRateId: data.isPickup ? null : 'shr_1S8qGFAr0WKar8jbC8LVSO2b',
        orderId: 'temp-' + paymentIntent.id // temporary order ID
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
};
