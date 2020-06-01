const requestHttp = require('request');
const {Card, Suggestion} = require('dialogflow-fulfillment');

module.exports = (agent) => {
    return new Promise((resolve, reject) => {
        requestHttp({
            url: 'https://api.spacexdata.com/v2/launches/upcoming',
            json: true
        }, (error, data, body) => {
            if (error) {
                agent.add("Oops, I can't connect to the SpaceX API, try again later.");
                return resolve();
            }

            if (body.length > 0) {
                const launch = body[0];
                const date = new Date(launch.launch_date_unix * 1000);

                let response = 'SpaceX will send a ' + launch.rocket.rocket_name + ' into space from ' +
                    launch.launch_site.site_name_long + '.';

                if (launch.reuse.core || launch.reuse.capsule || launch.reuse.fairings) {
                    response += 'SpaceX will be reusing';

                    if (launch.reuse.core) {
                        response += ', the center core';
                    }
                    if (launch.reuse.capsule) {
                        response += ', the dragon capsule';
                    }
                    if (launch.reuse.fairings) {
                        response += ', the fairings';
                    }

                    response += '.';
                }

                if (launch.rocket.second_stage.payloads) {
                    const payloads = launch.rocket.second_stage.payloads;
                    response += ' The rocket carries ' + payloads.length + ' payload(s).';

                    for (const payLoad of payloads) {
                        response += ' The ' + payLoad.payload_id + ' ' + payLoad.payload_type + ' from ' + payLoad.customers[0] + '.';
                    }
                }

                agent.add(response);

                // Card 1: Press kit
                if(launch.links.presskit){
                    agent.add(new Card({
                        title: 'Press kit',
                        text: 'Official SpaceX press release for this launch',
                        buttonText: 'Open',
                        buttonUrl: launch.links.presskit
                    }));                    
                }


                // Card 2: Live stream
                if(launch.links.video_link){
                    agent.add(new Card({
                        title: 'Live stream',
                        text: 'The official live stream for this launch (live 15 minutes before liftoff)',
                        buttonText: 'Open',
                        buttonUrl: launch.links.video_link
                    }));
                }

                // Suggestions
                agent.add(new Suggestion('What is the ' + launch.rocket.rocket_name + '?'));

                return resolve();
            }

            agent.add('Oops, I received a weird response from the SpaceX API.. Try again later.');
            console.log(body);
            return resolve();
        });
    });
}