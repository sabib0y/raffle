import registerServiceWorker from './registerServiceWorker';
import React from 'react';
import ReactDOM from 'react-dom';
import {applyMiddleware, compose, createStore} from 'redux';
import { Route, HashRouter, Link } from 'react-router-dom';
import thunk from 'redux-thunk';
import {Provider} from 'react-redux';
import App from './App.container';
// import ComingSoon from './components/ComingSoon/ComingSoon';
import Error from './components/Error/Error.container';
import reducer from './redux/index';
// import createLogger from 'redux-logger';
import './base.scss';
import './index.css';
import ParticleAnimation from 'react-particle-animation';
import ImageLocal from './images/logo.png';
import InterimPage from "./components/InterimPage/InterimPage.container";
import WinningID from "./components/WinningId/WinningId.container";
import Footer from "./components/Footer/Footer.component";

// Create redux store
// const loggerMiddleware = createLogger();
const store = createStore(reducer, compose(
  // applyMiddleware(thunk, loggerMiddleware),
  applyMiddleware(thunk),
  window.devToolsExtension ? window.devToolsExtension() : f => f
));

// Create app
const container = document.getElementById('root');

// Render app
ReactDOM.render(
  <HashRouter>
    <Provider store={store}>
      <div>
      <div id="particle_wrapper">
     <ParticleAnimation
        numParticles={200}
        particleSpeed ={0.5}
        interactive={false}
        background = {{
          r: 56,
          g: 32,
          b: 166,
          a: 1
        }}
        style={{
          position: 'absolute',
          width: '100%',
          height: '100%'
        }}
      />
      </div>
      <div id="overall_wrapper">
        <header>
          <div id="logo">
            <img
              src={ImageLocal}
              alt="dailychoppins logo"/>
          </div>
          {/*<div>*/}
            {/*<h1 className="headerText">Welcome to Dailychoppins!</h1>*/}
          {/*</div>*/}
          <h1 className="headerText">Welcome to Dailychoppins!</h1>
          <h2 id="teaser_text"><span className="teaser_text_time">For the first 7 days</span>we will be giving away five <span className="fiveh">₦500</span> airtime vouchers<br/>every day! <span className="large_text">Don’t miss out!!</span></h2>
        </header>
        <Route exact path='/' component={App} />
        <Route path='/awaiting-page' component={InterimPage} />
        <Route path='/claim-winnings' component={WinningID} />
        {/*<Route path='/coming-soon' component={ComingSoon} />*/}
        {/*<Route component={Error} />*/}


        <Footer />
      </div>
      </div>

    </Provider>
  </HashRouter>
  , container
);
registerServiceWorker();
