import React from 'react';
import './InterimPage.scss';
import fire from '../../fire';
import timerInterval from '../../helpers/timerinterval';

export default class InterimPage extends React.Component {

  handleTimeInterval(){
    let data = [];
    let sortedData = [];
    fire.database().ref('setTimeForm/postData').once('value').then((snapshot) => {
      let collectedData = Object.entries(snapshot.val());
      collectedData.map(item => {
        data.push(item);
      });
      for (let value of data) {
        console.log(value, 'value');
      }
    });
    console.log('test', data)
  };

  render () {
    this.handleTimeInterval();
    return (
      <div className="containerWrapper">
        <p>Competition is currently closed...</p>
        <p>{this.props.textInterim}</p>
      </div>
    )
  }
}
