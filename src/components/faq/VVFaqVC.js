import React from 'react';
import VVBannerModal from '../../models/VVBannerModal';
import { getFaqListAPI } from '../../services/VVCommonService';
import Faq from 'react-faq-component';
import {
  Link
  } from "react-router-dom";
var _ = require('lodash');

class VVFaqVC extends React.Component {

  constructor() {
    super(); 
    this.state = {
      faqList: [],
      faqloading: true,
    };

  } 

  componentDidMount() {
    this.getFaqlist(); 
  }

  getFaqlist = () => {
    let params = {
      status : true
    };
    getFaqListAPI(params).then(result=>{
        if(result.status === true) {
        var faqlists = VVBannerModal.parseFaqList(result.data.docs);
        this.setState({
          faqList: faqlists,
          faqloading: false
        })
        console.log("this.state.faqlists ->",this.state.faqList)
      }else{
        this.setState({
          faqList: [],
          faqloading: false
        })
      }
    })    
  }

  render() {      
    return (
      <>
      <div class="faqContainer">
          <div class="container">
                <div class="row">
                    <div class="col-12 mt-5">
                        <Faq data={{title: "FAQ (How it works)",rows: this.state.faqList}}/>
                    </div>
                </div>
            </div>
        </div>
      </>
      );
  }
}

export default VVFaqVC;