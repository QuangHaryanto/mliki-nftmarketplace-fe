
import React from 'react';
import {
  Link,
  withRouter
  } from "react-router-dom";
import {connect} from 'react-redux';
import { getNotificationListAPI } from '../../services/VVUserService';
import VVnotificationVW from './../../UI/notification/VVnotificationVW'
import InfiniteScroll from 'react-infinite-scroll-component';
import VVnodataVW from './../../UI/nodata/VVnodataVW';
import VVNotificationModal from '../../models/VVNotificationModal';
class VVnotificationVC extends React.Component {
  constructor() {
    super()
    this.page_type = ""
    this.page_id = ""
    this.page = 1;
    this.loading = false;
    this.state = {
      notifications: [],
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
      notifications: [],
      loading: false,
      paging: false,
    });
    this.page = 1;
    this.notificationAPI(this.page)
  }

  notificationAPI = (page) => {
    var params = {
      page:page
    };

    getNotificationListAPI(params).then(result=>{
      if(result.status === true) {
        var tempArray = VVNotificationModal.parseNotificationList(result.data.docs);
        var notifications = this.state.notifications
        if(page !== 1) {
           for (let index = 0; index < tempArray.length; index++) {
            notifications.push(tempArray[index])
           }
        } else {
            notifications = tempArray 
        }
        this.setState({
          loading: false,
          paging: result.data.docs.length>0 ? true : false,
          notifications: notifications
        })
      }
    })
  }

  fetchMoreData = () => {
    this.page = this.page + 1;
    this.notificationAPI(this.page)
  }

  render() {
    return (
      <>      
          { (!this.state.loading && this.state.notifications.length>0) &&
            <InfiniteScroll
          dataLength={this.state.notifications.length}
          next={this.fetchMoreData}
          hasMore={this.state.paging}
        >
              <div class="row justify-content-center">
                <div className='col-lg-6 col-md-8 col-sm-10'>
                <div className='space-y-20'>
              {this.state.notifications.map((item, index) => (
                              <div className="box" key={index}>
                              <div className="d-flex justify-content-between align-items-center">
                    <VVnotificationVW skeleton="false" data={item} />
                  </div>
                  </div>
                ))}
              </div>
              </div>
              </div>
          </InfiniteScroll>
         }{ (!this.state.loading && this.state.notifications.length == 0) &&
          <div class="row justify-content-center notificationerror">
          <div className='col-lg-6 col-md-8 col-sm-10'>
          <p>Sorry, No data to display</p>
          </div>
          </div>
         }
          { this.state.loading &&
              <div class="row justify-content-center">
              <div className='col-lg-6 col-md-8 col-sm-10'>
              <div className='space-y-20'>
                {this.state.skeleton.map((item, index) => (
                    <div className="box" key={index}>
                     <div className="d-flex justify-content-between align-items-center">
                         <VVnotificationVW skeleton="true" data={null} />
                      </div>
                      </div>
                  ))}
              </div>
              </div>
              </div>
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


export default connect(mapStateToProps, {})(withRouter(VVnotificationVC))
