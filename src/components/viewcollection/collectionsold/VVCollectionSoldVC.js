
import React from 'react';
import VVAssetVW from '../../../UI/asset/VVAssetVW';
import { getItemListAPI } from '../../../services/VVItemService';
import { detailAPI } from '../../../services/VVCollectionService';
import VVnodataVW from '../../../UI/nodata/VVnodataVW'
import InfiniteScroll from 'react-infinite-scroll-component';
import {
  BrowserRouter as Router,
  withRouter,
  } from "react-router-dom";
  import {connect} from 'react-redux';
import VVItemModal from '../../../models/VVItemModal';
class VVCollectionSoldVC extends React.Component {
  constructor() {
    super();
    this.page = 1;
    this.loading = false;
    this.user = null;
    this.firstTime = false
    this.collectionId = null;
    this.state = {
      skeleton: [1,1,1,1,1,1,1,1,1,1,1,1],
      items: [],
      paging: false,
      loading: true,
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
      var pathArray = this.props.location.pathname.split("/")
      this.collectionId = pathArray[pathArray.length-2]
      this.setState({
        items: [],
        loading: true,
        paging: false,
      });
      this.page = 1;
      this.getCollectionInfo()

  }

  getCollectionInfo = () =>{
    detailAPI(this.collectionId).then(result=>{
      this.collectionDetails = result.result;
      this.itemAPIAction(this.page);
    })
  }

  itemAPIAction = (page) => {
    var params = {
      type: "mycollection",
      sortby:"sold",
      collection_id: this.collectionId,
      page: page,
      user_id: this.collectionDetails.author_id._id
    };
    getItemListAPI(params).then(result=>{
      if(result.status === true) {
        var tempArray = VVItemModal.parseItemList(result.data.docs);
        var items = this.state.items
        if(page !== 1) {
           for (let index = 0; index < tempArray.length; index++) {
            items.push(tempArray[index])
           }
        } else {
            items = tempArray 
        }
        this.setState({
          loading: false,
          paging: result.data.docs.length>0 ? true : false,
          items: items
        })
      }
    })
  }

  fetchMoreData = () => {
    this.page = this.page + 1;
    this.itemAPIAction(this.page)
  }

  render() {
    return (
      <>
      <div class="item-grid">
        { this.state.loading &&
          <div className="row row--grid">
          {this.state.skeleton.map((item, index) => (
            <div class="col-sm-12 col-md-6 col-lg-4">
                <VVAssetVW skeleton="true" data={null} />
            </div>
          ))}
          </div> 
        }

      { (!this.state.loading && this.state.items.length>0) &&
        <InfiniteScroll
        dataLength={this.state.items.length}
        next={this.fetchMoreData}
        hasMore={this.state.paging}
      >
        <div className="row row--grid"> 
          {this.state.items.map((item, index) => (
             <div class="col-sm-12 col-md-6 col-lg-4">
                <VVAssetVW skeleton="false" data={item} />
             </div>
          ))}
         </div> 
      </InfiniteScroll>
    }

        { (!this.state.loading && this.state.items.length===0) &&
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

export default connect(mapStateToProps, {})(withRouter(VVCollectionSoldVC))