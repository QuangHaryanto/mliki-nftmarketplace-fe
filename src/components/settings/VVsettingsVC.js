
import React from 'react';
import {
    Link,
    withRouter,
    } from "react-router-dom";
import {connect} from 'react-redux';
import {actionNotifyUser} from './../../redux/NotifyAction'
import { getUser, getProfileAPI, updateProfileAPI } from '../../services/VVUserService';
import VVPermissionVW from '../../UI/permission/VVPermissionVW';
import { toast } from 'react-toastify';
import NetworkActions from '../../redux/actions/NetworkActions'

class VVsettingsVC extends React.Component {
  constructor() {
    super()
    this.state = {
       profileId: '',
       has_permission: true,
       fields: {
        username: "",
        first_name: "",
        last_name: "",
        email: "",
        description: "",
        website_url: "",
        facebook_url: "",
        twitter_url: "",
        linkedin_url: "",
        instagram_url: ""
       },
    }
  }
  componentDidMount() {
     this.initFields();
  }
  initFields = () => {
    let user = getUser();
    if(user!==null) {
        var pathArray = this.props.location.pathname.split("/")
        let profileId = pathArray[pathArray.length-2]
        this.setState({
            profileId: profileId
        })
        if(user.user_id === profileId) {
            this.setState({
                has_permission: true
            })
           this.getProfileInfo(profileId)
        } else {
            this.setState({
                has_permission: false
            })
        }
    } else {
        this.setState({
            has_permission: false
        })
    }
  }

  getProfileInfo = (profileId) => {
    getProfileAPI(profileId).then(result=>{
       if(result.status === true) {
          let currentUser = result.result
          this.setState({
            fields: {
                username: currentUser.username,
                first_name: currentUser.first_name,
                last_name: currentUser.last_name,
                email: currentUser.email,
                description: currentUser.description,
                website_url: currentUser.website_url,
                facebook_url: currentUser.facebook_url,
                twitter_url: currentUser.twitter_url,
                linkedin_url: currentUser.linkedin_url,
                instagram_url: currentUser.instagram_url,
            }
          })
       }
    })
  }
  

  componentDidUpdate(prevProps) {
    if(this.props.notifier !==prevProps.notifier) {
      this.initFields()
    }
  }

  handleChange = (field, e) => {
    let fields = this.state.fields;
    fields[field] = e.target.value;
    this.setState({ fields });
  }

