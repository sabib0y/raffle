const functions = require('firebase-functions');
const moment = require('moment-timezone');
const admin = require('firebase-admin');
const Immutable = require('immutable');
const _ = require('lodash');
admin.initializeApp(functions.config().firebase);

// // Create and Deploy Your First Cloud Functions
// https://firebase.google.com/docs/functions/write-firebase-functions
//
exports.dataBaseCleanUp = functions.https.onRequest((request, response) => {
  let timeNow = moment().tz("Africa/Lagos").format('HH:MM:SS');

  let todayDate = moment().tz("Africa/Lagos").format();
  todayDate = todayDate.split('T')[0];

  // admin.database().ref('confirmedWinnerList/').once('value').then(snapshot => {
  //   let winnersConf = snapshot.val();
  //
  //   if(winnersConf !== null) {
  //     let winnerValue = Object.keys(winnersConf).map(key => {
  //       return winnersConf[key];
  //     });
  //     admin.database().ref(`confirmedWinnerListBackUp/${todayDate}`).set({winnersConf});
  //   }
  // });

  return admin.database().ref('users/').once('value').then(snapshot => {
    let receivedData = snapshot.val();


    if (receivedData !== null) {
      let vals = Object.keys(receivedData).map(key => {
        return receivedData[key];
      });
      response.send(`Database Cleaned, at: ${timeNow}`);
      admin.database().ref(`usersBackup/${todayDate}`).set({receivedData});
      admin.database().ref('usersAll/').update({vals});
      admin.database().ref(`randomWinnerSet`).remove();
      admin.database().ref(`randomWinnerSetWebNew`).remove();
      return admin.database().ref(`users`).remove();

    } else {
      return response.send(`Database Not Cleaned at: ${timeNow}`);
    }
  });
});

exports.winnerGenerator = functions.https.onRequest((request, response) => {
  return admin.database().ref('users/').once('value').then((snapshot) => {
    let receivedDataTime = snapshot.val();
    let newArray = [];

    if (receivedDataTime !== null) {
      let valsNew = Object.keys(receivedDataTime).map(key => {
        return receivedDataTime[key];
      });
      for (let value of valsNew) {
        newArray.push(value.user)
      }

      let uniq = _.uniqBy(valsNew, (o) => {
        return o.user.mobileNumber;
      });
      let newDataToStore = [];
      for (let value of uniq) {
        newDataToStore.push(value)
      }
      return admin.database().ref('setNumberOfWinners/').once('value').then(snapshot => {
        let receivedData = snapshot.val();

        /* eslint-disable promise/always-return */
        if (receivedData !== null) {
          let randomData = [];
          let winners = [];
          let parseVal = parseInt(receivedData.winners);
          let postData, dataState;
          let timeNow = moment().tz("Africa/Lagos").format('YYYY-MM-DD');
          let uniqRandom = [];

          do {
            // for (let i = 0; i < parseVal; i++) {
            let randomIndex = Math.floor(Math.random() * newDataToStore.length);
            let randomElement = newDataToStore[randomIndex];
            randomData.push(randomElement);

            uniqRandom = _.uniqBy(randomData, (o) => {
              return o.user.mobileNumber;
            });
            // }
          }
          while (uniqRandom.length < parseVal);

          for (let value of uniqRandom) {
            winners.push(value);
          }

          uniqRandom.forEach(value => {
            postData = value.user;
            const postDataWeb = {
              fullName: value.user.fullName,
              emailAddress: value.user.emailAddress,
              mobileNumber: value.user.mobileNumber,
              selectedNetwork: value.user.selectedNetwork,
              uniqueId: value.user.uniqueId,
              winningCodeConfirmation: value.user.winningCodeConfirmation
            };

            let newPostKeySet = admin.database().ref().child('allWinningNumbers').push().key;
            let newPostKeyNew = admin.database().ref().child('winningNumbers').push().key;

            // Write the new post's data simultaneously in the posts list and the user's post list.
            let updates = {};
            let updatesWeb = {};
            updates[`/allWinningNumbers/${timeNow}/winners/`] = uniqRandom;
            updatesWeb[`/dailyWinningNumbers/winners/`] = uniqRandom;
            response.send('Random numbers generated....D');
            admin.database().ref().update(updates);
            return admin.database().ref().update(updatesWeb);
          });
        }
        else {
          return response.send('SetNumberOfWinners database is null....')
        }

        /* eslint-disable promise/always-return */


      });
    } else {
      return response.send('users database is null....')
    }
  });
});

exports.formScheduling = functions.https.onRequest((request, response) => {

  return admin.database().ref('setTimeForm/').once('value').then(snapshot => {
    let siteForm = snapshot.val();

    if (siteForm !== null || siteForm !== undefined) {

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
      return response.send(`Form not scheduled`);
    }
  });
});

