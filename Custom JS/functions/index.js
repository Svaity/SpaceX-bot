'use strict';

const functions = require('firebase-functions');
const {WebhookClient} = require('dialogflow-fulfillment');

process.env.DEBUG = 'dialogflow:debug'; // enables lib debugging statements

exports.dialogflowFirebaseFulfillment = functions.https.onRequest((request, response) => {
  const agent = new WebhookClient({ request, response });
  console.log('Dialogflow Request headers: ' + JSON.stringify(request.headers));
  console.log('Dialogflow Request body: ' + JSON.stringify(request.body));

  // Run the proper function handler based on the matched Dialogflow intent name
  const intentMap = new Map();
  intentMap.set('Default Welcome Intent', require('./action-handlers/default-welcome-intent'));
  intentMap.set('Default Fallback Intent', require('./action-handlers/default-fallback-intent'));

  intentMap.set('next-launch', require('./action-handlers/next-launch'));
  intentMap.set('next-launch-more', require('./action-handlers/next-launch-more'));
  intentMap.set('launch-count', require('./action-handlers/launch-count'));
  
  intentMap.set('company-employees', require('./action-handlers/company-employees'));
  intentMap.set('company-valuation', require('./action-handlers/company-valuation'));
  
  intentMap.set('rocket-details', require('./action-handlers/rocket-details'));

  agent.handleRequest(intentMap)
});