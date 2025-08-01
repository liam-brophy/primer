// setup-db.js - Script to set up MongoDB collections and indexes
require('dotenv').config();
const { MongoClient } = require('mongodb');

async function setupDatabase() {
  const client = new MongoClient(process.env.MONGODB_URI);
  
  try {
    console.log('Connecting to MongoDB...');
    await client.connect();
    console.log('Connected successfully!');
    
    const db = client.db('primerdb');
    
    // 1. Orders Collection
    console.log('Setting up orders collection...');
    
    // Check if collection exists, create if it doesn't
    const collections = await db.listCollections({ name: 'orders' }).toArray();
    if (collections.length === 0) {
      await db.createCollection('orders');
      console.log('Created orders collection');
    } else {
      console.log('Orders collection already exists');
    }
    
    // Create indexes for better query performance
    await db.collection('orders').createIndex({ paymentIntentId: 1 }, { unique: true });
    await db.collection('orders').createIndex({ 'customerInfo.email': 1 });
    await db.collection('orders').createIndex({ status: 1 });
    await db.collection('orders').createIndex({ createdAt: -1 });
    
    console.log('Created indexes on orders collection');
    
    // 2. Customers Collection - for future use
    console.log('Setting up customers collection...');
    
    const customerCollections = await db.listCollections({ name: 'customers' }).toArray();
    if (customerCollections.length === 0) {
      await db.createCollection('customers');
      console.log('Created customers collection');
    } else {
      console.log('Customers collection already exists');
    }
    
    // Create indexes for customer collection
    await db.collection('customers').createIndex({ email: 1 }, { unique: true });
    await db.collection('customers').createIndex({ name: 1 });
    
    console.log('Created indexes on customers collection');
    
    // 3. Products Collection - for future use with regular orders
    console.log('Setting up products collection...');
    
    const productCollections = await db.listCollections({ name: 'products' }).toArray();
    if (productCollections.length === 0) {
      await db.createCollection('products');
      console.log('Created products collection');
      
      // Insert the preorder product as an initial product
      await db.collection('products').insertOne({
        name: 'Primer - Volume One',
        description: 'Primer Volume One - Limited Edition Pre-order',
        price: 2399, // in cents, $23.99
        imageUrl: '/images/Primer_Mockup_1.png',
        inStock: true,
        isPreorder: true,
        createdAt: new Date()
      });
      console.log('Added initial product (Primer - Volume One)');
    } else {
      console.log('Products collection already exists');
    }
    
    // Create indexes for products collection
    await db.collection('products').createIndex({ name: 1 });
    await db.collection('products').createIndex({ isPreorder: 1 });
    
    console.log('Created indexes on products collection');
    
    console.log('Database setup complete!');
    
  } catch (error) {
    console.error('Error setting up database:', error);
  } finally {
    await client.close();
    console.log('Database connection closed');
  }
}

// Run the setup
setupDatabase();
