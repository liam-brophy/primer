// Function to manage products (get, create, update, delete)
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
    const products = db.collection('products');
    
    // Handle different HTTP methods
    switch (event.httpMethod) {
      case 'GET':
        // List all products or get a specific product
        if (event.queryStringParameters && event.queryStringParameters.id) {
          const product = await products.findOne({ 
            _id: new ObjectId(event.queryStringParameters.id) 
          });
          
          if (!product) {
            return {
              statusCode: 404,
              body: JSON.stringify({ error: 'Product not found' })
            };
          }
          
          return {
            statusCode: 200,
            body: JSON.stringify({ product })
          };
        } else {
          // List all products
          const productList = await products.find({}).toArray();
          return {
            statusCode: 200,
            body: JSON.stringify({ products: productList })
          };
        }
        
      case 'POST':
        // Create a new product
        const newProduct = JSON.parse(event.body);
        
        // Basic validation
        if (!newProduct.name || !newProduct.price) {
          return {
            statusCode: 400,
            body: JSON.stringify({ error: 'Name and price are required' })
          };
        }
        
        // Add timestamps
        newProduct.createdAt = new Date();
        newProduct.updatedAt = new Date();
        
        const result = await products.insertOne(newProduct);
        return {
          statusCode: 201,
          body: JSON.stringify({
            success: true,
            productId: result.insertedId,
            product: newProduct
          })
        };
        
      case 'PUT':
        // Update an existing product
        if (!event.queryStringParameters || !event.queryStringParameters.id) {
          return {
            statusCode: 400,
            body: JSON.stringify({ error: 'Product ID is required' })
          };
        }
        
        const productId = event.queryStringParameters.id;
        const updates = JSON.parse(event.body);
        
        // Add updatedAt timestamp
        updates.updatedAt = new Date();
        
        // Don't allow changing the _id
        if (updates._id) {
          delete updates._id;
        }
        
        const updateResult = await products.updateOne(
          { _id: new ObjectId(productId) },
          { $set: updates }
        );
        
        if (updateResult.matchedCount === 0) {
          return {
            statusCode: 404,
            body: JSON.stringify({ error: 'Product not found' })
          };
        }
        
        return {
          statusCode: 200,
          body: JSON.stringify({
            success: true,
            message: 'Product updated successfully'
          })
        };
        
      case 'DELETE':
        // Delete a product
        if (!event.queryStringParameters || !event.queryStringParameters.id) {
          return {
            statusCode: 400,
            body: JSON.stringify({ error: 'Product ID is required' })
          };
        }
        
        const deleteId = event.queryStringParameters.id;
        const deleteResult = await products.deleteOne({ 
          _id: new ObjectId(deleteId) 
        });
        
        if (deleteResult.deletedCount === 0) {
          return {
            statusCode: 404,
            body: JSON.stringify({ error: 'Product not found' })
          };
        }
        
        return {
          statusCode: 200,
          body: JSON.stringify({
            success: true,
            message: 'Product deleted successfully'
          })
        };
        
      default:
        return {
          statusCode: 405,
          body: JSON.stringify({ error: 'Method not allowed' })
        };
    }
  } catch (error) {
    console.error('Error managing products:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message })
    };
  } finally {
    await client.close();
  }
};
