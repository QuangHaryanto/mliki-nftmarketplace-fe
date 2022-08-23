
import React from 'react';
import {
  BrowserRouter as Router,
  Link,
  withRouter
  } from "react-router-dom";
import {actionNotifyUser} from './../../../redux/NotifyAction'
import {connect} from 'react-redux';
import Uploady from "@rpldy/uploady";
import UploadButton from "@rpldy/upload-button";
import {UploadHook} from './../../../hooks/uploadHook'
import { toast } from 'react-toastify';
import { api } from '../../../helper/VVApi';
import { BsFillFileEarmarkFill, BsPlusSquare, BsListUl, BsStarFill, BsReception3, BsLockFill, BsCalendarCheckFill, BsX } from "react-icons/bs";
import Switch from "react-switch";
import { Button, Modal, ProgressBar }  from 'react-bootstrap';
import { getUser } from '../../../services/VVUserService';
import { detailAPI } from '../../../services/VVCollectionService';
import {listAPI} from '../../../services/VVCategoryService';
import { addAPI, getItemListAPI, updateItemAPI, deleteItemAPI } from '../../../services/VVItemService';
import { config } from '../../../helper/VVConfig';
import DateRangePicker from 'react-bootstrap-daterangepicker';
import 'bootstrap-daterangepicker/daterangepicker.css';

class VVItemActionVC extends React.Component {
  constructor() {
    super()
    this.toastObj = null;
    this.collection_id = null;
    this.collectionDetails = null;
    this.item_id = null;
    this.itemDetails = null;
    this.currentItemData = null;
    this.waiting = false;
    this.state = {
      page_title: "Add Item",
      fields: {
        address: "",
        name: "",
        description: "",
        external_link: "",
        collection_id: "",
        category_id: "",
        thumb: "",
        media: "",
        token_id: "",
        transaction_hash: "",
        unlock_content_url: false,
        attributes: [{
          name:"",
          type: ""
        }],
        levels: [{
          name:"",
          value: "",
          valueof: ""
        }],
        stats: [{
          name:"",
          value: "",
          valueof: ""
        }],
        no_of_copies:1,
        // price:"",
        // is_offer: true,
        // offer_price: "",
        // offer_days: "",
        // offer_date: ""
      },
      categories: [],
      isSubmit: false,
      isEdit: false,
      isSold: false,
      showConfirmation: false,
      modelType: "",
      modelOpen: false,
      modelTitle: "",
      status: "",
      currentItemData: null,
      hasProperty: false,
      hasStat: false,
      hasLevel: false,
      
    }
  }

  componentDidMount() {
    this.setPath(this.props.location.pathname)
  }

  componentDidUpdate(prevProps) {
    if(this.props.notifier !== prevProps.notifier) {
      let notifier = this.props.notifier;
      if(notifier) {

      }
    }
  }

  setPath = (pathname) => {
    var pathArray = pathname.split("/")
    if(pathArray.length === 4) {
        this.setState({
            page_title: "Edit Item",
        })
        this.isEdit = true
        this.setState({
            isEdit: true
         })
        this.collection_id = pathArray[pathArray.length-2];
        this.item_id = pathArray[pathArray.length-1]
        this.itemDetail();
    } else {
        this.isEdit = false
        this.setState({
            page_title: "Add Item",
        })
        this.collection_id = pathArray[pathArray.length-1];
        this.getCategories()
    }
    this.getCollectionDetail();
    let fields = this.state.fields;
    let user = getUser();
    if(user===null) {
        toast("Login is required",{
            type: "error"
        });
        setTimeout(() => {
            window.location.href = '/';
          }, 2000);
        return false;
    }
    fields["address"] = user.public_key;
    fields["collection_id"] = this.collection_id;
    this.setState({ fields });
  }

  getCollectionDetail = () => {
    detailAPI(this.collection_id).then(result=>{
      this.collectionDetails = result.result
    })
  }

