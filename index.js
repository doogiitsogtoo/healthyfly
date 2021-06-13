
'use strict';

const functions = require('firebase-functions');
const admin = require('firebase-admin');
const {WebhookClient} = require('dialogflow-fulfillment');
const {Card, Suggestion} = require('dialogflow-fulfillment');

admin.initializeApp({
	credential: admin.credential.applicationDefault(),
  	databaseURL: 'ws://chatbot-kgye-default-rtdb.asia-southeast1.firebasedatabase.app/'
});
 
process.env.DEBUG = 'dialogflow:debug'; // enables lib debugging statements
 
exports.dialogflowFirebaseFulfillment = functions.https.onRequest((request, response) => {
  const agent = new WebhookClient({ request, response });
  console.log('Dialogflow Request headers: ' + JSON.stringify(request.headers));
  console.log('Dialogflow Request body: ' + JSON.stringify(request.body));
 
  function welcome(agent) {
    agent.add(`Welcome to my agent!`);
  }
 
  function fallback(agent) {
    agent.add(`I didn't understand`);
    agent.add(`I'm sorry, can you try again?`);
  }
  
  function handleSaveToDB(agent) {
  	const text = agent.parameters.text;
    return admin.database().ref('data').set({
      first_name: 'Doogii',
      last_name: 'Tsogtoo',
      text: text
    });
  }
  
  function handleReadFromDB(agent) {
  	return admin.database().ref('data').once('value').then((snapshot) => {
    	const value = snapshot.child('text').val();
      	if(value !== null) {
        	agent.add('өгөгдлийн сангийн утга $(value)');
        }
    });
  }

  let intentMap = new Map();
  intentMap.set('Default Welcome Intent', welcome);
  intentMap.set('Default Fallback Intent', fallback);
  intentMap.set('SaveToDB', handleSaveToDB);
  intentMap.set('ReadFromDB', handleReadFromDB);
  agent.handleRequest(intentMap);
});

var chatbox = document.getElementById('fb-customer-chat');
      chatbox.setAttribute("page_id", "106845777764592");
      chatbox.setAttribute("attribution", "biz_inbox");
      window.fbAsyncInit = function() {
        FB.init({
          xfbml            : true,
          version          : 'v11.0'
        });
      };

      (function(d, s, id) {
        var js, fjs = d.getElementsByTagName(s)[0];
        if (d.getElementById(id)) return;
        js = d.createElement(s); js.id = id;
        js.src = 'https://connect.facebook.net/en_US/sdk/xfbml.customerchat.js';
        fjs.parentNode.insertBefore(js, fjs);
      }(document, 'script', 'facebook-jssdk'));