
import React from 'react';
import { toast } from 'react-toastify';
import {
  BrowserRouter as Router,
  Link,
  withRouter,
  Switch,
  Route,
  Redirect
  } from "react-router-dom";
import {connect} from 'react-redux';
import {actionNotifyUser} from './../../redux/NotifyAction'
import { detailAPI, getRoyaltyStatus } from '../../services/VVCollectionService';
import VVCollectionModal from '../../models/VVCollectionModal';
import { api } from '../../helper/VVApi';
import { getUser } from '../../services/VVUserService';
import {copyToClipboard} from '../../hooks/copyHook'
import { config } from '../../helper/VVConfig';
class VVCollectionViewVC extends React.Component {
  constructor() {
    super()
    this.currentCollection = null;
    this.state = {
      collectionId: '',
      path: '',
      banner: "/images/bg/bg.png",
      profile_image: "/images/avatars/avatar5.jpg",
      is_verified: false,
      author_id: '',
      name: '',
      address: '',
      item_count: 0,
      item_count_str: '',
      volume_traded: 0,
      volume_traded_str: '',
      royalties: 0,
      desc: '',
      status: 0,
      is_owner: false,
      showRoyalty: false
    }
  }

  componentDidMount() {
    this.setPath(this.props.location.pathname, true)    
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

  setPath = (pathname, force) => {
    var pathArray = pathname.split("/")
    let path;
    let collectionId;
    if(pathArray.length==3) {
        path = 'created';
        collectionId = pathArray[pathArray.length-1]
        this.setState({
            path: path,
            collectionId: collectionId
        })
    } else {
        path = pathArray[pathArray.length-1]
        collectionId = pathArray[pathArray.length-2]
        this.setState({
            path: path,
            collectionId: collectionId
        })
    }
    if((collectionId != this.state.collectionId) || force) {
      this.getCollectionInfo(collectionId);
    }
  }

  changepriceformat = (price) => {
      let decimallength = 0
      let numStr = String(price)
      let formattedprice = price
      if (numStr.includes('.')) {
          decimallength = numStr.split('.')[1].length
          if (decimallength > 6) {
              formattedprice = parseFloat(formattedprice).toFixed(6)
          }
      }
      return formattedprice
  }

  getCollectionInfo = (collectionId) =>{
    detailAPI(collectionId).then(result=>{
      this.currentCollection = result.result;
      let profile_image = "/images/avatars/avatar5.jpg";
      if(this.currentCollection.author_id.profile_image.length!==0) {
        let thumbArray = this.currentCollection.author_id.profile_image.split(".")
        profile_image = api.media_path+"/images/user/"  + thumbArray[0] + "." + thumbArray[1]
      }

      let banner = "/images/bg/bg.png";
      if(this.currentCollection.banner) {
        if(this.currentCollection.banner.length!==0) {
          banner = api.media_path+"/images/collection/" + this.currentCollection.banner;
        }
      }
      let is_owner = false;
      let user = getUser();
      if(user) {
        if(user.user_id === this.currentCollection.author_id._id) {
          is_owner = true
        }
      }
      this.setState({
        name: this.currentCollection.name,
        royalties: this.currentCollection.royalties.toString(),
        item_count: this.currentCollection.item_count,
        item_count_str: VVCollectionModal.getShortenNum(this.currentCollection.item_count),
        volume_traded: this.currentCollection.volume_traded,
        volume_traded_str: this.changepriceformat(this.currentCollection.volume_traded),
        address: this.currentCollection.contract_address,
        desc: this.currentCollection.description,
        status: this.currentCollection.status,
        author_id: this.currentCollection.author_id._id,
        is_verified: this.currentCollection.author_id.is_verified,
        profile_image: profile_image,
        banner: banner,
        is_owner: is_owner
      })
      this.getRoyalties()
    })
  }

  getRoyalties = () => {
    getRoyaltyStatus(this.currentCollection._id).then(result=>{
        this.setState({
          showRoyalty: result.status
        })
    })
  }

  copyAddress() {
    copyToClipboard(this.state.address);
    toast("Contract Address copied",{
      type: "success"
    });
  }



  editAction = () => {
    this.props.actionNotifyUser({type:"clear",payload:{}});
    this.props.history.push("/addcollection/"+this.currentCollection._id);
  }

  addAction = () => {
    this.props.history.push("/upload-options/"+this.currentCollection._id);
  }

  render() {
    return (
     <>
           <div className='mb-100'>
      <div className="hero__profile">
        <div className="cover">
          <img src={this.state.banner}   alt="ImgPreview" />
        </div>
        <div className="infos">
          <div className="container">
            <div className="row flex-wrap align-items-center justify-content-between sm:space-y-50">
              <div className="col-md-auto mr-20">
                <div className="avatars d-flex space-x-20 align-items-center">
                  <div className="avatar_wrap">
                  <Link
                        to={"/profile/"+this.state.author_id}>
                    <img
                      className="avatar avatar-lg"
                      src={this.state.profile_image}
                      alt="avatar"
                    />
                        </Link>

                  </div>
                  <h5>{this.state.name}</h5>
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
                    {this.state.is_owner &&
                      <button class="btn btn-dark btn-sm 'btn-prim" type="button" onClick={()=>{
                        this.editAction()
                      }}>Edit</button>
                    }

                    </div>
                    {this.state.is_owner &&
                    <div className="mb-20">
                     <button class="btn btn-dark btn-sm 'btn-prim" type="button" onClick={()=>{
                        this.addAction()
                      }}>Add Item</button>
                    </div>
                    }
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      </div>


      <div class="container">
           <div className="row justify-content-center">
           <div className="col-lg-3 col-md-7 order-md-0 order-1">
           <div className="profile__sidebar">
      <div className="space-y-40">
        <div className="space-y-10">
          <h5 className="color_white">About Collection</h5>
          <div className="box space-y-20">
            <p className="color_white">
            {this.state.desc}
            </p>
            <div className="row">
              <div className="col-6">
                <span className="txt_sm color_white">Royalty</span>
                <h4 className="color_white">{this.state.royalties}%</h4>
                
              </div>
              <div className="col-6">
                <span className="txt_sm color_white">Volume</span>
                {this.state.volume_traded === 0 &&
                   <h4 className="color_white">NO</h4>
                }

                {this.state.volume_traded !== 0 &&
                   <h4 className="color_white">{this.state.volume_traded_str}</h4>
                }
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>

            </div>
             
               <div className="col-lg-9 col-md-12 order-md-1 order-0">
              <div class="tabsContainer">
               <div className="d-flex space-x-10 mb-30 nav-tabs">
                      <div>
                          <Link to={"/collection/"+this.state.collectionId+"/created"} className={"nav-btn btn btn-white btn-sm  " + (this.state.path == "created" ? 'btn-primary' : '')}>Created</Link>
                      </div>

                      <div>
                          <Link to={"/collection/"+this.state.collectionId+"/onauction"} className={"btn btn-white btn-sm  " + (this.state.path == "onauction" ? 'btn-primary' : '')}>On Auction</Link>
                      </div>
              
                      <div>
                          <Link to={"/collection/"+this.state.collectionId+"/sold"}  className={"btn btn-white btn-sm  " + (this.state.path == "sold" ? 'btn-primary' : '')}>Sold</Link>
                      </div>
                  
                      <div>
                            <Link to={"/collection/"+this.state.collectionId+"/activity"}  className={"btn btn-white btn-sm  " + (this.state.path == "activity" ? 'btn-primary' : '')}>Activity</Link>
                      </div>
                </div>
              </div>


                    <div class="tab-content">
                        <Switch>
                           <Redirect exact from={"/collection/"+this.state.collectionId} to={"/collection/"+this.state.collectionId + "/created"} />
                            {this.props.routes.map((route, i) => (
                                <Route 
                                path={route.path}
                                exact={route.exact}
                                render={props => (
                                    <route.component {...props} path={this.state.path} />
                                )}
                                />
                            ))} 
                        </Switch>
                    </div>
              </div>
          </div>
        </div>
     
     </>

    );
  }
}

function mapStateToProps(state) {
	return {
	  notifier: state.notifier
	};
}
export default connect(mapStateToProps, {actionNotifyUser})(withRouter(VVCollectionViewVC))
