import React from 'react';
import {
    BrowserRouter as Router,
    Link,
    withRouter,
    Switch,
    Route,
    Redirect
    } from "react-router-dom";
import {actionNotifyUser} from './../../redux/NotifyAction'
import {connect} from 'react-redux';
import Uploady from "@rpldy/uploady";
import UploadButton from "@rpldy/upload-button";
import {UploadHook} from './../../hooks/uploadHook'
import { api } from '../../helper/VVApi';
import { toast } from 'react-toastify';
import { getUser } from '../../services/VVUserService';
import { addAPI,updateAPI, detailAPI, deleteAPI, deleteRoyaltyAPI, getRoyaltyStatus } from '../../services/VVCollectionService';
import { Button, Modal }  from 'react-bootstrap';
import { config } from '../../helper/VVConfig';
class VVCollectionActionVC extends React.Component {
  constructor() {
    super()
    this.toastObj = null
    this.contractDetails = null
    this.isEdit = false;
    this.hasRoyalty = false;
    this.state = {
        page_title: "Add Collection",
        fields: {
            name: "",
            royalties: "",
            description: "",
            banner: "",
        },
        isSubmit: false,
        isEdit: false,
        item_count: 0,
        showConfirmation: false
    }
  }

  componentDidMount() {
    this.setPath(this.props.location.pathname)
  }

  setPath = (pathname) => {
    var pathArray = pathname.split("/")
    if(pathArray.length === 3) {
        this.setState({
            page_title: "Edit Collection",
        })
        this.isEdit = true
        this.setState({
            isEdit: true
         })
        let collection_id = pathArray[pathArray.length-1]
        detailAPI(collection_id).then(result=>{
            this.contractDetails = result.result
            this.setState({
                fields: {
                    name: this.contractDetails.name,
                    royalties: this.contractDetails.royalties.toString(),
                    description: this.contractDetails.description,
                    banner: this.contractDetails.banner,
                },
                item_count: this.contractDetails.item_count
            })
            this.getRoyalties()
        })
    } else {
        this.isEdit = false
        this.setState({
            page_title: "Add Collection",
        })
    }
  }

  getRoyalties = () => {
      getRoyaltyStatus(this.contractDetails._id).then(result=>{
          this.hasRoyalty = result.status;
      })
  }
  componentDidUpdate(prevProps) {
    let notifier = this.props.notifier;
    if(notifier) {
        if(notifier.type === 'contractfail') {
            toast.dismiss(this.toastObj);
            this.setState({
                isSubmit: false
             })
            toast("contract creation successful, but blockchain contract creating has failure",{
                type: "error"
            });
            let user = getUser()
            this.props.history.push("/profile/"+user.user_id+ "/collection");
        } else if(notifier.type === 'contractsuccess') {
            updateAPI({
                collection_id: this.contractDetails._id,
                contract_address: notifier.payload.contract_address,
                name: this.contractDetails.name,
                royalties: this.contractDetails.royalties,
                description:  this.contractDetails.description,
                banner:  this.contractDetails.banner,
            }).then(result=>{
                toast.dismiss(this.toastObj);
                this.setState({
                    isSubmit: false
                 })
                if(result.status === true) {
                } else {
                    toast("contract creation successful, but blockchain contract creating has failure",{
                        type: "error"
                    });
                }
                let user = getUser()
                this.props.history.push("/profile/"+user.user_id+ "/collection");
            })

        } else if(notifier.type === 'royaltycompleted') {
            toast.dismiss(this.toastObj);
            this.setState({
                isSubmit: false
             })
            let user = getUser()
            this.props.history.push("/profile/"+user.user_id+ "/collection");
        }
    }
  }

  handleChange = (field, e) => {
    let fields = this.state.fields;
    fields[field] = e.target.value;
    this.setState({ fields });
  }

  collectionAction = () => {
    if(this.validateFields()) {

        var params = this.state.fields;
        if(this.isEdit) {
            let user = getUser();
            if(user.user_id !== this.contractDetails.author_id._id) {
                toast("Permission denied",{
                    type: "error"
                });
                return false
            }
            params["collection_id"] = this.contractDetails._id
            this.toastObj =  toast(this.contractDetails.contract_address ? "Updating Collection" : "Creating Collection",{
                closeButton: false,
                autoClose: false,
                isLoading: true
            })
            this.setState({
                isSubmit: true
            })
            updateAPI(params).then(result=>{
                if(result.status === false) {
                    toast.dismiss(this.toastObj);
                    this.setState({
                        isSubmit: false
                     })
                    toast(result.message,{
                        type: "error"
                    });
                    return false
                }
                toast.dismiss(this.toastObj);
                this.setState({
                    isSubmit: false
                    })
                toast(result.message,{
                    type: "success"
                });
                this.props.history.push("/profile/"+user.user_id+ "/collection");
                this.contractDetails = result.result;

            })
        } else {
            this.setState({
                isSubmit: true
             })
            this.toastObj =  toast("Creating Collection",{
                closeButton: false,
                autoClose: false,
                isLoading: true
            })
            addAPI(params).then(result=>{
                if(result.status === false) {
                    toast.dismiss(this.toastObj);
                    toast(result.message,{
                        type: "error"
                    });
                    this.setState({
                        isSubmit: false
                     })
                    return false
                }
                this.contractDetails = result.result;
                updateAPI({
                    collection_id: this.contractDetails._id,
                    contract_address: config.contract_address,
                    name: this.contractDetails.name,
                    royalties: this.contractDetails.royalties,
                    description:  this.contractDetails.description,
                    banner:  this.contractDetails.banner,
                }).then(result=>{
                    toast.dismiss(this.toastObj);
                    this.setState({
                        isSubmit: false
                     })
                    if(result.status === true) {
                        toast("Collection created successfully",{
                            type: "success"
                        });
                    }
                    let user = getUser()
                    this.props.history.push("/profile/"+user.user_id+ "/collection");
                })
            })
        }

    }
  }

