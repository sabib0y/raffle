import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import Home from './components/Home/Home.component';
import WinningID from './components/WinningId/WinningId.component';
import WinningCodeValidation from './components/WinningCodeValidation/WinningCodeValidation.component';
import InterimPage from './components/InterimPage/InterimPage';
import moment from 'moment-timezone';
import Footer from'./components/Footer/Footer.component';
import fire from './fire'

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      revealRedeem: false,
      formStartTime: '07:00:00',
      formEndTime: '12:30:00',
      resultsStartTime: '12:45:00',
      resultsEndTime: '13:45:00',
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

  static isIntervalPreResults(formEndTime, preResults, nowTime) {
    if(nowTime > formEndTime && nowTime < preResults) {
      return true;
    }
    return false;
  }

  static isIntervalPreForm(resultsEndTime, tomorrowFormStartTime, nowTime) {
    if(nowTime > resultsEndTime && nowTime < tomorrowFormStartTime) {
      return true;
    }
    return false;
  }

  redeemCode() {
    this.setState({revealRedeem: true});
  }

  render() {


    const test = true;
    // fromNow
    const produceResults = {
      formEnd: '14:00:00',
      resultsStart: '19:00:00',
    };
    let timeNow = moment().tz("Europe/London").format('HH:MM:SS');

    let todayDate = moment().tz("Europe/London").format();
    todayDate = todayDate.split('T')[0];

    let testTime = moment().format('HH:MM:SS');
    console.log('test', testTime);
    const timeToCheck = [
      '01:10:00', //form startTime
      '12:30:00', //form endTime
      '13:00:00', //results startTime
      '14:00:00', //results endTime
    ];

    let newArray = [];

    timeToCheck.map(item => {
      let timeToConvert = moment().utc().toISOString();
      timeToConvert = timeToConvert.split('T')[0];
      timeToConvert = `${timeToConvert}T${item}`;
      timeToConvert = moment(timeToConvert).format();
      // timeToConvert = timeToConvert.moment(timeToConvert)
      newArray.push(timeToConvert)
    });

    let nextDayValue = moment();
    nextDayValue = nextDayValue.add(1, 'days').format();
    nextDayValue = nextDayValue.split('T')[0];
    nextDayValue = `${nextDayValue}T07:00:00Z`;
    nextDayValue = moment(nextDayValue).format();

    newArray.push(nextDayValue);

    console.log('nextDayValue', nextDayValue, newArray);

    let nowTime = moment().format();
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
          <div className="block-text">
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
        {App.isIntervalPreForm(newArray[3], newArray[4], nowTime) &&
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
