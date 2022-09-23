import AsyncStorage from '@react-native-community/async-storage';

// const getProductsFromStorage = async () => {
//   try {
//     var cartProduct = await AsyncStorage.getItem('cartproducts');
//     cartProducts = JSON.parse(cartProduct);
//   } catch (error) {
//     console.log('Cart Reducers', error);
//   }
// };

export const checkStorageAction = () => async dispatch => {
  try {
    var cartProduct = await AsyncStorage.getItem('cartproducts');
    var cartProducts = JSON.parse(cartProduct);
  } catch (error) {
    console.log('Cart Reducers', error);
  }

  dispatch({
    type: CHECK_STORAGE,
    payload: cartProducts,
  });
  //console.log('Call Storage Action', cartProducts);
};

export const removeCartItemAction = cartProduct => dispatch => {
  dispatch({
    type: REMOVE_ITEM_IN_CART,
    payload: cartProduct,
  });
};

export const REMOVE_ITEM_IN_CART = 'REMOVE_ITEM_IN_CART';
export const CHECK_STORAGE = 'CHECK_STORAGE';
