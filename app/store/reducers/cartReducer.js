import AsyncStorage from '@react-native-community/async-storage';
import { REMOVE_ITEM_IN_CART } from '../action/cartAction';
import { REMOVE_ALL_CART_PRODUCT } from '../action/checkoutAction';

const initialState = {
  products: [],
};

const setDataInStorage = async product => {
  try {
    await AsyncStorage.setItem('cartproducts', JSON.stringify(product));
  } catch (error) {
    console.log('Something went Wrong!!!!');
  }
};

const clearCartStorage = async () => {
  console.log("cart storage clear")
  try {
    await AsyncStorage.removeItem('cartproducts');
  } catch (error) {
    console.log('Something went Wrong!!!!');
  }
};

export default (state = initialState, action) => {
  switch (action.type) {
    case 'CHECK_STORAGE':
      return {
        ...state,
        products: action.payload,
      };

    case 'ADD_VALUE':
      return {
        ...state,
        products: [...state.products, action.payload],
      };

    case REMOVE_ITEM_IN_CART:
      setDataInStorage(action.payload);
      return {
        ...state,
        products: action.payload,
      };

    case 'REMOVE_ALL_VALUE':
      return {
        ...state,
        products: action.payload,
      };

    case REMOVE_ALL_CART_PRODUCT:
      clearCartStorage();
      console.log("after cart storage clear")
      return {
        ...state,
        products: [],
      };

    default: {
      return state;
    }
  }
};
