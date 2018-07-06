import React from 'react';
import fire from '../../fire';
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
         return  collectedData.push(item[1].user);
        });
      }
    });
  }

  render() {
    let uniqueCodeSplit;
    if(this.state.uniqueId !== null) {
      uniqueCodeSplit = this.state.uniqueId.replace(/(\w{4})/g, '$1 ').replace(/(^\s+|\s+$)/,'');
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
    user: state.reducer.user
  };
};

const mapDispatchToProps = {
  getWinningId,
};

export default connect(mapStateToProps, mapDispatchToProps)(WinningId);