var http = require('http');
var _ = require('lodash');
var express = require('express');
var Twit = require('twit');
var WebSocketServer = require('ws').Server
var twitterConfig = require('./twitter.json');
var util = require('util');
var historyApiFallback = require('connect-history-api-fallback');
historyApiFallback.setLogger(console.log.bind(console));
var T = new Twit(twitterConfig);

var app = express();
app.use(express.static('dist'));
app.use(historyApiFallback);
app.use(express.static('public'));

app.use(function(err, req, res, next){
    console.error(err.stack);
    next(err);
});

app.use(function(err, req, res, next) {
    util.inspect(err);
    res.status(500).send({ error: err.message });
});

var server = http.createServer(app);
server.listen(9999);

/*
var MongoClient = require('mongodb').MongoClient
, assert = require('assert');
var connectionUrl = 'mongodb://localhost:27017/techcase';
*/

var es = require('eventstore')({
  type: 'mongodb',
  host: 'localhost',                          
  port: 27017,                                
  dbName: 'eventstore',                       
  eventsCollectionName: 'events',             
  snapshotsCollectionName: 'snapshots',       
  transactionsCollectionName: 'transactions', 
  timeout: 10000,
  events: 'add'                      
});

es.init(function (err) {
    console.log('event store inited');
});

es.on('connect', function() {
     console.log("connected");
});


var LOCATIONS = {
    EUROPE: '-13.380968, 37.810047, 31.443250, 70.709137',
    WORLD: '-180,-90,180,90'
};

var wss = new WebSocketServer({ server: server });
var stream = T.stream('statuses/filter', 
{
 track: 'Ødegaard, Odegaard'
})

wss.on('connection', function(ws) {
    var pushTweet = saveAndPushTo(ws);
    stream.on('tweet', pushTweet)

    ws.on('close', function() {
        stream.removeListener('tweet', pushTweet);
    });
});


function saveAndPushTo(ws) {
    return function (tweet) {
        var tw = _.pick(tweet, 'id', 'text', 'geo', 'place', 'user', 'entities', 'lang');

        storeEvent(tw);

        ws.send(JSON.stringify(tw), function(err) {
            if (err) console.log(err);
        });
    }
};
function storeEvent(tweet) {
   var team = '';
    if (tweet.text.toLowerCase().indexOf('real madrid') >= 0) {
        team = 'REAL_MADRID';
    }
    else if (tweet.text.toLowerCase().indexOf('bayern') >= 0) {
        team = 'BAYERN';
    }
    else if (tweet.text.toLowerCase().indexOf('barcelona') >= 0) {
        team = 'BARCELONA';
    }
    else if (tweet.text.toLowerCase().indexOf('liverpool') >= 0) {
        team = 'LIVERPOOL';
    }
    else {
        team = 'NO_TEAM';
    }
     console.log("store event", team);

    es.getEventStream('streamId', function(err, stream) {      
        console.log("add event to db");               
        stream.addEvent({ event:'added', team: team, date: new Date()} );
        stream.commit();
    });

    es.getEventStream('streamId', function(err, stream) {                    
        var history = stream.events; 
        console.log(history);
    });
}

