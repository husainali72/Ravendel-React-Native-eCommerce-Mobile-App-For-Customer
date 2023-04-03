// import AsyncStorage from '@react-native-community/async-storage';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  ADD_CART,
  ADD_TOCART,
  APPLY_COUPAN,
  APPLY_COUPON,
  CART,
  DELETE_CART_PRODUCT,
  GET_CART,
  ORDER_HISTORY,
  UPDATE_CART,
} from '../../queries/orderQuery';
import { getToken, getValue, isEmpty } from '../../utils/helper';
import { mutation, query } from '../../utils/service';
import { ALERT_ERROR } from '../reducers/alert';

export const checkStorageAction = (userID) => async (dispatch) => {
  if (!isEmpty(userID)) {
    dispatch({
      type: CART_LOADING,
    });
    query(GET_CART, { id: userID })
      .then(async (response) => {
        if (!isEmpty(response.data.cartbyUser.products)) {
          var cartProducts = response.data.cartbyUser.products;
          dispatch({
            type: CHECK_STORAGE,
            payload: {
              cartProducts: cartProducts,
              cartID: response.data.cartbyUser.id,
            },
          });
        } else if (
          !isEmpty(response.data.cartbyUser.id) &&
          isEmpty(response.data.cartbyUser.products)
        ) {
          dispatch({
            type: CHECK_STORAGE,
            payload: { cartProducts: [], cartID: response.data.cartbyUser.id },
          });
        }
      })
      .catch((error) => {
        console.log('error in check storage', error);
        dispatch({
          type: CART_EMPTY,
        });
        dispatch({
          type: CHECK_STORAGE,
          payload: { cartProducts: [], cartID: '' },
        });
      });
  } else {
    dispatch({
      type: CART_LOADING,
    });
    try {
      var cartProduct = await AsyncStorage.getItem('cartproducts');
      if (!isEmpty(cartProduct)) {
        var cartProducts = JSON.parse(cartProduct);
      }
    } catch (error) {
      console.log('Cart Reducers', error);
    }
    dispatch({
      type: CHECK_LOCAL_STORAGE,
      payload: { cartProducts: cartProducts, cartID: '' },
    });
  }
};
export const removeCartItemAction = (cartProduct) => (dispatch) => {
  dispatch({
    type: REMOVE_ITEM_IN_CART,
    payload: cartProduct,
  });
};

