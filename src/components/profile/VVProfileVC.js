
import React from 'react';
import {
BrowserRouter as Router,
Link,
withRouter,
Switch,
Route,
Redirect
} from "react-router-dom";
import { getProfileAPI, getUser, updateProfileAPI, connectionAPI, verifyAPI, confirmAPI, userViewAPI } from '../../services/VVUserService';
import VVUserModel from '../../models/VVUserModel';
import { toast } from 'react-toastify';
import {connect} from 'react-redux';
import Uploady from "@rpldy/uploady";
import UploadButton from "@rpldy/upload-button";
import { api } from '../../helper/VVApi';
import {actionNotifyUser} from './../../redux/NotifyAction'

import {UploadHook} from './../../hooks/uploadHook'
import { Button, Modal }  from 'react-bootstrap';
import { copyToClipboard } from '../../hooks/copyHook';
import { config } from '../../helper/VVConfig';

class VVProfileVC extends React.Component {
  constructor() {
    super()
    this.toast = null
    this.currentUser = null
    this.state = {
        path: 'collected',
        profileId: '',
        showMenu: true,
        follow_count: 0,
        follow_count_str: '',
        creation_count: 0,
        creation_count_str: '',
        is_following: 0,
        followText: "Follow",
        isLoggedIn: false,
        isOwner: false,
        profile_cover: "/images/bg/bg.png",
        profile_image: "/images/avatars/avatar5.jpg",
        user_id: '',
        user_name: '',
        full_name: '',
        description: '',
        address: '',
        user_balance: '',
        is_verified: false,
        otp: '',
        showVerify: false,
        website_url: '',
        facebook_url: '',
        twitter_url: '',
        instagram_url: '',
        linkedin_url: '',
        
    }
  }
  componentDidMount() {
    this.setPath(this.props.location.pathname, true)    
  }

  getProfileInfo = (userId) => {
    getProfileAPI(userId).then(result=>{
       console.log("user info",result);
       if(result.status === true) {
          this.currentUser = result.result;
          let profile_image = "/images/avatars/avatar5.jpg";
          if(this.currentUser.profile_image.length!==0) {
            let thumbArray = this.currentUser.profile_image.split(".")
            profile_image = api.media_path+"/images/user/" + thumbArray[0] + "." + thumbArray[1]
          }

          let profile_cover = "/images/bg/bg.png";
          if(this.currentUser.profile_cover) {
            if(this.currentUser.profile_cover.length!==0) {
              profile_cover = api.media_path+"/images/cover/" + this.currentUser.profile_cover;
            }
          }

          let username = "";
          if(this.currentUser.first_name.length!==0) {
              username = this.currentUser.first_name + " " + this.currentUser.last_name;
          } else {
             username = this.currentUser.username
          }
          let user = getUser();
          let isLoggedIn = false;
          let isOwner = false
          if(user !== null) {
            isLoggedIn = true;
            isOwner = (this.currentUser._id === user.user_id) ? true : false
          }
          this.setState({
            profile_image: profile_image,
            profile_cover: profile_cover,
            user_name: this.currentUser.username,
            full_name: username,
            is_verified: this.currentUser.is_verified,
            description: this.currentUser.description,
            address: this.currentUser.public_key,
            website_url: this.currentUser.website_url,
            facebook_url: this.currentUser.facebook_url,
            twitter_url: this.currentUser.twitter_url,
            linkedin_url: this.currentUser.linkedin_url,
            instagram_url: this.currentUser.instagram_url,
            is_following: result.is_follow === 1 ? 1 : 0,
            followText: result.is_follow === 1 ? "UnFollow" : "Follow",
            follow_count: this.currentUser.follower_count,
            follow_count_str: VVUserModel.getShortenNum(this.currentUser.follower_count),
            creation_count: result.creations,
            creation_count_str: VVUserModel.getShortenNum(result.creations),
            isOwner: isOwner,
            isLoggedIn: isLoggedIn
          })
          if(user !== null && !isOwner) {
            this.addProfileView();
          }
       }
    })
  }

  addProfileView = () => {
       userViewAPI({
         profile_id: this.state.profileId
       }).then(result=>{
       });
  }

