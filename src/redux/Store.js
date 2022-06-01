import {createStore} from 'redux';

import rootReducer from './rootReducer';

export const Store = createStore(rootReducer);