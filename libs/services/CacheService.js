const redis = require('redis');
const log = require('../log')(module);

const DEFAULT_TTL = 10;

let client;

module.exports = {
  store: store,
  fetch: fetch,
  init: init
};


function store(key, value, ttl) {
  return new Promise((resolve, reject) => {
    if(!ttl || typeof ttl !== 'number') ttl = DEFAULT_TTL;
    client.set(key, JSON.stringify(value), 'EX', ttl, (err, data) => {
      if(err) reject(err);
      else resolve();
    });
  });
}

function fetch(key) {
  return new Promise((resolve, reject) => {
    client.get(key, (err, value) => {
      resolve(convToJson(value));
    })
  });
}

function init(options) {
  client = redis.createClient(options);
  client.on("error", function (err) {
    console.log("Error " + err);
  });
  log.info(`Connected to ${options.url}`);
}

function convToJson(value) {
  if(typeof value === 'string') {
    return JSON.parse(value);
  }
  else {
    return null;
  }
}
