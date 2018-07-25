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
      testData: ''
    }
  }


  componentDidMount() {
    let collectedData;
    fire.database().ref('setTimeForm/postData').once('value').then((snapshot) => {
      collectedData = snapshot.val();
      let formStart, formEnd, resultStart, resultEnd;

      // let timeNow = new Date(collectedData);
      formStart = new Date(collectedData.formStart);
      formEnd = new Date(collectedData.formEnd);
      resultStart = new Date(collectedData.resultStart);
      resultEnd = new Date(collectedData.resultEnd);

      let timeNow = new Date();

      let formTimeStart = formStart - timeNow;
      let resultStartTime = resultStart - timeNow;
      // let duration = moment.duration(timeMathResultStartTime*1000, 'milliseconds');
      let durationForm = moment.duration(formTimeStart, 'milliseconds');
      let durationResult = moment.duration(resultStartTime, 'milliseconds');
      let interval = 1000;

      setInterval(() => {
        var testData;
        if(this.props.schedule === 'form') {
          durationForm = moment.duration(durationForm - interval, 'milliseconds');
          testData = durationForm.days() + ":" + durationForm.hours() + ":" + durationForm.minutes() + ":" + durationForm.seconds();
        }
        else {
          durationResult = moment.duration(durationResult - interval, 'milliseconds');
          testData = durationResult.days() + ":" + durationResult.hours() + ":" + durationResult.minutes() + ":" + durationResult.seconds();
        }
          this.setState({
            testData,
          });

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
              sec
            });
          }

      }, interval);
    });
  }

  render () {
    return (
      <div className="containerWrapper">
        <p>Competition is currently closed...</p>
        <p>{this.props.textInterim}</p>
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
