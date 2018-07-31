const functions = require('firebase-functions');
const moment = require('moment-timezone');
const admin = require('firebase-admin');
admin.initializeApp(functions.config().firebase);

// // Create and Deploy Your First Cloud Functions
// https://firebase.google.com/docs/functions/write-firebase-functions
//
exports.helloWorld = functions.https.onRequest((request, response) => {
  const test = true;
  // fromNow
  const produceResults = {
    formEnd: '15:00:00',
    resultsStart: '20:00:00',
    newTime: '14:12:00'
  };
  let timeNow = moment().tz("Europe/London").format('HH:MM:SS');

  let randomizedData = [];
  let winnerData = [];
  let todayDate = moment().tz("Europe/London").format();
  todayDate = todayDate.split('T')[0];

  return admin.database().ref('users/').once('value').then(snapshot => {
    let receivedData = snapshot.val();
    let vals = Object.keys(receivedData).map(key => {
      return receivedData[key];
    });

    if (vals.length > 0) {
      let randomIndex = Math.floor(Math.random() * vals.length);
      let randomElement = vals[randomIndex];
      randomizedData.push(randomElement);
      const postData = {
        date: randomElement.user.date,
        emailAddress: randomElement.user.emailAddress,
        fullName: randomElement.user.fullName,
        mobileNumber: randomElement.user.mobileNumber,
        selectedNetwork: randomElement.user.selectedNetwork,
        uniqueId: randomElement.user.uniqueId,
        winningCodeConfirmation: randomElement.user.winningCodeConfirmation
      };
      const postDataWeb = {
        uniqueId: randomElement.user.uniqueId,
        mobileNumber: randomElement.user.mobileNumber
      };

      admin.database().ref('setTimeForm/').once('value').then(snapshot => {
        let formTimes = snapshot.val();
        let timeDataToReceived = {
          formStart: new Date(formTimes.postData.formStart),
          formEnd: new Date(formTimes.postData.formEnd),
          resultStart: new Date(formTimes.postData.resultStart),
          resultEnd: new Date(formTimes.postData.resultEnd),
        };

        let postData = {
          formStart: timeDataToReceived.formStart.setDate(timeDataToReceived.formStart.getDate() + 1),
          formEnd: timeDataToReceived.formEnd.setDate(timeDataToReceived.formEnd.getDate() + 1),
          resultStart: timeDataToReceived.resultStart.setDate(timeDataToReceived.resultStart.getDate() + 1),
          resultEnd: timeDataToReceived.resultEnd.setDate(timeDataToReceived.resultEnd.getDate() + 1),
        };
        return admin.database().ref('setTimeForm/').set({postData});
      });

      response.send(`Random Number generated ${randomizedData}, timeNow: ${timeNow}`);
      admin.database().ref('randomWinnerSetWeb/').set({postDataWeb});
      admin.database().ref('randomWinnerSet/').set({postData});
      admin.database().ref(`usersBackup/${todayDate}`).set({receivedData});
      admin.database().ref('usersAll/').update({vals});
      return admin.database().ref(`users`).remove();

    } else {
      console.error('No Entries Found', randomizedData);
     return response.send(`No Number generated ${randomizedData}, timeNow: ${timeNow}`);
    }
  });
});