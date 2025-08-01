// Test MongoDB connection
const { MongoClient } = require('mongodb');
require('dotenv').config();

async function testConnection() {
  // Create a new MongoClient
  const client = new MongoClient(process.env.MONGODB_URI);

  try {
    // Connect the client to the server
    console.log('Attempting to connect to MongoDB...');
    await client.connect();
    
    // Ping the database to verify connection
    await client.db("primerdb").command({ ping: 1 });
    console.log('✅ Connected successfully to MongoDB!');
    
    // List available collections in the database
    const collections = await client.db("primerdb").listCollections().toArray();
    
    if (collections.length === 0) {
      console.log('No collections found in the database yet. This is normal for a new database.');
      
      // Create orders collection if it doesn't exist
      await client.db("primerdb").createCollection("orders");
      console.log('Created "orders" collection.');
    } else {
      console.log('Collections in primerdb:');
      collections.forEach(collection => {
        console.log(` - ${collection.name}`);
      });
    }
    
    return true;
  } catch (error) {
    console.error('❌ Error connecting to MongoDB:', error);
    return false;
  } finally {
    // Close the connection
    await client.close();
    console.log('Connection closed');
  }
}

// Run the test
testConnection();

// Run the test
testConnection();
