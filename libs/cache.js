var cacheMiddleware = function (req, res, next) {
  console.log('Cached request');
  next();
}

module.exports = cacheMiddleware;