export const addToCartAction = (payload) => async (dispatch) => {
  dispatch({
    type: CART_LOADING,
  });
  const response = await mutation(ADD_TOCART, payload);
  // .then((response) => {
  try {
    if (!isEmpty(response.data.addToCart) && response.data.addToCart.success) {
      dispatch({
        type: RESPONSE_HANDLE,
        payload: response.data.addToCart.success,
      });
      dispatch(checkStorageAction(payload.user_id));
    }
  } catch (error) {
    console.log('error', error);
    dispatch({
      type: CART_FAIL,
    });
  }
};
export const addCartAction = (payload, isLoggin) => async (dispatch) => {
  dispatch({
    type: CART_LOADING,
  });
  console.log('payload', payload);

  const response = await mutation(ADD_CART, payload);
  // .then(async (response) => {
  try {
    console.log(response);
    if (!isEmpty(response.data.addCart) && response.data.addCart.success) {
      dispatch({
        type: RESPONSE_HANDLE,
        payload: response.data.addCart.success,
      });

      dispatch(checkStorageAction(payload.user_id));
      await AsyncStorage.removeItem('cartproducts');
    }
  } catch (error) {
    console.log('error', error);
    dispatch({
      type: CART_FAIL,
    });
  }
};
export const updateCartAction = (payload, userID) => (dispatch) => {
  dispatch({
    type: CART_LOADING,
  });
  mutation(UPDATE_CART, payload)
    .then(async (response) => {
      if (!isEmpty(response.data.updateCart)) {
        dispatch({
          type: RESPONSE_HANDLE,
          payload: response.data.updateCart.success,
        });
        dispatch(checkStorageAction(userID));
        await AsyncStorage.removeItem('cartproducts');
      }
    })
    .catch((error) => {
      console.log('error', error);
      dispatch({
        type: CART_FAIL,
      });
    });
};
export const removeFromCartAction = (payload, userID) => (dispatch) => {
  dispatch({
    type: CART_LOADING,
  });
  mutation(DELETE_CART_PRODUCT, payload)
    .then((response) => {
      if (response) {
        if (
          !isEmpty(response.data.deleteCartProduct) &&
          response.data.deleteCartProduct.success
        ) {
          dispatch({
            type: CART_FAIL,
          });
          dispatch(checkStorageAction(userID));
        }
      }
    })
    .catch((error) => {
      console.log('error cartupdate', error);
      dispatch({
        type: CART_FAIL,
      });
      dispatch({
        type: ALERT_ERROR,
        payload:
          response.data.calculateCoupon.message ||
          'Something went wrong. Please try again later.',
      });
    });
};
export const applyCouponAction = (payload) => (dispatch) => {
  dispatch({
    type: CART_LOADING,
  });
  query(APPLY_COUPON, payload)
    .then((response) => {
      if (response) {
        if (
          !isEmpty(response.data.calculateCoupon) &&
          response.data.calculateCoupon.total_coupon > 0
        ) {
          dispatch({
            type: COUPON_APPLIED,
            payload: response.data.calculateCoupon.total_coupon,
          });
        } else {
          dispatch({
            type: CART_FAIL,
          });
          dispatch({
            type: ALERT_ERROR,
            payload:
              response.data.calculateCoupon.message ||
              'Something went wrong. Please try again later.',
          });
        }
      }
    })
    .catch((error) => {
      console.log('error', error);
      dispatch({
        type: CART_FAIL,
      });
      dispatch({
        type: ALERT_ERROR,
        payload: 'Something went wrong. Please try again later.',
      });
    });
};
export const orderHistoryAction = (payload) => async (dispatch) => {
  dispatch({
    type: ORDER_LOADING,
  });

  const response = await query(ORDER_HISTORY, payload);
  // .then(response => {
  try {
    if (response) {
      if (
        !isEmpty(response.data.orderbyUser) &&
        response.data.orderbyUser.message.success
      ) {
        dispatch({
          type: ORDER_SUCCESS,
          payload: response.data.orderbyUser.data,
        });
      } else {
        dispatch({
          type: ORDER_LOAD_STOP,
        });
        dispatch({
          type: ALERT_ERROR,
          payload:
            response.data.calculateCoupon.message ||
            'Something went wrong. Please try again later.',
        });
      }
    }
  } catch (error) {
    console.log('error', error);
    dispatch({
      type: ORDER_LOAD_STOP,
    });
    dispatch({
      type: ALERT_ERROR,
      payload: 'Something went wrong. Please try again later.',
    });
  }
};

export const REMOVE_ITEM_IN_CART = 'REMOVE_ITEM_IN_CART';
export const CHECK_STORAGE = 'CHECK_STORAGE';
export const CART_LOADING = 'CART_LOADING';
export const ORDER_LOADING = 'ORDER_LOADING';
export const CART_FAIL = 'CART_FAIL';
export const ORDER_LOAD_STOP = 'ORDER_LOAD_STOP';
export const COUPON_APPLIED = 'COUPON_APPLIED';
export const COUPON_REMOVED = 'COUPON_REMOVED';
export const RESPONSE_HANDLE = 'RESPONSE_HANDLE';
export const ORDER_SUCCESS = 'ORDER_SUCCESS';
export const CART_EMPTY = 'CART_EMPTY';
export const CHECK_LOCAL_STORAGE = 'CHECK_LOCAL_STORAGE';
export const CHECK_CART = 'CHECK_CART';
