import AsyncStorage from '@react-native-async-storage/async-storage';
import { Alert } from 'react-native';
import { ADD_CHECKOUT, ADD_ORDER } from '../../queries/orderQuery';
import { getValue, isEmpty } from '../../utils/helper';
import { mutation, query } from '../../utils/service';
import { ALERT_ERROR } from '../reducers/alert';
import { updateCartAction } from './cartAction';

export const checkoutDetailsAction =
  (checoutDetailsData, cartId, navigation) => async (dispatch) => {
    dispatch({
      type: CHECKOUT_LOADING,
    });
    console.log(JSON.stringify(checoutDetailsData));
    const response = await mutation(ADD_ORDER, checoutDetailsData);
    console.log(JSON.stringify(response));
    // .then(async (response) => {
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
          Alert.alert(
            'Success',
            'Congratulations! Your order has been placed successfully.',
            [
              {
                text: 'Ok',
                onPress: () => {
                  // navigation.reset({
                  //   index: 0,
                  //   routes: [{ name: 'Home' }],
                  // });
                  navigation.navigate('Home', {
                    checoutDetailsData,
                  });
                },
                style: 'cancel',
              },
            ],
            { cancelable: false },
          );
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
      // console.log('error', error);
      dispatch({
        type: CHECKOUT_LOADING_STOP,
      });
      dispatch({
        type: ALERT_ERROR,
        payload: 'Something went wrong. Please try again later.',
      });
    }
  };

export const CHEKOUT_DETAILS = 'CHEKOUT_DETAILS';
export const REMOVE_ALL_CART_PRODUCT = 'REMOVE_ALL_CART_PRODUCT';
export const UPDATE_CART_PRODUCT = 'UPDATE_CART_PRODUCT';
export const CHECKOUT_LOADING = 'CHECKOUT_LOADING';
export const CHECKOUT_LOADING_STOP = 'CHECKOUT_LOADING_STOP';
export const CHECKOUT_SUCCESS_STOP = 'CHECKOUT_SUCCESS_STOP';
