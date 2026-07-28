// Backend/app.js
// Builds the Express app itself. Kept separate from server.js so the exact
// same app can be run two ways:
//   1) as a normal always-on server (server.js) -> good for Render/Railway
//   2) as a Vercel serverless function (api/index.js) -> good for Vercel
// You don't need to touch this file.

const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');

dotenv.config();
connectDB();

const app = express();

app.use(express.json());


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
