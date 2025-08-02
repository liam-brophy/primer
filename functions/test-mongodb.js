// Test MongoDB connection independently
const { MongoClient } = require('mongodb');

exports.handler = async (event, context) => {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS'
  };

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' };
  }

  if (!process.env.MONGODB_URI) {
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: 'MongoDB URI not configured' })
    };
  }

  try {
    console.log('Testing MongoDB connection...');
    const client = new MongoClient(process.env.MONGODB_URI, {
      serverSelectionTimeoutMS: 5000, // 5 second timeout
      connectTimeoutMS: 5000,
    });
    
    await client.connect();
    console.log('Connected to MongoDB');
    
    // Test database access
    const db = client.db('primerdb');
    const collections = await db.listCollections().toArray();
    
    await client.close();
    
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        success: true,
        message: 'MongoDB connection successful',
        collections: collections.map(c => c.name)
      })
    };

  } catch (error) {
    console.error('MongoDB connection error:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        error: 'MongoDB connection failed',
        details: error.message
      })
    };
  }
};
