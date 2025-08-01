// Function to update or create customer record when a new order is placed
const { MongoClient, ObjectId } = require('mongodb');

// MongoDB connection
const client = new MongoClient(process.env.MONGODB_URI);
const dbName = 'primerdb';

exports.handler = async (event, context) => {
  // This function is called after a successful payment
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: JSON.stringify({ error: 'Method not allowed' }) };
  }

  try {
    const data = JSON.parse(event.body);
    if (!data.orderId) {
      return { 
        statusCode: 400, 
        body: JSON.stringify({ error: 'Missing order ID' }) 
      };
    }

    await client.connect();
    const db = client.db(dbName);
    
    // Get the order information
    const ordersCollection = db.collection('orders');
    const order = await ordersCollection.findOne({ 
      _id: new ObjectId(data.orderId) 
    });

    if (!order) {
      return { 
        statusCode: 404, 
        body: JSON.stringify({ error: 'Order not found' }) 
      };
    }

    // Get or create customer record
    const customersCollection = db.collection('customers');
    const customerEmail = order.customerInfo.email;
    
    // Check if customer exists
    const existingCustomer = await customersCollection.findOne({ 
      email: customerEmail 
    });

    if (existingCustomer) {
      // Update existing customer
      await customersCollection.updateOne(
        { email: customerEmail },
        { 
          $set: { 
            updatedAt: new Date() 
          },
          $addToSet: { 
            orderHistory: order._id.toString() 
          }
        }
      );
    } else {
      // Create new customer
      await customersCollection.insertOne({
        email: customerEmail,
        name: order.customerInfo.name,
        phone: order.customerInfo.phone || '',
        addresses: order.customerInfo.address ? 
          [{
            formattedAddress: order.customerInfo.address,
            isDefault: true
          }] : [],
        orderHistory: [order._id.toString()],
        createdAt: new Date(),
        updatedAt: new Date()
      });
    }

    return {
      statusCode: 200,
      body: JSON.stringify({ success: true })
    };
    
  } catch (error) {
    console.error('Error updating customer:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message })
    };
  } finally {
    await client.close();
  }
};
