const mongoose = require('mongoose');
const colors = require('colors');

// Connect to database
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_DB_URL);
    console.log(`MongoDB Connected ${conn.connection.host}`.cyan.bold);
  } catch (error) {
    console.log(`MongoDB Error ${error}`.red.bold);
  }
}

// export
module.exports =  connectDB;