  setPath = (pathname, force) => {
    var pathArray = pathname.split("/")
    console.log(pathArray);
    let path;
    let profileId;
    if(pathArray.length==3) {
        path = 'collected';
        profileId = pathArray[pathArray.length-1]
        this.setState({
            path: path,
            profileId: profileId
        })
    } else {
        path = pathArray[pathArray.length-1]
        profileId = pathArray[pathArray.length-2]
        this.setState({
            path: path,
            profileId: profileId
        })
    }
    if((profileId != this.state.profileId) || force) {
      this.getProfileInfo(profileId);
    }
    if(path === "settings" || path === "notification") {
      this.setState({
        showMenu : false,
      })
    } else {
      this.setState({
        showMenu : true,
      })
    }
  }
  componentDidUpdate(prevProps) {
    if (
      this.props.location.pathname !== prevProps.location.pathname
    ) {
      window.scrollTo(0, 0);
	  this.setPath(this.props.location.pathname, false)
    }

    if(this.props.notifier !==prevProps.notifier) {
      this.setPath(this.props.location.pathname, true)
    }
  }

  copyAddress() {
    copyToClipboard(this.state.address);
    toast("Address copied",{
      type: "success"
    });
  }

  avatarUpload = () => {
    if(this.state.isOwner) {
      return <Uploady 
      accept="image/*"
      destination={{ url: api.base + "/media/avatar" }}>
      <UploadButton className="avatarUploader" text="EDIT"/>
      <UploadHook onDone={this.avatarUploadDone} onError={this.avatarUploadError}/>
      </Uploady>
    } else {
      return <div></div>
    }

  }

  avatarUploadDone = (profile_image)=> {
      updateProfileAPI(this.currentUser._id,{
        profile_image: profile_image,
        type: "profile"
      }).then(result=>{
        if(result.status === true) {
          localStorage.setItem("token",result.token);
          let user = getUser();
           this.props.actionNotifyUser({
               type: 'update',
               payload: user
           });
           toast(result.message,{
              type: "success"
           });
        } else {
          toast(result.message,{
              type: "error"
          });
        }
      })
  }

  avatarUploadError = (message)=> {
    toast(message,{
      type: "success"
   });
  }

  coverUpload = () => {
    if(this.state.isOwner) {
      return <Uploady 
      accept="image/*"
      destination={{ url: api.base + "/media/cover" }}>
      <UploadButton className="coverUploader" text="Change Cover"/>
      <UploadHook onDone={this.coverUploadDone} onError={this.avatarUploadError}/>
      </Uploady>
    } else {
      return <div></div>
    }
  }

  coverUploadDone = (profile_cover)=> {
    updateProfileAPI(this.currentUser._id,{
      profile_cover: profile_cover,
      type: "cover"
    }).then(result=>{
      if(result.status === true) {
        this.setState({
          profile_cover : api.media_path+"/images/cover/" + profile_cover
        })
        toast(result.message,{
          type: "success"
        });
      } else {
        toast(result.message,{
            type: "error"
        });
      }
    })
  }

  followAction = () => {
   let current_is_following = this.state.is_following;
    var params = {
      status : current_is_following === 0 ? 1: 2,
      user_id: this.state.profileId
    }
    var follow_count = this.state.follow_count;
    if(current_is_following === 0) {
      follow_count = follow_count + 1;
    } else {
      follow_count = follow_count - 1;
    }
     this.setState({
       is_following: current_is_following === 0 ? 1 : 0,
       followText: current_is_following === 0 ? "UnFollow": "Follow",
       follow_count: follow_count,
       follow_count_str: VVUserModel.getShortenNum(follow_count)
     })
     connectionAPI(params).then(result=>{
       console.log(result);
     })
  }

  verifyAction = () => {
    if(this.currentUser.email.trim().length===0) {
      toast("Please update profile before verify your account",{
        type: "error"
      });
      return
    }

    let toastObj =  toast("sending verification otp",{
      closeButton: false,
      autoClose: false,
      isLoading: true
    })
    verifyAPI().then(result=>{
      toast.dismiss(toastObj);
      if(result.status === false) {
         toast(result.message,{
           type: "error"
         });
       return
      }
      this.setState({
        showVerify: true
      })
   });

  }

  closeVerifyModal = () => {
    this.setState({
      showVerify: false,
      otp: ""
    })
  }

