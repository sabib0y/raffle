/* @flow */

import {
  SET_RAFFLE,
} from './constants/type';

export const getRaffle = raffleList => {
  return {
    type: SET_RAFFLE,
    raffleList
  }
};

