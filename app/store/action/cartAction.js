// import AsyncStorage from '@react-native-community/async-storage';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  ADD_CART,
  ADD_TOCART,
  APPLY_COUPAN,
  APPLY_COUPON,
  APPLY_COUPON_CODE,
  CALCULATE_CART,
  CALCULATE_CART_WITHOUT_LOGIN,
  CART,
  CHANGE_QTY,
  DELETE_CART,
  DELETE_CART_PRODUCT,
  ORDER_HISTORY,
  UPDATE_CART,
} from '../../queries/orderQuery';
import { getToken, getValue, isEmpty } from '../../utils/helper';
import { mutation, query } from '../../utils/service';
import { ALERT_ERROR } from '../reducers/alert';

export const checkStorageAction = (userID, load) => async (dispatch) => {
  if (!isEmpty(userID)) {
    if (!load) {
      dispatch({
        type: CART_LOADING,
      });
    }
    try {
      const response = await query(CALCULATE_CART, { id: userID });

      var cartProducts = response.data.calculateCart.cartItems;
      dispatch({
        type: CHECK_STORAGE,
        payload: {
          cartProducts: cartProducts,
          cartSummary: response.data.calculateCart.totalSummary,
          cartID: response.data.calculateCart.id,
        },
      });
    } catch (error) {
      console.log('error in check storage', error);
      if (error === 'Cart not found') {
        var cartProduct = await getValue('cartproducts');
        if (!isEmpty(cartProduct)) {
          var filteredProducts = [];
          cartProduct = JSON.parse(cartProduct);
          var mergedArr = [...cartProduct];
          var filteredProducts = [];
          mergedArr.filter((val) => {
            // let exist = mergedArr.find(
            //   (n) => n.product_id === val.product_id && n.qty > val.qty,
            // );
            // if (
            //   !filteredProducts.find((n) => n.product_id === val.product_id)
            // ) {
            // if (isEmpty(exist)) {
            //   filteredProducts.push({
            //     product_id: val.product_id,
            //     product_title: val.product_title,
            //     qty: val.qty,
            //   });
            // }
            //  else {
            filteredProducts.push({
              productId: val.product_id,
              productTitle: val.product_title,
              qty: val.qty,
              productImage: '',
              attributes: val.attributes,
            });
            // }
            // }
          });
          const cartData = {
            userId: userID,
            products: !isEmpty(filteredProducts) ? filteredProducts : [],
          };
          dispatch(addCartAction(cartData));
        }
      }
      dispatch({
        type: CART_EMPTY,
      });
      dispatch({
        type: CHECK_STORAGE,
        payload: { cartProducts: [], cartID: '' },
      });
    }
  } else {
    dispatch({
      type: CART_LOADING,
    });
    try {
      var cartProduct = await AsyncStorage.getItem('cartproducts');
      var cartProduct = JSON.parse(cartProduct);
      const cartPaylaod = cartProduct
        ? cartProduct.map((item) => {
            return {
              productId: item.productId,
              variantId: '',
              productTitle: item.productTitle,
              attributes: item.attributes,
              qty: item.qty,
            };
          })
        : [];
      const response = await query(CALCULATE_CART_WITHOUT_LOGIN, {
        cartItems: cartPaylaod,
      });

      dispatch({
        type: CHECK_LOCAL_STORAGE,
        payload: {
          cartProducts: response.data.calculateCart.cartItems,
          cartSummary: response.data.calculateCart.totalSummary,
          cartID: '',
        },
      });
    } catch (error) {
      console.log('Cart Reducers', error);
    }
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
  console.log(response, 'cart add response');
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

export const CartQtyAction = (payload) => async (dispatch) => {
  const response = await mutation(CHANGE_QTY, payload);
  try {
    if (response.data.changeQty.success) {
      dispatch(checkStorageAction(payload.userId, true));
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
export const updateCartAction = (payload, userID) => async (dispatch) => {
  dispatch({
    type: CART_LOADING,
  });
  const response = await mutation(UPDATE_CART, payload);
  // .then(async (response) => {
  try {
    if (!isEmpty(response.data.updateCart)) {
      dispatch({
        type: RESPONSE_HANDLE,
        payload: response.data.updateCart.success,
      });
      dispatch(checkStorageAction(userID));
      await AsyncStorage.removeItem('cartproducts');
    }
  } catch (error) {
    console.log('error', error);
    dispatch({
      type: CART_FAIL,
    });
  }
};
export const removeFromCartAction = (payload, userID) => async (dispatch) => {
  dispatch({
    type: CART_LOADING,
  });
  const response = await mutation(DELETE_CART_PRODUCT, payload);
  // .then((response) => {
  try {
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
  } catch (error) {
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
  }
};

export const removeCartAction = (userID) => async (dispatch) => {
  dispatch({
    type: CART_LOADING,
  });
  const response = await mutation(DELETE_CART, { userId: userID });
  console.log(response, 'delte cart response');
  // .then((response) => {
  try {
    if (response) {
      // if (
      //   !isEmpty(response.data.deleteCartProduct) &&
      //   response.data.deleteCartProduct.success
      // ) {
      dispatch({
        type: CART_FAIL,
      });
      dispatch(checkStorageAction(userID));
      // }
    }
  } catch (error) {
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
  }
};
export const applyCouponAction =
  (payload, setCouponApplied) => async (dispatch) => {
    dispatch({
      type: CART_LOADING,
    });
    const response = await query(APPLY_COUPON_CODE, payload);
    console.log(JSON.stringify(response), 'repo coupon');
    try {
      if (response) {
        if (
          !isEmpty(response.data.calculateCoupon) &&
          response.data.calculateCoupon.message ===
            'Coupon code applied successfully'
        ) {
          dispatch({
            type: COUPON_APPLIED,
            payload: {
              couponDiscount:
                response.data.calculateCoupon.couponCard?.appliedCouponDiscount,
              cartProducts: response.data.calculateCoupon.cartItems,
              cartSummary: response.data.calculateCoupon.totalSummary,
            },
          });
          setCouponApplied(true);
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
    } catch (error) {
      console.log('error', error);
      dispatch({
        type: CART_FAIL,
      });
      dispatch({
        type: ALERT_ERROR,
        payload: 'Something went wrong. Please try again later.',
      });
    }
  };
export const orderHistoryAction = (payload) => async (dispatch) => {
  dispatch({
    type: ORDER_LOADING,
  });

  const response = await query(ORDER_HISTORY, payload);
  console.log(response, 'order response');
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
