import {network} from '../ActionTypes'
export default {
    changeNetwork: data=>({type:network.CHANGE_NETWORK,payload:data})
}