  itemDetail = () => {
    getItemListAPI({
      page: 1,
      item_id: this.item_id,
      type: "view"
    }).then(result=>{
      if(result.data.docs.length>0) {
        this.itemDetails = result.data.docs[0];
        this.fillEditFields()
        this.getCategories()
      }
    })
  }

  fillEditFields = () => {
    let fields = this.state.fields;
    fields["name"] = this.itemDetails.name;
    fields["description"] = this.itemDetails.description;
    fields["external_link"] = this.itemDetails.external_link;
    fields["category_id"] = this.itemDetails.category_id._id;
    fields["unlock_content_url"] = this.itemDetails.unlock_content_url;
    fields["thumb"] = this.itemDetails.thumb;
    fields["media"] = this.itemDetails.media;
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
    this.setState({
      hasProperty: (attributes.length===0) ? false : true,
      status: this.itemDetails.status
    })
    if(attributes.length===0) {
      attributes.push({
        name: "",
        type: ""
      })
    } 
    fields["attributes"] = attributes

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
    this.setState({
      hasLevel: (levels.length===0) ? false : true,
    })
    if(levels.length===0) {
      levels.push({
        name: "",
        value: "",
        valueof: ""
      })
    }
    fields["levels"] = levels

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
    this.setState({
      hasStat: (stats.length===0) ? false : true,
    })
    if(stats.length===0) {
      stats.push({
        name: "",
        value: "",
        valueof: ""
      })
    }
    fields["stats"] = stats;
    fields['no_of_copies'] = this.itemDetails.copies;
    // fields['price'] = this.itemDetails.price;
    // fields['offer_price'] = this.itemDetails.offer_price;
    // fields['is_offer'] = this.itemDetails.has_offer;
    this.setState({
      fields: fields,
      isSold: (this.itemDetails.author_id !== this.itemDetails.current_owner._id)
    })
    
  }

  getCategories = () => {
    listAPI().then(result=>{
      var categoryArray = []
      for (let index = 0; index < result.data.length; index++) {
        const element = result.data[index];
        var selected = ""
        if((this.itemDetails !==null)) {
           console.log(element._id);
           if(element._id === this.itemDetails.category_id._id) {
             selected = "selected"
           }
        }
        categoryArray.push({
          _id: element._id,
          title: element.title,
          selected:selected
        })
      }
      this.setState({
        categories:categoryArray
      });
    })
  }


  handleChange = (field, e) => {
    let fields = this.state.fields;
    fields[field] = e.target.value;
    this.setState({ fields });
  }

  coverThumb = () => {
    return <Uploady 
      accept="image/*"
      destination={{ url: api.base + "/media/thumb" && api.base + "/media/media" }}>
      <UploadButton type="button" className="collectionUploader" text="e.g. Png, Jpg, Jpeg, Gif"/>
      <UploadHook onDone={this.thumbUploadDone} onError={this.mediaUploadError}/>
      <UploadHook onDone={this.mediaUploadDone} onError={this.mediaUploadError}/>
      </Uploady>
  }

  thumbUploadDone = (cover)=> {
    let fields = this.state.fields;
    fields["thumb"] = cover;
    this.setState({ fields });
  }

  deleteThumb = () =>{
    let fields = this.state.fields;
    fields["thumb"] = "";
    this.setState({ fields });
  }

  coverMedia = () => {
    return <Uploady 
      accept="image/*,video/*,application/*,audio/*"
      destination={{ url: api.base + "/media/media" }}>
      <UploadButton type="button" className="collectionUploader" text="e. g. Png, Jpg, Jpeg, Gif, MP4, MP3, PDF"/>
      <UploadHook onDone={this.mediaUploadDone} onError={this.mediaUploadError}/>
      </Uploady>
  }

  mediaUploadDone = (cover)=> {
    let fields = this.state.fields;
    fields["media"] = cover;
    this.setState({ fields });
  }

  mediaUploadError = (message)=> {
    toast(message,{
      type: "error"
    });
  }


