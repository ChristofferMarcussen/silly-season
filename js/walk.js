(function() {
	var sprite = document.querySelector('.sprite'),
		key = {left: false, right: false},
		trans = 0,
		property = getTransformProperty(sprite);
   


    function setupSocket() {
    	var ws = new WebSocket('ws://localhost:9999');
		var that = this;
		console.log("setting up WebSocket", ws);
	    ws.onmessage = function(ms) {
       		var newTweet = JSON.parse(ms.data);
            console.log("received tweet", newTweet.text);
            walk(newTweet.text.toLowerCase().indexOf('real madrid') >= 0);
	  }
    }

	function getTransformProperty(element) {
	    var properties = [
	        'transform',
	        'WebkitTransform',
	        'msTransform',
	        'MozTransform',
	        'OTransform'
	    ];
	    var p;
	    while (p = properties.shift()) {
	        if (typeof element.style[p] !== 'undefined') {
	            return p;
	        }
	    }
	    return false;
	}

	function translate() {
		sprite.style[property] = 'translateX(' + trans + 'px)';
	}

	function walk(isRealMadrid) {	
    if (isRealMadrid) {
			trans += 20;
			translate();
			sprite.classList.remove('left');
			sprite.classList.add('right');
			sprite.classList.add('walk-right');
		} 
	else {
			trans -= 20;
			translate();
			sprite.classList.remove('right');
			sprite.classList.add('left');
			sprite.classList.add('walk-left');
		}
	  setTimeout(function () {
           stop(isRealMadrid);
	    }, 250);
	}

	function stop(isRealMadrid) {

		if (isRealMadrid) {
			sprite.classList.remove('walk-right');
		} 
		else {
			sprite.classList.remove('walk-left');
		}
	}
	setupSocket();

})();