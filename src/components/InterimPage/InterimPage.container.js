import React, { Component } from 'react';
import './InterimPage.scss';
import '../ComingSoon/ComingSoon.scss';
import fire from '../../fire';
import moment from 'moment-timezone';
import {connect} from "react-redux";
import {getTimeForm} from "../../redux/actions";

export class InterimPage extends Component {
  constructor(props){
    super(props);
    this.state = {
      formStartToCheck: null,
      resultStartToCheck: null,
      timeMathResultStartTime: '',
      newCountDown: '',
      day: '',
      hour: '',
      min: '',
      sec: '',
      revealRedeem: false,
      formStartTime: null,
      formEndTime: null,
      resultsStartTime: null,
      resultsEndTime: null,
      time: 10,
      timeNow: new Date(),
      testData: '',
      testTime: '',
    }
  }

  getData() {

  }

  preForm() {}

  preResults() {


  }

  minusOne() {
    if(this.state.time > 0){
      this.setState({time: this.state.time -1});
    }
  }

  componentDidMount(){

    let nowTime = new Date();
    const { formStartTime, resultsEndTime } = this.props;
    let new_date = moment(formStartTime).subtract(7, 'hours').format();
    new_date = new Date(new_date);

    // this.isPostComp(nowTime, resultsEndTime);

    fire.database().ref('setTimeForm/').once('value').then((snapshot) => {
      let receivedDataTime = snapshot.val();

      this.setState({
        formStartTime: new Date(receivedDataTime.postData.formStart),
        formEndTime: new Date(receivedDataTime.postData.formEnd),
        resultsStartTime: new Date(receivedDataTime.postData.resultStart),
        resultsEndTime: new Date(receivedDataTime.postData.resultEnd),
      });

      /* @TODO time?
      * */
      // this.setState({
      //   formStartTime: new Date("2018-08-06T06:50:31+01:00"),
      //   resultsEndTime: new Date("2018-08-06T20:00:31+01:00"),
      //   formEndTime: new Date("2018-08-06T13:00:31+01:00"),
      //   resultsStartTime: new Date("2018-08-06T19:00:31+01:00"),
      // });

      const { formStartTime, resultsEndTime, formEndTime, resultsStartTime } = this.state;
      // let formStartTime, resultsEndTime, formEndTime, resultsStartTime;



      let nowTime = new Date();

      if(nowTime >= formStartTime && nowTime <= formEndTime) {
        this.props.history.push('/');
      }
      if(nowTime > resultsStartTime && nowTime < resultsEndTime) {
        this.props.history.push('/');
      }

      if(nowTime > resultsEndTime && resultsEndTime !== null) {
        this.props.history.push('/')
      }

    });

    fire.database().ref('setSiteLaunch/').once('value').then((snapshot) => {
      let siteLaunch = snapshot.val();
      const { formStartTime, resultsEndTime, formEndTime, resultsStartTime } = this.state;

      const dataToPost = {
        formStartTime,
        formEndTime,
        resultsStartTime,
        resultsEndTime,
        siteLaunch: new Date(siteLaunch.siteLaunch),
      };


      this.timerHandle = setInterval(() => {
        const { timeNow, resultsStartTime } = this.state;
        let newDateToTest = new Date();

        /*eslint no-mixed-operators:*/
        if(resultsStartTime > newDateToTest || newDateToTest > resultsStartTime && newDateToTest > formStartTime) {
          let testTime;
          if(resultsStartTime > newDateToTest) {
            testTime = resultsStartTime - newDateToTest;
          }

          let duration = moment.duration(testTime, 'milliseconds');

          duration = moment.duration(duration - 1000, 'milliseconds');
          let testData = `${duration.days()} : ${duration.hours()} : ${duration.minutes()} : ${duration.seconds()}`;
          this.setState({ testData});

          let day,
            hour,
            min,
            sec;

          if (testData.length > 1) {
            let newArray = [];
            newArray.push(testData.split(':'));

            day = newArray[0][0];
            hour = newArray[0][1];
            min = newArray[0][2];
            sec = newArray[0][3];

            this.setState({
              day,
              hour,
              min,
              sec,
              dateNow: timeNow,
            });
          }

        }
        else {
          clearInterval(this.timerHandle);
          this.timerHandle = 0;
          // this.props.history.push('/');
        }
      }, 1000);
      this.props.getTimeForm(dataToPost)
    });
  };

