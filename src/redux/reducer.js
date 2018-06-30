import {
  SET_USER,
  SET_NUMBER,
  SET_WINNING_ID,
  SET_WINNING_CODE, SET_CODE_CONFIRMATION
} from './constants/type';
import writeNewPost from '../helpers/firebasePostHelper';
import postWinnerHelper from '../helpers/postWinnerHelper';
import postAllWinners from '../helpers/postAllWinners';
import fire from '../fire';

const initialState = {
  user: {
    fullName: null,
    emailAddress: null,
    mobileNumber: null,
    date: {},
    id: null,
    disabled: true,
    receivedData: {},
    randomWinningId: '',
    displayResults: '',
    showResults: false,
    uniqueId: null,
    dataCollected: false,
    revealRedeem: false,
    duplicateNumber: null,
    winningCode: null,
    winningCodeConfirmation: false,
    selectedNetwork: null
  }
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_USER :
      const dataToSend = {
        fullName: action.newUser.fullName,
        emailAddress: action.newUser.emailAddress,
        selectedNetwork: action.newUser.selectedNetwork,
        mobileNumber: action.newUser.mobileNumber,
        date: action.newUser.date,
        uniqueId: action.newUser.uniqueId,
        winningCodeConfirmation: false,
      };

      writeNewPost(
        dataToSend.fullName,
        dataToSend.emailAddress,
        dataToSend.selectedNetwork,
        dataToSend.mobileNumber,
        dataToSend.date,
        dataToSend.uniqueId,
        dataToSend.winningCodeConfirmation,
      );

      return Object.assign({}, state.user, {
        // visibilityFilter: action.filter
        fullName: action.newUser.fullName,
        emailAddress: action.newUser.emailAddress,
        selectedNetwork: action.newUser.selectedNetwork,
        mobileNumber: action.newUser.mobileNumber,
        date: action.newUser.date,
        uniqueId: action.newUser.uniqueId,
        winningCodeConfirmation:false,
      });

    case SET_NUMBER :
      return Object.assign({}, state.user, {
        duplicateNumber: action.newNumber.mobileNumber,
      });

    case SET_WINNING_ID : {
      const dataToSend = {
        fullName: action.winningId.fullName,
        emailAddress: action.winningId.emailAddress,
        selectedNetwork: action.winningId.selectedNetwork,
        mobileNumber: action.winningId.mobileNumber,
        date: action.winningId.date,
        uniqueId: action.winningId.uniqueId,
        winningCodeConfirmation: action.winningId.winningCodeConfirmation,
      };

      postWinnerHelper(
        dataToSend.fullName,
        dataToSend.emailAddress,
        dataToSend.selectedNetwork,
        dataToSend.mobileNumber,
        dataToSend.date,
        dataToSend.uniqueId,
        dataToSend.winningCodeConfirmation,
      );
      postAllWinners(
        dataToSend.fullName,
        dataToSend.emailAddress,
        dataToSend.selectedNetwork,
        dataToSend.mobileNumber,
        dataToSend.date,
        dataToSend.uniqueId,
        dataToSend.winningCodeConfirmation,
      );

      return Object.assign({}, state.user, {
        fullName: action.winningId.fullName,
        emailAddress: action.winningId.emailAddress,
        selectedNetwork: action.winningId.selectedNetwork,
        mobileNumber: action.winningId.mobileNumber,
        date: action.winningId.date,
        uniqueId: action.winningId.uniqueId,
        winningCodeConfirmation: action.winningId.winningCodeConfirmation,
      });
    }

    case SET_WINNING_CODE : {
      return Object.assign({}, state.user, {
        winningCode: action.winningCode
      })
    }

    case SET_CODE_CONFIRMATION : {
      const postData = {
        winnerConfirmed: action.winningCodeConfirmation.winningCodeConfirmation,
        selectedNetwork: action.winningCodeConfirmation.selectedNetwork,
        confirmedWinningNumber: action.winningCodeConfirmation.mobileNumber
      };

      fire.database().ref('confirmedWinner/').set({postData});
      return Object.assign({}, state.user, {
        winningCodeConfirmation: action.winningCodeConfirmation.winningCodeConfirmation,
        selectedNetwork: action.winningCodeConfirmation.selectedNetwork,
        mobileNumber: action.winningCodeConfirmation.mobileNumber
      })
    }

    default:
      return state;
  }
};

export default reducer;