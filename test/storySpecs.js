var supertest = require("supertest");
//var should = require("should");
//require('../bin/www');
var nameurl="story02"
var url = supertest("http://localhost:8080/story?id=story01");

describe("Define the story route of frAgile app",function(){
it("Should be able to serve json from story route",function(done){

//console.log(url);

url.get("/")
    .expect("Content-Type",/json/)
    .expect(200) // THis is HTTP response
    .end(function(err,res){
      done();
    });
});
});
