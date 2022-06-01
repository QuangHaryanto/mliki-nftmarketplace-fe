import {api} from './../helper/VVApi';
import axios from "axios";

export const addAPI = (params) => {
    return new Promise((resolve, reject) => {
        let header = api.apiHeaderForGuest;
        header["authorization"] = localStorage.getItem("token");
        axios
          .post(api.base + api.collection_add, params, {
            headers:header,
          })
          .then((response) => {
            console.warn("collection add response", response.data);
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

export const updateAPI = (params) => {
    return new Promise((resolve, reject) => {
        let header = api.apiHeaderForGuest;
        header["authorization"] = localStorage.getItem("token");
        axios
          .put(api.base + api.collection_update, params, {
            headers:header,
          })
          .then((response) => {
            console.warn("collection update response", response.data);
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

export const updateCollectionApproval = (params) => {
  return new Promise((resolve, reject) => {
      let header = api.apiHeaderForGuest;
      header["authorization"] = localStorage.getItem("token");
      axios
        .put(api.base + api.collection_update_approval, params, {
          headers:header,
        })
        .then((response) => {
          console.warn("collection update approval response", response.data);
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

export const getApprovalStatus = (collection_id, user_id) => {
  return new Promise((resolve, reject) => {       
      axios
        .get(api.base + api.collection_check_approval + "?collection_id="+ collection_id +"&&user_id="+user_id, {
          headers:api.apiHeaderForGuest,
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

export const generateAbiAPI = (params) => {
    return new Promise((resolve, reject) => {
        let header = api.apiHeaderForGuest;
        header["authorization"] = localStorage.getItem("token");
        axios
          .post(api.base + api.collection_abi, params, {
            headers:header,
          })
          .then((response) => {
            console.warn("collection update response", response.data);
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

export const detailAPI = (collection_id) => {
    return new Promise((resolve, reject) => {       
        axios
          .get(api.base + api.collection_detail + "?collection_id="+ collection_id, {
            headers:api.apiHeaderForGuest,
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

export const allCollectionsAPI = (params) => {
  return new Promise((resolve, reject) => {
    let header = api.apiHeaderForGuest;
    var url = api.base + api.collection_all_list;
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

export const listAPI = (params) => {
  return new Promise((resolve, reject) => {
    let header = '';
     header = api.apiHeaderForGuest;
     let token = localStorage.getItem("token")
     delete header["authorization"];
     if(token) {
      header["authorization"] = localStorage.getItem("token");
     }
    var url = api.base + api.collection_list;
    if(params.page) {
      url = url + "?page="+ params.page
    }
    if(params.type) {
      url = url + "&type="+ params.type
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

export const deleteAPI = (params) => {
  return new Promise((resolve, reject) => {
      let header = api.apiHeaderForGuest;
      header["authorization"] = localStorage.getItem("token");
      axios
        .delete(api.base + api.collection_delete, {
          headers:header,
          data: params
        })
        .then((response) => {
          console.warn("collection delete response", response.data);
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

export const deleteRoyaltyAPI = (params) => {
  return new Promise((resolve, reject) => {
      let header = api.apiHeaderForGuest;
      header["authorization"] = localStorage.getItem("token");
      axios
        .delete(api.base + api.royalty_delete, {
          headers:header,
          data: params
        })
        .then((response) => {
          console.warn("royalty delete response", response.data);
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

export const getRoyaltyStatus = (collection_id) => {
  return new Promise((resolve, reject) => {       
      let header = '';
     header = api.apiHeaderForGuest;
     let token = localStorage.getItem("token")
     delete header["authorization"];
     if(token) {
      header["authorization"] = localStorage.getItem("token");
     }
      axios
        .get(api.base + api.royalty_get + "?collection_id="+ collection_id, {
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

export const addRoyaltyAPI = (params) => {
  return new Promise((resolve, reject) => {
    let header = api.apiHeaderForGuest;
    header["authorization"] = localStorage.getItem("token");
    axios
      .post(api.base + api.royalty_add, params, {
        headers:header,
      })
      .then((response) => {
        console.warn("royalty add response", response.data);
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
