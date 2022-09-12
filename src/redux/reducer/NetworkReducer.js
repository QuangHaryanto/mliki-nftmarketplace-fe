import {network} from '../ActionTypes'

const initialState ={
  networkName:'POLYGON'
}
export default function (state = initialState, action) {
  const {type,payload} = action
  switch (type) {
    case network.CHANGE_NETWORK:
      return {...state,networkName:payload}
    default:
      return state;
  }
}