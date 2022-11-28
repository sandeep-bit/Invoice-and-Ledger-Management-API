const CustomAPiError = require("./custom-api");
const { StatusCodes } = require("http-status-codes");

class Unauthorized extends CustomAPiError {
  constructor(message) {
    super(message);
    this.statusCode = StatusCodes.UNAUTHORIZED;
  }
}
module.exports = Unauthorized;
