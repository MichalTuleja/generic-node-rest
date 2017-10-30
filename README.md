# jdl-backend

The application exposes simple CRUD wrapped in REST interface with authentication.

Features:
* Rest API
* MongoDB/Mongoose based
* Redis caching
* e2e tests

# How to run

You need a configured MongoDB and a Redis server.
Access data can be configured in ``config.js``

## Standard local application

Change you config to use localhost or modify your ``/etc/hosts`` file accordingly.

```
$ npm install
$ npm start
```

## Docker environment

In order to run the app in Docker env, you have to run the latest MongoDB and Redis containers.

```
$ docker build -t jdl-backend .
$ docker run -d \
  --link <your_redis_container>:redis \
  --link <your_mongo_container>:mongo \
  --name jdl-backend \
  jdl-backend
```

## Running tests

End-to-end tests can be run using mocha test suite

```
$ npm install
$ npm test
```

## Potential improvements

This app can be improved several ways:
* ES6-Compliant
* Better code organization - abstraction layers, routing
* Unit test coverage
