import fire from '../fire';
import collectedData from './getDataFirebase';

export default function writeNewPost(firstName, lastName, emailAddress, mobileNumber, date, uniqueId) {

  // A post entry.
  let postData = {
    firstName,
    lastName,
    emailAddress,
    mobileNumber,
    date,
    uniqueId
  };

  // let collectedData = [];
  // let collectedNumbers = [];
  // let arrangedData = [];
  //
  // fire.database().ref('users').once('value').then((snapshot) => {
  //   if (Object.entries !== null || Object.entries !== undefined) {
  //     let receivedData = Object.entries(snapshot.val());
  //     receivedData.map(item => {
  //       collectedData.push(item[1]);
  //       collectedData.map(user => {
  //         collectedNumbers.push(user.user.mobileNumber);
  //       });
  //     });
  //     console.log('found users', collectedNumbers)
  //   }
  // });

  // Get a key for a new Post.
  let newPostKey = fire.database().ref().child('users').push().key;

  // Write the new post's data simultaneously in the posts list and the user's post list.
  let updates = {};
  updates[`/users/${newPostKey}/user/`] = postData;

  return fire.database().ref().update(updates);
}