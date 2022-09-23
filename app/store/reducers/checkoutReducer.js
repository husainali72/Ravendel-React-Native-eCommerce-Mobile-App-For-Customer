const initialState = {
  chekoutDetails: {},
};

export default (state = initialState, action) => {
  switch (action.type) {
    case 'CHEKOUT_DETAILS':
      return {
        chekoutDetails: action.payload,
      };
    default: {
      return state;
    }
  }
};
