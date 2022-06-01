
import React from 'react';
import {
  withRouter
  } from "react-router-dom";
import {connect} from 'react-redux';
import { getItemHistory } from '../../services/VVItemService';
import VVnotifyVW from './../../UI/notify/VVnotifyVW'
import VVnodataVW from './../../UI/nodata/VVnodataVW'
import InfiniteScroll from 'react-infinite-scroll-component';
import VVHistoryModal from '../../models/VVHistoryModal';
class VVmyactivityVW extends React.Component {
  constructor() {
    super()
    this.page_type = ""
    this.page_id = ""
    this.page = 1;
    this.loading = false;
    this.state = {
      activities: [],
      skeleton: [1,1,1,1,1,1,1,1,1,1,1,1],
      paging: false,
      loading: true,
    }
  }

  componentDidMount() {
     this.initFields();
  }

  componentDidUpdate(prevProps) {
    if(this.props.notifier !==prevProps.notifier) {
      this.initFields()
    }
  }

  initFields = () => {
    var pathArray = this.props.location.pathname.split("/")
    this.page_type = pathArray[1];
    this.page_id = pathArray[2]
    this.setState({
      activities: [],
      loading: true,
      paging: false,
    });
    this.page = 1;
    this.historyAPI(this.page)
  }

  historyAPI = (page) => {
    var params = {
      page:page
    };

    if(this.page_type === "profile") {
      params["type"] = "profile"
      params["user_id"] = this.page_id;
    } else if (this.page_type === "collection") {
      params["type"] = "collection"
      params["collection_id"] = this.page_id;
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

  render() {
    return (
      <>
          { (!this.state.loading && this.state.activities.length>0) &&
            <InfiniteScroll
          dataLength={this.state.activities.length}
          next={this.fetchMoreData}
          hasMore={this.state.paging}
        >
                   <div class="row justify-content-center">
              <div className='col-lg-12 col-md-12 col-sm-12'>
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
            <div className='col-lg-12 col-md-12 col-sm-12'>
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
      </>
    );
  }
}

function mapStateToProps(state) {
	return {
	  notifier: state.notifier
	};
}


export default connect(mapStateToProps, {})(withRouter(VVmyactivityVW))
