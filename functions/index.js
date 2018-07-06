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
      response.send(`Random Number generated ${randomizedData}, timeNow: ${timeNow}`);
      admin.database().ref('randomWinnerSetWeb/').set({postDataWeb});
      return admin.database().ref('randomWinnerSet/').set({postData});
      // return admin.database().ref('randomWinnerSet/').once('value').then(snapshot => {
      //   let receivedWinnerData = snapshot.val();
      //   let dateToCheckDatabase = receivedWinnerData.postData.date.split('T')[0];
      //   let dateToCheckIncoming = moment().toISOString().split('T')[0];
      //   if(dateToCheckIncoming <= dateToCheckDatabase) {
      //     return response.send(`Date Error ${randomizedData}, timeNow: ${timeNow}`);
      //   } else {
      //     response.send(`Random Number generated ${randomizedData}, timeNow: ${timeNow}`);
      //     return admin.database().ref('randomWinnerSet/').set({postData});
      //   }
      // });
    } else {
      console.error('No Entries Found', randomizedData);
     return response.send(`No Number generated ${randomizedData}, timeNow: ${timeNow}`);
    }
  });
});