// Test function to debug API issues
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
    console.log('Environment check:');
    console.log('STRIPE_SECRET_KEY exists:', !!process.env.STRIPE_SECRET_KEY);
    console.log('MONGODB_URI exists:', !!process.env.MONGODB_URI);
    
    // Parse the incoming JSON
    const data = JSON.parse(event.body || '{}');
    console.log('Received data:', data);
    
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        message: 'Test function working',
        hasStripeKey: !!process.env.STRIPE_SECRET_KEY,
        hasMongoUri: !!process.env.MONGODB_URI,
        receivedData: data
      })
    };

  } catch (error) {
    console.error('Error in test function:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ 
        error: error.message,
        stack: error.stack 
      })
    };
  }
};
