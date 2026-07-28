
const mongoose = require('mongoose');

const connectDB = async () => {
    try {
       
        const conn = await mongoose.connect(process.env.MONGO_URI);

        console.log(`✅ MongoDB connected successfully: ${conn.connection.host}`);
    } catch (error) {
        console.error(`❌ MongoDB connection error: ${error.message}`);
        console.error('   Check that MONGO_URI in your .env file is correct and that your');
        console.error('   MongoDB Atlas IP access list includes 0.0.0.0/0 (allow from anywhere).');
        process.exit(1); // Exit with failure
    }
};

module.exports = connectDB;
