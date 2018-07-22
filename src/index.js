import registerServiceWorker from './registerServiceWorker';
import React from 'react';
import ReactDOM from 'react-dom';
import {applyMiddleware, compose, createStore} from 'redux';
import { BrowserRouter as Router, Route, HashRouter } from 'react-router-dom';
import thunk from 'redux-thunk';
import {Provider} from 'react-redux';
import App from './App';
import ComingSoon from './components/ComingSoon/ComingSoon';
import Error from './components/Error/Error';
import reducer from './redux/index';
import createLogger from 'redux-logger';
import './base.scss';
import './index.css';

// Create redux store
const loggerMiddleware = createLogger();
const store = createStore(reducer, compose(
  applyMiddleware(thunk, loggerMiddleware),
  window.devToolsExtension ? window.devToolsExtension() : f => f
));

// Create app
const container = document.getElementById('root');

// Render app
ReactDOM.render(
  <HashRouter path='/'>
    <Provider store={store}>
      <div>
        <Route path='/home' component={App} />
        <Route path='/coming-soon' component={ComingSoon} />
        <Route path='/error' component={Error} />
      </div>
    </Provider>
  </HashRouter>
  , container
);
registerServiceWorker();
