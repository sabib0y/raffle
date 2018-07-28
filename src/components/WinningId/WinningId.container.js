import React from 'react';
import fire from '../../fire';
import { getWinningId } from "../../redux/actions";
import WinningCodeValidation from '../WinningCodeValidation/WinningCodeValidation.container';
import {connect} from "react-redux";

export class WinningId extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      randomizedData: null,
      uniqueCodeSplit: '',
      uniqueId: null,
      revealRedeem: false,
      receivedData: null,
      receivedMobileNumber: null,
      receivedCode: null,
      winningConfirmation: false
    }
  }

  componentDidMount(){
    fire.database().ref('randomWinnerSetWeb').once('value').then((snapshot) => {
      if (Object.entries !== null || Object.entries !== undefined) {
        let receivedData = snapshot.val();
        this.setState({
          receivedMobileNumber: receivedData.postDataWeb.mobileNumber,
          receivedCode: receivedData.postDataWeb.uniqueId,
        })
      }
    });


  }

  componentWillUnmount() {
    this.setState({
      receivedMobileNumber: null,
      receivedCode: null,
    });
  }

  redeemCode(e) {
    e.preventDefault();
    this.setState({revealRedeem: true});
  }

  handleSubmission(event) {
    if(event.winningCodeConfirmation) {
      this.setState({ winningConfirmation: true })
    }
  }

  render() {
    let uniqueCodeSplit;
    if(this.state.receivedCode !== null) {
      uniqueCodeSplit = this.state.receivedCode.replace(/(\w{4})/g, '$1 ').replace(/(^\s+|\s+$)/,'');
    }

    // let winningConfirmation = this.props.user.reducer.user.winningCodeConfirmation;
    const { winningConfirmation } = this.state;

    console.log(winningConfirmation, 'winning id', this.props.user);

    return (
      <div className="winning_validation draw_content_container">
        {winningConfirmation === false &&
        <div>
          <div className="winningId">
            the winning ID is <span>{uniqueCodeSplit} </span>
            <p>** <i>test purposes: copy phone number</i> {this.state.receivedMobileNumber} **</p>
          </div>
          <div>
            Have a winning code?
            <a
              onClick={(e) => this.redeemCode(e)}
            >click to redeem code
            </a>
          </div>
        </div>
        }
        {this.state.revealRedeem &&
        <WinningCodeValidation
          uniqueId={this.props.user.uniqueId}
          receivedCode={this.state.receivedCode}
          receivedMobileNumber={this.state.receivedMobileNumber}
          handleSubmission={event => this.handleSubmission(event)}
        />
        }
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    user: state.get('reducer')
  };
};

const mapDispatchToProps = {
  getWinningId,
};

export default connect(mapStateToProps, mapDispatchToProps)(WinningId);