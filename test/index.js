"use strict";

var nock = require("nock");
var should = require("should");

describe("Sample Tests", function(){
  before(function() {
    nock.disableNetConnect();
  });
  after( function() {
    nock.cleanAll();
    nock.enableNetConnect();
  });
  describe( "#a test", function(){
    it("should do something", function(done){
      "true".should.eql("true");
      done();
    });
  });
});
