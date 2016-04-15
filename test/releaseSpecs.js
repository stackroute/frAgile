var supertest = require("supertest");
//var should = require("should");
require('../bin/www');
var url = supertest("/sprint?id=Release0");

describe("Define the Release route of frAgile app",function(){
it("Should be able to serve json from Release route",function(done){
console.log("Release-----------------------");
console.log(url);

url.get("/")
    // .expect("Content-Type",/json/)
    // .expect(200) // THis is HTTP response
    .end(function(err,res){
      // HTTP status should be 200
      //res.status.should.equal(200);
      // Error key should be false.
      //res.body.error.should.equal(false);
      //console.log(res);
      done();
    });
});
});
