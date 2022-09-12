import {combineReducers} from 'redux';

import NotifyReducer from './reducer/NotifyReducer';
import NetworkReducer from './reducer/NetworkReducer';

const rootReducer = combineReducers({
  notifier: NotifyReducer,
  paymentnetwork:NetworkReducer
});

export default rootReducer;