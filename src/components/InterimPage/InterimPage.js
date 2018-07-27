import React from 'react';
import './InterimPage.scss';
import fire from '../../fire';
import moment from 'moment-timezone';
import Countdown from 'react-countdown-now';

export default class InterimPage extends React.Component {
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
      testTime: ''
    }
  }

  getData() {

  }

  preForm() {}

  preResults() {

    const { timeNow, resultsStartTime } = this.state;
    let newDateToTest = new Date();

    if(resultsStartTime > newDateToTest) {
      let testTime = resultsStartTime - newDateToTest;

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
    fire.database().ref('setTimeForm/').once('value').then((snapshot) => {
      let receivedDataTime = snapshot.val();

      this.setState({
        formStartTime: new Date(receivedDataTime.postData.formStart),
        formEndTime: new Date(receivedDataTime.postData.formEnd),
        resultsStartTime: new Date(receivedDataTime.postData.resultStart),
        resultsEndTime: new Date(receivedDataTime.postData.resultEnd)
      });
    });
    setTimeout( setInterval( () => {this.preResults()}, 1000), 1000);
  };


  render () {
    return (
      <div className="containerWrapper">
        <p>Competition is currently closed...</p>
        <p>{this.props.textInterim}</p>

        <div>Remaining Time: {this.state.testData}</div>
        {this.props.schedule === 'form' &&
          <div>
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
        {this.props.schedule === 'results' &&
          <div>
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
