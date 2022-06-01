
import React from 'react';
import { Link } from 'react-router-dom';
import VVbannerVW from './../../UI/banner/VVbannerVW'
import VVAssetVW from './../../UI/asset/VVAssetVW'
import VVsellerVW from './../../UI/seller/VVsellerVW'
import VVCollectionVW from './../../UI/collection/VVCollectionVW'
import { listAPI } from '../../services/VVCollectionService';
import VVCollectionModal from '../../models/VVCollectionModal';
import axios from "axios";
import { getUserListAPI , getOptions } from '../../services/VVUserService';
import VVUserModel from '../../models/VVUserModel';
import { getItemListAPI } from '../../services/VVItemService';
import VVItemModal from '../../models/VVItemModal';
class VVHomeVC extends React.Component {
  constructor() {
    super()
    this.state = {
      auction: [1,2,3,4],
      sellerloading: true,
      sellerskeleton: [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15],
      sellers: [],
      topcollection: [],
      collectionloading: true,
      sellerNav: false,
      offerItem: [],
      offerloading: true,
      offerNav: false,
      recentItem: [],
      recentloading: true,
      recentNav: false,
      auctions_title: '',
      sellers_title: '',
      explore_title: '',
      collection_title: ''
    }
  }

  componentDidMount() {
    this.getTopCollection();
    this.getTopSeller();
    this.getOfferList();
    this.getRecentList();
    this.getStaticcontent();
  }

  getStaticcontent = () => {
    getOptions('title').then(result=>{
      if(result.status === true) {
        var parse = JSON.parse(result.result.value);
        this.setState({
          auctions_title: parse.auctions_title,
          sellers_title: parse.sellers_title,
          explore_title: parse.explore_title,
          collection_title: parse.collection_title
        })
      }
    })
  }

  getTopSeller = () => {
    var params = {
      keyword: "",
      sortby: "top",
      type: "all",
      page: 1
    };
    this.cancelTokenSource = axios.CancelToken.source();
    getUserListAPI(params, this.cancelTokenSource).then(result=>{
      if(result.status === true) {
        this.cancelTokenSource = null;
        var tempArray = VVUserModel.parseSellerList(result.data.docs);
        var creators = []
        for (let index = 0; index < tempArray.length; index++) {
          creators.push(tempArray[index])
          if(index==14) {
            break
          }
        }
        this.setState({
          sellerloading: false,
          sellers: creators,
          sellerNav: tempArray.length>15 ? true: false
        })
      }
    })
  }

  getOfferList = () => {
    var params = {
      type: "offer",
      page: 1
    };
    getItemListAPI(params).then(result=>{
      if(result.status === true) {
        var tempArray = VVItemModal.parseItemList(result.data.docs);
        var items = []
        for (let index = 0; index < tempArray.length; index++) {
          items.push(tempArray[index])
          if(index==3) {
            break
          }
        }
        this.setState({
          offerItem: items,
          offerloading: false,
          offerNav: tempArray.length > 4 ? true : false
        })
      }
    })
  }

  getRecentList = () => {
    var params = {
      type: "marketplace",
      page: 1
    };
    getItemListAPI(params).then(result=>{
      if(result.status === true) {
        var tempArray = VVItemModal.parseItemList(result.data.docs);
        var items = []
        for (let index = 0; index < tempArray.length; index++) {
          items.push(tempArray[index])
          if(index==3) {
            break
          }
        }
        this.setState({
          recentItem: items,
          recentloading: false,
          recentNav: tempArray.length > 4 ? true : false
        })
      }
    })
  }


  getTopCollection = () => {
    var params = {
      type: "sold",
      page: 1
    };
    listAPI(params).then(result=>{
      if(result.status === true) {
        var tempArray = VVCollectionModal.parseCollectionList(result.data.docs);
        var collections = []
        for (let index = 0; index < tempArray.length; index++) {
          collections.push(tempArray[index])
          if(index==5) {
            break
          }
        }

        this.setState({
          collectionloading: false,
          topcollection: collections,
        })
      } else {
        this.setState({
          collectionloading: false,
        })
      }
    })
  }


