import React from 'react';
import { createRoot } from 'react-dom/client';
import './Styles/Styles.scss';
import App from './App';
import '../../node_modules/@mdi/font/css/materialdesignicons.min.css';
import '../../node_modules/materialize-css/dist/css/materialize.min.css';
import '../../node_modules/materialize-css/dist/js/materialize.min.js';
import { BrowserRouter as Router } from 'react-router-dom';

// Use createRoot instead of ReactDOM.render
createRoot(document.getElementById('root')).render(
  <Router>
    <App />
  </Router>
);


//If you want to start measuring performance in your app, pass a function
//to log results (for example: reportWebVitals(console.log))
//or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals

