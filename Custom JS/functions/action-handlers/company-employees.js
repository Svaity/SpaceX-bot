const request = require('request');
const {Suggestion} = require('dialogflow-fulfillment');

module.exports = (agent) => {

    return new Promise((resolve, reject) => {
        request({
            url: 'https://api.spacexdata.com/v2/info',
            json: true
        }, (error, data, body) => {
            if (error) {
                agent.add("Oops, I can't connect to the SpaceX API, try again later.");
                return resolve();
            }

            if(body.employees){
                agent.add('SpaceX currently has ' + NumberFormatter(body.employees) + ' employees.');
                agent.add(new Suggestion('What is the company\'s evaluation?'));
            }else{
                agent.add('Oops, I could not get the employee count right now. Try again later!');
            }

            return resolve();
        });
    });
}