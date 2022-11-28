const mongoose = require("mongoose");
const connectDB = url => {
  mongoose
    .connect(process.env.DB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    .then(data => {
      console.log(`MONGODB Connected on ${data.connection.host}`);
    });
};

module.exports = connectDB;
