import React from 'react';
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton'
import { Link, withRouter } from 'react-router-dom';
import { api } from '../../helper/VVApi';
import { config } from '../../helper/VVConfig';
class VVnotificationVW extends React.Component {
  constructor() {
    super()
    this.state = {
    }
  }

  navigateActivity = () => {
    if(this.props.data.type === "following") {
      this.props.history.push("/profile/"+this.props.data.user_id);
    } else {
      this.props.history.push("/item/"+this.props.data.item_id._id);
    }
  }

  render() {
    return (
      <>
      {this.props.skeleton === "true" &&
      <SkeletonTheme baseColor="#202020" highlightColor="#444">
                    <div className="creators_box">
                      <div className="avatars space-x-10">
                        <div className="media">
                         <Skeleton width={80} height={80}/>
                        </div>
                        <div>
                         <h5 className="color_black">
                          <Skeleton width={180} height={10}/>
                         </h5>
                         <div className="d-flex space-x-10">
                          <span className="price color_text">
                           <Skeleton width={100} height={8}/>
                          </span>
                         </div>
                        </div>
                       </div>
                      </div>
      </SkeletonTheme>
      }

      {this.props.skeleton === "false" &&

<div>
<div className="creators_box">
  <div className="avatars space-x-10">
    <div className="media">
    <a href="javascript:void(0)" onClick={this.navigateActivity}>
      <img
        src={this.props.data.image}
        alt="Avatar"
        className="avatar avatar-md"
      />
    </a>
    </div>
    <div>
      <h5 className="color_white">
        {this.props.data.object_title}
      </h5>
      <div className="d-flex space-x-10">
      { this.props.data.type === "following" &&
      <p class="activity__text">Followed by <Link to={"/profile/" + this.props.data.user_id}>{this.props.data.fullname}</Link></p>
      }
      { this.props.data.type === "offer_won" &&
      <p class="activity__text">You have won auction for  <b>{this.props.data.item_id.name}</b></p>
      }
      { this.props.data.type === "offer_complete" &&
      <p class="activity__text">You auction is ended for  <b>{this.props.data.item_id.name}</b></p>
      }
      { this.props.data.type === "offer_cancel" &&
      <p class="activity__text">You offer has neen cancelled for  <b>{this.props.data.item_id.name}</b></p>
      }
      { this.props.data.type === "offer_received" &&
       <p class="activity__text">You have received new offer from <Link to={"/profile/" + this.props.data.user_id}>{this.props.data.fullname}</Link> for  <b>{this.props.data.item_id.name}</b></p>
      }
      { this.props.data.type === "item_purchase" &&
       <p class="activity__text">Your item <b>{this.props.data.item_id.name}</b> sold to <Link to={"/profile/" + this.props.data.user_id}>{this.props.data.fullname}</Link></p>
      }

      { this.props.data.type === "comission_received" &&
       <p class="activity__text">You have received comission from <Link to={"/profile/" + this.props.data.user_id}>{this.props.data.fullname}</Link> for  <b>{this.props.data.item_id.name}</b></p>
      }
      </div>
      <p className="date color_text d-none d-sm-block">
{this.props.data.timeago}
</p>
    </div>
  </div>
</div>

</div>
      }
     </>
    );
  }
}

export default withRouter(VVnotificationVW);
