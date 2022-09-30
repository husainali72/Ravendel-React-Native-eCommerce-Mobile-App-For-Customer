import {
  GET_THEME_VALUE,
  SETTING_LOADING,
  SETTING_FAIL,
  RECENT_ADD__PRODUCT,
  SALE_PRODUCTS,
  CATEGORY_PRODUCT,
  GET_FEATURE_PRODUCT,
} from '../action/settingAction';

const initialState = {
  themeSettings: [],
  loading: false,
  success: false,
  homeData:'',
  featureData:[],
  recentAddedProduct:[],
  saleProduct:[],
  ProductByCategory:[]
};

export default (state = initialState, action) => {
  switch (action.type) {
    case GET_THEME_VALUE:
      return {
        ...state,
        themeSettings: action.payload.themeSettings,
        homeData:action.payload.homeData,
        loading: false,
        success: true,
      };
    case GET_FEATURE_PRODUCT:
      return {
        ...state,
        featureData: action.payload,
        loading: false,
      };
    case RECENT_ADD__PRODUCT:
      return {
        ...state,
        recentAddedProduct:action.payload,
        loading: false,
      };
      case SALE_PRODUCTS:
        return {
          ...state,
          saleProduct:action.payload,
          loading: false,
        };
    case CATEGORY_PRODUCT:
      return {
        ...state,
        ProductByCategory:action.payload,
        loading: false,
      };
    case SETTING_LOADING:
      return {
        ...state,
        loading: true,
        success: false,
      };
    case SETTING_FAIL:
      return {
        ...state,
        loading: false,
        success: false,
      };
    default: {
      return state;
    }
  }
};
