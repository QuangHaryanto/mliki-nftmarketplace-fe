import React from 'react';
import {
  Link,
  withRouter,
} from "react-router-dom";
import { Stepper, Step } from 'react-form-stepper';
import {connect} from 'react-redux';
import Uploady from "@rpldy/uploady";
import UploadButton from "@rpldy/upload-button";
import {UploadHook} from './../../../hooks/uploadHook';
import { api } from '../../../helper/VVApi';
import { toast } from 'react-toastify';
import { saveCsvAPI } from '../../../services/VVItemService';
import { getUser } from '../../../services/VVUserService';
import {networkConfig} from '../../../helper/VVConfig'
import NetworkActions from '../../../redux/actions/NetworkActions';

var _ = require('lodash');
class VVItemImportVC extends React.Component {

  constructor(props) {
    super(props); 
    this.state = {
      defaulStep:0,
      csvFilename:"",
      setUsertoken:"",
      items:[],
      errorData:[],
      errorMsg:'',
      tokens:localStorage.getItem("token"),
      status: false
    };
  } 

  uploadCsv = () => {
    var token = this.state.tokens;
    return <Uploady 
      accept=".csv"
      inputFieldName="inputfile"
      destination={{ url: api.base + "/item/read-csv", headers: {"authorization": token} }}>
      <UploadButton type="button" className="collectionUploader" text="Upload CSV File"/>
        <UploadHook onDone={this.csvUploadDone} onError={this.csvUploadError}/>
      </Uploady>
  }

  csvUploadDone = (response)=> {
    this.removeTost();
    this.setState({ items:response, defaulStep:0, errorData:[], errorMsg:'', status: false });
    this.toastsucc = toast("Items uploaded successfully. Please click in next to continue.",{
      type: "success"
    });
  }

  csvUploadError = (message)=> {
    this.removeTost();
    this.toasterr = toast(message,{
      type: "error"
    });
  }

  listItem = () => {
    let count = this.state.items.length;
    if(count==0){
      this.removeTost();
      this.toasterr = toast('No records found', {
        type: "error"
      });
    }else{
      this.setState({ defaulStep:1 });
    }
  }

  deleteAction = (index) => {
    this.state.items.splice(index, 1);
    console.log(this.state.items.length);
    if(this.state.items.length==0){
      this.setState({
        defaulStep: 0,
        items: this.state.items,
        errorData:[],
        errorMsg:'',
        status: false
      })
    }else{
      this.setState({
        items: this.state.items
      })  
    }
  }

  clearItem = () => {
    this.setState({
      defaulStep: 0,
      items: [],
      errorData:[],
      errorMsg:'',
      status: false
    })
  }

  removeTost = () => {
    toast.dismiss(this.toastObj);
    toast.dismiss(this.toasterr);
    toast.dismiss(this.toastsucc);
  }

  saveItem = () => {
    this.setState({ defaulStep:2 });
    let user = getUser();
    console.log(user);
    let params = {
        address: user.public_key,
        blockchain: this.props.config.block_chain,
        currency: this.props.config.currency,
        contract_address: this.props.config.contract_address,
        network_id: this.props.config.networkId,
        result: this.state.items
    };
    this.removeTost();
     this.toastObj = toast("Creating item please wait",{
            type: "success"
          });
    saveCsvAPI(params).then(result=>{
        if(result.status === false) {  
        this.removeTost();        
            this.toasterr = toast('Please check the errors',{
                type: "error"
            });
            if (result.errors.message && result.errors.message != '') {
              this.setState({
                errorMsg: result.errors.message
              })
            }else{
              let errors = this.state.errorData;
              for (let index = 0; index < result.errors.length; index++) {
                errors.push(result.errors[index]);
              }
              this.setState({
                errorData: errors,
                status: false
              })
            } 
            console.log(this.state.errorData);
            return false
        }else{
          this.setState({ defaulStep:3 });
          this.removeTost();
          this.toastsucc = toast("Items created successfully",{
            type: "success"
          });
          this.setState({
            errorData:[],
            errorMsg:'',
            status: true
          })
        }
    })
  }

