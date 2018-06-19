import {
  SET_RAFFLE,
} from './constants/type';

const initialState = {
  items: {
    raffleList: {
      name: null,
      surname: null,
      email: null,
      mobile: null
    },
  }
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_RAFFLE :
      delete state.items.raffleList;

      return {
        items: Object.assign(state.items, action)
      };

    default:
      return state;
  }
};

export default reducer;