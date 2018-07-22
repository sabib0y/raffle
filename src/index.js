import registerServiceWorker from './registerServiceWorker';
import React from 'react';
import ReactDOM from 'react-dom';
import {applyMiddleware, compose, createStore} from 'redux';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import thunk from 'redux-thunk';
import {Provider} from 'react-redux';
import App from './App';
import ComingSoon from './components/ComingSoon/ComingSoon';
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
  <Provider store={store}>
      <Router path='/'>
        <div>
          <Route path='/app' component={App} />
          <Route path='/comingsoon' component={ComingSoon} />
        </div>
      </Router>
  </Provider>
  , container
);
registerServiceWorker();
