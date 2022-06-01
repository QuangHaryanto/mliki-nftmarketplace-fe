import {USERNOTIFYACTION} from './ActionTypes'
export function actionNotifyUser(data) {
    return {
      type: USERNOTIFYACTION,
      payload: data
    };
}