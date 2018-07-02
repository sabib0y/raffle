import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import Home from './components/Home/Home.component';
import WinningID from './components/WinningId/WinningId.component';
import WinningCodeValidation from './components/WinningCodeValidation/WinningCodeValidation.component';
import InterimPage from './components/InterimPage/InterimPage';
import moment from 'moment';
import Footer from'./components/Footer/Footer.component';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      revealRedeem: false,
      formStartTime: '07:00:00',
      formEndTime: '19:00:00',
      resultsStartTime: '20:00:00',
      resultsEndTime: '21:00:00',
    }
  }

  static isTimeForm(formStartTime, formEndTime, nowTime) {
    if(nowTime >= formStartTime && nowTime <= formEndTime) {
      return true;
    }
    return false;
  }

  static isTimeResults(resultsStartTime, resultsEndTime, nowTime) {
    if(nowTime >= resultsStartTime && nowTime <= resultsEndTime) {
      return true;
    }
    return false;
  }

  static isIntervalPreResults(formEndTime, resultsStartTime, nowTime) {
    if(nowTime > formEndTime && nowTime < resultsStartTime) {
      return true;
    }
    return false;
  }

  static isIntervalPreForm(resultsEndTime, formStartTime, nowTime) {
    if(nowTime > resultsEndTime && nowTime < formStartTime) {
      return true;
    }
    return false;
  }

  redeemCode() {
    this.setState({revealRedeem: true});
  }

  render() {
    const timeToCheck = [
      '07:00:00', //form startTime
      '10:00:00', //form endTime
      '11:00:00', //results startTime
      '11:30:00', //results endTime
    ];

    let newArray = [];

    timeToCheck.map(item => {
      let timeToConvert = moment().utc().toISOString();
      timeToConvert = timeToConvert.split('T')[0];
      timeToConvert = `${timeToConvert}T${item}`;
      timeToConvert = moment.parseZone(timeToConvert).utc().format();
      newArray.push(timeToConvert)
    });

    let nowTime = moment().utc().format();
    var textInterim;

    if (nowTime > newArray[1] && nowTime < newArray[2]) {
      textInterim = 'Results will be published shortly... Thank you.'
    }

    if (nowTime > newArray[3] && nowTime < newArray[0]) {
      textInterim = 'New competition entry will be available shortly ... Thank you.'
    }
    else {
      textInterim = 'Thank you';
    }

    return (
      <div className="container-fluid appWrapper">
        <div>
          <h1 className="headerText">Welcome to Dailychoppins!</h1>
        </div>
        {App.isTimeForm(newArray[0], newArray[1], nowTime) &&
          <Home/>
        }
        {App.isTimeResults(newArray[2], newArray[3], nowTime) &&
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
        {App.isIntervalPreForm(newArray[3], newArray[0], nowTime) &&
          <InterimPage
            textInterim={textInterim}
          />
        }
        {App.isIntervalPreResults(newArray[1], newArray[2], nowTime) &&
          <InterimPage
            textInterim={textInterim}
          />
        }
        <Footer />
      </div>
    );
  }
}

export default App;
