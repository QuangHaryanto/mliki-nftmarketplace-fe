
import React from 'react';
import {
  Link,
  withRouter,
  } from "react-router-dom";
import {connect} from 'react-redux';
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton'
import VVAssetVW from '../../../UI/asset/VVAssetVW';
import { addLikes, addViews, getItemHistory, getItemListAPI, getMoreCollection, purchaseNFT, getItemOffer, getItemPrice, addOfferAPI, removeOfferAPI, actionOfferAPI, updateOfferItemAPI, sellAPI, removeAPI, postOfferAPI, getTokenInfo } from '../../../services/VVItemService';
import { getApprovalStatus } from '../../../services/VVCollectionService';
import { api } from '../../../helper/VVApi';
import { BsFillHeartFill, BsHeart, BsFillEyeFill, BsArrowUpRightSquare, BsPencilSquare, BsX, BsCheck } from "react-icons/bs";
import { getUser, getProfileAPI } from '../../../services/VVUserService';
import VVItemModal from '../../../models/VVItemModal';
import { toast } from 'react-toastify';
import { config } from '../../../helper/VVConfig';
import {actionNotifyUser} from './../../../redux/NotifyAction'
import VVnodataVW from '../../../UI/nodata/VVnodataVW'
import { ProgressBar }  from 'react-bootstrap';
import VVHistoryModal from '../../../models/VVHistoryModal';
import { Button, Modal }  from 'react-bootstrap';
import Countdown from 'react-countdown';
import Switch from "react-switch";
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs'
import Popup from 'reactjs-popup'
import 'reactjs-popup/dist/index.css';
import * as moment from 'moment';
import DateRangePicker from 'react-bootstrap-daterangepicker';
import 'bootstrap-daterangepicker/daterangepicker.css'; 

class VVItemDetailVC extends React.Component {
  constructor() {
    super()
    this.item_id = null
    this.itemDetails = null;
    this.ispending = false;
    this.isAcceptOffer = false;
    this.offerPrice = 0;
    this.toastObj = null;
    this.waiting = false
    this.page = 1;
    this.historypage = 1;
    this.system_token_id = 0;
    this.state = {
      loading: true,
      user_id:'',
      walletAmount:'',
      walletAddress:'',
      moreitem_skeleton: [1,2,3,4],
      moreitem: [],
      moreitemloading: true,
      hasmoreitem: false,
      page_title:'',
      thumb:'',
      like_count:0,
      like_count_str: '0',
      is_liked: false,
      view_count:0,
      view_count_str: '0',
      external_link: '',
      is_owner: false,
      itemInfo: null,
      profile_image:'/images/avatars/avatar5.jpg',
      fullname: "",
      collection_image:'/images/bg/bg.png',
      attributes:[],
      levels: [],
      stats: [],
      assetMenu: 'properties',
      itemMenu: 'history',
      histories: [],
      historyPrev:false,
      historyNext:false,
      offers: [],
      offerPrev:false,
      offerNext:false,
      prices: [],
      paging: false,
      assetloading: false,
      is_ready: true,
      showAddOffer: false,
      bidPrice: "",
      currentUser: null,
      is_expire: false,
      offer_time: 0,
      showOffer: false, 
      selectedOffer: null,
      isOffer: false,
      saddClass: false,
      raddClass: false,
      buttonTxt: 'Sell',
      iconname:"",
      offerCountTime:0,
      hide_offer: true, 
      offerFields: {
        price: "",
        has_offer: false,
        offer_price: "",
        offer_duration: "",
        offer_days: "",
        startDate: moment().fromNow(),
        endDate: moment().fromNow()
      }
    }
  }

  componentDidMount() {
    this.initFields();
  }

  toggle(classname) {
    this.iconname = classname;
    if(this.iconname == "share"){
      this.setState({saddClass: !this.state.saddClass});
    }else{
      this.setState({raddClass: !this.state.raddClass});
    }    
  }

  componentDidUpdate(prevProps) {
    if(this.props.notifier !==prevProps.notifier) {
        let notifier = this.props.notifier;
        if(notifier) {
          if(notifier.type === 'mintfailed' && this.waiting === true) {
            this.waiting = false;
            toast.dismiss(this.toastObj);
            this.setState({
                isSubmit: false
             })
            toast("mint failed",{
                type: "error"
            });
          } else if(notifier.type === 'mintsuccess' && this.waiting === true) {
            this.waiting = false;
            toast.dismiss(this.toastObj);
            console.log(notifier);
            let params = {
              token_id:notifier.payload.token,
              transaction_hash: notifier.payload.hash,
              item_id: this.item_id,
              system_token_id:this.system_token_id
            };
            sellAPI(params).then(result=>{
                toast.dismiss(this.toastObj);
                if(result.status === true) {
                   this.itemDetail();
                   this.updateSaleConfirmation();
                } else {
                  toast("mint failed",{
                    type: "error"
                  });
                }

            })
        } else if(notifier.type === 'buyfail' && this.ispending) {
            this.ispending = false
            this.isAcceptOffer = false;
            this.offerPrice = 0;
            toast.dismiss(this.toastObj);
            toast("Purchase failed",{
              type: "error"
            });
            this.ispending = false
          } else if(notifier.type === 'buysuccess' && this.ispending) {
            this.ispending = false
            this.buyNFT();
          } else if(notifier.type === 'login'){
            this.initFields();
          } else if(notifier.type === 'approvesuccess' && this.ispending) {
            this.ispending = false
            this.initFields();
          } else if(notifier.type === 'approvefail' && this.ispending) {
            this.ispending = false
          } else if(notifier.type === 'sendoffersuccess' && this.ispending) {
            this.ispending = false
            this.addOfferAction();
          } else if(notifier.type === 'sendofferfail' && this.ispending) {
            toast.dismiss(this.toastObj)
            this.setState({
              showAddOffer: false,
              bidPrice: ""
            })
            this.ispending = false
          } else if(notifier.type == 'create_auction_success') {
            toast.dismiss(this.toastObj);
            toast("Auction created successfully",{
              type: "success"
            });
            this.initFields()
          } else if(notifier.type == 'create_auction_fail' || notifier.type == 'delete_auction_success') {
            let params = {
              item_id: this.item_id,
            };
            removeAPI(params).then(result=>{
                toast.dismiss(this.toastObj);
                if(result.status === true) {
                   this.itemDetail();
                } else {
                  toast("remove from sale is failed failed",{
                    type: "error"
                  });
                }
            })
          } else if(notifier.type == 'delete_auction_fail') {
              toast.dismiss(this.toastObj);
              toast("item remove from sale is failed",{
                type: "error"
              });
          } else if(notifier.type === 'offersuccess' && this.ispending) {
            this.ispending = false
            this.addOfferAction();
          }else if(notifier.type === 'removeoffersuccess' && this.ispending) {
            this.ispending = false
            this.removeOfferAction(notifier.payload.item);
          }else if(notifier.type === 'offerfail' && this.ispending) {
            this.ispending = false
            toast.dismiss(this.toastObj);
          }
        }
      } else {
        
      }
       
    if (
      this.props.location.pathname !== prevProps.location.pathname
    ) {
      this.initFields();
    }
  }

