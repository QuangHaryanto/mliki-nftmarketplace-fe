import {api} from './../helper/VVApi';
import axios from "axios";

export const getBannerListAPI = () => {
  return new Promise((resolve, reject) => {
    let header = '';
     header = api.apiHeaderForGuest;
     let token = localStorage.getItem("token")
     delete header["authorization"];
     if(token) {
      header["authorization"] = localStorage.getItem("token");
     }
    var url = api.base + api.banner_list;
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

export const getFaqListAPI = (params) => {
  return new Promise((resolve, reject) => {
    let header = '';
     header = api.apiHeaderForGuest;
     let token = localStorage.getItem("token")
     delete header["authorization"];
     if(token) {
      header["authorization"] = localStorage.getItem("token");
     }
    var url = api.base + api.faq_list;
    if(params.status) {
       url = url + "?status="+ params.status
     }
    axios
       .get(url, params, {
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
 
