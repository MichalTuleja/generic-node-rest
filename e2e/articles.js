/*
//During the test the env variable is set to test
process.env.NODE_ENV = 'test';

let mongoose = require("mongoose");
let Book = require('../libs/models/article');

//Require the dev-dependencies
let chai = require('chai');
let chaiHttp = require('chai-http');
let server = require('../libs/app');
let should = chai.should();

chai.use(chaiHttp);
//Our parent block
describe('Articles', () => {

  describe('/GET articles', () => {
    it('should be able to get with status 200 and empty array', (done) => {
      chai.request(server)
          .get('/api/articles')
          .end((err, res) => {
              res.should.have.status(200);
              res.body.should.be.a('array');
              res.body.length.should.be.eql(0);
            done();
          });
    });
  });

});
*/