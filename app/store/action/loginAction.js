import APclient from "../../Client";
import { ADD_ADDRESSBOOK, DELETE_ADDRESSBOOK, GET_CUSTOMER, UPDATE_ADDRESSBOOK } from "../../queries/customerQuery";
import { ADD_CUSTOMER } from "../../queries/userQuery";
import { checkUserLoginStorage,isEmpty, storeData } from "../../utils/helper";
import { mutation, PostFetchWithoutToken, query } from "../../utils/service";
import { ALERT_ERROR, ALERT_SUCCESS } from "../reducers/alert";
import { CART_EMPTY, checkStorageAction } from "./cartAction";
import { userDetailsfetch } from "./customerAction";


export const LoginAction = (email, password, navigation) => (dispatch) => {
  dispatch({
    type: LOGIN_LOADING,
  });
  dispatch({
    type: CART_EMPTY        
  });
  PostFetchWithoutToken(`customers/login`, {
    email: email,
    password: password,
  })
    .then(async (response) => {
      let data = response.data;
      if (!isEmpty(response.data.success) && response.data.success) {
        dispatch(checkStorageAction(data.customer._id));
        const userDetails = data.customer
        storeData('token', data.token)
        storeData('userDetails', JSON.stringify(userDetails))
        dispatch({
          type: LOGIN,
          payload: { token: data.token },
        });
      
        dispatch({
          type: USER,
          payload: userDetails,
        });
        dispatch({
          type: ALERT_SUCCESS,
          payload: 'Login  successfully',
        });
        await APclient.resetStore();

        navigation.reset({
          index: 0,
          routes: [{ name: 'Home' }]
     })

      } else {
        dispatch({
          type: LOGIN_STOP,
        });
        dispatch({
          type: ALERT_ERROR,
          payload: response.data.message || 'Invalid Password',
        });
      }
    })
    .catch((error) => {
      dispatch({
        type: LOGIN_FAIL,
      });
      dispatch({
        type: ALERT_ERROR,
        payload: 'Something went wrong. Please try again later.',
      });
    });
};

export const sessionCheck = () => async (dispatch) => {
  const loginDetails = await checkUserLoginStorage()
  if (!isEmpty(loginDetails.token) && !isEmpty(loginDetails.userDetails)) {
    const userDetails = loginDetails.userDetails
    dispatch({
      type: LOGIN,
      payload: { token: loginDetails.token },
    });
    dispatch(userDetailsfetch(userDetails._id))
  }
}


export const registerAction = (payload, navigation) => (dispatch) => {
  dispatch({
    type: LOGIN_LOADING,
  });
  mutation(ADD_CUSTOMER, payload)
    .then((response) => {
      if (!isEmpty(response.data.addCustomer) && response.data.addCustomer.success) {
        navigation.navigate('Login', {
          initial: false,
        })
        dispatch({
          type: LOGIN_STOP,
        });
        dispatch({
          type: ALERT_SUCCESS,
          payload: 'Signup successfully',
        });
      } else {
        dispatch({
          type: LOGIN_STOP,
        });
        dispatch({
          type: ALERT_ERROR,
          payload: response.data.addCustomer.message || 'Something went wrong. Please try again later.',
        });
      }
    })
    .catch((error) => {
      dispatch({
        type: LOGIN_FAIL,
      });
      dispatch({
        type: ALERT_ERROR,
        payload: 'Something went wrong. Please try again later.',
      });
    });
};


export const LOGIN_LOADING = 'LOGIN_LOADING';
export const LOGIN_FAIL = 'LOGIN_FAIL';
export const LOGIN_STOP = 'LOGIN_STOP';
export const USER = 'USER';
export const LOGIN = 'LOGIN';