  initFields = () => {
    var pathArray = this.props.location.pathname.split("/")
    this.item_id = pathArray[pathArray.length-1]
    let user = getUser();
    if (user === null) {
      this.itemDetail()
    } else {
      this.setState({
        currentUser: user,
        walletAddress: user.public_key,
        user_id: user.user_id,
        walletAmount: user.wallet_amount
      })
      this.addViewsAction()
    }
  }

  itemDetail = () => {
    getItemListAPI({
      page: 1,
      item_id: this.item_id,
      type: "view"
    }).then(result=>{
      if(result.data.docs.length>0) {
        this.itemDetails = result.data.docs[0];
        this.setState({
          is_liked: result.return_id === 0 ? false : true,
          selectedOffer: result.offer,
          isOffer: result.has_offer
        })
        this.fillFields()
        this.getOffers(this.page)
        this.getPrices(this.page)
        this.OfferBidAction();
        this.getTradeHistory(this.page)
      }
    })
  }

  fillFields = () => {
    let user = getUser();
    var thumb;
    if(this.itemDetails.thumb) {
        if(this.itemDetails.thumb.length>0) {
            let thumbArray = this.itemDetails.thumb
            thumb = thumbArray
        } else {
            thumb = "/images/cover/cover-big.jpg"
        }
    } else {
        thumb = "/images/cover/cover-big.jpg"
    }
    var is_owner;
    var defaultText = 'Sell';
    if(user !== null) {
       if(user.user_id === this.itemDetails.current_owner._id) {
         is_owner = true;
       }

       if(this.itemDetails.current_owner._id!=this.itemDetails.author_id){
          defaultText = 'Resell';
       }
    }
    var profile_image;
    if(this.itemDetails.current_owner.profile_image) {
        if(this.itemDetails.current_owner.profile_image.length>0) {
            let thumbArray = this.itemDetails.current_owner.profile_image
            profile_image = thumbArray
        } else {
            profile_image = "/images/avatars/avatar5.jpg"
        }
    } else {
        profile_image = "/images/avatars/avatar5.jpg"
    }
    var collection_image;
    if(this.itemDetails.collection_id.banner) {
        if(this.itemDetails.collection_id.banner.length>0) {
            let thumbArray = this.itemDetails.collection_id.banner
            collection_image =  thumbArray
        } else {
            collection_image = "/images/bg/bg.png"
        }
    } else {
      collection_image = "/images/bg/bg.png"
    }

    let attributes = [];
    for (let index = 0; index < this.itemDetails.attributes.length; index++) {
      const element = this.itemDetails.attributes[index];
      if(element.name.trim().length>0 && element.type.trim().length>0) {
        attributes.push({
          name: element.name,
          type: element.type
        })
      }
    }

    let levels = [];
    for (let index = 0; index < this.itemDetails.levels.length; index++) {
      const element = this.itemDetails.levels[index];
      if(element.name.trim().length>0 && element.value > 0 && element.valueof > 0) {
        levels.push({
          name: element.name,
          value: element.value.toString(),
          valueof: element.valueof.toString()
        })
      }
    }

    let stats = [];
    for (let index = 0; index < this.itemDetails.stats.length; index++) {
      const element = this.itemDetails.stats[index];
      if(element.name.trim().length>0 && element.value > 0 && element.valueof > 0) {
        stats.push({
          name: element.name,
          value: element.value.toString(),
          valueof: element.valueof.toString()
        })
      }
    }
    let is_expire = false
    var offer_time = 0;
    let offerObj;
    if(this.itemDetails.has_offer === true) {
      offer_time = Date.parse(this.itemDetails.offer_end_date);
      //  + (parseInt(this.itemDetails.offer_days) * 24 * 60 * 60 * 1000)
      let currentTime = Date.now()
      console.log(offer_time);
      console.log(currentTime);
      console.log(this.itemDetails);

      this.setState({
        offerCountTime: offer_time
      })

      if (offer_time < currentTime) {
        is_expire = true
        this.setState({
          offerCountTime: 0
        })
      }

      offerObj = {
        price: this.itemDetails.price.toString(),
        has_offer: true,
        offer_price: this.itemDetails.offer_price.toString(),
        offer_duration: '',
      }
    } else {
      offerObj = {
        price: this.itemDetails.price.toString(),
        has_offer: false,
        offer_price: "",
        offer_duration: "",
      }
    }

    

    this.setState({
      itemInfo: this.itemDetails,
      page_title: this.itemDetails.name,
      thumb: this.itemDetails.thumb,
      loading: false,
      like_count: this.itemDetails.like_count,
      like_count_str: VVItemModal.getShortenNum(this.itemDetails.like_count),
      view_count: this.itemDetails.view_count,
      view_count_str: VVItemModal.getShortenNum(this.itemDetails.view_count),
      external_link:  this.itemDetails.external_link,
      is_owner: is_owner,
      profile_image: profile_image,
      collection_image: this.itemDetails.collection_id.banner,
      fullname: this.itemDetails.current_owner.first_name.length>0 ? this.itemDetails.current_owner.first_name + " " + this.itemDetails.current_owner.last_name : this.itemDetails.current_owner.username,
      attributes: attributes,
      levels: levels,
      stats: stats,
      offer_time: offer_time,
      is_expire: is_expire,
      offerFields: offerObj,
      buttonTxt: defaultText
    })
    

    this.getMoreCollection();
    this.page = 1;
    this.setState({
      histories: [],
      offers: [],
      prices: [],
      paging: false,
      assetloading: true,
      itemMenu: "history"
    })
    this.getTradeHistory(this.page);
    if(user !== null) {
      this.getApprovalForCollection()
    }
  }

