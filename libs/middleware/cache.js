const CacheService = require(__dirname + '/../services/CacheService');
const log = require('../log')(module);

var cacheMiddleware = function (req, res, next) {
  if(req.method === 'GET') {
    if(req.url === '/api/articles') {
      let key = `${req.headers['x-page-number']}-${req.headers['x-item-limit']}`;
      CacheService.fetch(key).then((data) => {
        if(data !== null) {
          log.info(`Found ${key} in cache`);
          res.json(data);
        }
        else {
          log.info(`Missing ${key} in cache, fetching from DB`);
          next();
        }
      }).catch((err) => { 
        log.warn(err);
        next();
      });
    }
  }

  next();
}

module.exports = cacheMiddleware;