import React from 'react';
import fire from '../../fire';
import postWinnerHelper from '../../helpers/postWinnerHelper';
import postAllWinners from '../../helpers/postAllWinners';

export default class WinningId extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      randomizedData: null,
    }
  }

  componentDidMount(){
      let collectedData = [];
      let randomizedData = [];

      fire.database().ref('users').once('value').then((snapshot) => {
        if (Object.entries !== null || Object.entries !== undefined) {
          let receivedData = Object.entries(snapshot.val());
          receivedData.map(item => {
            collectedData.push(item[1].user)
          });
        }
        if (collectedData.length > 0) {
          let randomIndex = Math.floor(Math.random() * collectedData.length);
          let randomElement = collectedData[randomIndex];
          randomizedData.push(randomElement);

          this.setState(randomizedData[0]);
        } else {
          console.error('No Entries Found', randomizedData)
        }
      });
  }

  render() {
    if(this.state.uniqueId !== undefined) {
      postWinnerHelper(
        this.state.firstName,
        this.state.lastName,
        this.state.emailAddress,
        this.state.mobileNumber,
        this.state.date,
        this.state.uniqueId,
      );

      postAllWinners(
        this.state.firstName,
        this.state.lastName,
        this.state.emailAddress,
        this.state.mobileNumber,
        this.state.date,
        this.state.uniqueId,
      );

    }

    return (
      <div>
        {this.state.uniqueId !== undefined &&
          <div className="winningId">
            the winning ID is <span>{this.state.uniqueId}</span>
          </div>
        }
      </div>
    )
  }
}