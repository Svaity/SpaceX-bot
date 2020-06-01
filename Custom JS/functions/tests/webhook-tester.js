const expect = require('chai').expect;
const fs = require('fs');
const request = require('request');


/**
 * We run a test for each file that is in the data/ directory. Each
 * json file there is essentially what Dialogflow would send to us.
 * We take that json and perform a request against a local instance
 * of our functions to see if they don't return any errors.
 */
fs.readdir(__dirname + '/data/', (err, files) => {
    for (const filename of files) {
        if (filename.indexOf('.json') > -1) {
            describe('Action: ' + filename, function() {
                it('should work', function(done) {
                    request({
                        url: 'http://localhost:5000/savjee-spacex/us-central1/dialogflowFirebaseFulfillment',
                        method: 'post',
                        json: require('./data/' + filename),
                    }, (error, data, body) => {

                        // We don't want errors
                        expect(error).to.be.null;

                        // We expect a status code 200
                        expect(data.statusCode).to.equal(200);

                        // Should be an object
                        expect(body).to.be.an('object');

                        // expect(body).to.have.property('messages');
                        // expect(body.messages).to.be.an('array');

                        console.log(body);

                        // Signal Mocha that we're done with the async request
                        done();
                    });

                });
            });
        }
    }

    run();
});