require("dotenv").config();

console.log(process.env.OPENAI_API_KEY);

const express = require('express');

const app = express();

app.use(express.static('../frontend'));

app.get('/api/config', (req, res) => {
    res.json({ apiKey: process.env.OPENAI_API_KEY });
  });  

app.listen(3000, () => {
    console.log('Server is running on port 3000');
})