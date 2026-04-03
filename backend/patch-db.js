const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Product = require('./models/Product');

dotenv.config();

mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/cider-clothing', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(async () => {
    console.log('MongoDB Connected');
    
    // Some older mock products might have empty arrays or null for sizes/colors.
    const result = await Product.updateMany(
        { 
          $or: [
            { sizes: { $size: 0 } },
            { sizes: { $exists: false } },
            { sizes: { $eq: null } },
            { sizes: { $eq: "" } }
          ]
        },
        { 
          $set: { 
              sizes: ["S", "M", "L", "XL", "XXL"], 
              colors: ["Black", "White", "Navy", "Beige", "Olive Green"] 
          } 
        }
    );
    
    console.log(`Updated ${result.modifiedCount} products with default sizes and colors.`);
    process.exit(0);
}).catch(err => {
    console.error('Error connecting to MongoDB:', err);
    process.exit(1);
});
