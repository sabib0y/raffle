import React, { Component } from 'react';
import './App.scss';
import Home from './components/Home/Home.component';
import WinningID from './components/WinningId/WinningId.component';
import InterimPage from './components/InterimPage/InterimPage';
import moment from 'moment-timezone';
import Footer from'./components/Footer/Footer.component';
import fire from './fire';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      revealRedeem: false,
      formStartTime: null,
      formEndTime: null,
      resultsStartTime: null,
      resultsEndTime: null
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

  static isIntervalPreForm(formStartTime, resultsEndTime, newValueTomorrow, nowTime) {
    if(nowTime > resultsEndTime && nowTime < newValueTomorrow) {
      return true;
    }
    return false;
  }

  redeemCode(e) {
    e.preventDefault();
    this.setState({revealRedeem: true});
  }

  componentWillMount() {
    fire.database().ref('setTimeForm/').once('value').then((snapshot) => {
      let receivedDataTime = snapshot.val();

      this.setState({
        formStartTime: receivedDataTime.postData.formStart,
        formEndTime: receivedDataTime.postData.formEnd,
        resultsStartTime: receivedDataTime.postData.resultStart,
        resultsEndTime: receivedDataTime.postData.resultEnd
      });
    });
  }

  render() {
    const timeToCheck = [
      this.state.formStartTime, //form startTime
      this.state.formEndTime, //form endTime
      this.state.resultsStartTime, //results startTime
      this.state.resultsEndTime, //results endTime
    ];

    let newArray = [];
    newArray.push(
      timeToCheck[0],
      timeToCheck[1],
      timeToCheck[2],
      timeToCheck[3]
      );

    let nextDayValue = moment();
    nextDayValue = nextDayValue.add(1, 'days').format();
    nextDayValue = nextDayValue.split('T')[0];
    nextDayValue = `${nextDayValue}T00:00:01Z`;
    nextDayValue = moment(nextDayValue).format();

    newArray.push(nextDayValue);

    let nowTime = moment().format();

    return (
      <div className="container-fluid appWrapper">
        <div>
          <h1 className="headerText">Welcome to Dailychoppins!</h1>
        </div>
        {App.isTimeForm(newArray[0], newArray[1], nowTime) &&
          <Home/>
        }
        {App.isTimeResults(newArray[2], newArray[3], nowTime) &&
          <div className="winning_validation draw_content_container">
            <WinningID
              id={this.props.id}
              uniqueId={this.props.uniqueId}
            />
          </div>
        }
        {App.isIntervalPreForm(newArray[0], newArray[3], newArray[4], nowTime) &&
          <InterimPage
            textInterim='New competition entry will be available shortly ... Thank you.'
          />
        }
         {App.isIntervalPreResults(newArray[1], newArray[2], nowTime) &&
          <InterimPage
            textInterim='Results will be published shortly... Thank you.'
          />
        }
        <Footer />
      </div>
    );
  }
}

export default App;
