"use strict";
var Path = require("path");
var Hapi     = require("hapi");
var server = module.exports = new Hapi.Server();
var clarifyio = require("clarifyio");
var config = require("./config");

var clarifyClient = new clarifyio.Client(config.clarify.apiHost, 
  config.clarify.apiKey);

var http = require("superagent");

var slackCallbackUrl = config.slack.webhookUrl;
var recordingResults = {};


var postToSlack = function(msg){
  msg.username = config.slack.defaultUsername;
  msg.channel = config.slack.defaultChannel;
  http.post(slackCallbackUrl).send(msg).end(function(err, res){
    if(err){
      console.log("Error sending message to slack: " + err);
    } else {
      console.log("sent message to slack"); 
    }
  });
}

function checkRecordingUrl(url, callback){
  http.get(url).end(function(err,res){
    if(err){
      console.log("Url not there yet, waiting...");
      setTimeout(checkRecordingUrl(url, callback),2000);
    }else {
      callback(null,res);
    }
  });
}


server.connection({
  host : process.env.HOST,
  port : process.env.PORT
});


server.ext("onRequest", function (request, reply) {
    console.log("Got request: " + request.path, request.query);
    return reply.continue();
});

server.route([
{ 
  method: "POST", 
  path:"/",
  handler: function(request, reply){
    console.log(request.payload)
    reply();

  }
},
{
  method:"GET",
  path:"/recording",
  handler:function(request,reply){
    console.log("media url: " + request.query.recordingUrl);
    var bundle = {
      name:"Call Recording - Tadhack",
      media_url:request.query.recordingUrl,
      notify_url: "http://194.210.220.21:3000/clarifyCallback"
    }
    reply();
    var msg = {
      "text":"Tadslack is indexing the recording of your call. You will be notified the contents are searchable"
    };
    postToSlack(msg);

    setTimeout(checkRecordingUrl(request.query.recordingUrl, function(err,res){
      clarifyClient.createBundle(bundle, function(e, bundle){
        if(e){
          console.log("Clarify bundle error: " + e);
        }else {
          recordingResults[bundle.id] = request.query.recordingUrl;
          console.log("created bundle successfully " + bundle.id);
        }
      });      
    }),2000);
  }
},
{
  method:["GET","POST"],
  path:"/clarifyCallback",
  handler:function(request,reply){
    if(request.payload.bundle_processing_cost > 0){
      var msg = {
        "text":"Your call audio has been indexed. You can now search"
      };
      postToSlack(msg);
    }
    reply();
  }  
},
{
  method:["POST"],
  path:"/tadslack",
  handler:function(request,reply){
    var command = request.payload.text.split(" ")[1];
    console.log("got slack call request: " + command);
    if(command === "call"){
      var number = request.payload.text.substring(request.payload.text.indexOf("call") + 5);
      console.log("number to call" + number);
      http.get(encodeURI(config.restcomm.appUrl + "?from=" + number + "&to=" + config.restcomm.to)).end(function(err,res){
        if(err){
          console.log(err);
        }else {}
      });
    }else if (command === "search"){
      var textToSearch = request.payload.text.substring(
        request.payload.text.indexOf("search")+7);
      console.log("Searching Clarify: " + textToSearch);
      var searchCriteria = {
        query: textToSearch,
        query_fields: "*"
      }
      clarifyClient.search(searchCriteria, function(err,res){
        if(err){
          console.log("clarify error: " + err);
        }else {
          console.log("Recording results: " + JSON.stringify(recordingResults,null,2));
          if(res.total > 0){
            for(var i=0; i<res._links.items.length;i++){
              var itemId = res._links.items[i].href.substring(12);
              if(recordingResults[itemId]){
                var msg = {
                    "text":"Your search term was found in the audio link below at " +
                    res.item_results[i].term_results[0].matches[0].hits[0].start + " seconds \n " +
                    recordingResults[itemId]  
                  }
                postToSlack(msg);
              }
            }
          }else {
            var msg = {
              "text":"There were no matches found"
            }
            postToSlack(msg);
          }
        }
      });
    } else {
      var msg = {
        "text":"I'm sorry, I don't understand what you're after. Try call or search"
      }
      postToSlack(msg);
    }
    reply();
  }
}
]);

server.start(function() {
  console.log("the server started on host: " + server.info.host + " and port: " + server.info.port );
});