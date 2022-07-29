import {api} from './../helper/VVApi';
import axios from "axios";

export const addAPI = (params) => {
    return new Promise((resolve, reject) => {
        let header = api.apiHeaderForGuest;
        header["authorization"] = localStorage.getItem("token");
        axios
          .post(api.base + api.item_add, params, {
            headers:header,
          })
          .then((response) => {
            console.warn("item add response", response.data);
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

export const sellAPI = (params) => {
  return new Promise((resolve, reject) => {
      let header = api.apiHeaderForGuest;
      header["authorization"] = localStorage.getItem("token");
      axios
        .post(api.base + api.item_sell, params, {
          headers:header,
        })
        .then((response) => {
          console.warn("item sell response", response.data);
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

export const removeAPI = (params) => {
  return new Promise((resolve, reject) => {
      let header = api.apiHeaderForGuest;
      header["authorization"] = localStorage.getItem("token");
      axios
        .post(api.base + api.item_removesale, params, {
          headers:header,
        })
        .then((response) => {
          console.warn("item sell response", response.data);
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

export const updateItemAPI = (params) => {
  return new Promise((resolve, reject) => {
      let header = api.apiHeaderForGuest;
      header["authorization"] = localStorage.getItem("token");
      axios
        .put(api.base + api.item_update, params, {
          headers:header,
        })
        .then((response) => {
          console.warn("item update response", response.data);
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

export const updateOfferItemAPI = (params) => {
  return new Promise((resolve, reject) => {
      let header = api.apiHeaderForGuest;
      header["authorization"] = localStorage.getItem("token");
      axios
        .put(api.base + api.item_update_offer, params, {
          headers:header,
        })
        .then((response) => {
          console.warn("item update offer response", response.data);
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

export const getItemListAPI = (params) => {
  return new Promise((resolve, reject) => {
     let header = '';
     header = api.apiHeaderForGuest;
     let token = localStorage.getItem("token")
     delete header["authorization"];
     if(token) {
      header["authorization"] = localStorage.getItem("token");
     }
     var url = api.base + api.item_list;
     if(params.page) {
       url = url + "?page="+ params.page
     }
     if(params.type) {
       url = url + "&type="+ params.type
     }

     if(params.sortby) {
      url = url + "&sortby="+ params.sortby
     }

     if(params.user_id) {
      url = url + "&user_id="+ params.user_id
     }

     if(params.collection_id) {
      url = url + "&collection_id="+ params.collection_id
     }

     if(params.item_id) {
       url = url + "&item_id="+ params.item_id
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

export const getItemListExplorerAPI = (params,cancelTokenSource) => {
  return new Promise((resolve, reject) => {
     let header = api.apiHeaderForGuest;
     var url = api.base + api.item_list;
     if(params.page) {
       url = url + "?page="+ params.page
     }
     if(params.type) {
       url = url + "&type="+ params.type
     }
     if(params.keyword) {
      url = url + "&keyword="+ params.keyword
     }
     if(params.sortby) {
      url = url + "&sortby="+ params.sortby
     }

     if(params.collection_id) {
      url = url + "&collection_id="+ params.collection_id
     }

     if(params.category_id) {
       url = url + "&category_id="+ params.category_id
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

export const deleteItemAPI = (params) => {
  return new Promise((resolve, reject) => {
      let header = api.apiHeaderForGuest;
      header["authorization"] = localStorage.getItem("token");
      axios
        .delete(api.base + api.item_delete, {
          headers:header,
          data: params
        })
        .then((response) => {
          console.warn("item delete response", response.data);
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


export const addLikes = (params) => {
  return new Promise((resolve, reject) => {
      let header = api.apiHeaderForGuest;
      header["authorization"] = localStorage.getItem("token");
      axios
        .post(api.base + api.item_add_like, params, {
          headers:header,
        })
        .then((response) => {
          console.warn("item like response", response.data);
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

export const addViews = (params) => {
  return new Promise((resolve, reject) => {
      let header = api.apiHeaderForGuest;
      header["authorization"] = localStorage.getItem("token");
      axios
        .post(api.base + api.item_add_view, params, {
          headers:header,
        })
        .then((response) => {
          console.warn("item view response", response.data);
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

export const getMoreCollection = (params) => {
  return new Promise((resolve, reject) => {
     let header = '';
     header = api.apiHeaderForGuest;
     let token = localStorage.getItem("token")
     delete header["authorization"];
     if(token) {
      header["authorization"] = localStorage.getItem("token");
     }
     var url = api.base + api.item_moreFromCollection;
     if(params.collection_id) {
       url = url + "?collection_id="+ params.collection_id
     }
     if(params.item_id) {
       url = url + "&item_id="+ params.item_id
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


export const purchaseNFT = (params) => {
  return new Promise((resolve, reject) => {
      let header = api.apiHeaderForGuest;
      header["authorization"] = localStorage.getItem("token");
      axios
        .post(api.base + api.item_purchase, params, {
          headers:api.apiHeaderForGuest,
        })
        .then((response) => {
          console.warn("item purchased response", response.data);
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

export const getItemHistory = (params) => {
  return new Promise((resolve, reject) => {
     let header = '';
     header = api.apiHeaderForGuest;
     let token = localStorage.getItem("token")
     delete header["authorization"];
     if(token) {
      header["authorization"] = localStorage.getItem("token");
     }
     var url = api.base + api.item_history;
     if(params.page) {
       url = url + "?page="+ params.page
     }
     if(params.filter) {
       url = url + "&filter="+ params.filter
     }

     if(params.type) {
      url = url + "&type="+ params.type
     }

     if(params.user_id) {
      url = url + "&user_id="+ params.user_id
     }

     if(params.collection_id) {
      url = url + "&collection_id="+ params.collection_id
     }

     if(params.item_id) {
       url = url + "&item_id="+ params.item_id
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

export const getTokenInfo = (params) => {
  return new Promise((resolve, reject) => {
     let header = api.apiHeaderForGuest;
     let token = localStorage.getItem("token")
     if(token) {
      header["authorization"] = localStorage.getItem("token");
     }
     var url = api.base + api.token_info+"?item_id="+ params.item_id;
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

export const getItemPrice = (params) => {
  return new Promise((resolve, reject) => {
     let header = '';
     header = api.apiHeaderForGuest;
     let token = localStorage.getItem("token")
     delete header["authorization"];
     if(token) {
      header["authorization"] = localStorage.getItem("token");
     }
     var url = api.base + api.item_prices;
     if(params.page) {
       url = url + "?page="+ params.page
     }

     if(params.item_id) {
       url = url + "&item_id="+ params.item_id
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

export const getItemOffer = (params) => {
  return new Promise((resolve, reject) => {
     let header = '';
     header = api.apiHeaderForGuest;
     let token = localStorage.getItem("token")
     delete header["authorization"];
     if(token) {
      header["authorization"] = localStorage.getItem("token");
     }
     var url = api.base + api.item_offers;
     if(params.page) {
       url = url + "?page="+ params.page
     }
     if(params.type) {
      url = url + "&type="+ params.type
     }
     if(params.item_id) {
       url = url + "&item_id="+ params.item_id
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

export const addOfferAPI = (params) => {
  return new Promise((resolve, reject) => {
      let header = api.apiHeaderForGuest;
      header["authorization"] = localStorage.getItem("token");
      axios
        .post(api.base + api.item_add_offers, params, {
          headers:header,
        })
        .then((response) => {
          console.warn("item add offer response", response.data);
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

export const removeOfferAPI = (params) => {
  return new Promise((resolve, reject) => {
      let header = api.apiHeaderForGuest;
      header["authorization"] = localStorage.getItem("token");
      axios
        .post(api.base + api.item_remove_offers, params, {
          headers:header,
        })
        .then((response) => {
          console.warn("item remove offer response", response.data);
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

export const postOfferAPI = (params) => {
  return new Promise((resolve, reject) => {
      let header = api.apiHeaderForGuest;
      header["authorization"] = localStorage.getItem("token");
      axios
        .post(api.base + api.item_already_bid, params, {
          headers:header,
        })
        .then((response) => {
          console.warn("item remove offer response", response.data);
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

export const actionOfferAPI = (params) => {
  return new Promise((resolve, reject) => {
      let header = api.apiHeaderForGuest;
      header["authorization"] = localStorage.getItem("token");
      axios
        .post(api.base + api.item_action_offers, params, {
          headers:header,
        })
        .then((response) => {
          console.warn("item action offer response", response.data);
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

export const saveCsvAPI = (params) => {
  return new Promise((resolve, reject) => {
      let header = api.apiHeaderForGuest;
      header["authorization"] = localStorage.getItem("token");
      axios
        .post(api.base + api.item_csv, params, {
          headers:header,
        })
        .then((response) => {
          console.warn("csv response", response.data);
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

export const depositAPI = (params) => {
  return new Promise((resolve, reject) => {
      let header = api.apiHeaderForGuest;
      header["authorization"] = localStorage.getItem("token");
      axios
        .post(api.base + api.deposits, params, {
          headers:header,
        })
        .then((response) => {
          console.warn("deposits response", response.data);
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

export const withdrawAPI = (params) => {
  return new Promise((resolve, reject) => {
      let header = api.apiHeaderForGuest;
      header["authorization"] = localStorage.getItem("token");
      axios
        .post(api.base + api.withdraw, params, {
          headers:header,
        })
        .then((response) => {
          console.warn("withdraw response", response.data);
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

