import React from 'react';
import {
  Link,
  withRouter,
} from "react-router-dom";
import { connect } from 'react-redux';
import { api } from '../../../helper/VVApi';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { toast } from 'react-toastify';
import { getUser } from '../../../services/VVUserService';
import { Button,Modal} from 'react-bootstrap';  
import { ethers } from 'ethers';
import { config } from '../../../helper/VVConfig';
import { actionNotifyUser } from '../../../redux/NotifyAction'
import { getProfileAPI } from '../../../services/VVUserService';
class VVItemWalletVC extends React.Component {

  constructor() {
    super();
    this.state = {
      user_id:'',
      walletAmount:'',
      walletAddress:'',
      copied: false,
      depositModal: false,
      amount:'',
      transferModal: false,
      transferAmount:''
    };
  }

  componentDidMount(){
    window.location = "/";
    let user = getUser();
    this.getProfileInfo(user);
  }

  componentDidUpdate(prevProps) {
    if(this.props.notifier !==prevProps.notifier) {
      let user = getUser();
      let notifier = this.props.notifier;
      if(notifier) {
        if(notifier.type === 'deposit_success') {
          this.setState({
            depositModal: false
          })
        }else if(notifier.type === 'withdraw_success') {
          this.setState({
            transferModal: false
          })
        }         
        this.getProfileInfo(user);
      } 
    }     
  }

  getProfileInfo = (user) => {
    this.setState({ walletAddress:user.public_key, user_id: user.user_id });
    getProfileAPI(user.user_id).then(result=>{
       if(result.status === true) {
          let currentUser = result.result
          this.setState({
            walletAmount: (currentUser.wallet_amount == 0) ? 0 : parseFloat(currentUser.wallet_amount).toFixed(2),
          })
       }
    })
  }

  actions = () => {
    toast('Ethereum address copied', {
      type: "success",
      toastId: 'successWallet'
    });
  }

  handleModal = () =>{  
    this.setState({depositModal:!this.state.depositModal,amount:''});  
  }

  handleTrModal = () =>{  
    this.setState({transferModal:!this.state.transferModal,transferAmount:''});  
  }

  handleChange = (event) => {
    this.setState({amount: event.target.value});
  }

  handleTrChange = (event) => {
    this.setState({transferAmount: event.target.value});
  } 

  doDeposit = async () =>{
    console.log(this.state.amount);
    this.props.actionNotifyUser({
      type: 'deposit',
      payload: {'wallet': this.state.walletAddress, 'amount': this.state.amount, 'user_id': this.state.user_id}
    });
  }

  doWithdraw = async () => {
    console.log(this.state.walletAmount)
    console.log(this.state.transferAmount)
    toast.dismiss(this.toastObj);
    if(this.state.walletAmount >= this.state.transferAmount){
      this.props.actionNotifyUser({
        type: 'withdraw',
        payload: {'wallet': this.state.walletAddress, 'amount': this.state.transferAmount, 'user_id': this.state.user_id}
      });
    }else{
      this.toastObj = toast('Insufficient fund', {
        type: "errors",
        toastId: 'errorsWallet'
      });
    }
  }
 
  render() {
    return (
      <div class="pagecontainer walletPage">
        <div class="container">
        <div class="row">
            <div class="col-lg-12">
              <div class="card">
                <div class="card-header">
                  <h3>Wallet</h3>
                </div>

                <div class="card-body">
                    <div class="row">
                        <div class="col-12">
                            <div class="">
                                <h4>Your Wallet Balance : {this.state.walletAmount} {config.currency} </h4>
                            </div>
                        </div>
                    </div>
                    <div class="form-group row">
                        <div class="col-12">
                            <div class="input-group">
                                <input type="text" value={this.state.walletAddress} class="form-control" disabled />
                                <CopyToClipboard text={this.state.walletAddress}
                                  onCopy={() => this.setState({copied: true})}>
                                  <span>Copy</span>
                                </CopyToClipboard> 
                                {this.state.copied ? this.actions() : null}
                            </div>
                        </div>
                    </div>

                      <div class="row">
                        <div class="text-center">
                          <div class="mt-2 mb-2">
                              <button type="button" class="btn btn-white others_btn" onClick={()=>{this.handleModal()}}>Deposit</button>                            
                              <button type="button" class="btn btn-white others_btn" onClick={()=>{this.handleTrModal()}}>Withdraw</button>
                          </div>
                        </div>
                      </div>
                </div>

              </div>
              <Modal show={this.state.depositModal} onHide={()=>this.handleModal()}>  
                  <Modal.Header closeButton>Deposit MATIC</Modal.Header>  
                  <Modal.Body class="walletBody">
                    <div class="form-group">
                        <h5>MATIC Value</h5>
                        <input type="number" value={this.state.amount} onChange={this.handleChange} placeholder="Enter MATIC Value" class="form-control" />
                    </div>
                  </Modal.Body>  
                  <Modal.Footer>  
                    <Button onClick={()=>this.handleModal()}>Close</Button>  
                    <Button onClick={()=>this.doDeposit()}>Save</Button>  
                  </Modal.Footer>  
                </Modal>
                <Modal show={this.state.transferModal} onHide={()=>this.handleTrModal()}>  
                  <Modal.Header closeButton>Transfer MATIC</Modal.Header>  
                  <Modal.Body class="walletBody">
                    <div class="form-group">
                        <h5>MATIC Value</h5>
                        <input type="number" value={this.state.transfer_amount} onChange={this.handleTrChange} placeholder="Enter MATIC Value" class="form-control" />
                    </div>
                  </Modal.Body>  
                  <Modal.Footer>  
                    <Button onClick={()=>this.handleTrModal()}>Close</Button>  
                    <Button onClick={()=>this.doWithdraw()}>Save</Button>  
                  </Modal.Footer>  
                </Modal>  
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

export default connect(mapStateToProps, {actionNotifyUser})(withRouter(VVItemWalletVC));
