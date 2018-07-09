import {
  SET_USER,
  SET_NUMBER,
  SET_WINNING_ID,
  SET_WINNING_CODE, SET_CODE_CONFIRMATION
} from './constants/type';
import writeNewPost from '../helpers/firebasePostHelper';
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
        user: {
          fullName: action.newUser.fullName,
          emailAddress: action.newUser.emailAddress,
          selectedNetwork: action.newUser.selectedNetwork,
          mobileNumber: action.newUser.mobileNumber,
          date: action.newUser.date,
          uniqueId: action.newUser.uniqueId,
          winningCodeConfirmation:false,
          showResults: false,
        }
      });

    case SET_NUMBER :
      return Object.assign({}, state.user, {
        user: {
          duplicateNumber: action.newNumber.mobileNumber,
        }
      });

    case SET_WINNING_ID : {

      return Object.assign({}, state.user, {
        user: {
          mobileNumber: action.winningId.mobileNumber,
          uniqueId: action.winningId.uniqueId,
        }
      });
    }

    case SET_WINNING_CODE : {
      return Object.assign({}, state.user, {
        user: {
          winningCode: action.winningCode
        }
      })
    }

    case SET_CODE_CONFIRMATION : {
      const postData = {
        winnerConfirmed: action.winningCodeConfirmation.winningCodeConfirmation,
      };

      fire.database().ref('confirmedWinner/').set({postData});
      return Object.assign({}, state.user, {
        user: {
          winningCodeConfirmation: action.winningCodeConfirmation.winningCodeConfirmation,
        }
      })
    }

    default:
      return state;
  }
};

export default reducer;