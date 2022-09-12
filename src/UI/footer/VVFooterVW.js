import React from 'react';
import { Link } from 'react-router-dom';
import { getOptions } from '../../services/VVUserService';
import axios from "axios";
import { getItemListExplorerAPI } from '../../services/VVItemService';
import VVItemModal from '../../models/VVItemModal';
import {listAPI} from './../../services/VVCategoryService';
import { allCollectionsAPI } from '../../services/VVCollectionService';
import VVAssetVW from '../../UI/asset/VVAssetVW';
import VVnodataVW from '../../UI/nodata/VVnodataVW'
import InfiniteScroll from 'react-infinite-scroll-component';

const scrollToTop = () =>{
	window.scrollTo({
	  top: 0, 
	  behavior: 'smooth'
	});
	};

class VVFooterVW extends React.Component {
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
			marketplace_title: '',
			facebook:'',
			messenger:'',
			whatsapp:'',
			youtube:'',
			copy_rights:'',
			footer_html:'',
			footerloading: true,
		}
  }

  componentDidMount() {
    this.getFooter(); 
	this.setState({
		items: [],
		loading: true,
		paging: false,
	  });
	  this.page = 1;
	  this.getCollections();
	  this.getStaticcontent()
  }

  getFooter = () => {
    getOptions('footer').then(result=>{
      if(result.status === true) {
      	var parse = JSON.parse(result.result.value);
        this.setState({
          facebook: parse.facebook,
          messenger: parse.messenger,
          whatsapp: parse.whatsapp,
          youtube: parse.youtube,
          copy_rights: parse.copy_rights,
          footer_html: parse.footer_html,
          footerloading: false
        })
      }
    })
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
		<div>
<footer className="footer__1">
  <div className="container">
	<div className="row">
		<div className="col-lg-6 space-y-20">
			<div className="footer__logo">
			<Link to="/">
				<img src={`/assets/img/logos/mliki white (1).png`} alt="logo" id="logo_js_f" width={300}  />
			</Link>
			</div>
			<p className="footer__text">
			MLIKI NFT Marketplace is a multi-chain NFT marketplace that enables anyone to seamlessly create, buy, sell and leverage NFTs across different blockchains.
			</p>
			{ (!this.state.footerloading) &&
				<>
			<div>
			<ul className="footer__social space-x-10 mb-40">
				<li>
				<a href={this.state.facebook} rel="noreferrer"  target="_blank">
					<i className="ri-facebook-line" />
				</a>
				</li>
				<li>
				<a href={this.state.messenger} rel="noreferrer"  target="_blank">
					<i className="ri-telegram-line" />
				</a>
				</li>
				<li>
				<a href={this.state.whatsapp} target="_blank" rel="noreferrer" >
					<i className="ri-twitter-line"  />
				</a>
				</li>
				<li>
				<a href={this.state.youtube} target="_blank" rel="noreferrer" >
					<i className="ri-youtube-line" />
				</a>
				</li>
			</ul>
			</div>
			</>
			}
		</div>
		<div class="col-lg-2 col-6">
			<h6 class="footer__title">Marketplace</h6>
			<ul class="footer__list">
			<li>
			<Link to="/marketplace" className={"" + (this.state.path == "/" ? 'color_brand' : 'color_white')}>All NFTs</Link>
          </li>
			{this.state.categories?.map((item, index) => (
				
				<li>
					<Link to="/marketplace" className={"" + (this.state.path == "/" ? 'color_brand' : 'color_white')} onClick={()=>{
					this.changeCategory(item._id)
				}}>{item.title}</Link>
				</li>
			))}
		  </ul>
		</div>
		<div class="col-lg-2 col-6">
			<h6 class="footer__title">Assets</h6>
			<ul class="footer__list">
			<li> <Link to="/" className={"" + (this.state.path == "/" ? 'color_brand' : 'color_white')}>Home</Link>
				</li>
				<li> <Link to="/creators" className={"" + (this.state.path == "/creators" ? 'color_brand' : 'color_white')}>Creators</Link>
				</li>
				<li> <Link to="/marketplace" className={"" + (this.state.path == "/marketplace" ? 'color_brand' : 'color_white')}>Marketplace</Link>
				</li>
				<li> <Link to="/activity" className={"" + (this.state.path == "/activity" ? 'color_brand' : 'color_white')}>Activity</Link>
				</li>
			</ul>
		</div>
		<div class="col-lg-2 col-6">
			<h6 class="footer__title">Company</h6>
			<ul class="footer__list">
				<li> <a href="https://www.mliki.com/" target="_blank" > About </a>
				</li>
				<li> <a href="https://mliki-1.gitbook.io/mliki-nft-marketplace-docs/faq" target="_blank" > FAQ </a>
				</li>
				<li> <a href="https://mliki-1.gitbook.io/mliki-nft-marketplace-docs/term-of-service" target="_blank"> Term Of Service </a> </li>
				<li> <a href="https://mliki-1.gitbook.io/mliki-nft-marketplace-docs/privacy-policy" target="_blank"> Privacy Policy
					</a> </li>
				<li> <a href="https://forms.gle/84wo1kKfpbNwAGVu9" target="_blank"> Verification
				</a> </li>
			</ul>
		</div>
	</div>
	{ (!this.state.footerloading) &&
	<p className="copyright text-center">
	  {this.state.copy_rights}
	</p>
	}
  </div>
</footer>
	  </div>
    );
  }
}

export default VVFooterVW;
