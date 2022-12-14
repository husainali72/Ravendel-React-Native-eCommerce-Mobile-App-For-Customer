import {combineReducers} from 'redux';

import login from './loginReducer';
import settings from './settingReducer';
import cart from './cartReducer';
import products from './productReducers';
import blogs from './blogReducer';
import checkoutDetail from './checkoutReducer';
import customer from './customerReducer';

// Combine Reducers
const MasterReducer = combineReducers({
  login,
  settings,
  cart,
  products,
  blogs,
  checkoutDetail,
  customer,
});

export default MasterReducer;
