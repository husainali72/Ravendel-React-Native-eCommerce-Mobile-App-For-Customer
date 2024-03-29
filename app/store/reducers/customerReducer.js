import {
  CUSTOMER_LOADING,
  CUSTOMER_LOADING_FAIL,
  USER_ALREADY_HAS_LOGIN,
} from '../action/customerAction';
import { USER } from '../action/loginAction';

const initialState = {
  savedAddress: {},
  profileDetails: {},
  orders: {},
  isLoggin: false,
  userDetails: [],
  loading: false,
};

export default (state = initialState, action) => {
  switch (action.type) {
    case CUSTOMER_LOADING:
      return {
        ...state,
        loading: true,
      };
    case CUSTOMER_LOADING_FAIL:
      return {
        ...state,
        loading: false,
      };
    case 'USERS_DETAILS':
      return {
        ...state,
        chekoutDetails: action.payload,
      };
    case USER:
      return {
        ...state,
        userDetails: action.payload,
        isLoggin: true,
      };
    case USER_ALREADY_HAS_LOGIN:
      return {
        ...state,
        ...action.payload,
        isLoggin: true,
      };
    case 'USER_LOGOUT':
      return { ...initialState };
    default: {
      return state;
    }
  }
};