  getApprovalForCollection = () => {
     getApprovalStatus(this.itemDetails.collection_id._id, this.itemDetails.current_owner._id).then(result=>{
       this.setState({
         is_ready: result.status
       })
     })
  }

  getMoreCollection = () => {
    getMoreCollection({
      collection_id: this.itemDetails.collection_id._id,
      item_id: this.itemDetails._id
    }).then(result=>{
      var tempArray = VVItemModal.parseItemList(result.data);
      var moreitems = [];
      for (let index = 0; index < tempArray.length; index++) {
        moreitems.push(tempArray[index]);
        if(index==3) {
          break;
        }
      }
      this.setState({
        moreitemloading: false,
        moreitem: moreitems,
        hasmoreitem: tempArray.length>4 ? true : false
      })
    })
  }

  getTradeHistory = (page) => {
    var params = {
      page:page,
      item_id: this.item_id,
      type: "item"
    };
    getItemHistory(params).then(result=>{
      if(result.status === true) {
        var tempArray = VVHistoryModal.parseTradeHistoryList(result.data.docs);
        var histories = this.state.histories
        if(page !== 1) {
           for (let index = 0; index < tempArray.length; index++) {
            histories.push(tempArray[index])
           }
        } else {
          histories = tempArray 
        }

        this.setState({
          assetloading: false,
          paging: (histories.length < result.data.totalDocs) ? true : false,
          histories: histories,
          historyPrev: result.data.hasPrevPage,
          historyNext: result.data.hasNextPage
        })
      }
    })
  }

  likeAction = () => {
    let user = getUser()
    if(user === null) {
      toast("Please login to continue",{
        type: "error"
      });
      return false
    }
    var like_status = 0
    if(this.state.is_liked) {
      like_status = 1
    }
    var like_count = like_status === 1 ? (this.state.like_count-1) : (this.state.like_count+1) 
    this.setState({
      like_count: like_count,
      like_count_str: VVItemModal.getShortenNum(like_count),
      is_liked:  like_status === 1 ?  false : true 
    })
    addLikes({
      item_id: this.itemDetails._id,
      type: like_status === 1 ? 'decrease':'increase'
    }).then(result=>{
    })
  }

  addViewsAction = () => {
    addViews({
      item_id: this.item_id
    }).then(result=>{
      this.itemDetail();
    })
  }

  purchaseNFT = () => {
    if(this.ispending) {
      return;
    }
    let user = getUser()
    if(user === null) {
      toast("Please login to continue",{
        type: "error"
      });
      return false
    }
    this.ispending = true;
    this.toastObj =  toast("Purchasing item...",{
      closeButton: false,
      autoClose: false,
      isLoading: true
    })
    this.props.actionNotifyUser({
      type:"buynft",
      payload: this.state.itemInfo
    })
    
  }

  buyNFT = () => {
    var params = {
      item_id: this.item_id
    }
    if(this.isAcceptOffer) {
      this.isAcceptOffer = false;
      params["price"] = this.offerPrice
    }
    purchaseNFT(params).then(result=>{
      toast.dismiss(this.toastObj);
      console.log("item publish result ->",result)
      if(result.status === true) {
        toast(result.message,{
          type: "success"
        });
        if(result.itemredirect === true){
          setTimeout(() => {
            this.props.history.push("/item/"+ result.result._id);
          }, 3000);
        }else{
          this.initFields();
        }
      } else {
        toast(result.message,{
          type: "error"
        });
      }
    })
  }

  assetMenuClick = (menu) => {
     this.setState({
       assetMenu: menu
     });
  }

  itemMenuClick = (menu) => {
    this.page = 1;
    this.setState({
      histories: [],
      offers: [],
      prices: [],
      paging: false,
      assetloading: true,
      itemMenu: menu
    })
    if(menu === "history") {
      this.getTradeHistory(this.page);
    } else if(menu === "prices") { 
       this.getPrices(this.page)
    } else if(menu === "offers") { 
      this.getOffers(this.page)
    }
 }

 /**
 * This is the function which used to retreive price list by item through api on next page click
 */
nextPricePage = () => {
  console.log('pagex',this.page);
  this.page = this.page + 1;
  this.getOffers(this.page);
}

/**
 * This is the function which used to retreive price list by item through api on previous page click
 */
prevPricePage = () => {
  this.page = this.page - 1;
  this.getOffers(this.page);
}

  /**
  * This is the function which used to retreive price list by item through api on next page click
  */
   nextHistoryPage = () => {
    this.historypage = this.historypage + 1;
    this.getTradeHistory(this.historypage);
  }

  /**
   * This is the function which used to retreive price list by item through api on previous page click
   */
   prevHistoryPage = () => {
    this.historypage = this.historypage - 1;
    this.getTradeHistory(this.historypage);
  }