  downloadCsv = () => {
    const params = [
      'Name',
      'Collection',
      'Category',
      'External Link',
      'Description',
      'Thumb Image URL',
      'Media URL',
      'No of Copies'
    ];
    const parsedResponse = params;
    const blob = new Blob([parsedResponse], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const filename = 'Item_' + Date.now() + '.csv';
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  }

  render() {
    return (
      <>


      <div class="container">
        <div class="row mt-4">
          <div class="right_btn">
            <a class="btn btn-white others_btn" href="javascript:void(0)" onClick={this.props.history.goBack}>Back</a>
            <a class="btn btn-white others_btn" href="javascript:void(0)" onClick={()=>{this.downloadCsv()}}>Download Csv</a>
          </div>
        </div>
      </div>

      <div class="container item_stepper">    
      <div class="row">

          {/* <ul class="uploadContainer">
            <li>
              <a>
                <div class="uploadSub">
                  <img src={`/assets/img/icons/single.svg`} alt="folder" />                  
                  <h3>Single Item</h3>
                </div>
                </a>
            </li>

            <li>
              <a>
                <div class="uploadSub">
                  <img src={`/assets/img/icons/multiple.svg`} alt="folder" />
                  <h3>Multiple Item</h3>
                </div>
              </a>
            </li>
          </ul> */}



      <Stepper activeStep={this.state.defaulStep}>
        <Step label="Choose Item" />
        <Step label="Upload Item" />
        <Step label="Done" />
      </Stepper>

    <div class="col-md-8 offset-md-2 col-sm-12">
      { (this.state.defaulStep==0) &&
       <>
        <div class="text-center chooseContainer">
          <div class="sign__file">
            {this.uploadCsv()}
          </div> 
        </div>
        <div class="text-center mt-4 mb-2">
        <a class="btn btn-white others_btn" href="javascript:void(0)" onClick={()=>{this.listItem()}}>Next</a>
        </div>
        <div class="text-center successnoteMessage"><p>Note: Kindly use only CSV file.</p></div>
       </>
      }
      { (this.state.defaulStep==1 && this.state.items.length > 0) &&
        <div class="table-responsive">
        <table class="listView">
        <thead>
        <tr>
          <th>Name</th>
          <th>Collection</th>
          <th>Thumb</th>
          <th>Action</th>
        </tr>
        </thead>
        <tbody>
          {this.state.items.map((result, index) => (
             <tr>
             <td>{result.name}</td>
             <td>{result.collection}</td>
             <td><img src={result.thumb_image_url} width="75px" /></td>
             <td><a class="btn btn-white others_btn" href="javascript:void(0)" onClick={()=>{this.deleteAction(index)}}>Delete</a></td>
             </tr>
          ))}

          <tr>
          <td colSpan={4}>          
          </td>
          </tr>
         </tbody>
        </table>

        <div class="bottomButtons">
        <a class="btn btn-white others_btn" href="javascript:void(0)" onClick={()=>{this.clearItem()}}>Back</a>
          <a class="btn btn-white others_btn" href="javascript:void(0)" onClick={()=>{this.clearItem()}}>Clear All</a>
          <a class="btn btn-white others_btn" href="javascript:void(0)" onClick={()=>{this.saveItem()}}>Next</a> 
        </div>
        </div>
      }
      { this.state.defaulStep==2 &&
        <>
        { this.state.errorData.length > 0 &&
          <>
          <div class="mt-4 mb-4 text-center errorResult">
            <h2>Errors in uploaded CSV file:</h2>
            <ul class="report-email">
              {this.state.errorData.map((errorResponse, errorIndex) => (
                <li>
                  <b>Row: {errorResponse.row}</b>
                  {errorResponse.msg.map((response, index) => (
                    <div>Error Details: {response}</div>  
                  ))}
                </li>
              ))}
            </ul>
          </div>
          <div class="text-center">
          <a class="btn btn-white others_btn" href="javascript:void(0)" onClick={()=>{this.clearItem()}}>Add More</a>
        </div>
          </>
        }

        { this.state.errorMsg!='' &&
          <>
            <div class="text-center errorMessage">
              <p>{this.state.errorMsg}</p>
            </div>
            <div class="text-center">
              <a class="btn btn-white others_btn" href="javascript:void(0)" onClick={()=>{this.clearItem()}}>Add More</a>
            </div>
          </>
        }        
        { ((this.state.errorData.length == 0) && (this.state.errorMsg =='')) &&
          <>
            <div class="text-center successMessage">
              <p>Creating item please wait..</p>
            </div>
          </>
        }
        </>
      }
      { this.state.defaulStep==3 &&
        <>
        { this.state.status==true &&
          <div class="text-center successMessage">
          <p>Items updated successfully!!!</p>
          </div>
        }
        <div class="text-center">
          <a class="btn btn-white others_btn" href="javascript:void(0)" onClick={()=>{this.clearItem()}}>Add More</a>
        </div>
        </>
      }
      </div>
      </div>
      </div>
      </>
      );
  }
}


function mapStateToProps(state) {
  const config = networkConfig[state.paymentnetwork.networkName]
  return {
    notifier: state.notifier,
    config
  };
}
function mapDispatchToProps(dispatch) {
  return {
    setNetworkName: data => dispatch(NetworkActions.changeNetwork(data)),    
  };
}

export default connect(mapStateToProps,mapDispatchToProps)(withRouter(VVItemImportVC));
