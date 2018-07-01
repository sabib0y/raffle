import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import Home from './components/Home/Home.component';
import WinningID from './components/WinningId/WinningId.component';
import WinningCodeValidation from './components/WinningCodeValidation/WinningCodeValidation.component';
import InterimPage from './components/InterimPage/InterimPage';
import moment from 'moment';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      revealRedeem: false
    }
  }

  static isTimeForm(formStartTime, formEndTime, nowTime) {
    // let formStartTime = '09:25:00';
    // let formEndTime = '09:27:00';
    // let nowTime = moment().format();
    // nowTime = moment(nowTime).format("HH:mm:ss");

    if(nowTime >= formStartTime && nowTime <= formEndTime) {
      return true;
    }
    return false;
  }

  static isTimeResults(resultsStartTime, resultsEndTime, nowTime) {
    // let resultsStartTime = '09:28:00';
    // let resultsEndTime = '09:56:00';
    // nowTime = moment(nowTime).format("HH:mm:ss");

    if(nowTime >= resultsStartTime && nowTime <= resultsEndTime) {
      return true;
    }
    return false;
  }

  redeemCode() {
    this.setState({revealRedeem: true});
  }

  render() {
    let nowTime = moment().format();
    nowTime = moment(nowTime).format("HH:mm:ss");

    const formStartTime = '09:25:00';
    const formEndTime = '09:27:00';

    const resultsStartTime = '09:28:00';
    const resultsEndTime = '09:56:00';

    let textInterim;

    if (nowTime > formEndTime && nowTime < resultsStartTime) {
      textInterim = 'Results will be published shortly... Thank you.'
    }

    if (nowTime > resultsEndTime && nowTime < formStartTime) {
      textInterim = 'New competition entry will resume shortly ... Thank you.'
    }
    else {
      textInterim = 'Thank you';
    }

    return (
      <div className="container-fluid appWrapper">
        <div>
          <h1 className="headerText">Welcome to Dailychoppins!</h1>
        </div>
        {App.isTimeForm(formStartTime, formEndTime, nowTime) &&
          <Home/>
        }
        {App.isTimeResults(resultsStartTime, resultsEndTime, nowTime) ?
          (<div>
            <WinningID
              id={this.props.id}
              uniqueId={this.props.uniqueId}
            />
            <div>
              Have a winning code?
              <a
                href="#"
                onClick={() => this.redeemCode()}
              >click to redeem code
              </a>
            </div>
            {this.state.revealRedeem &&
            <WinningCodeValidation
              uniqueId={this.props.uniqueId}
            />
            }
          </div>) :
          (
            <InterimPage
              textInterim={textInterim}
            />
          )}
      </div>
    );
  }
}

export default App;
