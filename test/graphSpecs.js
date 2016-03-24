var supertest = require("supertest");
//var should = require("should");
//require('../bin/www');
var nameurl="graph_sprintStatus"
var url = supertest("http://localhost:8080/graph?id=graph_sprintStatus");

describe("Define the graph route of frAgile app",function(){
it("Should be able to serve json from graph route",function(done){

//console.log(url);
// assert(function(done){
//   try {
//         JSON.parse(url);
//     } catch (e) {
//         return false;
//     }
//     return true;
// });

url.get("/")
    .expect("Content-Type",/json/)
    .expect(200) // THis is HTTP response
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
