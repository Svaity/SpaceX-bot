const requestHttp = require('request');
const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November','December'];
const {Card, Suggestion} = require('dialogflow-fulfillment');

/**
 * When the user aks for when the next launch will be.
 */
module.exports = (agent) => {

    return new Promise((resolve, reject) => {
        requestHttp({
            url: 'https://api.spacexdata.com/v2/launches/upcoming',
            json: true
        }, (error, data, body) => {
            if (error) {
                agent.add("Oops, I can't connect to the SpaceX API, try again later.");
                console.error(error);
                return resolve();
            }

            if (body.length > 0) {
                const launch = body[0];
                const date = new Date(launch.launch_date_unix * 1000);

                agent.add('The next launch is on ' + months[date.getMonth()] + ' ' + date.getDate() + ', ' + date.getFullYear());
                agent.add(new Card({
                    title: 'Next launch',
                    imageUrl: launch.links.mission_patch,
                    text: 'The next launch is on ' + months[date.getMonth()] + ' ' + date.getDate() + ', ' + date.getFullYear()
                }));
                
                agent.add(new Suggestion('Tell me more about this launch'));

                return resolve();
            }else{
                agent.add('Oops, I received a weird response from the SpaceX API.. Try again later.');

                console.error(new Error('API response did not contain multiple entries in the body.'));
                console.log(body);
                
                return resolve();
            }

        });
    });
}