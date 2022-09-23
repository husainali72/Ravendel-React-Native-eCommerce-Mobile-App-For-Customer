export const checkoutDetailsAction = (checoutDetailsData) => (dispatch) => {
  dispatch({
    type: CHEKOUT_DETAILS,
    payload: checoutDetailsData,
  });
  dispatch({
    type: REMOVE_ALL_CART_PRODUCT,
    payload: [],
  });
};

export const CHEKOUT_DETAILS = 'CHEKOUT_DETAILS';
export const REMOVE_ALL_CART_PRODUCT = 'REMOVE_ALL_CART_PRODUCT';