  componentWillMount() {

    // let nowTime = new Date();
    // const { formStartTime, resultsEndTime } = this.props;
    // let new_date = moment(formStartTime).subtract(7, 'hours').format();
    // new_date = new Date(new_date);
    //
    // this.isPostComp(nowTime, resultsEndTime);

  }

  componentWillUnmount() {
    clearInterval(this.timerHandle);
    this.timerHandle = 0;
  }

  checkPageLocation(siteLaunch, nowTime) {
    if(nowTime > siteLaunch){
      // this.props.history.push('/coming-soon');
      return true;
    }
    return false;
  };

  isPreFormCountDown(nowTime, new_date, formStartTime, resultsEndTime) {
    if(nowTime < formStartTime && nowTime < new_date) {
      this.setState({
        thankYouMessage: true
      })
    }
  }

  // isPostComp(nowTime, resultsEndTime){
  //   if(nowTime > resultsEndTime && resultsEndTime !== null) {
  //     this.props.history.push('/')
  //   }
  //   return false;
  // }

  render () {
    let schedule, message;
    let nowTime = new Date();
    const { siteLaunch } = this.props;

    // if(siteLaunch !== undefined) {
    //   console.log(siteLaunch, 'moment', siteLaunch.setDate(siteLaunch.getDate()+1));
    // }

    this.checkPageLocation(siteLaunch, nowTime);

    if(nowTime > this.state.formEndTime && nowTime < this.state.resultsStartTime) {
      schedule = 'results';
      message = 'Results will be displayed in:'
    }

    if(nowTime < this.state.formStartTime) {
      schedule = 'form';
      message = 'Form will be displayed in:'
    }

    if(nowTime > this.state.formStartTime && nowTime > this.state.resultsEndTime ) {
      schedule = 'form';
      message = 'Form will be displayed in:'
    }

    if(nowTime > this.props.resultEndTime) {
      schedule = 'form';
      message = 'Form will be displayed in:'
    }

    const { formStartTime, resultsEndTime } = this.props;
    let new_date = moment(formStartTime).subtract(7, 'hours').format();
    new_date = new Date(new_date);

    this.isPreFormCountDown(nowTime, new_date, formStartTime, resultsEndTime);
    // this.isPostComp(nowTime, resultsEndTime);
    if(nowTime > new_date && nowTime < formStartTime && formStartTime !== null) {
      schedule = 'form';
      message = 'Form will be displayed in:'
    }

    return (
      <div className="containerWrapper">
        <p>{this.props.textInterim ? this.props.textInterim : message }</p>
        {schedule === 'form' &&
          <div>
            {/*<div>*/}
              {/*<h1 className="headerText">Welcome to Dailychoppins!</h1>*/}
            {/*</div>*/}
            {/*<div>{message}</div>*/}
            {this.state.testData.length > 0 &&
              <div id="timer_wrapper">
                <span>
                    <span className="dynamic_value">{this.state.hour}</span>
                    <span>Hours</span>
                  </span>
                <span>
                    <span className="dynamic_value">{this.state.min}</span>
                    <span>Minutes</span>
                  </span>
                <span>
                    <span className="dynamic_value">{this.state.sec}</span>
                    <span>Seconds</span>
                  </span>
              </div>
            }
          </div>
        }
        {schedule === 'results' &&
          <div>
            {/*<div>*/}
              {/*<h1 className="headerText">Welcome to Dailychoppins!</h1>*/}
            {/*</div>*/}
            <div>{message}</div>
            {this.state.testData.length > 0 &&
              <div id="timer_wrapper">
                <span>
                  <span className="dynamic_value">{this.state.hour}</span>
                  <span>Hours</span>
                </span>
                <span>
                  <span className="dynamic_value">{this.state.min}</span>
                  <span>Minutes</span>
                </span>
                <span>
                  <span className="dynamic_value">{this.state.sec}</span>
                  <span>Seconds</span>
                </span>
              </div>
            }
          </div>
        }
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    mobileNumber: state.get('reducer').mobileNumber,
    uniqueId: state.get('reducer').uniqueId,
    formStartTime: state.get('reducer').formStartTime,
    siteLaunch: state.get('reducer').siteLaunch,
    resultsStartTime: state.get('reducer').resultsStartTime,
    resultsEndTime: state.get('reducer').resultsEndTime,
  };
};

const mapDispatchToProps = {
  getTimeForm,
};

export default connect(mapStateToProps, mapDispatchToProps)(InterimPage);
