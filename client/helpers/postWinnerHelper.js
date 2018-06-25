import fire from '../fire';
import moment from 'moment';

export default function postWinnerHelper(firstName, lastName, emailAddress, mobileNumber, uniqueId) {

  let postData = {
    firstName,
    lastName,
    emailAddress,
    mobileNumber,
    date: moment().format(),
    uniqueId
  };

  return fire.database().ref('winner/').set({postData});
}