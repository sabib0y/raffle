import fire from '../fire';

export default function postAllWinners(fullName, emailAddress, selectedNetwork, mobileNumber, date, uniqueId, winningCodeConfirmation) {

  let postData = {
    fullName,
    emailAddress,
    selectedNetwork,
    mobileNumber,
    date,
    uniqueId,
    winningCodeConfirmation
  };

  // Get a key for a new Post.
  let newPostKey = fire.database().ref().child('allWinners').push().key;

  // Write the new post's data simultaneously in the posts list and the user's post list.
  let updates = {};
  updates[`/allWinners/${newPostKey}/winner/`] = postData;

  return fire.database().ref().update(updates);
}