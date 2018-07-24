import React from 'react';
import Footer from '../Footer/Footer.component';
import { connect } from "react-redux";
import Countdown from 'react-countdown-now';
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
      sec: ''
    };
    this.renderer = this.renderer.bind(this);
  }

  renderer(event) {
    if (event.completed) {
      // Render a completed state
      return this.props.history.push('/home');
    } else {
      // Render a countdown
      return (
        <div>
          <span>Days</span>
          <span>{event.days}</span>:
          <span>Hours</span>
          <span>{event.hours}</span>:
          <span>minutes</span>
          <span>{event.minutes}</span>:
          <span>Seconds</span>
          <span>{event.seconds}</span>
        </div>
      );
    }
  };

  componentDidMount() {
    let collectedData;
    let dateToTestAgainst;
    fire.database().ref('setSiteLaunch/siteLaunch').once('value').then((snapshot) => {
      collectedData = snapshot.val();
      console.log('collectedData', collectedData);

      let timeNow = new Date();
      collectedData = new Date(collectedData);

      let timeMathResultStartTime = collectedData - timeNow;
      this.setState({
        timeMathResultStartTime
      });

      dateToTestAgainst = new  Date(collectedData);
      let eventTime= 1366549200; // Timestamp - Sun, 21 Apr 2013 13:00:00 GMT
      let currentTime = 1366547400; // Timestamp - Sun, 21 Apr 2013 12:30:00 GMT
      let diffTime = dateToTestAgainst - timeNow;
      let duration = moment.duration(diffTime*1000, 'milliseconds');
      let interval = 1000;

      setInterval(() => {
        duration = moment.duration(duration - interval, 'milliseconds');
        let testData = duration.days() + ":" + duration.hours() + ":" + duration.minutes() + ":" + duration.seconds();



        console.log('testing this badboy', testData);

        let day,
          hour,
          min,
          sec;

        if(testData.length > 1) {
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
          // console.log('time converted:',newArray, day, hour, min, sec);
        }

        // $('.countdown').text(duration.hours() + ":" + duration.minutes() + ":" + duration.seconds())
      }, interval);
    });
  }

  render() {
    const { timeMathResultStartTime } = this.state;
    return (
      <div className='container-fluid appWrapper'>
        <div>
          <h3 className="headerText">coming soon</h3>
        </div>
        <div className="centreText">
          <div className="timeCountDown">{this.state.newCountDown}</div>
          {/*<Countdown*/}
            {/*date={Date.now() + timeMathResultStartTime}*/}
            {/*onComplete={this.renderer}*/}
          {/*>*/}
          {/*</Countdown>*/}
          <span>
            <span>Days</span>
            <span>{this.state.day}</span>
          </span>
          <span>
            <span>Hours</span>
            <span>{this.state.hour}</span>
          </span>
          <span>
            <span>Minutes</span>
            <span>{this.state.min}</span>
          </span>
          <span>
            <span>Seconds</span>
            <span>{this.state.sec}</span>
          </span>
        </div>
        <Footer/>
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