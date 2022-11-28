const connectDB = require("./db/connectdb");

const app = require("./app");
require("dotenv").config();

const port = process.env.PORT || 3000;
const start = async () => {
  try {
    await connectDB(process.env.DB_URI);
    await app.listen(port, () => {
      console.log(`server running on port ${port}`);
    });
  } catch (error) {
    console.log(error);
  }
};

start();
