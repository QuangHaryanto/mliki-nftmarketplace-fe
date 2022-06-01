
import React from 'react';
import { Link,withRouter } from 'react-router-dom';
import { toast } from 'react-toastify';
import { getUser } from '../../services/VVUserService';
import VVBannerModal from '../../models/VVBannerModal';
import { getBannerListAPI } from '../../services/VVCommonService';
import ReactDOM from 'react-dom';
import "react-responsive-carousel/lib/styles/carousel.min.css"; // requires a loader
import { Carousel } from 'react-responsive-carousel';

class VVbannerVC extends React.Component {
  constructor() {
    super()
    this.state = {
			bannerItem: [],
			bannerloading: true,
		}
  }

  componentDidMount() {
    this.getBanners(); 
  }

  getBanners = () => {
    getBannerListAPI().then(result=>{
      if(result.status === true) {
        var tempArray = VVBannerModal.parseBannerList(result.data);
        var items = []
        for (let index = 0; index < tempArray.length; index++) {
          items.push(tempArray[index])
          if(index==3) {
            break
          }
        }
        this.setState({
          bannerItem: items,
          bannerloading: false
        })
      }
    })
  }

  gotoCollection = () => {
	  let user = getUser();
	  if(user === null) {
		toast("Please log to continue",{
			type: "success"
		});
		return;
	  }
	  this.props.history.push("/profile/"+user.user_id+"/collection");

  }
  render() {
    return (
		<div className="hero__1">
		<div className="container">
			{ (!this.state.bannerloading && this.state.bannerItem.length>0) &&
			<>
			<Carousel autoPlay="true" infiniteLoop="true">
			{this.state.bannerItem.map((item, index) => (
		  <div className="row align-items-center" key={index}>
			<div className="col-lg-6">
			  <div className="hero__left space-y-20">
				<h1 className="hero__title color_white">
				<a href="#" onClick={()=> window.open(item.slider_link, "_blank")}>
				  {item.slider_title}
				  </a>
				</h1>
				<p className="hero__text txt color_light">
				  {item.slider_description}
				</p>
				<div
				  className="space-x-20 d-flex flex-column flex-md-row
					sm:space-y-20">
				  <Link className="btn btn-primary" to="marketplace">
					View market
				  </Link>
				</div>
			  </div>
			</div>
			<div className="col-lg-6">
			<a href="#" onClick={()=> window.open(item.slider_link, "_blank")}>
				<img
					className="img-fluid w-full"
					id="img_js"
					src={item.slider_image} alt="img" />			
					</a>	
			</div>
		  </div>
		  ))}
		  </Carousel>
		  </>
     }
		</div>
	  </div>
    );
  }
}

export default withRouter(VVbannerVC);
