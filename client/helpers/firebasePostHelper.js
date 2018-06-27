import fire from '../fire';

export default function writeNewPost(firstName, lastName, emailAddress, mobileNumber, date, uniqueId, winningCodeConfirmation) {

  // A post entry.
  let postData = {
    firstName,
    lastName,
    emailAddress,
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