  deleteMedia = () =>{
    let fields = this.state.fields;
    fields["media"] = "";
    this.setState({ fields });
  }

  handleLockChange = (checked) => {
    let fields = this.state.fields;
    fields["unlock_content_url"] = checked;
    this.setState({ fields });
  }

  handleOfferChange = (checked) => {
    let fields = this.state.fields;
    fields["is_offer"] = checked;
    this.setState({ fields });
  }

  handleApply = (event, picker) => {
    const date1 = new Date(picker.startDate);
    const date2 = new Date(picker.endDate);
    let fields = this.state.fields;
    fields['offer_days'] = this.getDifferenceInDays(date1,date2);
    fields['offer_date'] = picker.startDate;
    this.setState({ fields });  
  }

  itemAction = () => {
    if(this.validateFields()) {
      this.setState({
        isSubmit:true
      })
      if(this.state.fields['offer_date']==''){
        var d = new Date();
        d.setHours(0,0,0,0); 
        let fields = this.state.fields;
        fields['offer_days'] = 1;
        fields['offer_date'] = d;  
      }
      if(this.state.isEdit) {
        this.toastObj =  toast("updating item",{
          closeButton: false,
          autoClose: false,
          isLoading: true
        })
        let params = this.state.fields;
        params["item_id"] = this.item_id
        updateItemAPI(params).then(result=>{
          this.setState({
            isSubmit:false
          })
          toast.dismiss(this.toastObj);
          if(result.status === true) {
            toast(result.message,{
              type: "success"
            });
            this.props.history.push("/item/"+ this.item_id);
          } else {
            toast(result.message,{
              type: "error"
            });
          }

        })
      } else {
        this.toastObj =  toast("creating new item",{
          closeButton: false,
          autoClose: false,
          isLoading: true
        })
        let params = this.state.fields;
        addAPI(params).then(result=>{
            toast.dismiss(this.toastObj);
            this.setState({
                isSubmit: false
            })
            if(result.status === true) {
              this.props.history.push("/item/"+result.result._id);
            } else {
              toast("create item failed",{
                type: "error"
              });
            }
        })
        // this.waiting = true;
        // this.toastObj =  toast("Miniting new item",{
        //   closeButton: false,
        //   autoClose: false,
        //   isLoading: true
        // })
        // this.props.actionNotifyUser({
        //   type: 'mint_contract',
        //   payload: this.collectionDetails.contract_address
        // });
      }

    }
  }

