import { GET_CUSTOMER, UPDATE_ADDRESSBOOK } from "../../queries/customerQuery";
import { CHANGE_PASSWORD, EDIT_CUSTOMER } from "../../queries/userQuery";
import { storeData } from "../../utils/helper";
import { mutation, query } from "../../utils/service";
import { ALERT_ERROR } from "../reducers/alert";
import { CART_EMPTY } from "./cartAction";
import { USER } from "./loginAction";



export const editCustomerAction = (payload, navigation) => (dispatch) => {
  dispatch({
    type: CUSTOMER_LOADING,
  });
  mutation(EDIT_CUSTOMER, payload)
    .then((response) => {
      console.log(response.data.updateCustomer.success, 'resssssssss')
      if (response.data.updateCustomer.success) {
        dispatch(userDetailsfetch(payload.id))
        navigation.navigate('Profile', {
          initial: false,
        })

        dispatch({
          type: CUSTOMER_LOADING_STOP,
        });
      } else {
        dispatch({
          type: CUSTOMER_LOADING_STOP,
        });
        dispatch({
          type: ALERT_ERROR,
          payload: response.data.updateCustomer.message || 'Something went wrong. Please try again later.',
        });
      }
    })
    .catch((error) => {
      dispatch({
        type: CUSTOMER_LOADING_STOP,
      });
      dispatch({
        type: ALERT_ERROR,
        payload: 'Something went wrong. Please try again later.',
      });
    });
};
export const changePasswordAction = (payload, navigation) => (dispatch) => {
  dispatch({
    type: CUSTOMER_LOADING,
  });
  mutation(CHANGE_PASSWORD, payload)
    .then((response) => {
      console.log(response.data.updateCustomerPassword.success, 'resssssssss')
      if (response.data.updateCustomerPassword.success) {
        dispatch(userDetailsfetch(payload.id))
        navigation.goBack(null)
        dispatch({
          type: CUSTOMER_LOADING_STOP,
        });
      } else {
        dispatch({
          type: CUSTOMER_LOADING_STOP,
        });
        dispatch({
          type: ALERT_ERROR,
          payload: response.data.updateCustomerPassword.message || 'Something went wrong. Please try again later.',
        });
      }
    })
    .catch((error) => {
      dispatch({
        type: CUSTOMER_LOADING_STOP,
      });
      dispatch({
        type: ALERT_ERROR,
        payload: 'Something went wrong. Please try again later.',
      });
    });
};

export const userDetailsfetch = (id) => (dispatch) => {
  dispatch({
    type: CUSTOMER_LOADING,
  });
  query(GET_CUSTOMER, { "id": id })
    .then(async (response) => {
      if (response.data.customer.message.success) {
        dispatch({
          type: USER,
          payload: response.data.customer.data,
        });
        dispatch({
          type: CART_EMPTY,
          payload: response.data.customer.data,
        });
        storeData('userDetails', JSON.stringify(response.data.customer.data))
        dispatch({
          type: CUSTOMER_LOADING_STOP,
        });
      } else {
        dispatch({
          type: CUSTOMER_LOADING_STOP,
        });
        dispatch({
          type: ALERT_ERROR,
          payload: response.data.customer.message.message || 'Something went wrong. Please try again later.',
        });
      }
    })
    .catch((error) => {

      dispatch({
        type: CUSTOMER_LOADING_STOP,
      });
      dispatch({
        type: ALERT_ERROR,
        payload: 'Something went wrong. Please try again later.',
      });
    });
};
export const addAddressAction = (payload, navigation) => (dispatch) => {
  dispatch({
    type: LOGIN_LOADING,
  });
  mutation(ADD_ADDRESSBOOK, payload)
    .then((response) => {
      if (response.data.addAddressBook.success) {
        setTimeout(() => {
          dispatch(userDetailsfetch(payload.id))
        }, 1500);
        dispatch({
          type: LOGIN_STOP,
        });
      } else {
        dispatch({
          type: LOGIN_STOP,
        });
        dispatch({
          type: ALERT_ERROR,
          payload: response.data.message || 'Something went wrong. Please try again later.',
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
export const removeAddressAction = (payload, navigation) => (dispatch) => {
  dispatch({
    type: LOGIN_LOADING,
  });
  mutation(DELETE_ADDRESSBOOK, payload)
    .then((response) => {
      if (response.data.deleteAddressBook.success) {
          dispatch(userDetailsfetch(payload.id))
        dispatch({
          type: LOGIN_STOP,
        });
      } else {
        dispatch({
          type: LOGIN_STOP,
        });
        dispatch({
          type: ALERT_ERROR,
          payload: response.data.message || 'Something went wrong. Please try again later.',
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
export const updateAddressAction = (payload, navigation) => (dispatch) => {
  dispatch({
    type: LOGIN_LOADING,
  });
  mutation(UPDATE_ADDRESSBOOK, payload)
    .then((response) => {
      if (response.data.updateAddressBook.success) {
        setTimeout(() => {
          dispatch(userDetailsfetch(payload.id))
        }, 2500);
        dispatch({
          type: LOGIN_STOP,
        });
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

export const CUSTOMER_LOADING = 'CUSTOMER_LOADING';
export const CUSTOMER_LOADING_STOP = 'CUSTOMER_LOADING_STOP';
export const CUSTOMER_STOP = 'CUSTOMER_STOP';

