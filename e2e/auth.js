//During the test the env variable is set to test
process.env.NODE_ENV = 'test';

//Require the dev-dependencies
let chai = require('chai');
let chaiHttp = require('chai-http');
let server = require('../bin/www');
let should = chai.should();

chai.use(chaiHttp);


describe('Application', () => {

  describe('/api/oauth/token', () => {
    it('should be able to reject invalid auth data', (done) => {
      chai.request(server)
          .post('/api/oauth/token')
          .send({'grant_type': 'password'})
          .send({'client_id': 'android'})
          .send({'client_secret': 'SomeRandomCharsAndNumbers1'})
          .send({'username': 'myapi'})
          .send({'password': 'abc1234'})
          .end((err, res) => {
              res.should.have.status(401);
            done();
          });
    });

    it('should be able to authorize', (done) => {
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
          done();
      });
    });
  });

});