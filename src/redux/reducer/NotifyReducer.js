import {USERNOTIFYACTION} from './../ActionTypes'

export default function (state = {}, action) {
    switch (action.type) {
      case USERNOTIFYACTION:
        return Object.assign({}, state, action.payload);
      default:
        return state;
    }
}