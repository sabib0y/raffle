import React from 'react';
import fire from '../../fire';
import postWinnerHelper from '../../helpers/postWinnerHelper';
import postAllWinners from '../../helpers/postAllWinners';
import { getWinningId } from "../../redux/actions";
import {connect} from "react-redux";

export class WinningId extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      randomizedData: null,
      uniqueCodeSplit: '',
      uniqueId: null
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
        this.props.getWinningId(randomizedData[0]);
      } else {
        console.error('No Entries Found', randomizedData)
      }
    });
  }

  render() {
    console.log('this.propsWI', this.props.user.mobileNumber);
    let uniqueCodeSplit;
    if(this.state.uniqueId !== null) {
      //
      // this.props.getWinningId();

      // postWinnerHelper(
      //   this.state.firstName,
      //   this.state.lastName,
      //   this.state.emailAddress,
      //   this.state.mobileNumber,
      //   this.state.date,
      //   this.state.uniqueId,
      // );

      // postAllWinners(
      //   this.state.firstName,
      //   this.state.lastName,
      //   this.state.emailAddress,
      //   this.state.mobileNumber,
      //   this.state.date,
      //   this.state.uniqueId,
      // );
      uniqueCodeSplit = this.state.uniqueId.replace(/(\w{4})/g, '$1 ').replace(/(^\s+|\s+$)/,'');
     // this.setState({}) = uniqueCodeSplit;
    }

    return (
      <div>
        {this.state.uniqueId !== null &&
          <div className="winningId">
            the winning ID is <span>{uniqueCodeSplit}</span>
          </div>
        }
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    user: state.reducer
  };
};

const mapDispatchToProps = {
  getWinningId,
};

export default connect(mapStateToProps, mapDispatchToProps)(WinningId);