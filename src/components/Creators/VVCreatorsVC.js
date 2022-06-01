
import React from 'react';
import { Link, withRouter } from 'react-router-dom';
import VVAuthorVW from '../../UI/author/VVAuthorVW'
import VVnodataVW from '../../UI/nodata/VVnodataVW'
import InfiniteScroll from 'react-infinite-scroll-component';
import { getUserListAPI, getUser, connectionAPI } from '../../services/VVUserService';
import VVUserModel from '../../models/VVUserModel';
import axios from "axios";
import {connect} from 'react-redux';
class VVCreatorsVC extends React.Component {
  constructor() {
    super()
    this.page = 1;
    this.user = null;
    this.cancelTokenSource = null;
    this.loading = false
    this.sortby = "latest"
    this.type = "all"
    this.keyword = ""
    this.state = {
      creators: [],
      skeleton: [1,1,1,1,1,1,1,1,1,1,1,1],
      paging: false,
      keyword: '',
      sortby: "latest",
      type: "all",
      loading: true,
      isLogged: false
    }
  }

  componentDidMount() {
    this.initData()
  }

  componentDidUpdate(prevProps) {
    if(this.props.notifier !==prevProps.notifier) {
      this.initData()
    }
  }

  initData = () => {
    this.user = getUser();
    this.setState({
      isLogged: (this.user === null) ? false : true,
      creators: [],
      loading: true,
      paging: false,
      keyword: '',
      sortby: "latest",
      type: "all",
    });
    this.page = 1;
    this.sellerAPIAction(this.keyword,this.page);
  }

  sellerAPIAction = (keyword,page) => {
    var params = {
      keyword: keyword,
      sortby: this.sortby,
      type: this.type,
      page: this.page
    };
    if(this.user !== null) {
      params["user_id"] = this.user.user_id
    }
    this.cancelTokenSource = axios.CancelToken.source();
    getUserListAPI(params, this.cancelTokenSource).then(result=>{
      if(result.status === true) {
        this.cancelTokenSource = null;
        var tempArray = VVUserModel.parseSellerList(result.data.docs);
        var creators = this.state.creators
        if(page !== 1) {
           for (let index = 0; index < tempArray.length; index++) {
             creators.push(tempArray[index])
           }
        } else {
          creators = tempArray 
        }
        this.setState({
          loading: false,
          paging: result.data.docs.length>0 ? true : false,
          creators: creators
        })
      }
    })
  }

  fetchMoreData = () => {
    this.page = this.page + 1;
    this.sellerAPIAction(this.keyword,this.page)
  }

  changeSortby = (e) => {
    this.page = 1;
    this.sortby = e.target.value;
    this.setState({
      creators: [],
      loading: true,
      paging: false,
      sortby: this.sortby,
    });
    this.sellerAPIAction(this.keyword,this.page)
  } 

  changeType = (e) => {
    this.page = 1;
    this.type = e.target.value;
    this.setState({
      creators: [],
      loading: true,
      paging: false,
      type: this.type,
    });
    this.sellerAPIAction(this.keyword,this.page)
  }

  changeKeyword = (e) => {
    this.page = 1;
    let search_text = e.target.value;
    this.keyword = search_text;
    if(this.cancelTokenSource) {
      this.cancelTokenSource.cancel();
    }
    this.setState({
      creators: [],
      loading: true,
      paging: false,
      keyword: e.target.value,
    });
    this.sellerAPIAction(this.keyword,this.page)
  }

  followAction = (item) =>{
    let current_is_following = item.is_follow;
    var params = {
      status : current_is_following === 0 ? 1: 2,
      user_id: item.user_id
    }
    var follow_count = item.follower_count;
    if(current_is_following === 0) {
      follow_count = follow_count + 1;
    } else {
      follow_count = follow_count - 1;
    }
    var creators = this.state.creators
    for (let index = 0; index < creators.length; index++) {
      const element = this.state.creators[index];
      if(element.user_id === item.user_id) {
        element.is_follow = current_is_following === 0 ? 1 : 0
        element.follower_count = follow_count
        element.follower_count_str  =  VVUserModel.getShortenNum(element.follower_count)
      }
    }
    this.setState({
      creators: creators
    })
     connectionAPI(params).then(result=>{
       console.log(result);
     })
  }

  render() {
    return (
      <div className="container">

        <div className="row row--grid mb-30">
          <div className="col-12">
            <div className="main__title main__title--page">
              <h1>Creators</h1>
            </div>
          </div>
        </div>

    
    { this.state.loading &&
        <div className="row row--grid">
        {this.state.skeleton.map((item, index) => (
          <div class="col-sm-12 col-md-6 col-lg-3">
              <VVAuthorVW skeleton="true" data={null} />
           </div>
        ))}
       </div> 
    }

    { (!this.state.loading && this.state.creators.length>0) &&
        <InfiniteScroll
        dataLength={this.state.creators.length}
        next={this.fetchMoreData}
        hasMore={this.state.paging}
      >
        <div className="row row--grid"> 
          {this.state.creators.map((item, index) => (
             <div class="col-sm-12 col-md-6 col-lg-3">
                <VVAuthorVW skeleton="false" data={item} isLogged={this.state.isLogged} follow={this.followAction} />
             </div>
          ))}
         </div> 
      </InfiniteScroll>
    }

    { (!this.state.loading && this.state.creators.length===0) &&
      <VVnodataVW />
    }

     
      </div>
    );
  }
}

function mapStateToProps(state) {
	return {
	  notifier: state.notifier
	};
}
export default connect(mapStateToProps)(withRouter(VVCreatorsVC))