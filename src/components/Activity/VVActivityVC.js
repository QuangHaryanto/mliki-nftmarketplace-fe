
import React from 'react';
import { Link } from 'react-router-dom';
import { getItemHistory } from '../../services/VVItemService';
import VVnotifyVW from './../../UI/notify/VVnotifyVW'
import InfiniteScroll from 'react-infinite-scroll-component';
import VVHistoryModal from '../../models/VVHistoryModal';
import VVnodataVW from './../../UI/nodata/VVnodataVW'
import { getOptions } from '../../services/VVUserService'
class VVActivityVC extends React.Component {
  constructor() {
    super()
    this.page = 1;
    this.loading = false;
    this.history_type="";
    this.state = {
      activities: [],
      filters: [{
        type: "Listings",
        value: "minted",
        status: false
      },
      {
        type: "Sales",
        value: "comission",
        status: false
      },
      {
        type: "Platform Sales",
        value: "admin_comission",
        status: false
      },
      {
        type: "Transfer",
        value: "transfer",
        status: false
      },
      {
        type: "Bids",
        value: "bids",
        status: false
      },
      {
        type: "Followings",
        value: "follow",
        status: false
      }],
      skeleton: [1,1,1,1,1,1,1,1,1,1,1,1],
      paging: false,
      loading: true,
      history_type: this.history_type,
      activity_title: ''
    }
  }
  
  componentDidMount() {
     this.initFields()
     this.getStaticcontent()
  }

  initFields = () => {
    this.setState({
      activities: [],
      loading: true,
      paging: false,
    });
    window.scrollTo(0, 0);
    this.page = 1;
    this.historyAPI(this.page)
  }

  getStaticcontent = () => {
    getOptions('title').then(result=>{
      if(result.status === true) {
        var parse = JSON.parse(result.result.value);
        console.log('parse ->', parse)
        this.setState({
          activity_title: parse.activity_page_title
        })
      }
    })
  }

  historyAPI = (page) => {
    var params = {
      page:page
    };
    if(this.history_type.trim().length>0) {
        params["filter"] = this.history_type
    }

    getItemHistory(params).then(result=>{
      if(result.status === true) {
        var tempArray = VVHistoryModal.parseHistoryList(result.data.docs);
        var activities = this.state.activities
        if(page !== 1) {
           for (let index = 0; index < tempArray.length; index++) {
            activities.push(tempArray[index])
           }
        } else {
          activities = tempArray 
        }
        this.setState({
          loading: false,
          paging: result.data.docs.length>0 ? true : false,
          activities: activities
        })
      }
    })
  }

  fetchMoreData = () => {
    this.page = this.page + 1;
    this.historyAPI(this.page)
  }

  resetFilter = () => {
    this.history_type="";
    var filters = this.state.filters
    for (let index = 0; index < filters.length; index++) {
      filters[index].status = false;
    }
    this.setState({
      filters: filters
    })
    this.initFields()
  }

  handleClick = (item) =>{
    var filters = this.state.filters
    for (let index = 0; index < filters.length; index++) {
      if(filters[index].value === item.value) {
        this.history_type=item.value;
        filters[index].status = true;
      } else {
        filters[index].status = false;
      }
    }
    this.setState({
      filters: filters
    })
    this.initFields()
  }


  render() {
    return (
      <>
        <div>
          <div>
          <div className="hero__profile">
            <div className="cover">
              <img src={`/assets/img/bg/Web_1920_10.png`} alt="ImgPreview" />
            </div>
		      </div>
            {/* <div className="hero__activity">
              <div className="container">
                <div className="space-y-10" dangerouslySetInnerHTML={{__html: this.state.activity_title}}>                
                </div>
              </div>
            </div> */}
          </div>
        </div>
      <div className="container mt-100">
        <div class="row">

          <div class="col-12">
          { (!this.state.loading && this.state.activities.length>0) &&
            <InfiniteScroll
          dataLength={this.state.activities.length}
          next={this.fetchMoreData}
          hasMore={this.state.paging}
        >
            <div class="row justify-content-center">
              <div className='col-lg-6 col-md-8 col-sm-10'>
                <div className='space-y-20'>
              {this.state.activities.map((item, index) => (
                 <div className="box" key={index}>
                 <div className="d-flex justify-content-between align-items-center">
                    <VVnotifyVW skeleton="false" data={item} />
                  </div>
                  </div>
                ))}
                </div>
                </div>
              </div>
          </InfiniteScroll>
         }
          { this.state.loading &&
              <div class="row justify-content-center">
                <div className='col-lg-6 col-md-8 col-sm-10'>
                <div className='space-y-20'>
                {this.state.skeleton.map((item, index) => (
                 <div className="box" key={index}>
                 <div className="d-flex justify-content-between align-items-center">
                      <VVnotifyVW skeleton="true" data={null} />
                      </div>
                  </div>
                  ))}
              </div>
              </div>
              </div>
          }
          { (!this.state.loading && this.state.activities.length===0) &&
          <VVnodataVW />
        }
          </div>
        </div>
      </div>
      </>
    );
  }
}

export default VVActivityVC;
