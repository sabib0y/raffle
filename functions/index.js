const functions = require('firebase-functions');
const moment = require('moment-timezone');
const admin = require('firebase-admin');
const Immutable = require('immutable');
admin.initializeApp(functions.config().firebase);

// // Create and Deploy Your First Cloud Functions
// https://firebase.google.com/docs/functions/write-firebase-functions
//
exports.dataBaseCleanUp = functions.https.onRequest((request, response) => {
  let timeNow = moment().tz("Europe/London").format('HH:MM:SS');

  let todayDate = moment().tz("Europe/London").format();
  todayDate = todayDate.split('T')[0];

  return admin.database().ref('users/').once('value').then(snapshot => {
    let receivedData = snapshot.val();


    if (receivedData !== null) {
      let vals = Object.keys(receivedData).map(key => {
        return receivedData[key];
      });
      response.send(`Database Cleaned, at: ${timeNow}`);
      admin.database().ref(`usersBackup/${todayDate}`).set({receivedData});
      admin.database().ref('usersAll/').update({vals});
      return admin.database().ref(`users`).remove();

    } else {
     return response.send(`Database Not Cleaned at: ${timeNow}`);
    }
  });
});

exports.winnerGenerator = functions.https.onRequest((request, response) => {
  return admin.database().ref('users/').once('value').then(snapshot => {
    let usersReceived = snapshot.val();

    if (usersReceived !== null) {
      let vals = Object.keys(usersReceived).map(key => {
        return usersReceived[key];
      });

     return admin.database().ref('setNumberOfWinners/').once('value').then(snapshot => {
        let receivedData = snapshot.val();
        let randomData = [];
        let randomToSend = [];
        let parseVal =  parseInt(receivedData.winners);
        let postData, postDataWeb, dataState;

        for (let i = 0; i < parseVal; i++) {
          let randomIndex = Math.floor(Math.random() * vals.length);
          let randomElement = vals[randomIndex];
          randomData.push(randomElement);
        }

        for (let value of randomData) {
          randomToSend.push(value.user);
        }

        return randomToSend.map(item => {
          postData = item;
          dataState = Immutable.fromJS(item);
          postDataWeb = {
            mobileNumber: dataState.get('mobileNumber'),
            selectedNetwork: dataState.get('selectedNetwork'),
            uniqueId: dataState.get('uniqueId'),
            winningCodeConfirmation: dataState.get('winningCodeConfirmation')
          };

          // Get a key for a new Post.
          let newPostKey = admin.database().ref().child('users').push().key;

          // Write the new post's data simultaneously in the posts list and the user's post list.
          let updates = {};
          let updatesWeb = {};
          updates[`/randomWinnerSet/${newPostKey}/winner/`] = postData;
          updatesWeb[`/randomWinnerSetWebNew/${newPostKey}/winner/`] = postDataWeb;
          admin.database().ref().update(updates);
          admin.database().ref().update(updatesWeb);

          return response.send(`Random Winners Set`);
        });
      });
    }
    else {
     return response.send(`Random Winners Not Set`);
    }
  });
});

exports.formScheduling = functions.https.onRequest((request, response) => {

  return admin.database().ref('setTimeForm/').once('value').then(snapshot => {
    let siteForm = snapshot.val();

    if(siteForm !== null || siteForm !== undefined) {

      let postDataTest = {
        formStart: new Date(siteForm.postData.formStart),
        formEnd: new Date(siteForm.postData.formEnd),
        resultStart: new Date(siteForm.postData.resultStart),
        resultEnd: new Date(siteForm.postData.resultEnd),
      };

      let postData = {
        formStart: moment(postDataTest.formStart.setDate(postDataTest.formStart.getDate() + 1)).format(),
        formEnd: moment(postDataTest.formEnd.setDate(postDataTest.formEnd.getDate() + 1)).format(),
        resultStart: moment(postDataTest.resultStart.setDate(postDataTest.resultStart.getDate() + 1)).format(),
        resultEnd: moment(postDataTest.resultEnd.setDate(postDataTest.resultEnd.getDate() + 1)).format(),
      };

      response.send(`Scheduling set`);
      return admin.database().ref('setTimeForm/').update({postData});

    } else {
      console.error('No Entries Found');
      return response.send(`Form not scheduled`);
    }
  });
});