  updateProfile = () => {
      if(this.validateFields()) {
          var params = this.state.fields;
          params["type"] = "general"
          updateProfileAPI(this.state.profileId,params).then(result=>{
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
                 this.props.history.push("/profile/"+ this.state.profileId + '/collected');
              } else {
                toast(result.message,{
                    type: "error"
                });
              }
          })
      }
  }

  validateFields = () => {
      if(this.state.fields["username"].trim().length===0) {
        toast("Username is required",{
            type: "error"
          });
          return false
      }

      if(this.state.fields["username"].trim().length>32) {
        toast("Username should not exceed 32 characters",{
            type: "error"
          });
          return false
      }

      if(this.state.fields["email"].trim().length===0) {
        toast("Email is required",{
            type: "error"
          });
          return false
      }
      const emailregex = /^((?!\.)[\w\-_.]*[^.])(@\w+)(\.\w+(\.\w+)?[^.\W])$/;
      if(!emailregex.test(this.state.fields["email"])) {
        toast("Invalid Email",{
            type: "error"
        });
        return false
      }

      if(this.state.fields["first_name"].trim().length===0) {
        toast("First name is required",{
            type: "error"
          });
          return false
      }

      if (!this.state.fields["first_name"].match(/^[a-zA-Z]+$/)) {
        toast("First name should be letters",{
            type: "error"
          });
          return false
      }

      if(this.state.fields["first_name"].trim().length>32) {
        toast("First name should not exceed 32 characters",{
            type: "error"
          });
          return false
      }

      if(this.state.fields["last_name"].trim().length===0) {
        toast("Last name is required",{
            type: "error"
          });
          return false
      }

      if (!this.state.fields["last_name"].match(/^[a-zA-Z]+$/)) {
        toast("Last name should be letters",{
            type: "error"
          });
          return false
      }

      if(this.state.fields["last_name"].trim().length>32) {
        toast("Last name should not exceed 32 characters",{
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

      let urlRegex = /^(?:http(s)?:\/\/)?[\w.-]+(?:\.[\w\.-]+)+[\w\-\._~:/?#[\]@!\$&'\(\)\*\+,;=.]+$/;
      if(this.state.fields["website_url"].trim().length>0) {
        if(!urlRegex.test(this.state.fields["website_url"])) {
            toast("Invalid website url",{
                type: "error"
             });
             return false
        }
      }

      if(this.state.fields["facebook_url"].trim().length>0) {
        if(!urlRegex.test(this.state.fields["facebook_url"])) {
            toast("Invalid url",{
                type: "error"
             });
            return false
        }
      }

      if(this.state.fields["twitter_url"].trim().length>0) {
        if(!urlRegex.test(this.state.fields["twitter_url"])) {
            toast("Invalid url",{
                type: "error"
             });
            return false
        }
      }

      if(this.state.fields["instagram_url"].trim().length>0) {
        if(!urlRegex.test(this.state.fields["instagram_url"])) {
            toast("Invalid url",{
                type: "error"
             });
            return false
        }
      }

      if(this.state.fields["linkedin_url"].trim().length>0) {
        if(!urlRegex.test(this.state.fields["linkedin_url"])) {
            toast("Invalid url",{
                type: "error"
             });
            return false
        }
      }
      return true
  }

  render() {
    return (
    <form action="#" class="box in__upload profiled mb-120">
        { this.state.has_permission &&
            <div class="row">
            <div class="col-12">
                <h3 class="color_white mb-20">Update Profile</h3>
            </div>

            <div class="col-12 col-md-6 col-lg-12 col-xl-6">
                <div class="sign__group">
                     <span class="nameInput color_white">Username</span>
                    <input id="username" type="text" name="username" class="form-control" placeholder="Enter username" onChange={this.handleChange.bind(this, "username")} value={this.state.fields["username"]}/>
                </div>
            </div>

            <div class="col-12 col-md-6 col-lg-12 col-xl-6">
                <div class="sign__group">
                    <span class="nameInput color_white">Email</span>
                    <input id="email" type="text" name="email" class="form-control" placeholder="Enter email" onChange={this.handleChange.bind(this, "email")} value={this.state.fields["email"]} />
                </div>
            </div>

            <div class="col-12 col-md-6 col-lg-12 col-xl-6">
                <div class="sign__group">
                    <span class="nameInput color_white">First name</span>
                    <input id="first_name" type="text" name="first_name" class="form-control" placeholder="Enter first name"  onChange={this.handleChange.bind(this, "first_name")} value={this.state.fields["first_name"]} />
                </div>
            </div>

            <div class="col-12 col-md-6 col-lg-12 col-xl-6">
                <div class="sign__group">
                    <span class="nameInput color_white">Last name</span>
                    <input id="last_name" type="text" name="last_name" class="form-control" placeholder="Enter last name"  onChange={this.handleChange.bind(this, "last_name")} value={this.state.fields["last_name"]} />
                </div>
            </div>

            <div class="col-12 col-md-12 col-lg-12 col-xl-12">
                <div class="sign__group">
                    <span class="nameInput color_white">Description</span>
                    <textarea name="description" class="form-control" placeholder="Enter description"  onChange={this.handleChange.bind(this, "description")} value={this.state.fields["description"]}></textarea>
                </div>
            </div>

            <div class="col-12 col-md-6 col-lg-12 col-xl-6">
                <div class="sign__group">
                <span class="nameInput color_white">Website</span>
                    <input id="website" type="text" name="website_url" class="form-control" placeholder="Website url" onChange={this.handleChange.bind(this, "website_url")} value={this.state.fields["website_url"]}/>
                </div>
            </div>

            <div class="col-12 col-md-6 col-lg-12 col-xl-6">
                <div class="sign__group">
                <span class="nameInput color_white">Facebook</span>
                    <input id="facebook" type="text" name="facebook_url" class="form-control" placeholder="Facebook url"  onChange={this.handleChange.bind(this, "facebook_url")} value={this.state.fields["facebook_url"]}/>
                </div>
            </div>

            <div class="col-12 col-md-6 col-lg-12 col-xl-6">
                <div class="sign__group">
                <span class="nameInput color_white">Twitter</span>
                    <input id="twitter" type="text" name="twitter_url" class="form-control" placeholder="Twitter url"  onChange={this.handleChange.bind(this, "twitter_url")} value={this.state.fields["twitter_url"]}/>
                </div>
            </div>

            <div class="col-12 col-md-6 col-lg-12 col-xl-6">
                <div class="sign__group">
                <span class="nameInput color_white">Instagram</span>
                    <input id="instagram" type="text" name="instagram_url" class="form-control" placeholder="Instagram url"  onChange={this.handleChange.bind(this, "instagram_url")} value={this.state.fields["instagram_url"]}/>
                </div>
            </div>

            <div class="col-12">
                <a class="btn btn-grad btn_create" aria-describedby="popup-109" href="javascript:void(0)" onClick={()=>{
                    this.updateProfile()
                }}>Save</a>
                <a class="btn btn-grad btn_create" aria-describedby="popup-109" href="javascript:void(0)" onClick={this.props.history.goBack}>Cancel</a>
            </div>
            </div>
        }

        { this.state.has_permission === false &&
           <VVPermissionVW />
        }

    </form>
    );
  }
}

function mapStateToProps(state) {
	return {
	  notifier: state.notifier
	};
}

function mapDispatchToProps(dispatch) {
    return {
      setNetworkName: data => dispatch(NetworkActions.changeNetwork(data))
    };
  }
export default connect(mapStateToProps, mapDispatchToProps)(withRouter(VVsettingsVC))
