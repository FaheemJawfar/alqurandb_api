const morgan = require('morgan');

morgan.token('client-ip', (req) => {
  const xForwardedFor = req.headers['x-forwarded-for'];
  return xForwardedFor ? xForwardedFor.split(',')[0] : req.socket.remoteAddress;
});

const loggingMiddleware = morgan(':client-ip :remote-user :method :url :status :res[content-length] - :response-time ms');

module.exports = loggingMiddleware;
