require("dotenv").config();

const express = require('express');

const app = express();

app.use(express.static('./frontend'));


// Endpoint to get Google Maps API key
app.get('/api/google-maps-config', (req, res) => {
  res.json({ apiKey: process.env.MAPS_API_KEY });
});

// Endpoint to get OpenAI API key
app.get('/api/openai-config', (req, res) => {
  res.json({ apiKey: process.env.OPENAI_API_KEY });
});

const PORT = process.env.PORT || 3000;
app.listen(3000, () => {
    console.log(`Server is running on port ${PORT}`);
})