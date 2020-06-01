const NumberFormatter = require('../helpers/NumberFormatter');
const expect = require('chai').expect;

/**
 * Originally from: 
 * https://www.raymondcamden.com/2012/07/06/Simple-JavaScript-number-format-function-and-an-example-of-Jasmine/
 * Adapted to work with Chai
 */
describe("NumberFormatter", function() {

	it("takes a number less than ten thousand and returns it as is", function() {
		var inputs = [1,100,999,1000,6321];
		for(var i=0; i<inputs.length; i++) {
			expect(inputs[i]).to.equal(NumberFormatter(inputs[i]));
		}
		expect(11000).not.to.equal(NumberFormatter(11000));
	});

	it("takes a number between 10,000 and 1 million and returns it as NK", function() {
		var inputs = [12019,32901,64091,201912,199102,581091,789109,320980];
		var outputs = ["12 thousand","33 thousand","64 thousand","202 thousand","199 thousand","581 thousand","789 thousand","321 thousand"];
		for(var i=0; i<inputs.length; i++) {
			expect(NumberFormatter(inputs[i])).to.equal(outputs[i]);
		}
	});

	it("takes a number between 1 million and 10 million and returns it as N.XXM", function() {
		var inputs = [1210901,5312091,8901451];
		var outputs = ["1.21 million","5.31 million","8.90 million"];
		for(var i=0; i<inputs.length; i++) {
			expect(NumberFormatter(inputs[i])).to.equal(outputs[i]);
		}
	});

	it("takes a number between 1 billion and 1 trillion and returns it as NB", function() {
		var inputs = [9286109901,32286109901,129286109901];
		var outputs = ["9 billion","32 billion","129 billion"];
		for(var i=0; i<inputs.length; i++) {
			expect(NumberFormatter(inputs[i])).to.equal(outputs[i]);
		}
	});

	it("takes a number 1 trillion and over and returns it as 1T+", function() {
		expect(NumberFormatter(1000000000000)).to.equal("1T+");
		expect(NumberFormatter(1000000000001)).to.equal("1T+");
	});

	it("takes an invalid number and returns it as is", function() {
		expect(NumberFormatter("moo")).to.equal("moo");
	});

});