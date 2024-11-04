require("dotenv").config();

console.log(process.env.OPENAI_API_KEY);

const express = require('express');

const app = express();

app.use(express.static('../frontend'));


// Endpoint to get Google Maps API key
app.get('/api/google-maps-config', (req, res) => {
  res.json({ apiKey: process.env.MAPS_API_KEY });
});

// Endpoint to get OpenAI API key
app.get('/api/openai-config', (req, res) => {
  res.json({ apiKey: process.env.OPENAI_API_KEY });
});

app.listen(3000, () => {
    console.log('Server is running on port 3000');
})