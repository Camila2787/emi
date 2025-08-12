// By default, this project supports all modern browsers.
// Support for Internet Explorer 11 requires polyfills.
// For to support Internet Explorer 11, install react-app-polyfill,
// https://github.com/facebook/create-react-app/tree/master/packages/react-app-polyfill
// import 'react-app-polyfill/ie11';
// import 'react-app-polyfill/stable';
import 'typeface-muli';
import './react-table-defaults';
import './react-chartjs-2-defaults';
import './styles/index.css';
import React from 'react';
import ReactDOM from 'react-dom';
import App from 'app/App';


ReactDOM.render(
        <App />
    ,
    document.getElementById('root')
);