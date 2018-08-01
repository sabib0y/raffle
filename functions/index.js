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


    if (receivedData !== null) {
      let vals = Object.keys(receivedData).map(key => {
        return receivedData[key];
      });
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

