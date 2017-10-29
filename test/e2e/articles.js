//During the test the env variable is set to test
process.env.NODE_ENV = 'test';

const ITEM_LIMIT = 10;
const PAGE_NUMBER = 3;

let mongoose;
let Book;
let server;

//Require the dev-dependencies
let chai = require('chai');
let chaiHttp = require('chai-http');
let should = chai.should();

chai.use(chaiHttp);

let access_token = '';


describe('Articles', () => {

  before(done => {
    mongoose = require("mongoose");
    Book = require(process.cwd() + '/libs/model/article');
    server = require(process.cwd() + '/bin/www');
    done();
  });

  before((done) => {
    chai.request(server)
      .post('/api/oauth/token')
      .send({'grant_type': 'password'})
      .send({'client_id': 'android'})
      .send({'client_secret': 'SomeRandomCharsAndNumbers'})
      .send({'username': 'myapi'})
      .send({'password': 'abc1234'})
      .end((err, res) => {
        res.should.have.status(200);
        res.body.should.be.a('object');
        res.body.should.have.property('access_token');
        res.body.should.have.property('refresh_token');
        // res.body.should.have.property('expires_in');
        // res.body.expires_in.should.be.a('number');
        // res.body.expires_in.should.equal(3600);
        res.body.should.have.property('token_type');
        res.body.token_type.should.be.equal('Bearer');
        access_token = res.body.access_token;
        done();
    });
  });

  describe('/GET articles', () => {
    it('should be able to get with status 200', (done) => {
      chai.request(server)
          .get('/api/articles')
          .set('authorization', `Bearer ${access_token}`)
          .end((err, res) => {
            res.should.have.status(200);
            res.body.should.be.a('array');
            res.body.length.should.be.gte(1);
            done();
          });
    });
  });

  // describe(`/POST articles`, () => {
  //   it(`should be able to get with status 200 exactly ${ITEM_LIMIT} articles`, (done) => {
  //     let numberOfArticles = 
  //     chai.request(server)
  //         .post('/api/articles')
  //         .set('authorization', `Bearer ${access_token}`)
  //         .set('x-item-limit', ITEM_LIMIT)
  //         .set('x-page-number', 1)
  //         .end((err, res) => {
  //           res.should.have.status(200);
  //           res.body.should.be.a('array');
  //           res.body.length.should.be.eql(ITEM_LIMIT);
  //           done();
  //         });
  //   });
  // });  

  describe(`/GET ${ITEM_LIMIT} articles`, () => {
    it(`should be able to get with status 200 exactly ${ITEM_LIMIT} articles`, (done) => {
      chai.request(server)
          .get('/api/articles')
          .set('authorization', `Bearer ${access_token}`)
          .set('x-item-limit', ITEM_LIMIT)
          .set('x-page-number', 0)
          .end((err, res) => {
            res.should.have.status(200);
            res.body.should.be.a('array');
            res.body.length.should.be.eql(ITEM_LIMIT);
            done();
          });
    });
  });

  describe(`/GET ${ITEM_LIMIT} articles`, () => {
    it(`should be able to get with status 200 exactly ${ITEM_LIMIT} articles with pagination`, (done) => {
      chai.request(server)
          .get('/api/articles')
          .set('authorization', `Bearer ${access_token}`)
          .set('x-item-limit', ITEM_LIMIT)
          .set('x-page-number', PAGE_NUMBER)
          .end((err, res) => {
            res.should.have.status(200);
            res.body.should.be.a('array');
            res.body.length.should.be.eql(ITEM_LIMIT);
            done();
          });
    });
  });

  after(done => {
    // mongoose.disconnect();
    server.close();
    done();
  });

});
