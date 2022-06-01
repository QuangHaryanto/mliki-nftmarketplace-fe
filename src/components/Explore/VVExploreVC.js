
import React from 'react';
import VVAssetVW from '../../UI/asset/VVAssetVW';
import { getItemListExplorerAPI } from '../../services/VVItemService';
import VVnodataVW from '../../UI/nodata/VVnodataVW'
import InfiniteScroll from 'react-infinite-scroll-component';
import { Link } from 'react-router-dom';
import VVItemModal from '../../models/VVItemModal';
import axios from "axios";
import {listAPI} from './../../services/VVCategoryService';
import { allCollectionsAPI } from '../../services/VVCollectionService';
import { getOptions } from '../../services/VVUserService';
class VVExploreVC extends React.Component {
  constructor() {
    super()
    this.page = 1;
    this.loading = false;
    this.user = null;
    this.firstTime = false
    this.collectionId = "";
    this.categoryId= "";
    this.sortby="latest";
    this.keyword = ""
    this.cancelTokenSource = null;
    this.state = {
      skeleton: [1,1,1,1,1,1,1,1,1,1,1,1],
      items: [],
      paging: false,
      loading: true,
      collection_id: "",
      category_id: "",
      sortby: this.sortby,
      keyword: '',
      categories:[],
      collections:[],
      marketplace_title: ''
    }
  }

  componentDidMount() {
    this.setState({
      items: [],
      loading: true,
      paging: false,
    });
    this.page = 1;
    this.getCollections();
    this.getStaticcontent()
  }

  getStaticcontent = () => {
    getOptions('title').then(result=>{
      if(result.status === true) {
        var parse = JSON.parse(result.result.value);
        console.log('parse ->', parse)
        this.setState({
          marketplace_title: parse.marketplace_page_title
        })
      }
    })
  }

  itemAPIAction = (keyword,page) => {
    var params = {
      type: "explorer",
      keyword: keyword,
      sortby:this.sortby,
      collection_id: this.collectionId,
      page:page
    };

    if(this.categoryId.trim().length>0) {
        params["category_id"] = this.categoryId
    }

    if(this.collectionId.trim().length>0) {
      params["collection_id"] = this.collectionId
    }
    this.cancelTokenSource = axios.CancelToken.source();
    getItemListExplorerAPI(params,this.cancelTokenSource).then(result=>{
      if(result.status === true) {
        this.cancelTokenSource = null;
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
    this.itemAPIAction(this.keyword,this.page)
  }

  changeKeyword = (e) => {
    this.page = 1;
    let search_text = e.target.value;
    this.keyword = search_text;
    if(this.cancelTokenSource) {
      this.cancelTokenSource.cancel();
    }
    this.setState({
      items: [],
      loading: true,
      paging: false,
      keyword: e.target.value,
    });
    this.itemAPIAction(this.keyword,this.page)
  }

  changeType = (e) => {
    this.page = 1;
    this.sortby = e;
    this.setState({
      items: [],
      loading: true,
      paging: false,
      sortby: this.sortby,
    });
    this.itemAPIAction(this.keyword,this.page)
  }

  changeCategory = (category_id) => {
    this.page = 1;
    this.categoryId = category_id;
    this.setState({
      items: [],
      loading: true,
      paging: false,
      category_id: this.categoryId,
    });
    this.itemAPIAction(this.keyword,this.page)
  }

  changeCollection = (e) => {
    this.page = 1;
    this.collectionId = e.target.value;
    this.setState({
      items: [],
      loading: true,
      paging: false,
      collection_id: this.collectionId,
    });
    this.itemAPIAction(this.keyword,this.page)
  }

  getCategories = () => {
    listAPI().then(result=>{
      this.setState({
        categories:result.data
      });
      this.itemAPIAction(this.keyword,this.page)
    })
  }

  getCollections = () => {
    allCollectionsAPI().then(result=>{
      this.setState({
        collections:result.data
      });
      this.getCategories()
    })
  }

  render() {
    return (
      <>
      	<div>
		       <div>
		        <div className="hero_marketplace bg_black">
		          <div className="container">
		            <h1 className="text-center color_white">{this.state.marketplace_title}</h1>
		          </div>
		        </div>
		      </div>
		    </div>
        <div className="d-flex justify-content-center">
        <ul className="menu_categories  bg_black py-20 px-15 w-100">
          <li>
          <a className="color_brand" href="javascript:void(0)" onClick={()=>{
                this.changeCategory("")
              }}>
              <span> All </span>
          </a>
          </li>
          {this.state.categories?.map((item, index) => (
            <li>
              <a href="javascript:void(0)" className="color_brand" onClick={()=>{
                this.changeCategory(item._id)
              }}>
                <span>{item.title}</span>
              </a>
            </li>
          ))}
        </ul>
        </div>

      <div className="container">

        <div className="row row--grid">
          <div className="col-12">
            <div>
              <h2 className='mt-40 mb-20 color_white'>Marketplace</h2>
            </div>
          </div>
        </div>
        <div className="row row--grid">
        <div class="col-12">
          <div class="tabsContainer">
        <div className="d-flex space-x-10 mb-30 nav-tabs">
                                            <div>
                            <a
                              className={"btn btn-white btn-sm " + (this.state.sortby == "latest" ? 'btn-primary' : '')}
                              href="javascript:void(0)" 
                              onClick={()=>{
                                this.changeType("latest")
                              }}
                              >
		                           New
		                        </a>
                                            </div>

                                            <div>
                                            <a
                              className={"btn btn-white btn-sm " + (this.state.sortby == "offer" ? 'btn-primary' : '')}
                              href="javascript:void(0)" 
                              onClick={()=>{
                                this.changeType("offer")
                              }}
                              >
		                           On Auction
		                        </a>
                                            </div>

                                            <div>
                                            <a
                              className={"btn btn-white btn-sm " + (this.state.sortby == "mostviewed" ? 'btn-primary' : '')}
                              href="javascript:void(0)" 
                              onClick={()=>{
                                this.changeType("mostviewed")
                              }}
                              >
		                           Most Viewed
		                        </a>
                                            </div>

                                            <div >
<a
                              className={"btn btn-white btn-sm " + (this.state.sortby == "mostliked" ? 'btn-primary' : '')}
                              href="javascript:void(0)" 
                              onClick={()=>{
                                this.changeType("mostliked")
                              }}
                              >
                                               Most Liked
                                            </a>
                                                            </div>



                                          </div>
</div>
				</div>
        </div>
        <div class="item-grid">
        { this.state.loading &&
          <div className="row row--grid">
          {this.state.skeleton.map((item, index) => (
            <div class="col-sm-12 col-md-6 col-lg-3">
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
             <div class="col-sm-12 col-md-6 col-lg-3">
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
      </div>
      </>
    );
  }
}

export default VVExploreVC;
