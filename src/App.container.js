import React, { Component } from 'react';
import './App.scss';
import WinningID from './components/WinningId/WinningId.container';
import InterimPage from './components/InterimPage/InterimPage.container';
import Home from './components/Home/Home.container';
import moment from 'moment-timezone';
import fire from './fire';
import {connect} from "react-redux";
import {getTimeForm} from "./redux/actions";

export class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      revealRedeem: false,
      formStartTime: null,
      formEndTime: null,
      resultsStartTime: null,
      resultsEndTime: null,
      time: 10,
      timeNow: new Date(),
      testData: '',
      testTime: ''
    }
  }

  isTimeForm(formStartTime, formEndTime, siteLaunch, nowTime) {
    if(nowTime > formStartTime && nowTime < formEndTime && nowTime > siteLaunch && formStartTime !== null) {
      return true;
    }
    return false;
  }

  isTimeResults(resultsStartTime, resultsEndTime, nowTime, siteLaunch) {
    if(nowTime > siteLaunch && nowTime >= resultsStartTime && nowTime <= resultsEndTime && resultsEndTime !== null) {
      this.props.history.push('/claim-winnings');
      return true;
    }
    return false;
  }

  isIntervalPreResults(formEndTime, resultsStartTime, nowTime, siteLaunch) {
    if(nowTime > formEndTime && nowTime < resultsStartTime && formEndTime !== null && nowTime > siteLaunch) {
      this.props.history.push('/awaiting-page');
      return true;
    }
    return false;
  }

  isIntervalPreForm(formStartTime, resultsEndTime, nextDayValue, nowTime, siteLaunch) {
    if(nowTime > resultsEndTime && nowTime < nextDayValue && nowTime > siteLaunch && resultsEndTime !== null) {
      this.props.history.push('/awaiting-page');
      return true;
    }
    return false;
  }

  isErrorLaunch(formStartTime, siteLaunch, nowTime) {
    if(nowTime < siteLaunch) {
      // this.props.history.push('/error');
      return true;
    }
    return false
  }

  isWinningId(siteLaunch, nowTime) {
    if(nowTime < siteLaunch){
      this.props.history.push('/coming-soon');
      return true;
    }
    return false;
  };

  redeemCode(e) {
    e.preventDefault();
    this.setState({revealRedeem: true});
  }

  componentDidMount() {
    fire.database().ref('setTimeForm/').once('value').then((snapshot) => {
      let receivedDataTime = snapshot.val();

      fire.database().ref('setSiteLaunch/').once('value').then((snapshot) => {
        let siteLaunchTime = snapshot.val();

        let nextDayValue = moment();
        nextDayValue = nextDayValue.add(1, 'days').format();
        nextDayValue = nextDayValue.split('T')[0];
        nextDayValue = `${nextDayValue}T00:00:01Z`;
        nextDayValue = moment(nextDayValue).format();

        const dataToSend = {
          formStartTime: new Date(receivedDataTime.postData.formStart),
          formEndTime: new Date(receivedDataTime.postData.formEnd),
          resultsStartTime: new Date(receivedDataTime.postData.resultStart),
          resultsEndTime: new Date(receivedDataTime.postData.resultEnd),
          siteLaunch: new Date("2015-08-06T07:00:34+01:00"),
          // siteLaunch: new Date(siteLaunchTime.siteLaunch),
          nextDayValue: new Date(nextDayValue),
        };
        this.props.getTimeForm(dataToSend)
      });
    });
  }

  render() {
    let nowTime = moment();

    const { formStartTime, resultsEndTime, formEndTime, resultsStartTime, siteLaunch, nextDayValue } = this.props;

    console.log('result start..', formStartTime)
    // this.isTimeForm(formStartTime, formEndTime, nowTime);
    this.isErrorLaunch(formStartTime, siteLaunch, nowTime);
    this.isTimeResults(resultsStartTime, resultsEndTime, nowTime);
    this.isWinningId(siteLaunch, nowTime);

      return (
      <div className="container-fluid appWrapper">
        {nowTime < resultsEndTime &&
          <div>
            {this.isTimeForm(formStartTime, formEndTime, siteLaunch, nowTime) &&
            <Home/>
            }
            {this.isTimeResults(resultsStartTime, resultsEndTime, nowTime, siteLaunch) &&
            <div className="winning_validation draw_content_container">
              <WinningID
                id={this.props.id}
                passedProps={this.props}
              />
            </div>
            }
            {this.isIntervalPreForm(formStartTime, resultsEndTime, nextDayValue, nowTime, siteLaunch) &&
            <InterimPage
              textInterim='New competition entry will be available in:'
              schedule="form"
              siteLaunch={siteLaunch}
              nextDayValue={nextDayValue}
            />
            }
            {this.isIntervalPreResults(formEndTime, resultsStartTime, nowTime, siteLaunch) &&
            <InterimPage
              textInterim='Results will be published in:'
              schedule="results"
              siteLaunch={siteLaunch}
            />
            }
          </div>
        }
        {nowTime > resultsEndTime &&
          <div>
            Thank you for taking part. Competition will resume at 7am tomorrow
          </div>
        }
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    formStartTime: state.get('reducer').formStartTime,
    resultsEndTime: state.get('reducer').resultsEndTime,
    formEndTime: state.get('reducer').formEndTime,
    resultsStartTime: state.get('reducer').resultsStartTime,
    siteLaunch: state.get('reducer').siteLaunch,
    nextDayValue: state.get('reducer').nextDayValue,
  };
};

const mapDispatchToProps = {
  getTimeForm,
};

export default connect(mapStateToProps, mapDispatchToProps)(App);
