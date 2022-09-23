const initialState = {
  userDetails: {
    savedAddress: {},
    profileDetails: {},
    orders: {},
    isLoggin: false,
  },
};

export default (state = initialState, action) => {
  switch (action.type) {
    case 'USERS_DETAILS':
      return {
        chekoutDetails: action.payload,
      };
    default: {
      return state;
    }
  }
};
