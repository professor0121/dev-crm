const express = require('express');
const app = express();
const router = require('./routes/router');
const connectDB = require('./config/connectDB');
const dotenv = require('dotenv');
dotenv.config();
const PORT = process.env.PORT;

// connectDB();
app.use(express.json());


app.use("/", router)
app.listen(PORT, () => {
  console.log(`the server is running on the port ${PORT}`)
}) 