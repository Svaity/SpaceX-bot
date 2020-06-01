/**
 * Source: https://www.raymondcamden.com/2012/07/06/Simple-JavaScript-number-format-function-and-an-example-of-Jasmine/
 */
module.exports = function NumberFormatter(x) {
	if(isNaN(x)) return x;

	if(x < 9999) {
		return x;
	}

	if(x < 1000000) {
		return Math.round(x/1000) + ' thousand';
	}
	if( x < 10000000) {
		return (x/1000000).toFixed(2) + " million";
	}

	if(x < 1000000000) {
		return Math.round((x/1000000)) + " million";
	}

	if(x < 1000000000000) {
		return Math.round((x/1000000000)) + " billion";
	}

	return "1T+";
}