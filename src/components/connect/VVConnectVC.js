import React from 'react';
import {
  Link,
  withRouter
  } from "react-router-dom";
import 'reactjs-popup/dist/index.css';
import {actionNotifyUser} from './../../redux/NotifyAction'
import {connect} from 'react-redux';
import { getUser } from '../../services/VVUserService';
class VVConnectVC extends React.Component {
  constructor() {
    super()
    this.state = {
      wallets: [

        {
          title: 'metamask',
          p: "A browser extension with great flexibility. The web's popular wallet",
        },
        {
          title: 'torus',
          p: 'Log in with Google,  Facebook,Twitter or other OAuth providers',
        },
        {
          title: 'fortmatic',
          p: 'wallet that allows you to  sign in with an email and password',
        },
        {
          title: 'walletconnect',
          p: 'wallet that allows you to  sign in with an email and password',
        },
      ]
    }
  }

  componentDidMount() {
  //  this.initFields();
  }


  initFields = () => {
    let user = getUser();
    if(user !== null) {
    //  this.props.history.push("/")
    }
  }

  componentDidUpdate(prevProps) {
    if(this.props.notifier !==prevProps.notifier) {
      let notifier = this.props.notifier;
      if(notifier) {
        if(notifier.type === 'login'){
          this.initFields()
        }
      }
    }
  }

  connectWallet = (wallet) => {
    this.props.actionNotifyUser({
      type: 'connect',
      payload: wallet
    });
  }


	render() {
		return (
			<div className="effect">

      <div className="container">
        <div>
          <Link to="/" className="btn btn-white btn-sm mt-20">
            Back to home
          </Link>
          <div className="hero__wallets pt-100 pb-50">
            <div className="space-y-20 d-flex flex-column align-items-center">
              <div className="logo">
                <img src={`/assets/img/icons/logo.svg`} alt="ImgPreview" />
              </div>
              <h2 className="text-center color_text">Connect your wallet</h2>
              <p className="text-center">
                Connect with one of available wallet providers or create a new
                wallet.
              </p>
            </div>
          </div>
        </div>

        <div className="row justify-content-center">
          <div className="col-lg-9">
            <div className="wallets">
              <div className="row mb-20_reset">
                {this.state.wallets.map((val, i) => (
                  <div className="col-xs-12 col-sm-6 col-md-6 col-lg-6" key={i}>
  
                        <button className="box in__wallet space-y-10" onClick={()=>{
                          this.connectWallet(val.title)
                        }}>
                          <div className="logo">
                            <img
                              src={`/assets/img/icons/${val.title}.svg`}
                              alt="logo_community"
                            />
                          </div>
                          <h5 className="text-center color_white">{val.title}</h5>
                          <p className="text-center">{val.p}</p>
                        </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
		);
	}
}

function mapStateToProps(state) {
	return {
	  notifier: state.notifier
	};
}

export default connect(mapStateToProps, {actionNotifyUser})(withRouter(VVConnectVC))