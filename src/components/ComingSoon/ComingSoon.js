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
      collectedData: ''
    };
  }

  preResults() {

    const { timeNow, collectedData } = this.state;
    let newDateToTest = new Date();

    if(collectedData > newDateToTest) {
      let testTime = collectedData - newDateToTest;

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
    // else {
    //   this.props.history.push('/home');
    // }
  }

  minusOne() {
    if(this.state.time > 0){
      this.setState({time: this.state.time -1});
    }
  }

  componentDidMount(){
    fire.database().ref('setSiteLaunch/siteLaunch').once('value').then((snapshot) => {
      let receivedDataTime = snapshot.val();

      this.setState({
        collectedData: new Date(receivedDataTime),
      });
    });
    setTimeout( setInterval( () => {this.preResults()}, 1000), 1000);
  };

  // componentDidMount() {
  //   let collectedData;
  //   fire.database().ref('setSiteLaunch/siteLaunch').once('value').then((snapshot) => {
  //     collectedData = snapshot.val();
  //     let interval = 1000;
  //
  //     setInterval(() => {
  //       let timeNow = moment().tz("Europe/London").format();
  //
  //       let newDateTime, oldDateTime;
  //
  //       oldDateTime = collectedData;
  //       newDateTime = timeNow;
  //
  //       timeNow = new Date(timeNow);
  //       collectedData = new Date(collectedData);
  //
  //       let timeMathResultStartTime = collectedData - timeNow;
  //
  //       if (collectedData > timeNow) {
  //         this.setState({
  //           timeMathResultStartTime
  //         });
  //
  //
  //         // let duration = moment.duration(timeMathResultStartTime*1000, 'milliseconds');
  //         let duration = moment.duration(timeMathResultStartTime, 'milliseconds');
  //
  //         duration = moment.duration(duration - interval, 'milliseconds');
  //         let testData = duration.days() + ":" + duration.hours() + ":" + duration.minutes() + ":" + duration.seconds();
  //         console.log('time new', testData, duration);
  //
  //         this.setState({
  //           testData
  //         });
  //
  //         let day,
  //           hour,
  //           min,
  //           sec;
  //
  //         if (testData === "0:0:0:0") {
  //           interval = 0;
  //         }
  //
  //         if (testData.length > 1) {
  //           let newArray = [];
  //           newArray.push(testData.split(':'));
  //
  //           day = newArray[0][0];
  //           hour = newArray[0][1];
  //           min = newArray[0][2];
  //           sec = newArray[0][3];
  //
  //           this.setState({
  //             day,
  //             hour,
  //             min,
  //             sec,
  //             dateThen: collectedData,
  //             dateNow: timeNow,
  //           });
  //         }
  //
  //         if (oldDateTime <= newDateTime) {
  //           interval = 0;
  //         }
  //       } else {
  //         interval = 0;
  //         return this.props.history.push('/home');
  //       }
  //     }, interval);
  //   });
  // }

  render() {
    return (
      <div className='container-fluid appWrapper'>
        {/*<div>*/}
          {/*<h3 className="headerText">Dailychoppins comes to life in...</h3>*/}
        {/*</div>*/}
        <div className="centreText">
          <div className="timeCountDown">{this.state.newCountDown}</div>
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
  };
};

const mapDispatchToProps = {
};

export default connect(mapStateToProps, mapDispatchToProps)(ComingSoon);