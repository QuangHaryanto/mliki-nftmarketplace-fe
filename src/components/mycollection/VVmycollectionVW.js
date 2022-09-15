
import React from 'react';
import VVCollectionVW from '../../UI/collection/VVCollectionVW';
import { listAPI } from '../../services/VVCollectionService';

import VVCollectionModal from '../../models/VVCollectionModal';
import VVnodataVW from '../../UI/nodata/VVnodataVW'
import InfiniteScroll from 'react-infinite-scroll-component';
import { getUser } from '../../services/VVUserService';
import {
  BrowserRouter as Router,
  Link,
  withRouter,
  } from "react-router-dom";
import {connect} from 'react-redux';
import {actionNotifyUser} from './../../redux/NotifyAction'

class VVmycollectionVW extends React.Component {
  constructor() {
    super();
    this.page = 1;
    this.loading = false;
    this.user = null;
    this.firstTime = false
    this.state = {
      skeleton: [1,1,1,1,1,1,1,1,1,1,1,1],
      collections: [],
      paging: false,
      loading: true,
    }
  }

  componentDidMount() {
    this.initData();
    this.props.actionNotifyUser({
      type: 'dummy',
      payload: {}
    });
  }

  componentDidUpdate(prevProps) {
    if(this.props.notifier !==prevProps.notifier) {
      this.initData()
    }
  }

  initData = () => {
    
      this.user = getUser();
      if(this.user == null) {
        this.setState({
          collections: [],
          paging: false,
          loading: false,
        })
        return
      }
      var pathArray = this.props.location.pathname.split("/")
      let profileId = pathArray[pathArray.length-2]
      if(this.user.user_id !== profileId) {
        this.setState({
          collections: [],
          paging: false,
          loading: false,
        })
        return
      }
      this.setState({
        collections: [],
        loading: false,
        paging: false,
      });
      this.page = 1;
      this.collectionAPIAction(this.page);

  }

  collectionAPIAction = (page) => {
    var params = {
      type: "my",
      page: page
    };
    listAPI(params).then(result=>{
      if(result.status === true) {
        var tempArray = VVCollectionModal.parseCollectionList(result.data.docs);
        var collections = this.state.collections
        if(page !== 1) {
           for (let index = 0; index < tempArray.length; index++) {
            collections.push(tempArray[index])
           }
        } else {
          collections = tempArray 
        }
        this.setState({
          loading: false,
          paging: result.data.docs.length>0 ? true : false,
          collections: collections
        })
      }
    })
  }

  fetchMoreData = () => {
    this.page = this.page + 1;
    this.collectionAPIAction(this.page)
  }

  render() {
    return (
      <>
        <section class="row row--grid">
          <div class="col-12">
            <div class="main__title mb-20">
              <h2>Collections</h2>              
            </div>
          </div>
        </section>
      

      <div>
        { this.state.loading &&
          <div className="row row--grid">
          {this.state.skeleton.map((item, index) => (
            <div class="col-sm-12 col-md-6 col-lg-4">
                <VVCollectionVW skeleton="true" data={null} />
            </div>
          ))}
          </div> 
        }

      { (!this.state.loading && this.state.collections.length>0) &&
        <InfiniteScroll
        dataLength={this.state.collections.length}
        next={this.fetchMoreData}
        hasMore={this.state.paging}
      >
        <div className="row row--grid"> 
          {this.state.collections.map((item, index) => (
             <div class="col-sm-12 col-md-6 col-lg-6">
                <VVCollectionVW skeleton="false" data={item} />
             </div>
          ))}
         </div> 
      </InfiniteScroll>
    }

        { (!this.state.loading && this.state.collections.length===0) &&
          <VVnodataVW />
        }
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

export default connect(mapStateToProps, {actionNotifyUser})(withRouter(VVmycollectionVW))
