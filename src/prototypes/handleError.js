function errorHandler() {}

Error.prototype.handler = function(source, message, status){
    return {
        status,
        source,
        message
    };
}

errorHandler.prototype = Object.create(Error.prototype);

module.exports = errorHandler;