const express = require('express');
const cors = require('cors');
require('dotenv').config();
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);




const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static('public'));