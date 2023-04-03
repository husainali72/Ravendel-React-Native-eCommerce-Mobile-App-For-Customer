export const ALERT_SUCCESS = 'ALERT_SUCCESS';
export const ALERT_ERROR = 'ALERT_ERROR';
export const ALERT_HIDE = 'ALERT_HIDE';
export const NET_ON = 'NET_ON';
export const NET_OFF = 'NET_OFF';

const initialState = {
  success: false,
  message: '',
  error: false,
  netConnection: false
};

export default (state = initialState, action) => {
  switch (action.type) {
    case ALERT_SUCCESS:
      return {
        success: true,
        message: action.payload,
        error: false,
      };

    case ALERT_ERROR:
      return {
        success: false,
        message: action.payload,
        error: true,
      };

    case ALERT_HIDE:
      return {
        message: '',
        error: false,
        success: false,
      };
    case NET_ON:
      return {
        netConnection: false,

      };
    case NET_OFF:
      return {
        netConnection: true,
      };
      case "USER_LOGOUT":
        return (state = initialState);
    default:
      return state;
  }
};
