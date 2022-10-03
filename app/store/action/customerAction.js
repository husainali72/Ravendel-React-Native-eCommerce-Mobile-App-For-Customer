import { ADD_ADDRESSBOOK, DELETE_ADDRESSBOOK, GET_CUSTOMER, UPDATE_ADDRESSBOOK } from "../../queries/customerQuery";
import { CHANGE_PASSWORD, EDIT_CUSTOMER } from "../../queries/userQuery";
import { isEmpty, storeData } from "../../utils/helper";
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
      if (!isEmpty(response.data.updateCustomer) && response.data.updateCustomer.success) {
        dispatch(userDetailsfetch(payload.id))
        navigation.navigate('Profile', {
          initial: false,
        })

        dispatch({
          type: CUSTOMER_LOADING_FAIL,
        });
      } else {
        dispatch({
          type: CUSTOMER_LOADING_FAIL,
        });
        dispatch({
          type: ALERT_ERROR,
          payload: response.data.updateCustomer.message || 'Something went wrong. Please try again later.',
        });
      }
    })
    .catch((error) => {
      dispatch({
        type: CUSTOMER_LOADING_FAIL,
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
      if (!isEmpty(response.data.updateCustomerPassword) && response.data.updateCustomerPassword.success) {
        dispatch(userDetailsfetch(payload.id))
        navigation.goBack(null)
        dispatch({
          type: CUSTOMER_LOADING_FAIL,
        });
      } else {
        dispatch({
          type: CUSTOMER_LOADING_FAIL,
        });
        dispatch({
          type: ALERT_ERROR,
          payload: response.data.updateCustomerPassword.message || 'Something went wrong. Please try again later.',
        });
      }
    })
    .catch((error) => {
      dispatch({
        type: CUSTOMER_LOADING_FAIL,
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
      if (!isEmpty(response.data.customer) && response.data.customer.message.success) {
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
          type: CUSTOMER_LOADING_FAIL,
        });
      } else {
        dispatch({
          type: CUSTOMER_LOADING_FAIL,
        });
        dispatch({
          type: ALERT_ERROR,
          payload: response.data.customer.message.message || 'Something went wrong. Please try again later.',
        });
      }
    })
    .catch((error) => {

      dispatch({
        type: CUSTOMER_LOADING_FAIL,
      });
      dispatch({
        type: ALERT_ERROR,
        payload: 'Something went wrong. Please try again later.',
      });
    });
};
export const addAddressAction = (payload, navigation) => (dispatch) => {
  dispatch({
    type: CUSTOMER_LOADING,
  });
  mutation(ADD_ADDRESSBOOK, payload)
    .then((response) => {
      if (!isEmpty(response.data.addAddressBook) && response.data.addAddressBook.success) {
        setTimeout(() => {
          dispatch(userDetailsfetch(payload.id))
        }, 1500);
        dispatch({
          type: CUSTOMER_LOADING_FAIL,
        });
      } else {
        dispatch({
          type: CUSTOMER_LOADING_FAIL,
        });
        dispatch({
          type: ALERT_ERROR,
          payload: response.data.message || 'Something went wrong. Please try again later.',
        });
      }
    })
    .catch((error) => {
      dispatch({
        type: CUSTOMER_LOADING_FAIL,
      });
      dispatch({
        type: ALERT_ERROR,
        payload: 'Something went wrong. Please try again later.',
      });
    });
};
export const removeAddressAction = (payload, navigation) => (dispatch) => {
  dispatch({
    type: CUSTOMER_LOADING,
  });
  mutation(DELETE_ADDRESSBOOK, payload)
    .then((response) => {
      if (!isEmpty( response.data.deleteAddressBook) &&  response.data.deleteAddressBook.success) {
          dispatch(userDetailsfetch(payload.id))
          dispatch({
            type: CUSTOMER_LOADING_FAIL,
          });
      } else {
        dispatch({
          type: CUSTOMER_LOADING_FAIL,
        });
        dispatch({
          type: ALERT_ERROR,
          payload: response.data.message || 'Something went wrong. Please try again later.',
        });
      }
    })
    .catch((error) => {
      dispatch({
        type: CUSTOMER_LOADING_FAIL,
      });
      dispatch({
        type: ALERT_ERROR,
        payload: 'Something went wrong. Please try again later.',
      });
    });
};
export const updateAddressAction = (payload, navigation) => (dispatch) => {
  dispatch({
    type: CUSTOMER_LOADING,
  });
  mutation(UPDATE_ADDRESSBOOK, payload)
    .then((response) => {
      if (!isEmpty(response.data.updateAddressBook) && response.data.updateAddressBook.success) {
        setTimeout(() => {
          dispatch(userDetailsfetch(payload.id))
        }, 2500);
        dispatch({
          type: CUSTOMER_LOADING_FAIL,
        });
      } else {
        dispatch({
          type: CUSTOMER_LOADING_FAIL,
        });
        dispatch({
          type: ALERT_ERROR,
          payload: response.data.message || 'Invalid Password',
        });
      }
    })
    .catch((error) => {
      dispatch({
        type: CUSTOMER_LOADING_FAIL,
      });
      dispatch({
        type: ALERT_ERROR,
        payload: 'Something went wrong. Please try again later.',
      });
    });
};

export const CUSTOMER_LOADING = 'CUSTOMER_LOADING';
export const CUSTOMER_LOADING_FAIL = 'CUSTOMER_LOADING_FAIL';
export const CUSTOMER_STOP = 'CUSTOMER_STOP';