  validateFields = () => {
    let user = getUser()
    if(user === null) {
      toast("Permission denied",{
        type: "error"
      });
      return false
    }
    if(this.state.isEdit) {
      if(this.itemDetails.current_owner._id !== user.user_id) {
        toast("Permission denied",{
          type: "error"
        });
        return false
      }
    } else {
      if(this.collectionDetails.author_id._id !== user.user_id) {
        toast("Permission denied",{
          type: "error"
        });
        return false
      }
    }

    if(this.collectionDetails.status === 0) {
      toast("Contract was not publised yet. please publish contract and try again",{
        type: "error"
      });
      return false
    }
    if(this.state.fields["name"].trim().length === 0) {
      toast("Item name is required",{
        type: "error"
      });
      return false
    }

    if(this.state.fields["name"].trim().length < 3) {
      toast("Item name alteast have 3 characters",{
        type: "error"
      });
      return false
    }

    if(this.state.fields["name"].trim().length > 255) {
      toast("Item name maximum have 255 characters",{
        type: "error"
      });
      return false
    }

    if(this.state.fields["description"].trim().length === 0) {
      toast("Item description is required",{
        type: "error"
      });
      return false
    }

    if(this.state.fields["description"].trim().length > 1000) {
      toast("Item description maximum have 1000 characters",{
        type: "error"
      });
      return false
    }

    let urlRegex = /^(?:http(s)?:\/\/)?[\w.-]+(?:\.[\w\.-]+)+[\w\-\._~:/?#[\]@!\$&'\(\)\*\+,;=.]+$/;
    if(this.state.fields["external_link"].trim().length>0) {
      if(!urlRegex.test(this.state.fields["external_link"])) {
          toast("Invalid external url",{
              type: "error"
           });
           return false
      }
    }

    if(this.state.fields["category_id"].trim().length === 0) {
      toast("Category is required",{
        type: "error"
      });
      return false
    }


      if(this.state.fields["thumb"].trim().length === 0) {
        toast("Item preview is required",{
          type: "error"
        });
        return false
      }
  
      if(this.state.fields["media"].trim().length === 0) {
        toast("Item media is required",{
          type: "error"
        });
        return false
      }
    
    // if (!this.state.fields['is_offer'] && (this.state.fields["price"]=== 0 || this.state.fields["price"]=='')) {
    //   toast("Price is required", {
    //     type: "error"
    //   });
    //   return false
    // }

    // if(!this.state.fields['is_offer'] && (this.state.fields["price"]> 0 || this.state.fields["price"]!='')) {
    //   var regexp = /^\d+(\.\d{1,6})?$/;
    //   if(!regexp.test(this.state.fields["price"])){
    //     toast("Item price is allowed number only ", {
    //       type: "error"
    //     });
    //     return false
    //   }
    // }
    // if (this.state.fields['is_offer'] && (this.state.fields["offer_price"]=== 0 || this.state.fields["offer_price"]=='')) {
    //   toast("Offer Price is required", {
    //     type: "error"
    //   });
    //   return false
    // }

    // if(this.state.fields['is_offer'] && (this.state.fields["offer_price"]> 0 || this.state.fields["offer_price"]!='')) {
    //   var regexp = /^\d+(\.\d{1,6})?$/;
    //   if(!regexp.test(this.state.fields["offer_price"])){
    //     toast("Offer price is allowed number only", {
    //       type: "error"
    //     });
    //     return false
    //   }
    // }    

    if (this.state.fields["no_of_copies"]=='') {
      toast("No of copies is required", {
        type: "error"
      });
      return false
    }

    if((this.state.fields["no_of_copies"]> 0 || this.state.fields["no_of_copies"]!='')) {
      var regexp = /^[0-9]*$/;
      if(!regexp.test(this.state.fields["no_of_copies"])){
        toast("No of copies is allowed number only ", {
          type: "error"
        });
        return false
      }
    }


    return true
  }

  propertyAction = () => {
    var currentfields = [];
    for (let index = 0; index < this.state.fields["attributes"].length; index++) {
      currentfields.push(this.state.fields["attributes"][index]);
    }
    this.currentItemData = currentfields
    this.setState({
      modelOpen: true,
      modelType: "property",
      modelTitle: "Add Properties"
    })
  }

  statsAction = () => {
    var currentfields = [];
    for (let index = 0; index < this.state.fields["stats"].length; index++) {
      currentfields.push(this.state.fields["stats"][index]);
    }
    this.currentItemData = currentfields
    this.setState({
      modelOpen: true,
      modelType: "stat",
      modelTitle: "Add Stats"
    })
  }

  levelAction = () => {
    var currentfields = [];
    for (let index = 0; index < this.state.fields["levels"].length; index++) {
      currentfields.push(this.state.fields["levels"][index]);
    }
    this.currentItemData = currentfields
    this.setState({
      modelOpen: true,
      modelType: "level",
      modelTitle: "Add Levels"
    })
  }

  closeItemModal = () => {
    var fields = this.state.fields;
    if(this.state.modelType === "property") {
      fields["attributes"] = this.currentItemData
    } else if(this.state.modelType === "stat") {
      fields["stats"] = this.currentItemData
    } else if(this.state.modelType === "level") {
      fields["levels"] = this.currentItemData
    }
    this.currentItemData = null
    this.setState({
      modelOpen: false,
      modelType: "",
      modelTitle: "",
      fields: fields,
    })
  }

  saveItemModal = () => {
    var fields = this.state.fields
    if(this.state.modelType === "property") {
      var property = fields["attributes"];
      var properties = []
      for (let index = 0; index < property.length; index++) {
        const element = property[index];
        if(element.type.trim() !== '' && element.name.trim() !== '') {
          properties.push(element)
        }
      }
      this.setState({
        hasProperty: properties.length===0 ? false : true
      })
      if(properties.length===0) {
        properties.push({
          name:"",
          type: ""
        })
      }
      fields["attributes"] = properties
    } else if(this.state.modelType === "stat") {
      var stat = fields["stats"];
      var stats = []
      for (let index = 0; index < stat.length; index++) {
        const element = stat[index];
        if(element.name.trim() !== '' && element.value.trim() !== '' && element.valueof.trim() !== '') {
          stats.push(element)
        }
      }
      this.setState({
        hasStat: stats.length===0 ? false : true
      })
      if(stats.length===0) {
        stats.push({
          name:"",
          value: "",
          valueof: ""
        })
      }
      fields["stats"] = stats
    } else if(this.state.modelType === "level") {
      var level = fields["levels"];
      var levels = []
      for (let index = 0; index < level.length; index++) {
        const element = level[index];
        if(element.name.trim() !== '' && element.value.trim() !== '' && element.valueof.trim() !== '') {
          levels.push(element)
        }
      }
      this.setState({
        hasLevel: levels.length===0 ? false : true
      })
      if(levels.length===0) {
        levels.push({
          name:"",
          value: "",
          valueof: ""
        })
      }
      fields["levels"] = levels
    }
    this.setState({
      modelOpen: false,
      modelType: "",
      fields: fields
    })
  }

  deleteAdditionalItem = (index) => { 
    var fields = this.state.fields
    if(this.state.modelType === "property") {
      var property = fields["attributes"];
      if(property.length>1) {
        property.splice(index,1)
      } else {
        property = [{
          name:"",
          type: ""
        }]
      }
      fields["attributes"] = property
    } else if(this.state.modelType === "stat") {
      var stat = fields["stats"];
      if(stat.length>1) {
        stat.splice(index,1)
      } else {
        stat = [{
          name:"",
          value: "",
          valueof: ""
        }]
      }
      fields["stats"] = stat
    } else if(this.state.modelType === "level") {
      var level = fields["levels"];
      if(level.length>1) {
        level.splice(index,1)
      } else {
        level = [{
          name:"",
          value: "",
          valueof: ""
        }]
      }
      fields["levels"] = level
    }
    this.setState({
      fields: fields
    })
  }

  additionAddMore = () => {
    var fields = this.state.fields
    if(this.state.modelType === "property") {
      var property = fields["attributes"];
      property.push({
        name:"",
        type: ""
      })
      fields["attributes"] = property
    } else if(this.state.modelType === "stat") {
      var stat = fields["stats"];
      stat.push({
        name:"",
        value: "",
        valueof: ""
      })
      fields["stats"] = stat
    } else if(this.state.modelType === "level") {
      var level = fields["levels"];
      level.push({
        name:"",
        value: "",
        valueof: ""
      })
      fields["levels"] = level
    }
    this.setState({
      fields: fields
    })
  }

  handleAdditionalLeftChange = (field,index,e) => {
    var fields = this.state.fields
    if(this.state.modelType === "property") {
      var property = fields["attributes"];
      property[index].type = e.target.value
      fields["attributes"] = property
    } else if(this.state.modelType === "stat") {
      var stat = fields["stats"];
      stat[index].name = e.target.value
      fields["stats"] = stat
    } else if(this.state.modelType === "level") {
      var level = fields["levels"];
      level[index].name = e.target.value
      fields["levels"] = level
    }
    this.setState({
      fields: fields
    })
  }

  handleAdditionalRightChange = (field,index,e) => {
    var fields = this.state.fields
    if(this.state.modelType === "property") {
      var property = fields["attributes"];
      property[index].name = e.target.value
      fields["attributes"] = property
    } else if(this.state.modelType === "stat") {
      var stat = fields["stats"];
      stat[index].value = e.target.value
      fields["stats"] = stat
    } else if(this.state.modelType === "level") {
      var level = fields["levels"];
      level[index].value = e.target.value
      fields["levels"] = level
    }
    this.setState({
      fields: fields
    })
  }

  handleAdditionalRightChange1 = (field,index,e) => {
    var fields = this.state.fields
    if(this.state.modelType === "stat") {
      var stat = fields["stats"];
      stat[index].valueof = e.target.value
      fields["stats"] = stat
    } else if(this.state.modelType === "level") {
      var level = fields["levels"];
      level[index].valueof = e.target.value
      fields["levels"] = level
    }
    this.setState({
      fields: fields
    })
  }

deleteAction = () => {
    this.setState({
        showConfirmation: true
    })
}

closeConfirmationModal = () => {
    this.setState({
        showConfirmation: false
    })
}

getDifferenceInDays(date1, date2) {
  const diffInMs = Math.abs(date2 - date1);
  return Math.round(diffInMs / (1000 * 60 * 60 * 24));
}

deleteConfirmationModal = () => {
    this.setState({
        showConfirmation: false
    })
    let user = getUser()
    if(user===null) {
        toast("Login is required",{
            type: "error"
        });
        return false
    }
    if(user.user_id !== this.itemDetails.author_id) {
        toast("Permission denied",{
            type: "error"
        });
        return false
    }
    deleteItemAPI({
        item_id: this.itemDetails._id
    }).then(result=>{
        if(result.status === false) {
            toast(result.message,{
                type: "error"
            });
            return false
        }
        this.props.history.push("/profile/"+user.user_id+ "/collection");
    })
}

  render() {
    return (
      <div class="container">
        <div class="collectionAction">
          <div className='item_details mt-4'>
            <div className='row sm:space-y-10'>
              <div className='col-lg-6'>
                <div className='space-y-20'>
                <div class="row">
                  <div class="col-12 col-12 col-md-12 col-lg-12 col-xl-12">
                  <div className='space-y-20'>
                  <div class="text-center chooseContainer">
                    <span class="nameInput color_white">Item media</span>
                    </div>
                    <div class="text-center mt-4 mb-2">
                    { this.state.fields["thumb"].length === 0 &&
                      <div class="text-center chooseContainer">
                        <div class="sign__file">
                         {this.coverThumb()}
                         </div> 
                      </div>                      
                     }
                     { this.state.fields["thumb"].length !== 0 &&
                         <div class="timerdetail">
                           <img  className='item_img itemdetailimg' src={this.state.fields["thumb"]} />
                           <div className='space-y-20'>
                           <a class="btn btn-white others_btn" aria-describedby="popup-109" onClick={this.deleteThumb}>delete</a>
                           </div>
                         </div>                   
                     }
                     </div>
                    </div>
                  </div>
                </div>
                </div>
              </div>

              <div className='col-lg-6'>
                <div className='space-y-20'>
                  <div class="row">
                    <div class="col-12">
                      <h3 class="color_white mb-20">{this.state.page_title}</h3>
                        </div>
                          <div class="col-12 col-md-12 col-lg-12 col-xl-12">
                            <div class="sign__group">
                              <span class="nameInput color_white">Name</span>
                              <input id="name" type="text" name="name" class="form-control" placeholder="Enter item name" onChange={this.handleChange.bind(this, "name")} value={this.state.fields["name"]}/>
                          </div>
                        </div>
                      <div class="col-12 col-md-12 col-lg-12 col-xl-12">
                          <div class="sign__group">
                              <span class="nameInput color_white">Description</span>
                              <textarea name="description" class="form-control" placeholder="Enter description"  onChange={this.handleChange.bind(this, "description")} value={this.state.fields["description"]}></textarea>
                          </div>
                      </div>
                      <div class="col-12 col-md-12 col-lg-12 col-xl-12">
                          <div class="sign__group">
                              <span class="nameInput color_white">External link</span>
                              <input id="external_link" type="text" name="external_link" class="form-control" placeholder="Enter external link" onChange={this.handleChange.bind(this, "external_link")} value={this.state.fields["external_link"]}/>
                          </div>
                      </div>
                      <div class="col-12 col-md-12 col-lg-12 col-xl-12">
                          <div class="sign__group">
                          <span class="nameInput color_white">Category</span>
                              <select id="category" name="category" class="form-control" onChange={this.handleChange.bind(this, "category_id")}>
                                <option value="">Select category</option>
                                {this.state.categories.map((item, index) => (
                                  <option value={item._id} selected={item.selected}>{item.title}</option>
                                ))}
                              </select>
                          </div>
                      </div>          
                      <>
                      <div class="col-12">
                        <div class="form_section">
                            <div class="form_section_left">
                            <span><BsLockFill color="#bdbdbd" size={20}/></span>Lock media for only owner
                            </div>
                            <div class="form_section_right">
                              <Switch onChange={this.handleLockChange} checked={this.state.fields["unlock_content_url"]} uncheckedIcon={false} checkedIcon={false} onColor={"#6164ff"} offColor={"#bdbdbd"} />
                            </div>
                        </div>
                      </div>

                      </>
                    <>
                      <div class="col-12 col-md-12 col-lg-12 col-xl-12">
                        <div class="sign__group">
                          <span class="nameInput color_white">No. of Copies</span>
                          <input id="no_of_copies" type="text" name="no_of_copies" class="form-control" placeholder="Enter No of copies" onChange={this.handleChange.bind(this, "no_of_copies")} value={this.state.fields["no_of_copies"]} />
                        </div>
                      </div>

                      </> 
  
                      {!this.state.isSubmit &&
                      <div class="bottom-0 left-0 right-0">
                          <div class="container">
                              <div class="row content justify-content-between mb-20_reset">
                              {(this.state.isEdit && !this.state.isSold) &&

                                                  <div class="col-md-auto col-12 mb-20">
                                                  <div class="space-x-10">
                                                      <a class="btn btn-white others_btn" href="javascript:void(0)" onClick={()=>{
                                                      this.deleteAction()
                                                  }}>Delete</a>
                                                  </div>
                                              </div>
                                              }

                                  <div class="col-md-auto col-12 mb-20">
                                      <a class="btn btn-grad btn_create" aria-describedby="popup-109" href="javascript:void(0)" onClick={()=>{
                                                  this.itemAction()
                                              }}>Save</a>
                                      <a class="btn btn-grad btn_create" aria-describedby="popup-109" href="javascript:void(0)" onClick={this.props.history.goBack}>Cancel</a>
                                  </div>
                              </div>
                          </div>
                      </div>
                      }
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
                    

        
        <Modal show={this.state.modelOpen} onHide={this.closeItemModal}>
            <Modal.Header closeButton>
              <Modal.Title>{this.state.modelTitle}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
               {this.state.modelType === "property" &&
                <div class="adddtionalContent">
                  <div class="additionalHeader clearfix">
                    <div class="additionalHeaderLeft">
                      Type
                    </div>
                    <div class="additionalHeaderRight">
                      Name
                    </div>
                  </div>
                  {this.state.fields.attributes.map((item, index) => (
                     <div class="additionalContentRow clearfix">
                        <div class="additionalContentLeft">
                           <div class="additionalContentLeftDelete">
                             <button onClick={()=>{
                                        this.deleteAdditionalItem(index)
                                    }}>
                                <BsX color="#000" size={40} />
                             </button>
                             
                           </div>
                           <input type="text" name={"type_"+index} class="sign__input" placeholder="Character" onChange={this.handleAdditionalLeftChange.bind(this,"type_"+index, index)} value={item.type}/>
                        </div>
                        <div class="additionalContentRight">
                          <input type="text" name={"name_"+index} class="sign__input" placeholder="Male" onChange={this.handleAdditionalRightChange.bind(this,"name_"+index, index)} value={item.name}/>
                        </div>
                     </div>

                  ))}
                </div>
               }

               {this.state.modelType === "level" &&
                <div class="adddtionalContent">
                  <div class="additionalHeader clearfix">
                    <div class="additionalHeaderLeft">
                      Name
                    </div>
                    <div class="additionalHeaderRight">
                      Value
                    </div>
                  </div>
                  {this.state.fields.levels.map((item, index) => (
                     <div class="additionalContentRow clearfix">
                        <div class="additionalContentLeft">
                           <div class="additionalContentLeftDelete">
                             <button onClick={()=>{
                                        this.deleteAdditionalItem(index)
                                    }}>
                                <BsX color="#000" size={40} />
                             </button>
                             
                           </div>
                           <input type="text" name={"name_"+index} class="sign__input" placeholder="Speed" onChange={this.handleAdditionalLeftChange.bind(this,"name_"+index, index)} value={item.name}/>
                        </div>
                        <div class="additionalContentRight additionalContentRightLevel">
                          <input type="number" name={"value_"+index} class="sign__input" placeholder="3" onChange={this.handleAdditionalRightChange.bind(this,"value_"+index, index)} value={item.value}/>
                          <span>Of</span>
                          <input type="number" name={"valueof_"+index} class="sign__input" placeholder="5" onChange={this.handleAdditionalRightChange1.bind(this,"valueof_"+index, index)} value={item.valueof}/>
                        </div>
                     </div>

                  ))}
                </div>
               }

              {this.state.modelType === "stat" &&
                <div class="adddtionalContent">
                  <div class="additionalHeader clearfix">
                    <div class="additionalHeaderLeft">
                      Name
                    </div>
                    <div class="additionalHeaderRight">
                      Value
                    </div>
                  </div>
                  {this.state.fields.stats.map((item, index) => (
                     <div class="additionalContentRow clearfix">
                        <div class="additionalContentLeft">
                           <div class="additionalContentLeftDelete">
                             <button onClick={()=>{
                                        this.deleteAdditionalItem(index)
                                    }}>
                                <BsX color="#000" size={40} />
                             </button>
                             
                           </div>
                           <input type="text" name={"name_"+index} class="sign__input" placeholder="Speed" onChange={this.handleAdditionalLeftChange.bind(this,"name_"+index, index)} value={item.name}/>
                        </div>
                        <div class="additionalContentRight additionalContentRightLevel">
                          <input type="number" name={"value_"+index} class="sign__input" placeholder="3" onChange={this.handleAdditionalRightChange.bind(this,"value_"+index, index)} value={item.value}/>
                          <span>Of</span>
                          <input type="number" name={"valueof_"+index} class="sign__input" placeholder="5" onChange={this.handleAdditionalRightChange1.bind(this,"valueof_"+index, index)} value={item.valueof}/>
                        </div>
                     </div>

                  ))}
                </div>
               }

               

               <div class="adddtionalfooter">
                 <Button variant="primary" onClick={this.additionAddMore}>
                   Add More
                 </Button>
               </div>
            </Modal.Body>
            <Modal.Footer>
            <Button variant="primary" onClick={this.closeItemModal}>
                Close
              </Button>
              <Button variant="primary" onClick={this.saveItemModal}>
                Save
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
                Are you sure to delete ?
              </div>
              </div>
            </Modal.Body>
            <Modal.Footer>
              <Button variant="primary" onClick={this.closeConfirmationModal}>
                Close
              </Button>
              <Button variant="primary" onClick={this.deleteConfirmationModal}>
                Delete
              </Button>
            </Modal.Footer>
          </Modal>
      </div>
    );
  }
}

function mapStateToProps(state) {
	return {
	  notifier: state.notifier
	};
}

export default connect(mapStateToProps, {actionNotifyUser})(withRouter(VVItemActionVC))