  fetchMoreData = () => {
    this.page = this.page + 1;
    if (this.state.itemMenu === "history") {
      this.getTradeHistory(this.page);
    } else if (this.state.itemMenu === "prices") {
      this.getPrices(this.page)
    } else if (this.state.itemMenu === "offers") {
      this.getOffers(this.page)
    }
  }

getOffers = (page) =>{
  var params = {
    page:page,
    item_id: this.item_id,
    type: "item"
  };
  getItemOffer(params).then(result=>{
    if(result.status === true) {
      var tempArray = VVHistoryModal.parseOfferList(result.data.docs);
      var offers = this.state.offers
      if(page !== 1) {
         for (let index = 0; index < tempArray.length; index++) {
          offers.push(tempArray[index])
         }
      } else {
        offers = tempArray 
      }
      this.setState({
        assetloading: false,
        paging: (offers.length<result.data.totalDocs) ? true : false,
        offers: offers,
        offerPrev: result.data.hasPrevPage,
        offerNext: result.data.hasNextPage
      })
    }
  })
}

getPrices = (page) =>{
  var params = {
    page:page,
    item_id: this.item_id,
  };
  getItemPrice(params).then(result=>{
    if(result.status === true) {
      var tempArray = VVHistoryModal.parsePriceList(result.data.docs);
      var prices = this.state.prices
      if(page !== 1) {
         for (let index = 0; index < tempArray.length; index++) {
          prices.push(tempArray[index])
         }
      } else {
        prices = tempArray 
      }
      
      this.setState({
        assetloading: false,
        paging: (prices.length<result.data.totalDocs) ? true : false,
        prices: prices
      })
    }
  })
}

addOffer = () => {
  this.state.loading = true;
  if(this.state.is_expire) {
    toast("Auction time ended",{
      type: "error"
    });
    this.state.loading = false;
    return
  }
   this.setState({
     showAddOffer: true,
     loading:false
   })   
}

closeOfferModal = () => {
  this.setState({
    showAddOffer: false,
    bidPrice: ""
  })
}

confirmOfferModal = () => {

  let user = getUser()
  if(user === null) {
    toast("Please login to continue",{
      type: "error"
    });
    return false
  }

  if(this.ispending) {
    return;
  }
  this.ispending = true;

  if (!this.state.bidPrice.match(/^\d+(\.\d{1,6})?$/)) {
    toast("Bid price should be numbers",{
       type: "error"
     });
     return false
  }

  toast.dismiss(this.toastbidObj);
  toast.dismiss(this.toastsuffObj);
  this.toastObj = toast("Adding offer...",{
    closeButton: false,
    autoClose: true,
    isLoading: true
  })

  let price = parseFloat(this.state.bidPrice)
  let min_bid = parseFloat(this.state.itemInfo.offer_price)
  if (price < min_bid) {
    toast.dismiss(this.toastObj);
    this.ispending = false;
    this.toastbidObj = toast("Bid price should be more than or equal to " + this.state.itemInfo.offer_price + " " + config.currency,{
      type: "error"
    });
    return false
  } 
  console.log(this.state.walletAmount);
  console.log(price);
  console.log(user);
  // if(user.wallet_amount>=price){
    this.props.actionNotifyUser({
      type:"addoffer",
      payload: {
        wallet: user.public_key, 
        amount: price, 
        user_id: user.user_id,
        item: this.itemDetails
      }
    })
  // }else{
  //   toast.dismiss(this.toastObj);
  //   this.ispending = false;
  //   this.toastsuffObj = toast("Insufficient balance in your wallet",{
  //     type: "error"
  //   });
  //   return false
     
  // } 
}

addOfferAction = () => {
  let price = parseFloat(this.state.bidPrice)
  addOfferAPI({
    item_id: this.item_id,
    price: price
  }).then(result=>{
    toast.dismiss(this.toastObj)
    if(result.status === false) {
       toast(result.message,{
         type: "error"
       });
     return
    }
    this.setState({
      showAddOffer: false,
      bidPrice: ""
    })
    this.initFields()
  });
}

handlePriceChange = (e) => {
  this.setState({ 
    bidPrice: e.target.value
  });
}

removeOffer = (itemInfo) => {
  console.log(itemInfo);
  this.toastObj =  toast("Removing offer...",{
    closeButton: false,
    autoClose: false,
    isLoading: true
  })
  this.ispending = true;
  getProfileAPI(itemInfo.user_id).then(artistInfo=>{
    console.log(artistInfo);
    this.props.actionNotifyUser({
      type:"removeoffer",
      payload: {
        wallet: artistInfo.result.public_key, 
        user_id: artistInfo.result._id,
        amount: itemInfo.price,
        item: itemInfo
      }
    })
  }); 
}

  removeOfferAction = (item) => {
    console.log(item);
    removeOfferAPI({
      item_id: this.item_id,
      offer_id: item.offer_id
    }).then(result => {
      this.ispending = false;
      toast.dismiss(this.toastObj)
      if (result.status === false) {
        toast(result.message, {
          type: "error"
        });
        return
      }
      this.initFields();
      this.OfferBidAction();
    });
  }

  OfferBidAction = () => {
    postOfferAPI({
      item_id: this.item_id 
    }).then(result => {
       if(result.bids>0){
        this.setState({
          hide_offer: false 
        })
       }else{
        this.setState({
          hide_offer: true
        })
       }
    });
  }

actionOffer = (item, type) => {
  this.toastObj =  toast(type === "cancel" ? "Cancelling offer..." : "Accepting offer...",{
    closeButton: false,
    autoClose: false,
    isLoading: true
  })
  actionOfferAPI({
    item_id: this.item_id,
    type: type,
    offer_id: item.offer_id
  }).then(result=>{
    toast.dismiss(this.toastObj)
    if(result.status === false) {
       toast(result.message,{
         type: "error"
       });
     return
    }
    var offers = [];
    if(type === "cancel") {
      for (let index = 0; index < this.state.offers.length; index++) {
        const element = this.state.offers[index];
        if(element.offer_id !== item.offer_id) {
          offers.push(element)
        }
      }
    } else {
      for (let index = 0; index < this.state.offers.length; index++) {
        const element = this.state.offers[index];
        if(element.offer_id === item.offer_id) {
          element.status = "accepted"
          offers.push(element)
        }
      }
    }
    this.OfferBidAction();
    this.setState({
      offers: offers
    })
  });
}

buyOffer = (item) => {
  if(this.ispending) {
    return;
  }
  this.isAcceptOffer = true
  this.ispending = true;
  this.toastObj =  toast("Purchasing item...",{
    closeButton: false,
    autoClose: false,
    isLoading: true
  })
  var itemInfo = this.state.itemInfo
  itemInfo["price"] = item.price
  this.offerPrice = item.price
  this.props.actionNotifyUser({
    type:"buynft",
    payload: itemInfo
  })
}

approveCollection = () => {
  if(this.ispending) {
    return;
  }
  this.ispending = true;
  var itemInfo = this.state.itemInfo
  this.props.actionNotifyUser({
    type:"approvenft",
    payload: itemInfo
  })
}

offerComplete = () => {
  this.setState({
      is_expire : true
  })
}

