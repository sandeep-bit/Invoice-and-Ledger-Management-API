require("dotenv").config();
require("express-async-errors");
const express = require("express");
const app = express();
const UserRoutes = require("./routes/UserRoutes");
const ProfileRoutes = require("./routes/ProfileRoutes");
const CustomerRoutes = require("./routes/CustomerRoutes");

//error Handler
const errorHandlerMiddleware = require("./middleware/error-handler");
const notFoundMiddleware = require("./middleware/error-handler");
const cookieParser = require("cookie-parser");
app.use(express.json());
app.use(cookieParser());

app.get("/", (req, res) => {
  res.send("Bill api");
});
app.use("/api/v1", UserRoutes);
app.use("/api/v1", ProfileRoutes);
app.use("/api/v1", CustomerRoutes);

app.use(errorHandlerMiddleware);
app.use(notFoundMiddleware);
module.exports = app;
