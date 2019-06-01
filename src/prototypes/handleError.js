function serverError(source, message, status, details = "") {
    this.source = source;
    this.message = message;
    this.code = status;
    this.details = details;
    this.stack = new Error().stack;
}

serverError.prototype = new Error();

module.exports = serverError;