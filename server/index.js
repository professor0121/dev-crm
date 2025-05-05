const express = require('express');
const app = express();
const dotenv = require('dotenv');
dotenv.config();
const router = require('./routes/router');
const connectDB = require('./config/connectDB');
const PORT = process.env.PORT;

connectDB();
app.use(express.json());


app.use("/", router)
app.listen(PORT, () => {
  console.log(`the server is running on the port ${PORT}`)
}) 