10const express = require('express');
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




// Map incoming items to stripe line_items
const line_items = items.map(item => ({
  price_data: {
    currency: 'usd',
    product_data: {
      name: item.name,
      description: item.description || undefined
    },
    unit_amount: Math.round(item.price * 100) // dollars -> cents
  },
  quantity: item.quantity || 1
}));

const session = await stripe.checkout.sessions.create({
  payment_method_types: ['card'],
  line_items,
  mode: 'payment',
  success_url: `${process.env.DOMAIN}/success.html?session_id={CHECKOUT_SESSION_ID}`,
  cancel_url: `${process.env.DOMAIN}/cancel.html`
});

// Return session url for redirect (or id if you prefer client-side redirect via stripe.js)
res.json({ url: session.url });