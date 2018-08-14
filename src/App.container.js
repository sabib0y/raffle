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
      testTime: '',
      thankYouMessage: false
    }
  }

  isTimeForm(formStartTime, formEndTime, nowTime) {
    if(nowTime > formStartTime && nowTime < formEndTime && formStartTime !== null) {
      return true;
    }
    return false;
  }

  isTimeResults(resultsStartTime, resultsEndTime, nowTime) {
    if(nowTime >= resultsStartTime && nowTime <= resultsEndTime && resultsEndTime !== null) {
      this.props.history.push('/claim-winnings');
      return true;
    }
    return false;
  }

  isIntervalPreResults(formEndTime, resultsStartTime, nowTime) {
    if(nowTime > formEndTime && nowTime < resultsStartTime && formEndTime !== null && nowTime) {
      this.props.history.push('/awaiting-page');
      return true;
    }
    return false;
  }

  // isIntervalPreForm(formStartTime, resultsEndTime, nowTime) {
  //   if(nowTime > resultsEndTime && resultsEndTime !== null) {
  //     this.props.history.push('/');
  //     return true;
  //   }
  //   return false;
  // }

  isPostComp(nowTime, resultsEndTime){
    if(nowTime > resultsEndTime && resultsEndTime !== null) {
      return true;
    }
    return false;
  }

  // isErrorLaunch(formStartTime, nowTime) {
  //   if(nowTime < siteLaunch) {
  //     // this.props.history.push('/error');
  //     return true;
  //   }
  //   return false
  // }

  newIntervalPreForm(nowTime, formStartTime, new_date) {
    if (nowTime > new_date && nowTime < formStartTime && formStartTime !== null) {
      return true;
    }
    return false
  }

  /*
  * @TODO fix isPreFormCountDown
  * */



  isPreFormCountDown(nowTime, new_date, formStartTime, resultsEndTime) {
    if(nowTime > new_date && nowTime < formStartTime && formStartTime !== null) {
      this.props.history.push('/awaiting-page');
    }

    if(nowTime < formStartTime && nowTime < new_date) {
      this.setState({
        thankYouMessage: true
      })
    }
  }

  // isWinningId(siteLaunch, nowTime) {
  //   if(nowTime < siteLaunch){
  //     this.props.history.push('/coming-soon');
  //     return true;
  //   }
  //   return false;
  // };

  redeemCode(e) {
    e.preventDefault();
    this.setState({revealRedeem: true});
  }

  componentDidMount() {
    
    fire.database().ref('setTimeForm/').once('value').then((snapshot) => {
      let receivedDataTime = snapshot.val();

      fire.database().ref('setSiteLaunch/').once('value').then((snapshot) => {
        let siteLaunchTime = snapshot.val();

        const dataToSend = {
          formStartTime: new Date(receivedDataTime.postData.formStart),
          formEndTime: new Date(receivedDataTime.postData.formEnd),
          resultsStartTime: new Date(receivedDataTime.postData.resultStart),
          resultsEndTime: new Date(receivedDataTime.postData.resultEnd),
          siteLaunch: new Date(siteLaunchTime.siteLaunch),
        };
        this.props.getTimeForm(dataToSend)
      });
    });
  }

  render() {
    let nowTime = moment().tz("Africa/Lagos").format();
    nowTime = new Date(nowTime);

    // const { formStartTime, resultsEndTime, formEndTime, resultsStartTime, siteLaunch } = this.props;
    let formStartTime, resultsEndTime, formEndTime, resultsStartTime, siteLaunch ;

    formStartTime = new Date("2018-08-14T06:50:31+01:00");
    resultsEndTime = new Date("2018-08-14T20:00:31+01:00");
    formEndTime = new Date("2018-08-14T13:00:31+01:00");
    resultsStartTime = new Date("2018-08-14T19:00:31+01:00");

    // console.log('before', formStartTime)
    let new_date = moment(formStartTime).subtract(7, 'hours').format();
    new_date = new Date(new_date);

    // this.isErrorLaunch(formStartTime, siteLaunch, nowTime);
    this.isTimeResults(resultsStartTime, resultsEndTime, nowTime);
    // this.isWinningId(siteLaunch, nowTime);
    this.isPreFormCountDown(nowTime, new_date, formStartTime, resultsEndTime);

      return (
      <div className="container-fluid appWrapper">
        {this.isTimeForm(formStartTime, formEndTime, nowTime) &&
        <Home/>
        }
        {this.isTimeResults(resultsStartTime, resultsEndTime, nowTime) &&
        <div className="winning_validation draw_content_container">
          <WinningID
            id={this.props.id}
            passedProps={this.props}
          />
        </div>
        }
        {/*{this.isIntervalPreForm(formStartTime, resultsEndTime, nowTime) &&*/}
        {/*<InterimPage*/}
          {/*textInterim='New competition entry will be available in:'*/}
          {/*schedule="form"*/}
          {/*siteLaunch={siteLaunch}*/}
        {/*/>*/}
        {/*}*/}
        {this.isIntervalPreResults(formEndTime, resultsStartTime, nowTime) &&
        <InterimPage
          textInterim='Results will be published in:'
          schedule="results"
          siteLaunch={siteLaunch}
        />
        }
        {this.isPostComp(nowTime, resultsEndTime) &&
        <div className="thank_you_wrapper">
          <h1 className="headerText">Thank you for taking part</h1>
          <div>Competition will resume at <span className="largeText">7am </span>tomorrow</div>
        </div>
        }
        {this.newIntervalPreForm(nowTime, formStartTime, new_date) &&
        <InterimPage
          textInterim='New competition entry will be available in:'
          schedule="form"
          siteLaunch={siteLaunch}
        />
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
  };
};

const mapDispatchToProps = {
  getTimeForm,
};

export default connect(mapStateToProps, mapDispatchToProps)(App);
