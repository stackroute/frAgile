var supertest = require("supertest");
//var should = require("should");
//require('../bin/www');

var url = supertest("http://localhost:8080/sprint?id=Release0");

describe("Define the project route of frAgile app",function(){
it("Should be able to serve json from project route",function(done){

//console.log(url);

url.get("/")
    .expect("Content-Type",/json/)
    .expect(200) // THis is HTTP response
    .end(function(err,res){
      done();
    });
});
});