  showUpdateOffer = () => {
    if (this.state.itemInfo.status == "inactive") {
      if (this.waiting == false) {
        this.waiting = true;
        this.toastObj = toast("Miniting new item", {
          closeButton: false,
          autoClose: false,
          isLoading: true
        })
        let params = {
          item_id: this.state.itemInfo._id
        }
        getTokenInfo(params).then(result => {
          if (result.status === true) {
            console.log(result.token);
            console.log(this.state.itemInfo.copies);
            var isTypebulk = false;
            if (this.state.itemInfo.copies > 1) {
              isTypebulk = true;
            }
            var tokenNumber = result.token;
            this.system_token_id = tokenNumber;
            this.props.actionNotifyUser({
              type: 'mint_contract',
              // payload: this.state.itemInfo.collection_id.contract_address
              payload: {
                no_of_copies: this.state.itemInfo.copies,
                is_type: isTypebulk,
                token_id: tokenNumber,
                ipfs_cid: this.state.itemInfo.ipfs_cid
              }
            });
          }
        }); 
      }
    } else {
      this.setState({
        showOffer: true
      })
    }
  }

updateSaleConfirmation = () => {
  console.log(this.state.itemInfo);
  let fields = this.state.offerFields;
  fields['price'] = this.state.itemInfo.price;
  fields['offer_price'] = this.state.itemInfo.offer_price;
  if(this.state.itemInfo.has_offer){
    var startDate = moment(this.state.itemInfo.offer_date).format("MM/DD/YYYY");
    var endDate = moment(startDate, "MM/DD/YYYY").add((this.state.itemInfo.offer_days-1),'days').format("MM/DD/YYYY");
    fields['startDate'] = startDate;
    fields['endDate'] = endDate;
  }
  // fields['offer_date'] = picker.startDate;
  this.setState({
    showOffer: true,
    fields
  })
}

removeFromSaleConfirmation = () => {
   this.setState({
     showConfirmation: true
   })
}

closeConfirmationModal = () => {
  this.setState({
    showConfirmation: false
  })
}

removeFromSale = () => {
  this.closeConfirmationModal();
  let params = {
    item_id: this.item_id,
  };
  removeAPI(params).then(result=>{
      toast.dismiss(this.toastObj);
      if(result.status === true) {
         this.itemDetail();
      } else {
        toast("remove from sale is failed failed",{
          type: "error"
        });
      }
  })
}

handleApply = (event, picker) => {
  const date1 = new Date(picker.startDate);
  const date2 = new Date(picker.endDate);
  let fields = this.state.offerFields;
  fields['offer_days'] = this.getDifferenceInDays(date1,date2);
  fields['offer_date'] = picker.startDate;
  fields['offer_end_date'] = picker.endDate;
  this.setState({ fields });  
}

getDifferenceInDays(date1, date2) {
  const diffInMs = Math.abs(date2 - date1);
  return Math.round(diffInMs / (1000 * 60 * 60 * 24));
}

closeUpdateOfferModal = () => {
  let offerObj;
  if(this.itemDetails.has_offer === true) {
    offerObj = {
      price: this.itemDetails.price.toString(),
      has_offer: true,
      offer_price: this.itemDetails.offer_price.toString()
    }
  } else {
    offerObj = {
      price: this.itemDetails.price.toString(),
      has_offer: false,
      offer_price: ''
    }
  }
  this.setState({
    showOffer: false,
    offerFields: offerObj
  })
}

submitUpdateOffer = () => {

  if(this.state.offerFields["has_offer"] === true) {
    if(this.state.offerFields["offer_price"]=='') {
      toast("Minimum bid amount is required",{
        type: "error"
      });
      return false
    }

    if (!this.state.offerFields["offer_price"]!='') {
      var regexp = /^\d+(\.\d{1,6})?$/;
      if(!regexp.test(this.state.offerFields["offer_price"])){
        toast("Minimum bid amount should be numbers", {
          type: "error"
        });
        return false
      } 
    }

    let offer_price = parseFloat(this.state.offerFields["offer_price"]);
    if (offer_price<0) {
      toast("Minimum bid amount should be greater than zero",{
         type: "error"
       });
       return false
    }
 
    if(this.state.offerFields['offer_date']==''){
      var d = new Date();
      d.setHours(0,0,0,0); 
      let fields = this.state.offerFields;
      fields['offer_days'] = 1;
      fields['offer_date'] = d;  
    }

  } else {
    if(this.state.offerFields["price"]=='') {
      toast("Item price is required",{
        type: "error"
      });
      return false
    }

    if (!this.state.offerFields["price"]!='') {
      var regexp = /^\d+(\.\d{1,6})?$/;
      if(!regexp.test(this.state.offerFields["price"])){
        toast("Price should be numbers", {
          type: "error"
        });
        return false
      } 
    } 
  
    let price = parseFloat(this.state.offerFields["price"]);
    if (price<=0) {
      toast("Price should be greater than zero",{
         type: "error"
       });
       return false
    }  
  }
  this.setState({
    showOffer: false,
  })
  this.toastObj =  toast("updating offer",{
    closeButton: false,
    autoClose: false,
    isLoading: true
  })
  let params = this.state.offerFields;
  params["item_id"] = this.item_id
  updateOfferItemAPI(params).then(result=>{
    if(result.status === true) {
      toast.dismiss(this.toastObj);
      toast(result.message,{
        type: "success"
      });
      this.initFields()
    } else {
      toast.dismiss(this.toastObj);
      toast(result.message,{
        type: "error"
      });
      let offerObj;
      if(this.itemDetails.has_offer === true) {
        offerObj = {
          price: 0,
          has_offer: true,
          offer_price: this.itemDetails.offer_price.toString()
        }
      } else {
        offerObj = {
          price: this.itemDetails.price.toString(),
          has_offer: false,
          offer_price: 0
        }
      }
      this.setState({
        offerFields:offerObj
      })
    }
  })
}

handleChange = (field, e) => {
  let offerFields = this.state.offerFields;
  offerFields[field] = e.target.value;
  this.setState({ offerFields });
}

handleOfferChange = (checked) => {
  let offerFields = this.state.offerFields;
  offerFields["has_offer"] = checked;
  this.setState({ offerFields });
}


