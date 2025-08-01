const { MongoClient } = require('mongodb');

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
  
  // Get query parameters for filtering
  const params = event.queryStringParameters || {};
  const filter = {};
  
  // Apply filters if provided
  if (params.status) {
    filter.status = params.status;
  }
  
  if (params.paymentStatus) {
    filter.paymentStatus = params.paymentStatus;
  }
  
  const client = new MongoClient(process.env.MONGODB_URI);
  
  try {
    await client.connect();
    const db = client.db('primerdb');
    const orders = db.collection('orders');
    
    // Get summary statistics
    const stats = {
      total: await orders.countDocuments({}),
      pending: await orders.countDocuments({ status: 'pending' }),
      processing: await orders.countDocuments({ status: 'processing' }),
      shipped: await orders.countDocuments({ status: 'shipped' }),
      delivered: await orders.countDocuments({ status: 'delivered' }),
      cancelled: await orders.countDocuments({ status: 'cancelled' }),
      totalRevenue: 0
    };
    
    // Calculate total revenue from paid orders
    const revenuePipeline = [
      { $match: { paymentStatus: 'paid' } },
      { $group: {
          _id: null,
          total: { $sum: '$orderDetails.total' }
        }
      }
    ];
    
    const revenueResult = await orders.aggregate(revenuePipeline).toArray();
    if (revenueResult.length > 0) {
      stats.totalRevenue = revenueResult[0].total;
    }
    
    // Get sorted orders with pagination
    const page = parseInt(params.page) || 1;
    const limit = parseInt(params.limit) || 20;
    const skip = (page - 1) * limit;
    
    const orderList = await orders.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .toArray();
    
    // Get total count for pagination
    const totalOrders = await orders.countDocuments(filter);
    
    return {
      statusCode: 200,
      body: JSON.stringify({ 
        success: true,
        orders: orderList,
        stats: stats,
        pagination: {
          page,
          limit,
          total: totalOrders,
          pages: Math.ceil(totalOrders / limit)
        }
      })
    };
  } catch (error) {
    console.error('Error fetching orders:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message })
    };
  } finally {
    await client.close();
  }
};
