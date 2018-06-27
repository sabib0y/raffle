import fire from '../fire';
import moment from 'moment';

export default function postWinnerHelper(firstName, lastName, emailAddress, mobileNumber, date, uniqueId, winningCodeConfirmation) {

  let postData = {
    firstName,
    lastName,
    emailAddress,
    mobileNumber,
    date,
    uniqueId,
    winningCodeConfirmation
  };

  return fire.database().ref('winner/').set({postData});
}