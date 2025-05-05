const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();
const MONGO_URI = process.env.MONGO_URI;

// console.log(MONGO_URI);
const connectDB = async () => {
    // const options = {
    //     useNewUrlParser: true,
    //     useUnifiedTopology: true,
    // }
    try {
        await mongoose.connect(MONGO_URI)
        console.log("MongoDB connected successfully")
    } catch (err) {
        console.log(err.message)
        process.exit(1)
    }
}
module.exports = connectDB;