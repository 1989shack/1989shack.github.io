const express = require('express');
const cors = require('cors');
require('dotenv').config();
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);




const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static('public'));


// Example health endpoint
app.get('/health', (req, res) => res.json({ok: true}));



// Create Stripe Checkout session
app.post('/create-checkout-session', async (req, res) => {
 try {
 const { items } = req.body;
 if (!items || !Array.isArray(items) || items.length === 0) {
 return res.status(400).json({ error: 'No items provided' });
 }