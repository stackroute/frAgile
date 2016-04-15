var supertest = require("supertest");
var expect = require("chai").expect;
//var app = require('../bin/www');

var url = supertest("http://localhost:8080");

// UNIT test begin

describe("Unit test for activity endpoint", function() {

  // #1 should return activity JSON

  it("should return activity array for main route", function(done) {

    // calling home page api
    url
      .get("/activity")
      .expect(200)
      .expect("Content-Type", /json/)
      .end(function(err, res) {
        var myObj = JSON.parse(res.text);
        expect(myObj).to.be.an('array');
        done();
      });
  });

  it("should return activity array for a card ID", function(done) {

    // calling home page api
    url
      .get("/activity?cardID=card01")
      .expect(200)
      .expect("Content-Type", /json/)
      .end(function(err, res) {
        var myObj = JSON.parse(res.text);
        expect(myObj).to.be.an('array');
        done();
      });
  });

});
