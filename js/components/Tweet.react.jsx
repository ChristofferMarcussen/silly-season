/*** @jsx React.DOM */
var _ = require('lodash');
var React = require('react');

module.exports = React.createClass({

	render: function() {
	    var tweet = this.props.latestTweet;
	    console.log(tweet.user.name);
	    var countryCode = tweet.place.country_code.toLowerCase();

		return  <div className="tweet">
		<div className="tweet-header">
		<img className="tweet-image" src="some/url/image.jpg" />
		<div className="tweet-image-offset tweet-name">{tweet.user.name}</div>
		<div className="tweet-image-offset tweet-screen-name">{tweet.user.screen_name}</div>
		<a className="tweet-save-button">Save</a>
		</div>

		<div className="tweet-text">{tweet.text}</div>
		<div className="tweet-stats">
		<span className="tweet-user-followers">
		<span className="tweet-stats-desc">{tweet.user.followers_count}</span>
		</span>
		</div>
		<span className={"tweet-flag flag-icon flag-icon-" + countryCode}></span>
		<span className="tweet-country tweet-stats-desc">{tweet.place.country}</span>
		<div className="tweet-city tweet-stats-desc">{tweet.place.name}</div>
		</div>

	}
});


