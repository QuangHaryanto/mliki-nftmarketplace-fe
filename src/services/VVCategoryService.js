import {api} from './../helper/VVApi';
import axios from "axios";

export const listAPI = () => {
    return new Promise((resolve, reject) => {
        let header = api.apiHeaderForGuest;
        var url = api.base + api.category_list;
        axios
           .get(url, {
             headers:header,
           })
           .then((response) => {
              resolve(response.data);
           })
           .catch((error) => {
             resolve({
                 status: false,
                 message: error.message
             });
           });
       });
}