  render() {
    let siconClass = [];
    let riconClass = [];
    if(this.state.saddClass) {      
      siconClass.push('active');            
    }
    if(this.state.raddClass) {
      riconClass.push('active');
    }
    return (
      <>
      {(!this.state.loading && !this.state.is_ready && this.state.is_owner) &&
        <div class="row">
          <div class="col-12">
            <div class="approval_warning">
              You haven't give permission to admin for this collection. <a href="javascript:void(0)" onClick={this.approveCollection}>Click Here</a>
            </div>
          </div>
        </div>
      }
 {!this.state.loading &&
    <div className='container'>
        <Link to='/' className='btn btn-white btn-sm my-40'>
          Back to home
        </Link>
        <div className='item_details'>
          <div className='row sm:space-y-20'>
            <div className='col-lg-6'>
            <div class="timerdetail">
              <img
                className='item_img itemdetailimg'
                src={this.state.thumb}
                alt='ImgPreview'
              />
		{(this.state.itemInfo.has_offer && this.state.itemInfo.status=='active' ) &&
                        <span class="countdown"><Countdown date={this.state.offerCountTime} onComplete={()=>{
                            this.offerComplete()
                        }}/></span>
                    }
              </div>
              <div class="row">
          <div class="authencity-row">
                <h4 class="color_white authencity-header">Proof of Authenticity</h4>
                  <div class="authencity-box">
                    <div class="authencity-subbox">
                        <p class="title-text color_white">Contract Address</p>
                        <p class="contact-text">
                            <a target="_blank" class="copy-link primary-link" href={config.explorer + "address/" +config.contract_address}> {config.contract_address} </a>
                        </p>
                    </div>
                    <div class="authencity-subbox">
                        <p class="title-text color_white">Blockchain</p>
                        <p class="blockchain-text color_white">{config.block_chain}</p>
                    </div>
                    {(this.state.itemInfo.token_id && this.state.itemInfo.token_id > 0) &&
                    <div class="authencity-subbox copybox">
                        <p class="title-text color_white">Token ID</p>
                        <p class="token-text color_white">{this.state.itemInfo.token_id}</p>
                       {/* <span class="copy-icon"><i class="ri-file-copy-fill color_white"></i></span>*/}
                    </div>
                    }
                    { ((!this.state.itemInfo.unlock_content_url) || (this.state.currentUser!=null && this.state.itemInfo.current_owner._id == this.state.currentUser.user_id)) &&
                    <div class="authencity-subbox">
                        <p class="title-text color_white">Media</p>
                        <p class="contact-text">
                            <a target="_blank" class="contact-link primary-link" href={this.state.itemInfo.media}>Click to View</a>
                        </p>
                    </div>
                  }
                </div>
              </div>
          </div>
            </div>
            <div className='col-lg-6'>
              <div className='space-y-20'>
                <h2 className='color_white mt-res'>{this.state.itemInfo.name}</h2>
                <div className='d-flex justify-content-between'>
                  <div className='space-x-10 d-flex align-items-center'>
                    <a href="javascript:void(0)" onClick={this.likeAction} className='likes space-x-3'>
                      <i className='ri-heart-3-fill' />
                      <span className='txt_sm'>{this.state.like_count_str}</span>
                    </a>
                  </div>
                  <div className='space-x-10 d-flex align-items-center'>
                    <div>
                      <div className={`hide share `+siconClass} onClick={this.toggle.bind(this,"share")}>
                        <div className='icon'>
                          <i className='ri-share-line' />
                        </div>
                        <div
                          className={`dropdown__popup`}>
                          <ul className='space-y-10' onClick={this.toggle.bind(this,"share")}>
                            <li>
                              <a href='https://www.facebook.com/' rel='noreferrer' target='_blank'>
                                <i className='ri-facebook-line' />
                              </a>
                            </li>
                            <li>
                              <a href='https://www.messenger.com/' rel='noreferrer' target='_blank'>
                                <i className='ri-messenger-line' />
                              </a>
                            </li>
                            <li>
                              <a href='https://whatsapp.com' target='_blank' rel='noreferrer' >
                                <i className='ri-whatsapp-line' />
                              </a>
                            </li>
                            <li>
                              <a href='https://youtube.com' target='_blank' rel='noreferrer' >
                                <i className='ri-youtube-line' />
                              </a>
                            </li>
                          </ul>
                        </div>
                      </div>
                    </div>
                    <div>
                      <div className={`hide more `+riconClass} onClick={this.toggle.bind(this,"more")}>
                        <div className='icon'>
                          <i className='ri-more-fill' />
                        </div>
                        <div
                          className={`dropdown__popup`}>
                          <ul className='space-y-10'>
                            <li>
                              <Popup
                                className='custom'
                                ref={this.ref}
                                trigger={
                                  <Link
                                    to='#'
                                    className='content space-x-10 d-flex'>
                                    <i className='ri-flag-line' />
                                    <span onClick={this.toggle.bind(this,"more")}> Report </span>
                                  </Link>
                                }
                                position='bottom center'>
                                <div>
                                  <div
                                    className='popup'
                                    id='popup_bid'
                                    tabIndex={-1}
                                    role='dialog'
                                    aria-hidden='true'>
                                    <div>
                                      <div className='space-y-20'>
                                        <h5>
                                          Thank you,
                                          <span className='color_green'>
                                            we've received your report
                                          </span>
                                        </h5>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </Popup>
                            </li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className='numbers'>
                  <div className='row'>
                    <div className='col-lg-6'>
                      <div className='space-y-5'>
                        <p className='color_white'>Owner <span className='color_text'> {this.state.itemInfo.collection_id.royalties}% royalties</span></p>

                        <div className='avatars space-x-5'>
                          <div className='media'>
                            <Link to={"/profile/" + this.state.itemInfo.current_owner._id}>
                              <img
                                src={this.state.profile_image}
                                alt='Avatar'
                                className='avatar avatar-sm'
                              />
                            </Link>
                          </div>
                          <div>
                            <Link to={"/profile/" + this.state.itemInfo.current_owner._id}>
                              <p className='avatars_name color_black'>
                                {this.state.fullname}
                              </p>
                            </Link>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className='col-lg-6'>
                      <div className='space-y-5'>
                        <p className='color_text'>Collection</p>
                        <div className='avatars space-x-5'>
                          <div className='media'>
                            <Link to={"/collection/"+this.state.itemInfo.collection_id._id}>
                              <img
                                src={this.state.collection_image}
                                alt='Avatar'
                                className='avatar avatar-sm'
                              />
                            </Link>
                          </div>
                          <div>
                            <Link to={"/collection/"+this.state.itemInfo.collection_id._id}>
                              <p className='avatars_name color_black'>
                                {this.state.itemInfo.collection_id.name}
                              </p>
                            </Link>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
    

                <div className='box'>
                  <Tabs className='space-y-20'>
                    <div className='d-flex justify-content-between mb-30_reset'>
                      <TabList className='d-flex space-x-10 mb-30 nav-tabs'>
                        <Tab className='nav-item'>
                          <Link
                            className='btn btn-white btn-sm'
                            data-toggle='tab'
                            to='#tabs-1'
                            role='tab'>
                            Details
                          </Link>
                        </Tab>
                        {this.state.itemInfo.has_offer && 
                        <Tab>
                          <Link
                            className='btn btn-white btn-sm'
                            data-toggle='tab'
                            to='#tabs-2'
                            role='tab'>
                            Bids
                          </Link>
                        </Tab>
                        }
                        <Tab>
                          <Link
                            className='btn btn-white btn-sm'
                            data-toggle='tab'
                            to='#tabs-3'
                            role='tab'>
                            History
                          </Link>
                        </Tab>
                      </TabList>

                    </div>
                    <div className='hr' />
                    <div className='tab-content item-tab-content'>
                      <TabPanel className='active space-y-20'>
                        <p class="gray-text">{this.state.itemInfo.description}</p>
                        {/* <p class="gray-text">Contract Address: <span><a target="_blank">{this.state.itemInfo.collection_id.contract_address}</a></span></p>
                        <p class="gray-text">Token: <span><a target="_blank">{this.state.itemInfo.token_id}</a></span></p>
                        <p class="gray-text">Blockchain: <span><a target="_blank">{config.block_chain}</a></span></p> */}
                      </TabPanel>
                      {this.state.itemInfo.has_offer && 
                       <TabPanel>
                          <table class="table bidtable table-bordered table-striped table-sm table-border-new">
                          <thead>
                          <tr>
                          <th>Sender</th>
                          <th>Price</th>
                          <th>Created Date</th>
                          <th>Action</th>
                          </tr>
                          </thead>
                          <tbody>
                            {this.state.offers.length>0 &&
                            <>
                            {this.state.offers.map((itemOffer, index) => (
                              <tr>
                                <td> 
                                  {itemOffer.username}
                                </td>
                                <td>{itemOffer.price}</td>
                                <td>{itemOffer.timeago}</td>
                                <td>
                                {this.state.currentUser?.user_id!=null &&
                                <>
                                {(itemOffer.user_id == this.state.currentUser.user_id && itemOffer.status != 'accepted') && 
                                <> 
                                  <button class="btn btn-sm btn-secondary" onClick={()=>{this.removeOffer(itemOffer)}}>Remove</button>
                                </>
                                }

                                {(itemOffer.receiver_id == this.state.currentUser.user_id && itemOffer.status != 'accepted' && this.state.currentUser.blockchain_member == 1) && 
                                <>
                                  <button class="btn btn-cm btn-secondary" onClick={()=>{this.removeOffer(itemOffer)}}>Remove</button>
                                </>
                                }
                                {(itemOffer.receiver_id == this.state.currentUser.user_id && itemOffer.status == 'accepted') && 
                                <>
                                  <button class="btn btn-sm btn-secondary">Waiting for payment</button>
                                </>
                                }
                                </>
                                }
                                </td>
                              </tr>
                            ))}
                            </>
                          }
                          {this.state.offers.length==0 &&
                            <>
                            <tr>
                                <td colSpan="4"><strong>Oops!</strong> No Data Found</td>
                             </tr>
                            </>
                          }
                          </tbody>
                          </table>

                          {(this.state.offerPrev || this.state.offerNext) &&
                          <ul class="pagination">
                              {(this.state.offerPrev) &&
                              <li class="page-item"><a class="page-link" href="javascript:void(0)" onClick={()=>{this.prevPricePage()}}>Prev</a></li>
                              }
                              {(this.state.offerNext) &&
                              <li class="page-item"><a class="page-link" href="javascript:void(0)" onClick={()=>{this.nextPricePage()}}>Next</a></li>
                              }
                          </ul>
                          } 
                            </TabPanel>
                          }
                          <TabPanel>
                            <div className='space-y-20'>
                              {this.state.histories.length > 0 &&
                                <>
                                  {this.state.histories.map((itemHistory, index) => (
                                    <div key={`history_${index}`} className='creator_item creator_card space-x-10'>
                                      <div className='avatars space-x-10'>
                                        <div className='media'>
                                          <div className='badge'>
                                            <img
                                              src='/assets/img/icons/Badge.svg'
                                              alt='ImgPreview'
                                            />
                                          </div>
                                          { itemHistory.sender != null && <> <Link to={"/profile/"+ itemHistory.sender_id}>
                                            <img
                                              src={itemHistory.image}
                                              alt='Avatar'
                                              className='avatar avatar-md'
                                            />
                                          </Link>
                                          </> }
                                           { itemHistory.sender_id == null && <> <Link to="#">
                                            <img
                                              src={itemHistory.image}
                                              alt='Avatar'
                                              className='avatar avatar-md'
                                            />
                                          </Link>
                                          </> }
                                        </div>
                                        <div>
                                          
                                          {(itemHistory.transaction_hash != null && itemHistory.transaction_hash!='') &&
                                          <>
                                          <a rel="noopener noreferrer"  target="_blank" href={config.explorer+"tx/"+itemHistory.transaction_hash}>View Transaction</a>
                                                                            </>                                            
                                          }
                                          <p className='color_white'>
                                          {(itemHistory.history_type == "comission") ? 'royalties' : itemHistory.history_type }
                                          <span className='color_brand'> 
                                            {(itemHistory.history_type != "minted") && 
                                            <>
                                              &nbsp;{itemHistory.price}&nbsp;{config.currency} 
                                              </>
                                            }</span>
                                            {(itemHistory.sender != null && itemHistory.history_type!='transfer')  &&
                                              <>
                                              &nbsp;By&nbsp;
                                              <Link
                                                className='color_white txt _bold'
                                                to={"/profile/"+ itemHistory.sender_id}>
                                                  {itemHistory.sender}
                                              </Link>
                                              </>
                                            }
                                            {(itemHistory.receiver != null && itemHistory.history_type=='transfer')  &&
                                              <>
                                              &nbsp;By&nbsp;
                                              <Link
                                                className='color_white txt _bold'
                                                to={"/profile/"+ itemHistory.receiver_id}>
                                                  {itemHistory.receiver}
                                              </Link>
                                              </>
                                            }
                                          </p>
                                          <span className='date color_text'>
                                          {itemHistory.timeago}
                                          </span>
                                        </div>
                                      </div>
                                    </div>
                                  ))}
                                  {(this.state.historyPrev || this.state.historyNext) &&
                                    <ul class="pagination">
                                      {(this.state.historyPrev) &&
                                        <li class="page-item"><a class="page-link" href="#javascript" onClick={() => { this.prevHistoryPage() }}>Prev</a></li>
                                      }
                                      {(this.state.historyNext) &&
                                        <li class="page-item"><a class="page-link" href="#javascript" onClick={() => { this.nextHistoryPage() }}>Next</a></li>
                                      }
                                    </ul>
                                  }
                                </>
                              }
                              {this.state.histories.length == 0 &&
                                <>
                                <p class="gray-text">No records found</p>
                                </>
                              }
                            </div>
                          </TabPanel>
                        </div>
                      </Tabs>
                    </div>
                    <div className='d-flex space-x-20'>
                      {(this.state.itemInfo.has_offer === false && this.state.itemInfo.status=="active" && !this.state.is_owner) &&
                        <div class="asset__btns">
                          <button class="btn btn-lg btn-primary" type="button" onClick={this.purchaseNFT}>BUY - {this.state.itemInfo.price} {config.currency}</button>
                        </div>
                      }
                      {(this.state.itemInfo.has_offer && this.state.itemInfo.status=='active' && !this.state.is_owner && !this.state.is_expire) &&
                        <div class="asset__btns">
                          Minimum bid price - {this.state.itemInfo.offer_price} {config.currency}
                        </div>
                      }
                      

                  {(this.state.is_owner) &&
                    <div class="asset__btns">

                      {this.state.itemInfo.enable_price === false && this.state.itemInfo.status == 'inactive' && !this.state.itemInfo.is_mint &&
                        <button class="btn btn-lg btn-primary" type="button" onClick={this.showUpdateOffer}>{this.state.buttonTxt}</button>
                      }

                      {this.state.itemInfo.enable_price === false && this.state.itemInfo.status == 'inactive' && this.state.itemInfo.is_mint && this.state.is_ready &&
                        <button class="btn btn-lg btn-primary" type="button" onClick={this.updateSaleConfirmation}>{this.state.buttonTxt}</button>
                      }
 
                      { this.state.itemInfo.enable_price === true && this.state.itemInfo.has_offer === false &&
                          <button class="btn btn-lg btn-primary" type="button" onClick={this.removeFromSaleConfirmation}>Remove From Sale</button>
                      }
                     
                      { this.state.itemInfo.is_mint === false && this.state.prices.length==0 && this.state.offers.length==0 &&
                         <Link to={"/additem/"+this.state.itemInfo.collection_id._id + "/" + this.state.itemInfo._id} class="btn btn-lg btn-primary">Edit</Link>
                      }

                    </div>
                   }
                   </div>

                   {(this.state.itemInfo.has_offer && !this.state.is_owner && this.state.hide_offer && this.state.itemInfo.status=='active' && !this.state.is_expire) &&
                        <button class="btn btn-primary btn-cm" onClick={() => { this.addOffer() }}>Make Offer</button>
                      }

              </div>
            </div>
          </div>
        </div>

      <Modal show={this.state.showAddOffer} onHide={this.closeOfferModal}>
            <Modal.Header closeButton>
              <Modal.Title>Add Offer</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <div class="row verifyContent">
              <div class="col-12">
                <div class="sign__group">
                    <input id="bidprice" type="text" name="bidprice" class="sign__input" placeholder="Enter Bid Price" onChange={this.handlePriceChange.bind("bidprice")} value={this.state.bidPrice}/>
                </div>
              </div>
              </div>
            </Modal.Body>
            <Modal.Footer>
              <Button variant="primary" onClick={this.closeOfferModal}>
                Close
              </Button>
              <Button variant="primary" onClick={this.confirmOfferModal}>
                Add
              </Button>
            </Modal.Footer>
        </Modal>

        <Modal enforceFocus={false} className="unique-class" show={this.state.showOffer} onHide={this.closeUpdateOfferModal}>
            <Modal.Header closeButton>
              <Modal.Title>Item Price Update</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <div class="row verifyContent">
              { <div class="col-12">
                       <div class="form_section item_detail_form_section">
                          <div class="form_section_left">
                          Enable auction
                          </div>
                          <div class="form_section_right">
                             <Switch onChange={this.handleOfferChange} checked={this.state.offerFields["has_offer"]} uncheckedIcon={false} checkedIcon={false}  onColor={"#6164ff"} offColor={"#bdbdbd"}/>
                          </div>
                       </div>
                    </div> }
                    { !this.state.offerFields["has_offer"] &&
                      <div class="col-12 col-md-12 col-lg-12 col-xl-12">
                            <div class="sign__group">
                                <span class="nameInput color_white">Price</span>
                                <input id="price" type="text" name="price" class="sign__input" placeholder="Enter price" onChange={this.handleChange.bind(this, "price")} value={this.state.offerFields["price"]}/>
                            </div>
                      </div>
                    }
                    { this.state.offerFields["has_offer"] &&
                      <>
                      <div class="col-12 col-md-12 col-lg-12 col-xl-12">
                          <div class="sign__group">
                               <p class="color_white" htmlFor="offer_price">Minimum bid price</p>
                              <input id="offer_price" type="text" name="offer_price" class="sign__input" placeholder="Enter Minimum bid" onChange={this.handleChange.bind(this, "offer_price")} value={this.state.offerFields["offer_price"]}/>
                          </div>
                      </div>
                      <div class="col-12 col-md-12 col-lg-12 col-xl-12">
                          <div class="sign__group">
                              <p class="color_white" htmlFor="offer_duration">Bidding Days</p>
                              <DateRangePicker initialSettings={{ locale: {format: 'M/DD/Y hh:mm A'}, timePicker: true, startDate: this.state.offerFields.startDate, endDate: this.state.offerFields.endDate }}  onApply={this.handleApply}>
                                <input type="text" className="form-control" />
                              </DateRangePicker> 
                          </div>
                      </div>
                      </>
                    }
              </div>
            </Modal.Body>
            <Modal.Footer>
              <Button variant="primary" onClick={this.closeUpdateOfferModal}>
                Close
              </Button>
              <Button variant="primary" onClick={this.submitUpdateOffer}>
                Add
              </Button>
            </Modal.Footer>
        </Modal>

        <Modal show={this.state.showConfirmation} onHide={this.closeConfirmationModal}>
            <Modal.Header closeButton>
              <Modal.Title>Confirmation</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <div class="row verifyContent">
              <div class="col-12">
                Are you sure to remove from sale ?
              </div>
              </div>
            </Modal.Body>
            <Modal.Footer>
              <Button variant="primary" onClick={this.closeConfirmationModal}>
                Close
              </Button>
              <Button variant="primary" onClick={this.removeFromSale}>
                Remove
              </Button>
            </Modal.Footer>
          </Modal>
      </div>

      }


    </>
    );
  }
}

function mapStateToProps(state) {
	return {
	  notifier: state.notifier
	};
}
export default connect(mapStateToProps, {actionNotifyUser})(withRouter(VVItemDetailVC))
