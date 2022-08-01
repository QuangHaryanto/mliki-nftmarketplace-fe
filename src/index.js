import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import 'remixicon/fonts/remixicon.css'
import "./assets/scss/style.scss";
import App from './App';
import reportWebVitals from './reportWebVitals';
import { HashRouter } from 'react-router-dom'


ReactDOM.render(
  <React.StrictMode>
    <HashRouter
      hashType={'#/'}
    >
      <App />
    </HashRouter>
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
