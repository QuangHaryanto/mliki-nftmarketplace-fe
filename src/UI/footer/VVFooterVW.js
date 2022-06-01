import React from 'react';
import { Link } from 'react-router-dom';
import { getOptions } from '../../services/VVUserService';

const scrollToTop = () =>{
	window.scrollTo({
	  top: 0, 
	  behavior: 'smooth'
	});
	};

class VVFooterVW extends React.Component {
  constructor() {
    super()
    this.state = {
			facebook:'',
			messenger:'',
			whatsapp:'',
			youtube:'',
			copy_rights:'',
			footer_html:'',
			footerloading: true,
		}
  }

  componentDidMount() {
    this.getFooter(); 
  }

  getFooter = () => {
    getOptions('footer').then(result=>{
      if(result.status === true) {
      	var parse = JSON.parse(result.result.value);
        this.setState({
          facebook: parse.facebook,
          messenger: parse.messenger,
          whatsapp: parse.whatsapp,
          youtube: parse.youtube,
          copy_rights: parse.copy_rights,
          footer_html: parse.footer_html,
          footerloading: false
        })
      }
    })
  }


  render() {
    return (
		<div>
<footer className="footer__1">
  <div className="container">
	<div className="row">
	  <div className="col-lg-6 space-y-20">
		<div className="footer__logo">
		  <Link to="/">
			<img src={`/assets/img/logos/Logo.svg`} alt="logo" id="logo_js_f" />
		  </Link>
		</div>
		<p className="footer__text">
		  Mliki is a shared liquidity NFT market smart contract
		</p>
		{ (!this.state.footerloading) &&
			<>
		<div>
		  <ul className="footer__social space-x-10 mb-40">
			<li>
			  <a href={this.state.facebook} rel="noreferrer"  target="_blank">
				<i className="ri-facebook-line" />
			  </a>
			</li>
			<li>
			  <a href={this.state.messenger} rel="noreferrer"  target="_blank">
				<i className="ri-messenger-line" />
			  </a>
			</li>
			<li>
			  <a href={this.state.whatsapp} target="_blank" rel="noreferrer" >
				<i className="ri-whatsapp-line"  />
			  </a>
			</li>
			<li>
			  <a href={this.state.youtube} target="_blank" rel="noreferrer" >
				<i className="ri-youtube-line" />
			  </a>
			</li>
		  </ul>
		</div>
		</>
		}
	  </div>
	  { (!this.state.footerloading) &&
	  	<div className="col-lg-6 space-y-20" dangerouslySetInnerHTML={{__html: this.state.footer_html}} />
		}
	</div>
	{ (!this.state.footerloading) &&
	<p className="copyright text-center">
	  {this.state.copy_rights}
	</p>
	}
  </div>
</footer>
	  </div>
    );
  }
}

export default VVFooterVW;
