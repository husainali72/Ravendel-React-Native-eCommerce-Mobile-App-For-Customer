import {GET_APP_SETTING} from '../../queries/appSetting';
import {query} from '../../utils/service';

export const AppSettingAction = () => dispatch => {
  dispatch({
    type: SETTING_LOADING,
  });
  query(GET_APP_SETTING)
    .then(response => {
      if (response) {
        return dispatch({
          type: GET_THEME_VALUE,
          payload: response.data.getSettings,
        });
      }
    })
    .catch(error => {
      dispatch({
        type: SETTING_FAIL,
      });
    });
};

export const SETTING_LOADING = 'SETTING_LOADING';
export const GET_THEME_VALUE = 'GET_THEME_VALUE';
export const SETTING_FAIL = 'SETTING_FAIL';
