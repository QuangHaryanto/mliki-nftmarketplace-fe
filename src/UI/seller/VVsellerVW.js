
import React from 'react';
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton'
import { Link } from 'react-router-dom';
class VVsellerVW extends React.Component {
  constructor() {
    super()
    this.state = {
    }
  }
  render() {
    return (
      <>
      {this.props.skeleton == "true" &&
      <SkeletonTheme baseColor="#202020" highlightColor="#444">
          <div className="col-xl-3 col-lg-4 col-md-4 col-sm-6 mb-20"> 
           <div className="creator_item creator_card space-x-10 ">
            <div className="usercard">
             <div className="cards">
              <div className="new-collecter">
               <Skeleton className="circles" variant="circular" width={80} height={80} />
               <div className="new-wayer">
                <Skeleton className="small-lines" width={140} height={10} />
                <Skeleton className="small-lines" height={10} />
               </div> 
              </div>
             </div>
            </div>
           </div> 
          </div> 
      </SkeletonTheme>

      }
      {this.props.skeleton == "false" &&
      <div className="col-xl-3 col-lg-4 col-md-4 col-sm-6 mb-20">
          <div className="creator_item creator_card space-x-10 ">
                    <div className="avatars space-x-10">
                      <Link to={"/profile/"+ this.props.data.user_id}>
                        <img
                          src={this.props.data.profile_image}
                          alt="Avatar"
                          className="avatar avatar-md"
                        />
                      </Link>
                      <div>
                        <Link to={"/profile/"+ this.props.data.user_id}>
                          <p className="avatars_name color_black">
                            {this.props.data.fullname}
                          </p>
                        </Link>

                        {this.props.data.follower_count === 0 &&
              <span className="price color_green">No Followers</span>
            }

            {this.props.data.follower_count !== 0 &&
              <span className="price color_green">{this.props.data.follower_count_str} Followers</span>
            }
                      </div>
                    </div>

        </div>
      </div>
      }
    </>

    );
  }
}

export default VVsellerVW;
