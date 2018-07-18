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
      resultStartToCheck: null
    }
  }

  componentDidMount(){
    let collectedData;
    fire.database().ref('setTimeForm/postData').once('value').then((snapshot) => {
      collectedData = snapshot.val();

      let resultStartTime = new Date(collectedData.resultStart);
      let formStartTime = new Date(collectedData.formStart);
      let timeNow = new Date();

      let timeMathResultStartTime = resultStartTime - timeNow;
      let timeMathFormStartTime;

      if(timeNow > formStartTime){
        let day;
        day = moment(formStartTime).add(1, 'd');
        console.log('day', day.format());
        timeMathFormStartTime = day - timeNow;
        this.setState({
          formStartToCheck: timeMathFormStartTime,
        })
      }
      else {
        timeMathFormStartTime = formStartTime - timeNow;
        this.setState({
          formStartToCheck: timeMathFormStartTime,
        })
      }
      this.setState({
        resultStartToCheck: timeMathResultStartTime
      });
    });
  };

  render () {
    const { formStartToCheck, resultStartToCheck } =this.state;

    return (
      <div className="containerWrapper">
        <p>Competition is currently closed...</p>
        <p>{this.props.textInterim}</p>
        {this.props.schedule === 'form' &&
          <Countdown date={Date.now() + formStartToCheck}>
            <span>You are good to go FORM</span>
          </Countdown>
        }
        {this.props.schedule === 'results' &&
          <Countdown date={Date.now() + resultStartToCheck}>
            <span>You are good to go Results</span>
          </Countdown>
        }
      </div>
    )
  }
}
