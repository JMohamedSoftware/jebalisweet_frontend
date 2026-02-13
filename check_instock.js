const mongoose = require('mongoose');
const Product = require('./backend/models/Product');
const dotenv = require('dotenv');
dotenv.config();

async function check() {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/jebalisweet');
    const products = await Product.find({}).limit(5);
    console.log('Sample Products InStock status:');
    products.forEach(p => {
        console.log(`Product: ${p.name}, inStock: ${p.inStock}, type: ${typeof p.inStock}`);
    });
    process.exit(0);
}

check();
