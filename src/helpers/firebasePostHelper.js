import fire from '../fire';

export default function writeNewPost(fullName, emailAddress, selectedNetwork, mobileNumber, date, uniqueId, winningCodeConfirmation) {

  // A post entry.
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
  let newPostKey = fire.database().ref().child('users').push().key;

  // Write the new post's data simultaneously in the posts list and the user's post list.
  let updates = {};
  updates[`/users/${newPostKey}/user/`] = postData;

  return fire.database().ref().update(updates);
}