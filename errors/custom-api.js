class CustomAPiError extends Error {
  constructor(message) {
    super(message);
  }
}

module.exports = CustomAPiError;
