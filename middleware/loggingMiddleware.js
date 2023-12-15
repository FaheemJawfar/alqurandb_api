const morgan = require('morgan');

const loggingMiddleware = morgan(':remote-addr :remote-user :method :url :status :res[content-length] - :response-time ms');

module.exports = loggingMiddleware;
