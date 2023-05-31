const expect = require('chai').expect;
const request = require('supertest');
const app = require('../server.js');

jest.spyOn(console, 'log').mockImplementation(jest.fn());

describe('server.js', () => {

  it('should return a status code 200 by healthz API', (done) => {
    setTimeout(() => {
      request(app)
        .get('/healthz')
        .end((_, response) => {
          expect(response.statusCode).to.equal(200);
          done();
        });
    }, 1000);
  });
});





// const request = require('supertest');
// const app=require("../server.js");
// describe('Test the root path', () => {
//   test('It should response the GET method', async () => {
//     const response = await request(app).get('/healthz');
//     expect(response.statusCode).toBe(200);
//   });
// });

















// const supertest = require("supertest");

// //const app = require("../app");
// const app=require("../server.js");
// const request = supertest(app);

// test("Should return 200 status code from API", async () => {
//   await request
//     .get("/healthz")
//     .expect(200)
   

// });


// let chai = require("chai");
// let chaiHttp = require("chai-http");
// const res = require("express/lib/response");
// let server = require("../server.js");
// let app=require("../app");

// // Assertion Style
// chai.should();

// chai.use(chaiHttp);

// describe('Tasks API', () => {
//     /**
//      * Test GET APIS
//     */
//     describe("GET /healthz", () => {
//         it("GET '/healthz' API test", (done) => {
//             chai.request(app)
//                 .get("/healthz")
//                 .end((err, res) => {
//                     res.should.have.status(200);
//                     done();
//                 })
//         })
//     })
// })