const CustomAPiError = require("./custom-api");
const { StatusCodes } = require("http-status-codes");

class NotFoundError extends CustomAPiError {
  constructor(message) {
    super(message);
    this.statusCode = StatusCodes.NOT_FOUND;
  }
}

module.exports = NotFoundError;
