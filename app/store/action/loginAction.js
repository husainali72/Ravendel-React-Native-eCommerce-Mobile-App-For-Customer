import APclient from '../../Client';
import {
  ADD_ADDRESSBOOK,
  DELETE_ADDRESSBOOK,
  GET_CUSTOMER,
  UPDATE_ADDRESSBOOK,
} from '../../queries/customerQuery';
import { GET_CART } from '../../queries/orderQuery';
import { ADD_CUSTOMER } from '../../queries/userQuery';
import {
  checkUserLoginStorage,
  getValue,
  isEmpty,
  storeData,
} from '../../utils/helper';
import { mutation, PostFetchWithoutToken, query } from '../../utils/service';
import { ALERT_ERROR, ALERT_SUCCESS } from '../reducers/alert';
import {
  addCartAction,
  CART_EMPTY,
  checkStorageAction,
  updateCartAction,
} from './cartAction';
import { userDetailsfetch } from './customerAction';

export const LoginAction = (email, password, navigation) => (dispatch) => {
  dispatch({
    type: LOGIN_LOADING,
  });
  dispatch({
    type: CART_EMPTY,
  });
  PostFetchWithoutToken(`customers/login`, {
    email: email,
    password: password,
  })
    .then(async (response) => {
      let data = response.data;
      console.log('ddta', data);
      if (!isEmpty(response.data.success) && response.data.success) {
        const userDetails = data.customer;
        await APclient.resetStore();
        storeData('token', data.token);
        storeData('userDetails', JSON.stringify(userDetails));
        dispatch({
          type: LOGIN,
          payload: { token: data.token },
        });
        dispatch({
          type: USER,
          payload: userDetails,
        });
        var cartProductstore = await getValue('cartproducts');
        if (!isEmpty(cartProductstore)) {
          dispatch(getCartDetails(data.customer._id, cartProductstore));
        }
        dispatch({
          type: ALERT_SUCCESS,
          payload: 'Login  successfully',
        });

        navigation.reset({
          index: 0,
          routes: [{ name: 'Home' }],
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
      console.log('Error Login', error);
      dispatch({
        type: LOGIN_FAIL,
      });
      dispatch({
        type: ALERT_ERROR,
        payload: 'Something went wrong. Please try again later.',
      });
    });
};

export const getCartDetails =
  (userID, cartProductstore) => async (dispatch) => {
    query(GET_CART, { id: userID })
      .then(async (response) => {
        if (!isEmpty(response.data.cartbyUser.products)) {
          var cartProducts = response.data.cartbyUser.products;
          if (!isEmpty(cartProductstore)) {
            var filteredProducts = [];
            cartProductstore = JSON.parse(cartProductstore);
            var mergedArr = [...cartProductstore, ...cartProducts];
            var filteredProducts = [];
            mergedArr.filter((val) => {
              let exist = mergedArr.find(
                (n) => n.product_id === val.product_id && n.qty > val.qty,
              );
              if (
                !filteredProducts.find((n) => n.product_id === val.product_id)
              ) {
                if (isEmpty(exist)) {
                  filteredProducts.push({
                    product_id: val.product_id,
                    product_title: val.product_title,
                    qty: val.qty,
                  });
                } else {
                  filteredProducts.push({
                    product_id: val.product_id,
                    product_title: val.product_title,
                    qty: exist.qty,
                  });
                }
              }
            });
            if (!isEmpty(filteredProducts)) {
              const cartData = {
                id: response.data.cartbyUser.id,
                products: filteredProducts,
              };
              dispatch(updateCartAction(cartData, userID));
            }
          }
        } else if (
          !isEmpty(response.data.cartbyUser.id) &&
          isEmpty(response.data.cartbyUser.products)
        ) {
          if (!isEmpty(cartProductstore)) {
            var filteredProducts = [];
            cartProductstore = JSON.parse(cartProductstore);
            var filteredProducts = [];
            cartProductstore.map((val) => {
              filteredProducts.push({
                product_id: val.product_id,
                product_title: val.product_title,
                qty: val.qty,
              });
            });
            if (!isEmpty(filteredProducts)) {
              const cartData = {
                id: response.data.cartbyUser.id,
                products: filteredProducts,
              };
              dispatch(updateCartAction(cartData, userID));
            }
          }
        }
      })
      .catch((error) => {
        // console.log('error in getCartDetails ', error);
        if (!isEmpty(cartProductstore)) {
          var filteredProducts = [];
          cartProductstore = JSON.parse(cartProductstore);
          var filteredProducts = [];
          cartProductstore.map((val) => {
            filteredProducts.push({
              product_id: val.product_id,
              product_title: val.product_title,
              qty: val.qty,
            });
          });
          if (!isEmpty(filteredProducts)) {
            const cartData = {
              user_id: userID,
              products: filteredProducts,
            };
            dispatch(addCartAction(cartData));
          }
        }
        dispatch({
          type: CART_EMPTY,
        });
      });
  };
export const sessionCheck = () => async (dispatch) => {
  const loginDetails = await checkUserLoginStorage();
  if (!isEmpty(loginDetails.token) && !isEmpty(loginDetails.userDetails)) {
    const userDetails = loginDetails.userDetails;
    dispatch({
      type: LOGIN,
      payload: { token: loginDetails.token },
    });
    dispatch(userDetailsfetch(userDetails._id));
  }
};

export const registerAction = (payload, navigation) => (dispatch) => {
  dispatch({
    type: LOGIN_LOADING,
  });
  mutation(ADD_CUSTOMER, payload)
    .then((response) => {
      if (
        !isEmpty(response.data.addCustomer) &&
        response.data.addCustomer.success
      ) {
        navigation.navigate('Login', {
          initial: false,
        });
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
          payload:
            response.data.addCustomer.message ||
            'Something went wrong. Please try again later.',
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
