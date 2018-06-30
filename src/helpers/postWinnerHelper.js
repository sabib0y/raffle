import fire from '../fire';

export default function postWinnerHelper(fullName, emailAddress, selectedNetwork, mobileNumber, date, uniqueId, winningCodeConfirmation) {

  let postData = {
    fullName,
    emailAddress,
    selectedNetwork,
    mobileNumber,
    date,
    uniqueId,
    winningCodeConfirmation
  };

  return fire.database().ref('winner/').set({postData});
}