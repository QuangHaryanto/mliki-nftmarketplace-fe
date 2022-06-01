import React from 'react';
import {
  Link
  } from "react-router-dom";
var _ = require('lodash');
class VVUploadOptionsVC extends React.Component {

  constructor() {
    super(); 
    this.state = {
      collectionid: '',
    };
  } 


  render() {    
    var pathArray = this.props.location.pathname.split("/")
    if(pathArray.length == 3){
      this.state.collectionid = pathArray[2]
    }
    if(this.state.collectionid == ''){      
      window.location = "/";
    }
    return (
      <>
      <div class="row">
      <div class="col-12 mt-5">

          <ul class="uploadContainer">
            <li>
              <Link to={"/additem/"+this.state.collectionid}>
                <div class="uploadSub">
                  <img src={`/assets/img/icons/single.svg`} alt="folder" />                  
                  <h3>Single Item</h3>
                </div>
                </Link>
            </li>

            <li>
              <Link to={"/import-item"}>
                <div class="uploadSub">
                  <img src={`/assets/img/icons/multiple.svg`} alt="folder" />
                  <h3>Multiple Item</h3>
                </div>
              </Link>
            </li>
          </ul>

      </div>
      </div>
      </>
      );
  }
}

export default VVUploadOptionsVC;