  confirmVerifyModal = () => {
    if(this.state.otp.trim().length===0) {
      toast("otp is required",{
        type: "error"
      });
      return
    }
    let toastObj =  toast("confirming verification otp",{
      closeButton: false,
      autoClose: false,
      isLoading: true
    })
    confirmAPI({
      verification_code: this.state.otp
    }).then(result=>{
      toast.dismiss(toastObj);
      if(result.status === false) {
         toast(result.message,{
           type: "error"
         });
       return
      }
      window.location.reload();
   });

    this.setState({
      showVerify: false,
      otp: ""
    })
  }

  handleOTPChange = (e) => {
    let otp = this.state.otp;
    this.setState({ 
      otp: e.target.value
    });
  }

  render() {
    return (
  <div class="profileContainer">
      <div className='mb-100'>
      <div className="hero__profile">
        <div className="cover">
          <img src={this.state.profile_cover}  alt="ImgPreview" />
          {this.coverUpload()}
        </div>
        <div className="infos">
          <div className="container">
            <div className="row flex-wrap align-items-center justify-content-between sm:space-y-50">
              <div className="col-md-auto mr-20">
                <div className="avatars d-flex space-x-20 align-items-center">
                  <div className="avatar_wrap avatar_wrap_new">
                    <img
                      className="avatar avatar-lg"
                      src={this.state.profile_image}
                      alt="avatar"
                    />
                    <div className="edit-center">{this.avatarUpload()}</div>
                  </div>
                  <h5>@{this.state.full_name}</h5>
                </div>
              </div>
              <div className="col-md-auto follow-one">
                <div className="d-sm-flex flex-wrap align-items-center space-x-20 mb-20_reset d-sm-block">
                  <div className="mb-20">
                    <div className="copy" onClick={()=>{
					this.copyAddress()
				}}>
                      <span className="color_text">{this.state.address} </span>
                    </div>
                  </div>
                  <div className="d-flex flex-wrap align-items-center space-x-20">
                    <div className="mb-20">
                    {(this.state.isLoggedIn && !this.state.isOwner) &&
                      <button class="btn btn-dark btn-sm 'btn-prim" type="button" onClick={()=>{
                        this.followAction()
                      }}>{this.state.followText}</button>
                    }

                    </div>
                    {(this.state.isLoggedIn && this.state.isOwner) &&
                    <div className="mb-20">
                      <Link
                        to={"/profile/"+this.state.profileId+"/settings"}
                        className="btn btn-dark btn-sm content space-x-10 d-flex">
                        <span>Edit Profile </span>
                      </Link>
                    </div>
                    }
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        { this.state.path == "notification" && 
        <Link to='/' className='btn btn-white btn-sm my-40 backhomebtn'>Back to home</Link> }
      </div>
      </div>



           <div class="container">
           <div className="row justify-content-center">
           {this.state.showMenu &&
           <div className="col-lg-3 col-md-7 order-md-0 order-1">
           <div className="profile__sidebar">
      <div className="space-y-40">
        <div className="space-y-10">
          <h5 className="color_white">About me</h5>
          <div className="box space-y-20">
            <p className="color_white">
            {this.state.description}
            </p>
            <div className="row">
              <div className="col-6">
                <span className="txt_sm color_white">Followers</span>
                {this.state.follow_count === 0 &&
                   <h4 className="color_white">NO</h4>
                }
                {this.state.follow_count !== 0 &&
                   <h4 className="color_white">{this.state.follow_count_str}</h4>
                }
              </div>
              <div className="col-6">
                <span className="txt_sm color_white">Creations</span>
                {this.state.follow_count === 0 &&
                   <h4 className="color_white">NO</h4>
                }

                {this.state.follow_count !== 0 &&
                   <h4 className="color_white">{this.state.creation_count_str}</h4>
                }
              </div>
            </div>
          </div>
        </div>
        { (this.state.facebook_url.length>0 || this.state.instagram_url.length>0 || this.state.twitter_url.length>0 || this.state.website_url.length>0) &&
        <div className="space-y-10">
          <h5 className="color_white">Follow me</h5>
          <div className="box">
            <ul className="social_profile space-y-10 overflow-hidden">
            { this.state.facebook_url.length>0 &&
              <li>
              <a href={this.state.facebook_url} rel="noreferrer"  target="_blank">
                  <i className="ri-facebook-line" />
                  <span className="color_white">facebook/@{this.state.full_name}</span>
                </a>
              </li>
            }
 { this.state.instagram_url.length>0 &&
              <li>
              <a href={this.state.facebook_url} rel="noreferrer"  target="_blank">
                  <i className="ri-instagram-line" />
                  <span className="color_white"> instagram/@{this.state.full_name}</span>
                  
                </a>
              </li>
  }
   { this.state.twitter_url.length>0 &&
              <li>
              <a href={this.state.twitter_url} target="_blank" rel="noreferrer" >
                  <i className="ri-twitter-line" />
                  <span className="color_white"> twitter/@{this.state.full_name}</span>
                  
                </a>
              </li>
  }
              { this.state.website_url.length>0 &&
              <li>
              <a href={this.state.website_url} target="_blank" rel="noreferrer" >
                  <i className="ri-messenger-line" />
                  <span className="color_white">website/@{this.state.full_name}</span>
                  
                </a>
              </li>
              }
            </ul>
          </div>
        </div>
      }
      </div>
    </div>

            </div>
            }
               
                  <div className="col-lg-9 col-md-12 order-md-1 order-0">
                  {this.state.showMenu &&
                  <div class="tabsContainer">
                  		                    <div className="d-flex space-x-10 mb-30 nav-tabs">
                                            <div>
                            <Link
                              className={"btn btn-white btn-sm " + (this.state.path == "collected" ? 'btn-primary' : '')}
                              to={"/profile/"+this.state.profileId+"/collected"} 
                              >
		                           Owned
		                        </Link>
                                            </div>

                                            <div>
                            <Link
	                              className={"btn btn-white btn-sm " + (this.state.path == "created" ? 'btn-primary' : '')}
                              to={"/profile/"+this.state.profileId+"/created"} 
                              >
		                           Created
		                        </Link>
                                            </div>

                                            <div>
                            <Link
                              className={"btn btn-white btn-sm " + (this.state.path == "activity" ? 'btn-primary' : '')}
                              to={"/profile/"+this.state.profileId+"/activity"} 
                              >
		                           Activity
		                        </Link>
                                            </div>
{this.state.isOwner &&
                                            <div >
                                            <Link
                                                className={"btn btn-white btn-sm " + (this.state.path == "collection" ? 'btn-primary' : '')}
                                              to={"/profile/"+this.state.profileId+"/collection"} 
                                              >
                                               Collections
                                            </Link>
                                                            </div>
}
</div>
</div>
                  }
{this.state.isOwner &&                  
<div class="d-flex space-x-10 mb-30 nav-tabs righttab">
{ ((this.state.path == "collected") || (this.state.path == "created") || (this.state.path == "activity") || (this.state.path == "collection")) &&                                            
    <Link to="/addcollection" class="main__link">
    <svg xmlns="http://www.w3.org/2000/svg" class="bi bi-plus-square" viewBox="0 0 16 16">
    <path d="M14 1a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1h12zM2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2H2z"/>
    <path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4z"/>
    </svg>Add Collection
    </Link>  
  }
</div>
}
                    <div class="tab-content">
                        <Switch>
                           <Redirect exact from={"/profile/"+this.state.profileId} to={"/profile/"+this.state.profileId + "/collected"} />
                            {this.props.routes.map((route, i) => (
                                <Route key={`path_${i}`}
                                path={route.path}
                                exact={route.exact}
                                render={props => (
                                    <route.component {...props} path={this.state.path} profileId={this.state.profileId}/>
                                )}
                                />
                            ))} 
                        </Switch>
                    </div>
                </div>
             </div>
           </div>
          <Modal show={this.state.showVerify} onHide={this.closeVerifyModal}>
            <Modal.Header closeButton>
              <Modal.Title>Verify Account</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <div class="row verifyContent">
              <div class="col-12">
                <div class="sign__group">
                    <input id="otp" type="text" name="otp" class="sign__input" placeholder="Enter OTP" onChange={this.handleOTPChange.bind("otp")} value={this.state.otp}/>
                </div>
              </div>
              </div>
            </Modal.Body>
            <Modal.Footer>
              <Button variant="primary" onClick={this.closeVerifyModal}>
                Close
              </Button>
              <Button variant="primary" onClick={this.confirmVerifyModal}>
                Verify
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

export default connect(mapStateToProps, {actionNotifyUser})(withRouter(VVProfileVC))
