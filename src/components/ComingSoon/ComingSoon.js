import React from 'react';
import { connect } from "react-redux";
import moment from 'moment-timezone';
import fire from '../../fire';
import './ComingSoon.scss';

export class ComingSoon extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      timeMathResultStartTime: '',
      newCountDown: '',
      day: '',
      hour: '',
      min: '',
      sec: '',
      testData: '',
      dateThen: '',
      dateNow: '',
      collectedData: '',
      timeNow: new Date(),
      siteLaunch: '',
      testTime: ''
    }
  }

  getData() {

  }

  preForm() {}

  preResults() {

    const { timeNow, siteLaunch } = this.state;
    let newDateToTest = new Date();

    if(siteLaunch > newDateToTest) {
      let testTime = siteLaunch - newDateToTest;

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
      clearTimeout(this);
      this.props.history.push('/');
    }
  }

  minusOne() {
    if(this.state.time > 0){
      this.setState({time: this.state.time -1});
    }
  }

  componentDidMount(){
    if(this.props.location.pathname === '/coming-soon') {
      fire.database().ref('setSiteLaunch/').once('value').then((snapshot) => {
        let receivedDataTime = snapshot.val();

        this.setState({
          siteLaunch: new Date(receivedDataTime.siteLaunch),
        });
      });
      this.timerHandle = setInterval(() => {

          const { timeNow, siteLaunch } = this.state;
          let newDateToTest = new Date();

          if(siteLaunch > newDateToTest) {
            let testTime = siteLaunch - newDateToTest;

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
            clearTimeout(this.timerHandle);
            this.timerHandle = 0;
            this.props.history.push('/');
          }

      }, 1000);
    }
  }

  componentWillUnmount() {
    clearInterval(this.timerHandle);
    this.timerHandle = 0;
}
  render() {
    return (
      <div className='container-fluid appWrapper'>
        <div>
          <h3 className="coming_soon_header">Dailychoppins comes to life in...</h3>
        </div>
        <div className="centreText">
          {this.state.testData.length > 0 &&
            <div id="timer_wrapper">
              <span>
                <span className="dynamic_value">{this.state.day}</span>
                <span>Days</span>
              </span>
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
      </div>
    )
  }
}


const mapStateToProps = (state) => {
  return {
    user: state.get('reducer').user
  };
};

const mapDispatchToProps = {
};

export default connect(mapStateToProps, mapDispatchToProps)(ComingSoon);
