import {combineReducers} from 'redux';

import NotifyReducer from './reducer/NotifyReducer';

const rootReducer = combineReducers({
  notifier: NotifyReducer
});

export default rootReducer;