import {
  SET_USER,
  SET_NUMBER,
  SET_WINNING_ID,
  SET_WINNING_CODE, SET_CODE_CONFIRMATION
} from './constants/type';
import writeNewPost from '../helpers/firebasePostHelper';
import postWinnerHelper from '../helpers/postWinnerHelper';
import postAllWinners from '../helpers/postAllWinners';
import getWinningCodeConfirmation from '../helpers/postAllWinners';

const initialState = {
  user: {
    firstName: null,
    lastName: null,
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
    winningCodeConfirmation: false
  }
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_USER :
      const dataToSend = {
        firstName: action.newUser.firstName,
        lastName: action.newUser.lastName,
        emailAddress: action.newUser.emailAddress,
        mobileNumber: action.newUser.mobileNumber,
        date: action.newUser.date,
        uniqueId: action.newUser.uniqueId,
        winningCodeConfirmation: false,
      };

      writeNewPost(
        dataToSend.firstName,
        dataToSend.lastName,
        dataToSend.emailAddress,
        dataToSend.mobileNumber,
        dataToSend.date,
        dataToSend.uniqueId,
        dataToSend.winningCodeConfirmation,
      );

      return Object.assign({}, state.user, {
        // visibilityFilter: action.filter
        firstName: action.newUser.firstName,
        lastName: action.newUser.lastName,
        emailAddress: action.newUser.emailAddress,
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
        firstName: action.winningId.firstName,
        lastName: action.winningId.lastName,
        emailAddress: action.winningId.emailAddress,
        mobileNumber: action.winningId.mobileNumber,
        date: action.winningId.date,
        uniqueId: action.winningId.uniqueId,
        winningCodeConfirmation: action.winningId.winningCodeConfirmation,
      };

      postWinnerHelper(
        dataToSend.firstName,
        dataToSend.lastName,
        dataToSend.emailAddress,
        dataToSend.mobileNumber,
        dataToSend.date,
        dataToSend.uniqueId,
        dataToSend.winningCodeConfirmation,
      );
      postAllWinners(
        dataToSend.firstName,
        dataToSend.lastName,
        dataToSend.emailAddress,
        dataToSend.mobileNumber,
        dataToSend.date,
        dataToSend.uniqueId,
        dataToSend.winningCodeConfirmation,
      );

      return Object.assign({}, state.user, {
        firstName: action.winningId.firstName,
        lastName: action.winningId.lastName,
        emailAddress: action.winningId.emailAddress,
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
      return Object.assign({}, state.user, {
        winningCodeConfirmation: action.winningCodeConfirmation
      })
    }

    default:
      return state;
  }
};

export default reducer;