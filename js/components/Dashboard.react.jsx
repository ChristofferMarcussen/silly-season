var _ = require('lodash');
var React = require('react');
var TweetList = require('./TweetList.react');

module.exports = React.createClass({

    render: function() {
       var tweets = null;
       if (this.state.latestTweets.length > 0) {

       	tweets = <TweetList latestTweets={this.state.latestTweets}/>;
       }
       return <div> 
       {tweets}
       </div>
    },

    getInitialState: function() {
		console.log("get initial state");
		return {
			latestTweets: []
		}
	},

	componentDidMount: function() {
		console.log("mounted");
		var ws = new WebSocket('ws://localhost:9999');
		var that = this;
	    ws.onmessage = function(ms) {
       		var newTweet = JSON.parse(ms.data);
        	var tweets = that.state.latestTweets.concat([newTweet]).slice(-100);
            that.setState({latestTweets: tweets});
        	

	  }
	}


});


