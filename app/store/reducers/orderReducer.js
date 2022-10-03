import { ORDER_LOADING, ORDER_LOAD_STOP, ORDER_SUCCESS } from "../action/cartAction";

const initialState = {
    loading: false,
    orderList: [],
};


export default (state = initialState, action) => {
    switch (action.type) {
        case ORDER_LOADING:
            return {
                ...state,
                loading: true,
            }
        case ORDER_LOAD_STOP:
            return {
                ...state,
                loading: false,
            }
        case ORDER_SUCCESS:
            return {
                ...state,
                loading: false,
                orderList:action.payload
            }



            case "USER_LOGOUT":
                return {...initialState};
        default: {
            return state;
        }
    }
};
