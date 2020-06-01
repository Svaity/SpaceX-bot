const requestHttp = require('request');
const {Suggestion} = require('dialogflow-fulfillment');


module.exports = (agent) => {
    const vehicule = agent.parameters['spacex-rocket'];
    const dateRange = agent.parameters['date-period'];

    return new Promise((resolve, reject) => {

        let url = 'https://api.spacexdata.com/v2/launches?rocket_id=' + vehicule;
        let year = 0;

        // Try to grab a year from the daterange
        if(dateRange.length > 0){
            const testYear = parseInt(dateRange.substring(0, 4));

            if(testYear > 2000 && testYear < 2100){
                url += '&launch_year=' + testYear;
                year = testYear;
            }
        }

        requestHttp({
            url: url,
            json: true
        }, (error, data, body) => {
            if (error) {
                agent.add('Oops, I can\'t connect to the SpaceX API, try again later.');
                console.error(error);
                console.error('URL: ' + url);
                return resolve();
            }

            if(body.length === 0){
                agent.add("Oops, I could not get the launch count right now. Try again later!");
                console.error(body);
                console.error('URL: ' + url);
                return resolve();
            }

            const successes = body.filter(launch => launch.launch_success === true).length;
            const failures = body.filter(launch => launch.launch_success === false).length;
            const successRate = parseFloat((successes / body.length) * 100).toFixed(2);

            let response = '';

            if(year > 0){
                response += 'In ' + year + ' ';
            }

            response += "The " + vehicule + " has launched a total of " + body.length + " times. " +
                successes + " launches where successfull while " + failures + " resulted in a failure. " +
                "That's a success rate of " + successRate + '%';

            agent.add(response);

            return resolve();
        });
    });
}