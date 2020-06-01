const requestHttp = require('request');
const {Suggestion} = require('dialogflow-fulfillment');
const NumberFormatter = require('../helpers/NumberFormatter');

module.exports = (agent) => {
    return new Promise((resolve, reject) => {
        requestHttp({
            url: 'https://api.spacexdata.com/v2/info',
            json: true
        }, (error, data, body) => {
            if (error) {
                agent.add('Oops, I can\'t connect to the SpaceX API, try again later.');
                return resolve();
            }

            if(body.valuation){
                agent.add('The company is valuated at ' + NumberFormatter(body.valuation) + ' dollars.');
                agent.add(new Suggestion('How many employees do they have?'));
            }else{
                agent.add('Oops, I could not get the valuation right now. Try again later!');
            }

            return resolve();
        });
    });
}