import AsyncStorage from '@react-native-async-storage/async-storage';
import { Alert } from 'react-native';
import {
  ADD_CHECKOUT,
  ADD_ORDER,
  ADD_TOCART,
  CHECK_ZIPCODE,
} from '../../queries/orderQuery';
import { getValue, isEmpty } from '../../utils/helper';
import { mutation, query } from '../../utils/service';
import { ALERT_ERROR } from '../reducers/alert';
import { updateCartAction } from './cartAction';
import NavigationConstants from '../../navigation/NavigationConstants';

export const checkoutDetailsAction =
  (checoutDetailsData, cartId, navigation) => async (dispatch) => {
    dispatch({
      type: CHECKOUT_LOADING,
    });
    const response = await mutation(ADD_ORDER, checoutDetailsData);
    try {
      if (response) {
        if (
          !isEmpty(response.data.addOrder) &&
          response.data.addOrder.success
        ) {
          dispatch({
            type: REMOVE_ALL_CART_PRODUCT,
          });
          await AsyncStorage.removeItem('cartproducts');
          dispatch({
            type: CHEKOUT_DETAILS,
            payload: checoutDetailsData,
          });
          const cartData = {
            id: cartId,
            products: [],
          };
          dispatch(updateCartAction(cartData, checoutDetailsData.customer_id));

          navigation.navigate(NavigationConstants.CHECKOUT_DETAILS_SCREEN, {
            checoutDetailsData,
          });
        } else {
          dispatch({
            type: CHECKOUT_LOADING_STOP,
          });
          dispatch({
            type: ALERT_ERROR,
            payload: 'Something went wrong. Please try again later.',
          });
        }
      }
    } catch (error) {
      dispatch({
        type: CHECKOUT_LOADING_STOP,
      });
      dispatch({
        type: ALERT_ERROR,
        payload: 'Something went wrong. Please try again later.',
      });
    }
  };

export const checkPincodeValid =
  (payload, navigation, navParams) => async (dispatch) => {
    dispatch({
      type: CHECKOUT_LOADING,
    });
    try {
      const response = await query(CHECK_ZIPCODE, payload);
      if (response.data.checkZipcode.success) {
        navigation.navigate('ShippingMethod', navParams);
      } else {
        dispatch({
          type: ALERT_ERROR,
          payload: response.data.checkZipcode.message,
        });
      }
    } catch (error) {
      console.log('error', error);
      dispatch({
        type: CART_FAIL,
      });
    }
  };

export const CHEKOUT_DETAILS = 'CHEKOUT_DETAILS';
export const REMOVE_ALL_CART_PRODUCT = 'REMOVE_ALL_CART_PRODUCT';
export const UPDATE_CART_PRODUCT = 'UPDATE_CART_PRODUCT';
export const CHECKOUT_LOADING = 'CHECKOUT_LOADING';
export const CHECKOUT_LOADING_STOP = 'CHECKOUT_LOADING_STOP';
export const CHECKOUT_SUCCESS_STOP = 'CHECKOUT_SUCCESS_STOP';
