// Comprehensive MongoDB Atlas connection test
const { MongoClient } = require('mongodb');
require('dotenv').config();

async function testConnection() {
  console.log('🔍 Testing MongoDB Atlas connection...\n');
  
  const uri = process.env.MONGODB_URI;
  
  if (!uri) {
    console.error('❌ MONGODB_URI environment variable not found!');
    console.error('Make sure you have a .env file with the MongoDB connection string.');
    return false;
  }
  
  console.log('Connection URI:', uri.replace(/pas1kY8f7BSzSNmU/, '***PASSWORD***'));
  console.log('');
  
  const client = new MongoClient(uri, {
    serverSelectionTimeoutMS: 10000, // 10 second timeout
    connectTimeoutMS: 10000,
    socketTimeoutMS: 10000,
    maxPoolSize: 1
  });
  
  try {
    console.log('⏳ Attempting to connect...');
    await client.connect();
    console.log('✅ Successfully connected to MongoDB Atlas!');
    
    console.log('\n📊 Testing database operations...');
    const db = client.db('primerdb');
    
    // Test ping
    console.log('🏓 Pinging database...');
    await db.command({ ping: 1 });
    console.log('✅ Ping successful');
    
    // Test listing collections
    console.log('\n📂 Listing collections...');
    const collections = await db.listCollections().toArray();
    console.log('Collections found:', collections.length > 0 ? collections.map(c => c.name) : 'No collections found (this is normal for new databases)');
    
    // Test creating a test document
    console.log('\n📝 Testing write operation...');
    const testCollection = db.collection('connection_test');
    const testDoc = {
      test: true,
      timestamp: new Date(),
      message: 'Connection test successful',
      nodeVersion: process.version
    };
    
    const insertResult = await testCollection.insertOne(testDoc);
    console.log('✅ Test document inserted with ID:', insertResult.insertedId);
    
    // Test reading the document back
    console.log('\n📖 Testing read operation...');
    const retrievedDoc = await testCollection.findOne({ _id: insertResult.insertedId });
    console.log('✅ Test document retrieved:', retrievedDoc ? 'Success' : 'Failed');
    
    // Clean up test document
    console.log('\n🧹 Cleaning up test document...');
    await testCollection.deleteOne({ _id: insertResult.insertedId });
    console.log('✅ Test document cleaned up');
    
    // Test orders collection (what your app uses)
    console.log('\n📦 Testing orders collection...');
    const ordersCollection = db.collection('orders');
    const orderCount = await ordersCollection.countDocuments();
    console.log('Orders collection exists with', orderCount, 'documents');
    
    console.log('\n🎉 All MongoDB operations successful!');
    console.log('\n✅ Your MongoDB Atlas connection is working perfectly!');
    console.log('The issue might be specific to the Netlify function environment.');
    
    return true;
    
  } catch (error) {
    console.error('\n❌ MongoDB connection failed!');
    console.error('Error type:', error.constructor.name);
    console.error('Error message:', error.message);
    
    if (error.code) {
      console.error('Error code:', error.code);
    }
    
    if (error.codeName) {
      console.error('Error code name:', error.codeName);
    }
    
    // Specific error diagnostics
    if (error.message.includes('Server selection timed out')) {
      console.error('\n🔍 DIAGNOSIS: Server selection timeout');
      console.error('This usually means:');
      console.error('1. ❌ Your IP address is not whitelisted in Atlas Network Access');
      console.error('2. ❌ The cluster is paused or stopped');
      console.error('3. ❌ Network connectivity issues (firewall, etc.)');
      console.error('4. ❌ Incorrect cluster hostname in connection string');
    } else if (error.message.includes('Authentication failed')) {
      console.error('\n🔍 DIAGNOSIS: Authentication failure');
      console.error('This usually means:');
      console.error('1. ❌ Incorrect username or password');
      console.error('2. ❌ User doesn\'t have permissions for this database');
      console.error('3. ❌ User account is disabled in Database Access');
    } else if (error.message.includes('ENOTFOUND')) {
      console.error('\n🔍 DIAGNOSIS: DNS resolution failure');
      console.error('This usually means:');
      console.error('1. ❌ Incorrect cluster hostname');
      console.error('2. ❌ Network connectivity issues');
      console.error('3. ❌ DNS configuration problems');
    }
    
    console.error('\n📋 RECOMMENDED ACTIONS:');
    console.error('1. 🌐 Check MongoDB Atlas dashboard > Network Access:');
    console.error('   - Add your current IP address');
    console.error('   - Or temporarily add 0.0.0.0/0 (allow all IPs) for testing');
    console.error('2. 🗄️  Check MongoDB Atlas dashboard > Clusters:');
    console.error('   - Ensure "PrimerCluster" is running (not paused)');
    console.error('   - Free tier clusters auto-pause after inactivity');
    console.error('3. 👤 Check MongoDB Atlas dashboard > Database Access:');
    console.error('   - Verify user "primer" exists and is enabled');
    console.error('   - Ensure user has "readWrite" permissions to "primerdb"');
    console.error('4. 🔗 Verify connection string format is correct');
    
    return false;
    
  } finally {
    try {
      await client.close();
      console.log('\n🔐 Database connection closed');
    } catch (closeError) {
      console.error('Error closing connection:', closeError.message);
    }
  }
}

// Run the test
console.log('MongoDB Atlas Connection Diagnostic Tool');
console.log('=====================================\n');

testConnection().then(success => {
  if (success) {
    console.log('\n🚀 Your MongoDB setup is working! The issue may be in the Netlify function deployment.');
  } else {
    console.log('\n🔧 Please fix the MongoDB Atlas configuration issues above.');
  }
}).catch(console.error);
