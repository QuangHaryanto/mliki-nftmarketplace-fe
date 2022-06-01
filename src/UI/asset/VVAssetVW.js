
import React from 'react';
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton'
import { Link } from 'react-router-dom';
import { config } from '../../helper/VVConfig';
import Countdown from 'react-countdown';
import ProgressBar from 'react-bootstrap/ProgressBar'

class VVAssetVW extends React.Component {
  constructor() {
    super()
    this.state = {
        has_offer: false
    }
    
  }

  componentDidMount() {
    let has_offer = false;
    if(this.props.skeleton === "false") {
        has_offer = this.props.data.has_offer
        this.setState({
            has_offer: has_offer
        })
    } 
  }

  offerComplete = () => {
      this.setState({
          has_offer : false
      })
  }
  render() {
    return (
        <>
        {this.props.skeleton === "true" &&
            <SkeletonTheme baseColor="#202020" highlightColor="#444">
          <div className="card__item four">
           <div className="cards">  
             <Skeleton height={300}/>
             <div className="top-mode">
              <Skeleton height={10}/>
             </div> 
             <div className="row">
              <div className="col-sm-8"><Skeleton height={6}/></div>
             </div>
             <div className="lean-line">
              <Skeleton height={1}/>
             </div>
             <div className="row">
              <div className="col-sm-6"><div className="bid-new"><Skeleton height={32}/></div></div>
             </div>
           </div>
          </div>
            </SkeletonTheme>
        }

        {this.props.skeleton !== "true" &&

<div className="card__item four liveactionlist">
<div className="card_body space-y-10">
  {/* =============== */}
  <div className="creators space-x-10">
    <div className="avatars space-x-6">
      <Link to={"/profile/"+this.props.data.user_id}>
        <img
          src={this.props.data.profile_image}
          alt="Avatar"
          className="avatar avatar-sm"
        />
      </Link>
      <Link to={"/profile/"+this.props.data.user_id} className="ml-2">
        <p className="avatars_name txt_xs">{this.props.data.fullname}</p>
      </Link>
    </div>
  </div>
  <div className="card_head">
  <Link to={"/item/"+this.props.data.item_id}>
    <img src={this.props.data.thumb} alt="nftimage" />
    {(this.props.data.has_offer && this.props.data.status == 'active') &&
          <span class="countdown"><Countdown date={this.props.data.offer_time} onComplete={()=>{
              this.offerComplete()
          }}/></span>
      }
      {(this.props.data.has_offer && this.props.data.status == 'active' && this.props.data.percentage>0) &&
      <ProgressBar now={this.props.data.percentage} />
      }
  </Link>
    
    <Link to={"/item/"+this.props.data.item_id} className="likes space-x-3">
      <i className="ri-heart-3-fill" />
      <span className="txt_sm">{this.props.data.like_count}</span>
    </Link>
  </div>
  {/* =============== */}
  <h6 className="card_title">
    <Link className="color_black" to={"/item/"+this.props.data.item_id}>
      {this.props.data.name}
    </Link>
  </h6>
  <div className="card_footer d-block space-y-10">
    <div className="card_footer justify-content-between">
      <div className="creators">
        <p className="txt_sm">In stock</p>
      </div>
      <div>
      {(this.props.data.price > 0 && this.props.data.has_offer === false) &&
              <>
        <div className=" color_text txt_sm">
          Price:
          <span className="color_green txt_sm">
             
              {this.props.data.price} {config.currency}
              
          </span>
        </div>
        </>
         }
      </div>
    </div>
  </div>
</div>
</div>


            //     <div class="card">
            //     <Link to={"/item/"+this.props.data.item_id} class="card__cover">
            //         <img src={this.props.data.thumb} alt="" />
            //         {this.state.has_offer &&
            //            <span class="card__time card__time--clock"><Countdown date={this.props.data.offer_time} onComplete={()=>{
            //                this.offerComplete()
            //            }}/></span>
            //         }
                    
            //     </Link>
            //     <h3 class="card__title"> <Link to={"/item/"+this.props.data.item_id}>{this.props.data.name}</Link></h3>
            //     <div className={"card__author " + (this.props.data.is_verified ? "card__author--verified" : "")}>
            //         <img src={this.props.data.profile_image} alt="" />
            //         <Link to={"/profile/"+this.props.data.user_id}>{this.props.data.fullname} </Link>
            //     </div>
            //     <div class="card__info">
            //         <div class="card__price">
            //             <span>Current price</span>
            //             <span>{this.props.data.price} {config.currency}</span>
            //         </div>
            //         {this.props.data.like_count === 0 &&
            //             <div class="card__likes">
            //                 <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M20.16,5A6.29,6.29,0,0,0,12,4.36a6.27,6.27,0,0,0-8.16,9.48l6.21,6.22a2.78,2.78,0,0,0,3.9,0l6.21-6.22A6.27,6.27,0,0,0,20.16,5Zm-1.41,7.46-6.21,6.21a.76.76,0,0,1-1.08,0L5.25,12.43a4.29,4.29,0,0,1,0-6,4.27,4.27,0,0,1,6,0,1,1,0,0,0,1.42,0,4.27,4.27,0,0,1,6,0A4.29,4.29,0,0,1,18.75,12.43Z"/></svg>
            //                 <span>{this.props.data.like_count}</span>
            //             </div>
            //         }
            //     </div>
                
            // </div>
        }
        </>
    );
  }
}

export default VVAssetVW;
