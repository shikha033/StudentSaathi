const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');

dotenv.config();
connectDB();

const app = express();

app.use(express.json());

// 👉 Set FRONTEND_URL in your .env once deployed, to lock CORS down to just
//    your Vercel site. Empty/local = allow all origins.
app.use(cors({
    origin: process.env.FRONTEND_URL || '*'
}));

app.use('/api/documents', require('./routes/documents'));
app.use('/api/auth', require('./routes/auth'));
app.use('/api/chat', require('./routes/chat'));

app.get('/', (req, res) => {
    res.send('StudentSaathi API is running...');
});

module.exports = app;
