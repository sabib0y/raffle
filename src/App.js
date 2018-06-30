import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import Home from './components/Home/Home.component';
import WinningID from './components/WinningId/WinningId.component';
import WinningCodeValidation from './components/WinningCodeValidation/WinningCodeValidation.component';
import InterimPage from './components/InterimPage/InterimPage';
import moment from 'moment';

class App extends Component {

  isTimeForm() {
    let formStartTime = '00:27:00';
    let formEndTime = '00:30:00';
    let nowTime = moment().format();
    nowTime = moment(nowTime).format("HH:mm:ss");

    if(nowTime >= formStartTime && nowTime <= formEndTime) {
      return true;
    }
    return false;
  }

  isTimeResults() {
    let resultsStartTime = '00:31:00';
    let resultsEndTime = '00:33:00';
    let nowTime = moment().format();
    nowTime = moment(nowTime).format("HH:mm:ss");

    if(nowTime >= resultsStartTime && nowTime <= resultsEndTime) {
      return true;
    }
    return false;
  }

  render() {
    return (
      <div className="container-fluid appWrapper">
        <div>
          <h1 className="headerText">Welcome to Dailychoppins!</h1>
        </div>
        {this.isTimeForm() &&
          <Home/>
        }
        {this.isTimeResults() &&
        <div>
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
        </div>
        }
        {!this.isTimeResults() || !this.isTimeResults() &&
          <InterimPage/>
        }
      </div>
    );
  }
}

export default App;