  coverUpload = () => {
    return <Uploady 
      accept="image/*"
      destination={{ url: api.base + "/media/collection" }}>
      <UploadButton type="button" className="collectionUploader" text="e. g. Png, Jpg, Jpeg"/>
      <UploadHook onDone={this.coverUploadDone} onError={this.coverUploadError}/>
      </Uploady>
  }


  coverUploadDone = (cover)=> {
    let fields = this.state.fields;
    fields["banner"] = cover;
    this.setState({ fields });
  }

  coverUploadError = (message)=> {
    toast(message,{
        type: "error"
    });
  }


  deleteBanner = () =>{
    let fields = this.state.fields;
    fields["banner"] = "";
    this.setState({ fields });
  }

  validateFields = () => {
    let user = getUser()
    if(user===null) {
        toast("Login is required",{
            type: "error"
        });
        return false
    }
    if(this.state.fields["name"].trim().length===0) {
      toast("Name is required",{
          type: "error"
        });
        return false
    }

    if(this.state.fields["name"].trim().length>32) {
      toast("Name should not exceed 32 characters",{
          type: "error"
        });
        return false
    }

    if(this.state.fields["royalties"].trim().length===0) {
      toast("Royalties is required",{
          type: "error"
        });
        return false
    }

    if (!this.state.fields["royalties"].match(/^[0-9]+$/)) {
       toast("Royalties should be numbers",{
          type: "error"
        });
        return false
    }

    if(this.state.fields["royalties"]<0 || this.state.fields["royalties"]>100) {
        toast("Royalties should between 0 to 100",{
            type: "error"
          });
          return false
    }


    if(this.state.fields["description"].trim().length>255) {
      toast("Description should not exceed 255 characters",{
          type: "error"
        });
        return false
    }

    if(this.state.fields["banner"].trim().length==0) {
        toast("Collection banner is required",{
            type: "error"
        });
        return false
    }
    return true
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
    if(user.user_id !== this.contractDetails.author_id._id) {
        toast("Permission denied",{
            type: "error"
        });
        return false
    }
    deleteAPI({
        collection_id: this.contractDetails._id
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
            <div class="box in__upload mt-10 mb-80">
                <div class="row">
                    <div class="col-12">
                        <h3 class="color_white mb-20">{this.state.page_title}</h3>
                    </div>
                    <div class="col-12 col-md-6 col-lg-12 col-xl-6">
                        <div class="sign__group">
                            <span class="nameInput color_white">Name</span>
                            <input id="name" type="text" name="name" class="form-control" placeholder="Enter collection name" onChange={this.handleChange.bind(this, "name")} value={this.state.fields["name"]}/>
                        </div>
                    </div>
                    <div class="col-12 col-md-6 col-lg-12 col-xl-6">
                        <div class="sign__group">
                            <span class="nameInput color_white">Royalties</span>
                            <input id="royalties" type="text" name="royalties" class="form-control" placeholder="Enter royalties" onChange={this.handleChange.bind(this, "royalties")} value={this.state.fields["royalties"]}/>
                        </div>
                    </div>
                    <div class="col-12 col-md-12 col-lg-12 col-xl-12">
                        <div class="sign__group">
                            <span class="nameInput color_white">Description</span>
                            <textarea name="description" class="form-control" placeholder="Enter description"  onChange={this.handleChange.bind(this, "description")} value={this.state.fields["description"]}></textarea>
                        </div>
                    </div>
                    <div class="col-12">
                        <div>
                            <span class="nameInput color_white">Upload image</span>
                        </div>
                        { this.state.fields["banner"].length === 0 &&
                            <div class="sign__file">
                            {this.coverUpload()}
                            </div>                        
                        }

                        { this.state.fields["banner"].length !== 0 &&
                            <div class="form_preview">
                               <button class="deletecover" onClick={this.deleteBanner}>delete</button>
                               <img src={api.media_path+ "/images/collection/" + this.state.fields["banner"]} />
                            </div>                        
                        }

                    </div>
                    {!this.state.isSubmit &&
                    <div class="bottom-0 left-0 right-0">
                        <div class="container">
                            <div class="row content justify-content-between mb-20_reset">
                            {(this.state.isEdit && this.state.item_count === 0 ) &&

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
                                        this.collectionAction()
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

export default connect(mapStateToProps, {actionNotifyUser})(withRouter(VVCollectionActionVC))
