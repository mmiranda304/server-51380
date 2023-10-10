import chai from 'chai';
import supertest from 'supertest';
import { faker } from '@faker-js/faker';
import app from '../src/app';

const expect = chai.expect;
const requester = supertest(app);


// Tests for Products routes
describe('Products Controller', () => {
    // Test for GET '/'
    it('Should get all products', (done) => {
      // GET to '/api/products'
      requester.get('/api/products')
        .end((err, res) => {
          if (err) return done(err);
  
          // Verify HTTP status and response
          expect(res.status).to.equal(200);
          expect(res.body.status).to.equal('success');
          expect(res.body.payload).to.be.an('array');
  
          done(); 
        });
    });
  
    // Tests
  
    // Close Express App after tests
    after((done) => {
      app.close(() => {
        done();
      });
    });
  });