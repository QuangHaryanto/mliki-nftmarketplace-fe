import {api} from './../helper/VVApi';
import axios from "axios";
import jwt_decode from "jwt-decode";

export const loginAPI = (params) => {
    return new Promise((resolve, reject) => {
        axios
          .post(api.base + api.connect, params, {
            headers:api.apiHeaderForGuest,
          })
          .then((response) => {
            console.warn("login respoonse", response.data);
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

export const getUser = () => {
  let token = localStorage.getItem("token");
  if(token !== null ) {
    return jwt_decode(token);
  } else {
    return null;
  }
}

export const getProfileAPI = (userId,blockChain) => {
  return new Promise((resolve, reject) => {
     let header = '';
     header = api.apiHeaderForGuest;
     let token = localStorage.getItem("token")
     delete header["authorization"];
     if(token) {
      header["authorization"] = localStorage.getItem("token");
     }
     
      axios
        .get(api.base + api.user_profile + '/' + userId + '/'+ blockChain, {
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

export const updateProfileAPI = (userId,params) => {
  return new Promise((resolve, reject) => {
      let header = api.apiHeaderForGuest;
      header["authorization"] = localStorage.getItem("token");
      axios
        .put(api.base + api.user_update + "/" + userId, params, {
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

export const verifyAPI = () => {
  return new Promise((resolve, reject) => {
    let header = api.apiHeaderForGuest;
    header["authorization"] = localStorage.getItem("token");
      axios
        .post(api.base + api.user_verfiy,{}, {
          headers:header,
        })
        .then((response) => {
          console.warn("verify response", response.data);
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

export const confirmAPI = (params) => {
  return new Promise((resolve, reject) => {
    let header = api.apiHeaderForGuest;
     header["authorization"] = localStorage.getItem("token");
      axios
        .post(api.base + api.user_confirm, params, {
          headers:header,
        })
        .then((response) => {
          console.warn("verify response", response.data);
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

export const userViewAPI = (params) => {
  return new Promise((resolve, reject) => {
    let header = api.apiHeaderForGuest;
     header["authorization"] = localStorage.getItem("token");
      axios
        .post(api.base + api.user_views, params, {
          headers:header,
        })
        .then((response) => {
          console.warn("user view response", response.data);
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

export const getUserListAPI = (params, cancelTokenSource) => {
  return new Promise((resolve, reject) => {
    let header = '';
     header = api.apiHeaderForGuest;
     let token = localStorage.getItem("token")
     delete header["authorization"];
     if(token) {
      header["authorization"] = localStorage.getItem("token");
     }
    var url = api.base + api.seller_list;
    if(params.page) {
      url = url + "?page="+ params.page
    }
    if(params.sortby) {
      url = url + "&sortby="+ params.sortby
    }
    if(params.type) {
      url = url + "&type="+ params.type
    }
    if(params.keyword) {
      url = url + "&keyword="+ params.keyword
    }
    if(params.user_id) {
      url = url + "&user_id="+ params.user_id
    }
    axios
       .get(url,{
        cancelToken: cancelTokenSource.token, 
        }, {
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

export const getSearchListAPI = (params, cancelTokenSource) => {
  return new Promise((resolve, reject) => {
    let header = '';
     header = api.apiHeaderForGuest;
     let token = localStorage.getItem("token")
     delete header["authorization"];
     if(token) {
      header["authorization"] = localStorage.getItem("token");
     }
    var url = api.base + api.search_result;
    if(params.keyword) {
      url = url + "?keyword="+ params.keyword
    } else {
      url = url + "?keyword="
    }
    if(params.user_id) {
      url = url + "&user_id="+ params.user_id
    }
    axios
       .get(url,{
        cancelToken: cancelTokenSource.token, 
        }, {
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

export const connectionAPI = (params) => {
  return new Promise((resolve, reject) => {
    let header = api.apiHeaderForGuest;
     header["authorization"] = localStorage.getItem("token");
      axios
        .post(api.base + api.follow_action, params, {
          headers:header,
        })
        .then((response) => {
          console.warn("login respoonse", response.data);
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

export const getOptions = (name) => {
  return new Promise((resolve, reject) => {
     let header = '';
     header = api.apiHeaderForGuest;
     let token = localStorage.getItem("token")
     delete header["authorization"];
     if(token) {
      header["authorization"] = localStorage.getItem("token");
     }
      axios
        .get(api.base + api.option_get + '?name=' + name, {
          headers:header,
        })
        .then((response) => {
          console.log('REsponse',response)
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

export const getNotificationListAPI = (params) => {
  return new Promise((resolve, reject) => {
    let header = '';
     header = api.apiHeaderForGuest;
     let token = localStorage.getItem("token")
     delete header["authorization"];
     if(token) {
      header["authorization"] = localStorage.getItem("token");
     }
    var url = api.base + api.user_notifications;
    if(params.page) {
      url = url + "?page="+ params.page
    } 
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

export const updateNotificationAPI = () => {
  return new Promise((resolve, reject) => {
    let header = '';
     header = api.apiHeaderForGuest;
     let token = localStorage.getItem("token")
     delete header["authorization"];
     if(token) {
      header["authorization"] = localStorage.getItem("token");
     }
      axios
        .post(api.base + api.user_updatenotification, {}, {
          headers:header,
        })
        .then((response) => {
          console.warn("notification respoonse", response.data);
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