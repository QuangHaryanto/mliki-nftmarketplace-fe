import React from 'react';
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton'
import { Link, withRouter } from 'react-router-dom';
import { api } from '../../helper/VVApi';
import { config } from '../../helper/VVConfig';
class VVnotifyVW extends React.Component {
  constructor() {
    super()
    this.state = {
    }
  }

  navigateActivity = () => {
    if(this.props.data.history_type === "follow") {
      this.props.history.push("/profile/"+this.props.data.object_id);
    } else {
      this.props.history.push("/item/"+this.props.data.object_id);
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
                { this.props.data.history_type === "follow" &&
                <p class="activity__text">Followed by <Link to={"/profile/" + this.props.data.user_id}>{this.props.data.fullname}</Link></p>
                }
                { this.props.data.history_type === "admin_comission" &&
                <p class="activity__text">Platform comission by <Link to={"/profile/" + this.props.data.user_id}>{this.props.data.fullname}</Link> for <b>{this.props.data.price} {config.currency}</b></p>
                }
                { this.props.data.history_type === "comission" &&
                <p class="activity__text">Royalty by <Link to={"/profile/" + this.props.data.user_id}>{this.props.data.fullname}</Link> for <b>{this.props.data.price} {config.currency}</b></p>
                }
                { this.props.data.history_type === "transfer" &&
                <p class="activity__text">Transferred to <Link to={"/profile/" + this.props.data.user_id}>{this.props.data.fullname}</Link><br />for <a href={config.explorer + "tx/" +this.props.data.transaction_hash} target="_blank"><b>{this.props.data.price} {config.currency}</b></a></p>
                }
                { this.props.data.history_type === "minted" &&
                  <p class="activity__text">Listed by <Link to={"/profile/" + this.props.data.user_id}>{this.props.data.fullname}</Link><br />for <a href={config.explorer + "tx/" +this.props.data.transaction_hash} target="_blank"><b>{this.props.data.price} {config.currency}</b></a></p>
                }
                { this.props.data.history_type === "bids" &&
                  <p class="activity__text">Offered by <Link to={"/profile/" + this.props.data.user_id}>{this.props.data.fullname}</Link><br />for <a href={config.explorer + "tx/" +this.props.data.transaction_hash} target="_blank"><b>{this.props.data.price} {config.currency}</b></a></p>
                }
                { this.props.data.history_type === "deposit" &&
                  <p class="activity__text">Deposited by <Link to={"/profile/" + this.props.data.user_id}>{this.props.data.fullname}</Link><br />for <a href={config.explorer + "tx/" +this.props.data.transaction_hash} target="_blank"><b>{this.props.data.price} {config.currency}</b></a></p>
                }
                { this.props.data.history_type === "withdraw" &&
                  <p class="activity__text">Withdraw by <Link to={"/profile/" + this.props.data.user_id}>{this.props.data.fullname}</Link><br />for <b>{this.props.data.price} {config.currency}</b></p>
                }
                                    </div>
                                    <p className="date color_text d-none d-sm-block">
                              {this.props.data.timeago}
                              </p>
                                  </div>
                                </div>
                              </div>

                            </div>
        
        // <div class="activity">
        //     <a href="javascript:void(0)" class="activity__cover" onClick={this.navigateActivity}>
        //         <img src={this.props.data.image} alt="" />
        //     </a>
        //     <div class="activity__content">
        //         <h3 class="activity__title"><a href="javascript:void(0)" onClick={this.navigateActivity}>{this.props.data.object_title}</a></h3>

        //         <span class="activity__time">{this.props.data.timeago}</span>
        //     </div>
        // </div>
      }
     </>
    );
  }
}

export default withRouter(VVnotifyVW);
