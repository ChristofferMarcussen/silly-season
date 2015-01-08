/*** @jsx React.DOM */
var _ = require('lodash');
var React = require('react');
var Tweet = require('./Tweet.react');

module.exports = React.createClass({

	render: function() {
		    var tweets = _.chain(this.props.latestTweets)
            
            .slice(this.props.latestTweets.length-3, this.props.latestTweets.length)
            .map(function(tweet) {
                return <li>
                    <Tweet latestTweet={ tweet } />
                </li>
            })
            .value();

        return <ul className="tweetlist">
            { tweets }
        </ul>

	}
});


