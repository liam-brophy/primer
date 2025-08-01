// Function to manage customers (list, view, update)
const { MongoClient, ObjectId } = require('mongodb');

exports.handler = async (event, context) => {
  // Basic auth - check for admin password
  const adminPassword = process.env.VITE_ADMIN_PASSWORD;
  const providedPassword = event.headers['x-admin-auth'];
  
  if (!adminPassword || providedPassword !== adminPassword) {
    return {
      statusCode: 401,
      body: JSON.stringify({ error: 'Unauthorized' })
    };
  }
  
  const client = new MongoClient(process.env.MONGODB_URI);
  
  try {
    await client.connect();
    const db = client.db('primerdb');
    const customers = db.collection('customers');
    const orders = db.collection('orders');
    
    // Handle different HTTP methods
    switch (event.httpMethod) {
      case 'GET':
        // List all customers or get a specific customer with their orders
        if (event.queryStringParameters && event.queryStringParameters.id) {
          const customerId = event.queryStringParameters.id;
          
          // Get customer details
          const customer = await customers.findOne({ 
            _id: new ObjectId(customerId) 
          });
          
          if (!customer) {
            return {
              statusCode: 404,
              body: JSON.stringify({ error: 'Customer not found' })
            };
          }
          
          // Get customer's orders
          const customerOrders = await orders.find({
            'customerInfo.email': customer.email
          }).sort({ createdAt: -1 }).toArray();
          
          return {
            statusCode: 200,
            body: JSON.stringify({ 
              customer: customer,
              orders: customerOrders
            })
          };
          
        } else if (event.queryStringParameters && event.queryStringParameters.email) {
          // Search by email
          const email = event.queryStringParameters.email;
          
          // Get customer details
          const customer = await customers.findOne({ 
            email: email 
          });
          
          if (!customer) {
            return {
              statusCode: 404,
              body: JSON.stringify({ error: 'Customer not found' })
            };
          }
          
          // Get customer's orders
          const customerOrders = await orders.find({
            'customerInfo.email': email
          }).sort({ createdAt: -1 }).toArray();
          
          return {
            statusCode: 200,
            body: JSON.stringify({ 
              customer: customer,
              orders: customerOrders
            })
          };
          
        } else {
          // List all customers with pagination
          const page = parseInt(event.queryStringParameters?.page) || 1;
          const limit = parseInt(event.queryStringParameters?.limit) || 20;
          const skip = (page - 1) * limit;
          
          // Get customers with order count
          const customerList = await customers.aggregate([
            {
              $lookup: {
                from: 'orders',
                localField: 'email',
                foreignField: 'customerInfo.email',
                as: 'orders'
              }
            },
            {
              $project: {
                _id: 1,
                name: 1,
                email: 1,
                phone: 1,
                createdAt: 1,
                orderCount: { $size: '$orders' },
                totalSpent: {
                  $sum: {
                    $map: {
                      input: {
                        $filter: {
                          input: '$orders',
                          as: 'order',
                          cond: { $eq: ['$$order.paymentStatus', 'paid'] }
                        }
                      },
                      as: 'paidOrder',
                      in: '$$paidOrder.orderDetails.total'
                    }
                  }
                }
              }
            },
            { $sort: { createdAt: -1 } },
            { $skip: skip },
            { $limit: limit }
          ]).toArray();
          
          // Get total count for pagination
          const totalCustomers = await customers.countDocuments({});
          
          return {
            statusCode: 200,
            body: JSON.stringify({
              customers: customerList,
              pagination: {
                page,
                limit,
                total: totalCustomers,
                pages: Math.ceil(totalCustomers / limit)
              }
            })
          };
        }
        
      case 'PUT':
        // Update customer details
        if (!event.queryStringParameters || !event.queryStringParameters.id) {
          return {
            statusCode: 400,
            body: JSON.stringify({ error: 'Customer ID is required' })
          };
        }
        
        const customerId = event.queryStringParameters.id;
        const updates = JSON.parse(event.body);
        
        // Add updatedAt timestamp
        updates.updatedAt = new Date();
        
        // Don't allow changing the _id or email
        if (updates._id) delete updates._id;
        if (updates.email) delete updates.email;
        
        const updateResult = await customers.updateOne(
          { _id: new ObjectId(customerId) },
          { $set: updates }
        );
        
        if (updateResult.matchedCount === 0) {
          return {
            statusCode: 404,
            body: JSON.stringify({ error: 'Customer not found' })
          };
        }
        
        return {
          statusCode: 200,
          body: JSON.stringify({
            success: true,
            message: 'Customer updated successfully'
          })
        };
        
      default:
        return {
          statusCode: 405,
          body: JSON.stringify({ error: 'Method not allowed' })
        };
    }
  } catch (error) {
    console.error('Error managing customers:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message })
    };
  } finally {
    await client.close();
  }
};
