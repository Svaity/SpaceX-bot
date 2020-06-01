const requestHttp = require('request');
const {Card, Suggestion} = require('dialogflow-fulfillment');

module.exports = (agent) => {

    return new Promise((resolve, reject) => {

        const rocketId = agent.parameters['spacex-rocket'];
        const rocketProperty = agent.parameters['rocket-property'];

        requestHttp({
            url: 'https://api.spacexdata.com/v2/rockets',
            json: true
        }, (error, data, body) => {
            if (error) {
                agent.add("Oops, I can't connect to the SpaceX API, try again later.");
                return resolve();
            }

            if(body.length === 0){
                agent.add('Oops, I could not get the valuation right now. Try again later!');
                return resolve();
            }

            const rocketDetails = body.find(item => item.id === rocketId);

            if(!rocketDetails){
                agent.add('Oops, I could not look up more info right now. Try again later!');
                return resolve();
            }


            const weightKgTonnes = parseFloat(rocketDetails.mass.kg / 1000).toFixed(0);
            const diameter = rocketDetails.diameter;
            const engines = rocketDetails.engines;
            const height = rocketDetails.height;
            const launchPrice = parseFloat(rocketDetails.cost_per_launch / 1000000).toFixed(0);

            // Check if the user requests a specific property of the rocket
            if(rocketProperty && rocketProperty.length > 0){
                switch(rocketProperty){
                    case 'height':
                        agent.add('The ' + rocketId + ' has a height of ' + height.meters + ' meters.');
                        break;

                    case 'diameter':
                        agent.add('The ' + rocketId + ' has a diameter of ' + diameter.meters + ' meters.');
                        break;

                    case 'weight':
                        agent.add('The ' + rocketId + ' weighs ' + weightKgTonnes + ' tonnes.');
                        break;

                    default:
                        agent.add('Oops, I don\'t know anything about that property!');
                        break;
                }

                return resolve();
            }

            // If the user wasn't requesting a precise property, let's give a summary:
            let response = 'The ' + rocketId + ' is rocket developed by SpaceX. It measures ' + diameter.meters + ' meters in diameter,';
            response += ' has a height of ' + height.meters + ' meters and weighs ' + weightKgTonnes + ' tonnes. ';
            response += 'It is powered by ' + engines.number + ' ' + engines.type + ' engines ';

            if(engines.engine_loss_max > 0){
                response += 'and can lose up to ' + engines.engine_loss_max + ' of them and still complete a mission. ';
            }else{
                response += '. ';
            }

            response += 'A single launch costs ' + launchPrice + ' million dollars.';

            agent.add(new Card({
                title: rocketId,
                text: `Diameter: ${diameter.meters}\nHeight: ${height.meters}\nWeight: ${rocketDetails.mass.kg}kg\nEngines: ${engines.number} ${engines.type}`,
            }));

            agent.add(new Suggestion('When is the next launch?'));
            agent.add(new Suggestion('How many launches has SpaceX completed?'));

            agent.add(response);
            return resolve();
        });
    });
}