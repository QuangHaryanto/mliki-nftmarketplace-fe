
import React from 'react';
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton'
import {
	BrowserRouter as Router,
	Link,
	withRouter
  } from "react-router-dom";
class VVAuthorVC extends React.Component {
  constructor() {
    super()
    this.state = {
    }
  }

  followAction() {
    this.props.follow(this.props.data);
  }
  render() {
    return (
    <>
    {this.props.skeleton === "true" &&
    <SkeletonTheme baseColor="#202020" highlightColor="#444">
     <div class="author">
     <a href="javascript:void(0)" class="author__cover author__cover--bg">
        <Skeleton height="100%" />
     </a>
     <div class="author__meta">
         <a href="javascript:void(0)" class="author__avatar">
            <Skeleton height="100%" />
         </a>
         <h3 class="author__name"><Skeleton /></h3>
         <h3 class="author__nickname"><Skeleton width="75%"/></h3>
         <div class="author__wrap">
             <div class="author__followers">
                 <p><Skeleton /></p>
                 <span>Followers</span>
             </div>
         </div>
     </div>
    </div>
    </SkeletonTheme>

    }
    {this.props.skeleton === "false" &&
     <div class="author">
        <Link to={"/profile/"+ this.props.data.user_id}  class="author__cover author__cover--bg">
            <img src={this.props.data.profile_cover} />
        </Link>
        <div class="author__meta">
            <Link to={"/profile/"+ this.props.data.user_id} className={"author__avatar " + (this.props.data.is_verified ? "author__avatar--verified" : "")}>
                <img src={this.props.data.profile_image} alt="" />
            </Link>
            <h3 class="author__name"><Link to={"/profile/"+ this.props.data.user_id}>{this.props.data.fullname}</Link></h3>
            <h3 class="author__nickname"><Link to={"/profile/"+ this.props.data.user_id}>@{this.props.data.username}</Link></h3>
            <div class="author__wrap">
                <div class="author__followers">
                    { this.props.data.follower_count>0 &&
                      <p>{this.props.data.follower_count_str}</p>
                    }
                    { this.props.data.follower_count===0 &&
                      <p>NO</p>
                    }
                    <span>Followers</span>
                </div>
                { (this.props.isLogged && this.props.data.is_follow === 0) &&
                  <button class="author__follow" type="button" onClick={this.followAction.bind(this)}>Follow</button>
                }

                { (this.props.isLogged && this.props.data.is_follow === 1) &&
                  <button class="author__follow" type="button" onClick={this.followAction.bind(this)}>UnFollow</button>
                }
               
            </div>
        </div>
      </div>
      }
      </>
    );
  }
}

export default VVAuthorVC;
