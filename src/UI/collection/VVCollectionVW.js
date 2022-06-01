
import React from 'react';
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton'
import {
	BrowserRouter as Router,
	Link,
	withRouter
  } from "react-router-dom";
  import _ from "lodash";

class VVCollectionVW extends React.Component {
  constructor() {
    super()
    this.state = {
    }
  }
  render() {
    return (
    <>
    {this.props.skeleton === "true" &&
    <SkeletonTheme baseColor="#202020" highlightColor="#444">
            <div className="collections space-y-10 mb-30">
             <div className="collections_item">
              <div className="usercard">
               <div className="cards">
                <div className="row">
                 <div className="col-sm-4"><Skeleton height={94}/></div>
                 <div className="col-sm-4"><Skeleton height={94}/></div>
                 <div className="col-sm-4"><Skeleton height={94}/></div>
                </div> 
                <div className="collection-one"> 
                 <Skeleton height={302}/>
                </div> 
               </div>
              </div>
             </div> 
            </div> 
    </SkeletonTheme>
    }

   {this.props.skeleton === "false" &&

<div className="collections space-y-10 mb-30">
<Link to={"/collection/"+ this.props.data.collection_id}>
  <div className="collections_item">
    <div className="images-box space-y-10">
      <div className="top_imgs">
      {this.props.data.item_info.length > 0 &&
       <>
        {this.props.data.item_info.map((itemOffer, index) => (
          <Link to={"/item/"+ itemOffer._id}>
            <img
            src={itemOffer.image}
            alt="prv"
          /></Link> 
          ))}
          </>
        }
        {this.props.data.item_info.length < 3 &&
          <>
            {_.times(3-this.props.data.item_info.length, (i) => (
              <Link to="#">
              <img
                src={`/assets/img/items/item_15.png`}
                alt="prv"
              />
              </Link>
            ))}
          </>
        }
      </div>
      <img src={this.props.data.banner} alt="prv" />
    </div>
  </div>
</Link>
<div className="collections_footer justify-content-between">
  <h5 className="collection_title">
    <Link to={"/collection/"+ this.props.data.collection_id}>{this.props.data.name}</Link>
  </h5>
</div>
<div className="creators space-x-10">
  <span className="color_text txt_md">
  {this.props.data.item_count} items · Created by
  </span>
  <div className="avatars space-x-5">
    <Link to={"/profile/"+ this.props.data.user_id}>
      <img
        src={this.props.data.profile_image}
        alt="Avatar"
        className="avatar avatar-sm"
      />
    </Link>
  </div>
  <Link to={"/profile/"+ this.props.data.user_id}>
    <p className="avatars_name txt_sm">
      {this.props.data.fullname}
    </p>
  </Link>
</div>
</div>

    // <div class="collection">
    //    <Link to={"/collection/"+ this.props.data.collection_id}  class="collection__cover">
    //        <img src={this.props.data.banner} alt="" />
    //     </Link>
        
    //     <div class="collection__meta">
    //         <Link to={"/collection/"+ this.props.data.collection_id} className={"collection__avatar " + (this.props.data.is_verified ? "collection__avatar--verified" : "")}>
    //             <img src={this.props.data.profile_image} alt="" />
    //         </Link>
    //         <h3 class="collection__name"><Link to={"/collection/"+ this.props.data.collection_id}>{this.props.data.name}</Link></h3>
    //         <span class="collection__number">{this.props.data.item_count} Items</span>
    //     </div>
    // </div>
    }
    </>
    );
  }
}

export default VVCollectionVW;
