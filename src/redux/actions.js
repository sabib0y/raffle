/* @flow */

import {
  SET_USER,
} from './constants/type';

import {
  SET_NUMBER,
} from './constants/type';

import {
  SET_TIME_FORM,
} from "./constants/type";

import {
  SET_WINNING_ID,
} from './constants/type';

import {
  SET_WINNING_CODE,
} from './constants/type';

import {
  SET_CODE_CONFIRMATION,
} from './constants/type';

export const getUsers = newUser => {
  return {
    type: SET_USER,
    newUser
  }
};

export const getNumbers = newNumber => {
  return {
    type: SET_NUMBER,
    newNumber
  }
};

export const getWinningId = winningId => {
  return {
    type: SET_WINNING_ID,
    winningId
  }
};

export const getTimeForm = formTime => {
  return {
    type: SET_TIME_FORM,
    formTime
  }
};

export const getWinningCode = winningCode => {
  return {
    type: SET_WINNING_CODE,
    winningCode
  }
};

export const getWinningCodeConfirmation = winningCodeConfirmation => {
  return {
    type: SET_CODE_CONFIRMATION,
    winningCodeConfirmation
  };
};

