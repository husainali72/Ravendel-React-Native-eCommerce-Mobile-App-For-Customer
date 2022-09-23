import {
  GET_THEME_VALUE,
  SETTING_LOADING,
  SETTING_FAIL,
} from '../action/settingAction';

const initialState = {
  themeSettings: [],
  loading: false,
  success: false,
};

export default (state = initialState, action) => {
  switch (action.type) {
    case GET_THEME_VALUE:
      return {
        ...state,
        themeSettings: action.payload,
        loading: false,
        success: true,
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
