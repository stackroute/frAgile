var supertest = require("supertest");
//var should = require("should");
//require('../bin/www');
var nameurl="graph_sprintStatus"
var url = supertest("http://localhost:8080/graph?id=graph_sprintStatus");

describe("Define the graph route of frAgile app",function(){
it("Should be able to serve json from graph route",function(done){

url.get("/")
    .expect("Content-Type",/json/)
    .expect(200) // HTTP status should be 200
    .end(function(err,res){
      //console.log(res);
      done();
    });
});
});
