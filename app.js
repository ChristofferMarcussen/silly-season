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
var MongoClient = require('mongodb').MongoClient
, assert = require('assert');
var connectionUrl = 'mongodb://localhost:27017/techcase';

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
        insert(JSON.stringify(tw));
        ws.send(JSON.stringify(tw), function(err) {
            if (err) console.log(err);
        });
    }
};

function insert(event) {
  MongoClient.connect(connectionUrl, function(err, db) {
     insertDocument(event, db, function() {
        db.collection.find().pretty();
        db.close();
    });
 });
}

// Insert row
function insertDocument(db, callback, document) {
    // If collection 'events' does not exists, it will be created
    var collection = db.collection('events');
    collection.insert(
        document
        , function(err, result) {
        assert.equal(err, null);
        assert.equal(1, result.ops.length);
        console.log("Inserted 3 documents into the events collection");
        callback(result);
    });
}


