import {
  GET_PRODUCTS,
  GET_CATEGORIES,
  GET_PRODUCT,
  GET_CAT_PRODUCTS,
  GET_PRODUCT_REVIEWS,
  ADD_REVIEW,
  GET_ALL_CATEGORIES,
} from '../../queries/productQuery';
import { isEmpty } from '../../utils/helper';
import { mutation, query } from '../../utils/service';
import { ALERT_ERROR } from '../reducers/alert';

export const productsAction = () => async (dispatch) => {
  dispatch({
    type: PRODUCT_LOADING,
  });
  const response = await query(GET_PRODUCTS);
  // .then((response) => {
  try {
    if (!isEmpty(response.data.products) && response) {
      return dispatch({
        type: PRODUCTS_SUCCESS,
        payload: response.data.products.data,
      });
    }
  } catch (error) {
    dispatch({
      type: PRODUCT_FAIL,
    });
    return dispatch({
      type: PRODUCT_FAIL,
      payload: { boolean: true, message: error, error: true },
    });
  }
};

export const productAction = (id) => async (dispatch) => {
  dispatch({
    type: PRODUCT_LOADING,
  });
  const response = await query(GET_PRODUCT, { id: id });
  // .then((response) => {
  try {
    if (!isEmpty(response.data.product)) {
      return dispatch({
        type: PRODUCT_SUCCESS,
        payload: response.data.product.data,
      });
    }
  } catch (error) {
    dispatch({
      type: PRODUCT_FAIL,
    });
    return dispatch({
      type: PRODUCT_FAIL,
      payload: { boolean: true, message: error, error: true },
    });
  }
};

export const categoriesAction = () => async (dispatch) => {
  dispatch({
    type: CAT_LOADING,
  });
  const response = await query(GET_CATEGORIES);
  // .then((response) => {
  try {
    if (!isEmpty(response.data.productCategories)) {
      return dispatch({
        type: CATS_SUCCESS,
        payload: response.data.productCategories,
      });
    }
  } catch (error) {
    dispatch({
      type: CAT_FAIL,
    });
    return dispatch({
      type: CAT_FAIL,
      payload: { boolean: true, message: error, error: true },
    });
  }
};

export const catProductAction = (url) => async (dispatch) => {
  dispatch({
    type: PRODUCT_LOADING,
  });
  const response = await query(GET_CAT_PRODUCTS, { url: url });
  // .then((response) => {
  try {
    if (!isEmpty(response.data.productsbycaturl)) {
      return dispatch({
        type: CAT_PRODUCTS,
        payload: response.data.productsbycaturl,
      });
    }
  } catch (error) {
    dispatch({
      type: PRODUCT_FAIL,
    });
    return dispatch({
      type: PRODUCT_FAIL,
      payload: { boolean: true, message: error, error: true },
    });
  }
};

export const AllCategoriesAction = (id) => async (dispatch) => {
  dispatch({
    type: PRODUCT_LOADING,
  });
  const response = await query(GET_ALL_CATEGORIES, {
    fillter: { parentId: id },
  });
  // .then((response) => {
  try {
    if (!isEmpty(response.data.productCategoriesByFilter)) {
      if (id === null) {
        return dispatch({
          type: ALL_CATEGORIES,
          payload: response.data.productCategoriesByFilter,
        });
      } else {
        return dispatch({
          type: SINGLE_CATEGORY,
          payload: response.data.productCategoriesByFilter,
        });
      }
    }
  } catch (error) {
    dispatch({
      type: PRODUCT_FAIL,
    });
    return dispatch({
      type: PRODUCT_FAIL,
      payload: { boolean: true, message: error, error: true },
    });
  }
};

export const productReviewsAction = (id) => async (dispatch) => {
  dispatch({
    type: PRODUCT_LOADING,
  });
  const response = await query(GET_PRODUCT_REVIEWS, { product_id: id });
  // .then((response) => {
  try {
    if (isEmpty(response.data.productwise_Review)) {
      return dispatch({
        type: PRODUCT_REVIEWS,
        payload: response.data.productwisereview.data,
      });
    }
  } catch (error) {
    dispatch({
      type: PRODUCT_FAIL,
    });
    return dispatch({
      type: PRODUCT_FAIL,
      payload: { boolean: true, message: error, error: true },
    });
  }
};

export const productAddReviewAction = (object) => async (dispatch) => {
  dispatch({
    type: PRODUCT_LOADING,
  });
  const response = await mutation(ADD_REVIEW, object);
  // .then((response) => {
  try {
    if (!isEmpty(response.data.addReview) && response.data.addReview.success) {
      dispatch({
        type: ADD_PRODUCT_REVIEWS,
        payload: response.data.addReview,
      });
    } else {
      dispatch({
        type: PRODUCT_FAIL,
      });
      dispatch({
        type: ALERT_ERROR,
        payload: response.data.addReview.message || 'Something went wrong',
      });
    }
  } catch (error) {
    // console.log('error', error);
    dispatch({
      type: PRODUCT_FAIL,
    });
  }
};

export const CAT_LOADING = 'CAT_LOADING';
export const CATS_SUCCESS = 'CATS_SUCCESS';
export const CAT_FAIL = 'CAT_FAIL';
export const CAT_SUCCESS = 'CAT_SUCCESS';
export const PRODUCT_LOADING = 'PRODUCT_LOADING';
export const PRODUCT_SUCCESS = 'PRODUCT_SUCCESS';
export const PRODUCTS_SUCCESS = 'PRODUCTS_SUCCESS';
export const PRODUCT_FAIL = 'PRODUCT_FAIL';
export const CAT_PRODUCTS = 'CAT_PRODUCTS';
export const CAT_PRODUCTS_CLEAR = 'CAT_PRODUCTS_CLEAR';
export const PRODUCT_REVIEWS = 'PRODUCT_REVIEWS';
export const PRODUCT_CLEAR = 'PRODUCT_CLEAR';
export const ADD_PRODUCT_REVIEWS = 'ADD_PRODUCT_REVIEWS';
export const ALL_CATEGORIES = 'ALL_CATEGORIES';
export const SINGLE_CATEGORY = 'SINGLE_CATEGORY';