  render() {
    return (
        <div>
          <VVbannerVW />
       <div className="mt-100">
         <div className="container">
          { this.state.offerloading &&
            <>
             <div className="row">
                <div className="section_head mb-30">
                  <h2 className="section__title ">{this.state.auctions_title}
                  </h2>
                </div>
              </div>
              <div className="row">
                  {this.state.auction.map((item, index) => (
                    <div class="col-sm-12 col-md-6 col-lg-3">
                      <VVAssetVW skeleton="true" data={null} />
                    </div>
                  ))}
              </div>
            </>
          }
          
          { (!this.state.offerloading && this.state.offerItem.length>0) &&
            <>
            <div className="section_head mb-30 liveaction">
                <div className="row">                
                <div class="col-md-6 col-sm-12">
                  <h2 class="section__title ">{this.state.auctions_title}</h2>
                </div>
                  <div class="col-md-6 col-sm-12">
                  { this.state.offerNav &&
                      <Link to="/marketplace" class="main__link">View all <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M17.92,11.62a1,1,0,0,0-.21-.33l-5-5a1,1,0,0,0-1.42,1.42L14.59,11H7a1,1,0,0,0,0,2h7.59l-3.3,3.29a1,1,0,0,0,0,1.42,1,1,0,0,0,1.42,0l5-5a1,1,0,0,0,.21-.33A1,1,0,0,0,17.92,11.62Z"/></svg></Link>
                    }
                  </div>
                </div>
              </div>
              <div className="row">
                  {this.state.offerItem.map((item, index) => (
                    <div class="col-sm-12 col-md-6 col-lg-3">
                      <VVAssetVW skeleton="false" data={item} />
                    </div>
                  ))}
              </div>
            </>
          }

          </div></div>
          <div className="mt-100">
         <div className="container">

          { this.state.sellerloading &&
              <>
              <div className="row">
                <div className="section_head mb-30">
                <h2 class="section__title ">{this.state.sellers_title}</h2>
                </div>
              </div>
           
              <div class="row">
              <div class="col-12">
              <div className="section__body">
                   <div className="row mb-20_reset">
                  {this.state.sellerskeleton.map((item, index) => (
                      <VVsellerVW rank={index+1} skeleton="true" data={null}  />
                  ))}
                </div>
                </div>
              </div>
            </div>
            </>
          }

          { (!this.state.sellerloading && this.state.sellers.length>0) &&
             <>
              <div className="row">
                <div className="section_head mb-30">
                <h2 class="section__title ">{this.state.sellers_title}</h2>
                {this.state.sellerNav &&
                    <Link to="/creators" class="main__link">View all <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M17.92,11.62a1,1,0,0,0-.21-.33l-5-5a1,1,0,0,0-1.42,1.42L14.59,11H7a1,1,0,0,0,0,2h7.59l-3.3,3.29a1,1,0,0,0,0,1.42,1,1,0,0,0,1.42,0l5-5a1,1,0,0,0,.21-.33A1,1,0,0,0,17.92,11.62Z"/></svg></Link>
                  }
                </div>
              </div>
              <div class="row">
              <div class="col-12">
              <div className="section__body">
                   <div className="row mb-20_reset">
                  {this.state.sellers.map((item, index) => (
                      <VVsellerVW rank={index+1} skeleton="false" data={item}  />
                  ))}
              </div>
              </div>
              </div>
              </div>
             </>

          }

          </div></div>
          <div className="mt-100">
         <div className="container">
          { this.state.recentloading &&
            <>
              <div className="row">
                <div className="section_head mb-30">
                <h2 class="section__title ">{this.state.explore_title}</h2>
                </div>
              </div>
              <div class="row">
                  {this.state.auction.map((item, index) => (
                    <div className="col-xl-3 col-lg-4 col-md-6 col-sm-6" key={index}>
                      <VVAssetVW skeleton="true" data={null} />
                    </div>
                  ))}
              </div>
            </>
          }

          { (!this.state.recentloading && this.state.recentItem.length>0) &&
            <>
              <div className="row">
                <div className="section_head mb-30">
                <h2 class="section__title ">{this.state.explore_title}</h2>
                {this.state.sellerNav &&
                    <Link to="/marketplace" class="main__link">View all <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M17.92,11.62a1,1,0,0,0-.21-.33l-5-5a1,1,0,0,0-1.42,1.42L14.59,11H7a1,1,0,0,0,0,2h7.59l-3.3,3.29a1,1,0,0,0,0,1.42,1,1,0,0,0,1.42,0l5-5a1,1,0,0,0,.21-.33A1,1,0,0,0,17.92,11.62Z"/></svg></Link>
                  }
                </div>
              </div>
              <div class="row item-grid">
                  {this.state.recentItem.map((item, index) => (
                    <div className="col-xl-3 col-lg-4 col-md-6 col-sm-6" key={index}>
                      <VVAssetVW skeleton="false" data={item} />
                    </div>
                  ))}
              </div>
            </>
          }
</div></div>
<div className="mt-100">
         <div className="container">

          { this.state.collectionloading &&
            <div>
              <div className="row">
                <div className="section_head mb-30">
                <h2 class="section__title ">{this.state.collection_title}</h2>
                </div>
              </div>
          
            <div class="row">
            {this.state.auction.map((item, index) => (
             <div className="col-lg-4 col-md-6 col-sm-8">
                <VVCollectionVW skeleton="true" data={null} />
              </div>
            ))}
          </div>
          </div>
          }

          {!this.state.collectionloading && this.state.topcollection.length>0 &&
            <div>
              <div className="row">
                <div className="section_head mb-30">
                <h2 class="section__title ">{this.state.collection_title}</h2>
                </div>
              </div>
            
              <div class="row">
                {this.state.topcollection.map((item, index) => (
                 <div className="col-lg-4 col-md-6 col-sm-8">
                    <VVCollectionVW skeleton="false" data={item} />
                  </div>
                ))}
              </div>
            </div>
          }

         </div>
         </div>
        </div>
    );
  }
}

export default VVHomeVC;  
