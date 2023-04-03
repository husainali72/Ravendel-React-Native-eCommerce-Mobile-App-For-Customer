import { GET_APP_SETTING } from '../../queries/appSetting';
import {
  FEATURE_CATEGORY,
  PRODUCT_BY_A_CATEGORY,
  RECENT_PRODUCT,
  SALE_PRODUCT,
} from '../../queries/productQuery';
import { isEmpty } from '../../utils/helper';
import { query } from '../../utils/service';

export const AppSettingAction = () => async (dispatch) => {
  // dispatch({
  //   type: SETTING_LOADING,
  // });
  const response = await query(GET_APP_SETTING);

  try {
    if (!isEmpty(response.data.getSettings)) {
      var currencyOptions = response.data.getSettings.store.currency_options;
      var crSymbol = '';
      if (
        currencyOptions.currency == 'dollar' ||
        currencyOptions.currency == 'cad'
      ) {
        if (currencyOptions.currency_position == 'left_space') {
          crSymbol = '$ ';
        } else if (currencyOptions.currency_position == 'right_space') {
          crSymbol = ' $';
        } else {
          crSymbol = '$';
        }
      } else if (currencyOptions.currency == 'eur') {
        if (currencyOptions.currency_position == 'left_space') {
          crSymbol = '€ ';
        } else if (currencyOptions.currency_position == 'right_space') {
          crSymbol = ' €';
        } else {
          crSymbol = '€';
        }
      } else if (currencyOptions.currency == 'gbp') {
        if (currencyOptions.currency_position == 'left_space') {
          crSymbol = '£ ';
        } else if (currencyOptions.currency_position == 'right_space') {
          crSymbol = ' £';
        } else {
          crSymbol = '£';
        }
      }
      return dispatch({
        type: GET_THEME_VALUE,
        payload: {
          homeslider: response.data.getSettings.appearance.mobile.slider,
          homeData: response.data.getSettings.appearance.mobile.mobile_section,
          themeSettings: response.data.getSettings.appearance.theme,
          title: response.data.getSettings.seo.meta_title,
          store: response.data.getSettings.store,
          currencySymbol: crSymbol,
        },
      });
    }
  } catch (error) {
    dispatch({
      type: SETTING_FAIL,
    });
  }
};
export const featureDataAction = () => (dispatch) => {
  dispatch({
    type: SETTING_LOADING,
  });
  query(FEATURE_CATEGORY)
    .then((response) => {
      if (!isEmpty(response.data.featureproducts)) {
        return dispatch({
          type: GET_FEATURE_PRODUCT,
          payload: response.data.featureproducts,
        });
      }
    })
    .catch((error) => {
      dispatch({
        type: SETTING_FAIL,
      });
    });
};
export const recentaddedproductAction = () => (dispatch) => {
  dispatch({
    type: SETTING_LOADING,
  });
  query(RECENT_PRODUCT)
    .then((response) => {
      if (!isEmpty(response.data.recentproducts)) {
        return dispatch({
          type: RECENT_ADD__PRODUCT,
          payload: response.data.recentproducts,
        });
      }
    })
    .catch((error) => {
      dispatch({
        type: SETTING_FAIL,
      });
    });
};
export const productOnSaleAction = () => (dispatch) => {
  dispatch({
    type: SETTING_LOADING,
  });
  query(SALE_PRODUCT)
    .then((response) => {
      if (!isEmpty(response.data.onSaleProducts)) {
        return dispatch({
          type: SALE_PRODUCTS,
          payload: response.data.onSaleProducts,
        });
      }
    })
    .catch((error) => {
      dispatch({
        type: SETTING_FAIL,
      });
    });
};
export const productByPerticulareAction = (payload) => (dispatch) => {
  dispatch({
    type: SETTING_LOADING,
  });
  query(PRODUCT_BY_A_CATEGORY, { id: payload })
    .then((response) => {
      if (!isEmpty(response.data.productsbycatid)) {
        return dispatch({
          type: CATEGORY_PRODUCT,
          payload: response.data.productsbycatid,
        });
      }
    })
    .catch((error) => {
      dispatch({
        type: SETTING_FAIL,
      });
    });
};

export const SETTING_LOADING = 'SETTING_LOADING';
export const GET_THEME_VALUE = 'GET_THEME_VALUE';
export const SETTING_FAIL = 'SETTING_FAIL';
export const GET_FEATURE_PRODUCT = 'GET_FEATURE_PRODUCT';
export const RECENT_ADD__PRODUCT = 'RECENT_ADD__PRODUCT';
export const SALE_PRODUCTS = 'SALE_PRODUCTS ';
export const CATEGORY_PRODUCT = 'CATEGORY_PRODUCT ';
