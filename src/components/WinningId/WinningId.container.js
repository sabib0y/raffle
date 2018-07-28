import React from 'react';
import fire from '../../fire';
import {getTimeForm, getWinningId} from "../../redux/actions";
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
      winningConfirmation: false,
      siteLaunch: null,
      formStartTime: null
    }
  }

  componentWillMount(){
    fire.database().ref('setSiteLaunch/').once('value').then((snapshot) => {
      if (Object.entries !== null || Object.entries !== undefined) {
        let siteLaunchTime = snapshot.val();

        this.setState({
          siteLaunch: new Date(siteLaunchTime.siteLaunch),
        })
      }
    });

    fire.database().ref('setTimeForm/').once('value').then((snapshot) => {
      if (Object.entries !== null || Object.entries !== undefined) {
        let siteForm = snapshot.val();

        this.setState({
          formStartTime: new Date(siteForm.postData.formStart),
          resultStart: new Date(siteForm.postData.resultStart),
        })
      }
    });

    fire.database().ref('randomWinnerSetWeb/').once('value').then((snapshot) => {
      if (Object.entries !== null || Object.entries !== undefined) {
        let receivedData = snapshot.val();

        const dataToPost = {
          mobileNumber: receivedData.postDataWeb.mobileNumber,
          uniqueId: receivedData.postDataWeb.uniqueId,
          formStartTime: this.state.formStartTime,
          resultStartTime: this.state.resultStart,
          siteLaunch: this.state.siteLaunch,
        };

        this.props.getWinningId(dataToPost);

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

  isWinningId(siteLaunch, nowTime) {
    if(nowTime < siteLaunch){
      this.props.history.push('/coming-soon');
      return true;
    }
    return false;
  };

  render() {
    const { winningConfirmation } = this.state;
    const { mobileNumber, uniqueId, formStartTime, siteLaunch, resultStartTime  } = this.props;

    let uniqueCodeSplit;
    if(this.state.uniqueId !== null) {
      uniqueCodeSplit = uniqueId.replace(/(\w{4})/g, '$1 ').replace(/(^\s+|\s+$)/,'');
    }
    let nowTime = new Date();

    console.log(winningConfirmation, 'winning id', this.props);
    this.isWinningId(siteLaunch, nowTime);

    return (
      <div className="winning_validation draw_content_container">
        {winningConfirmation === false &&
        <div>
          <div className="winningId">
            the winning ID is <span>{uniqueCodeSplit} </span>
            <p>** <i>test purposes: copy phone number</i> {mobileNumber} **</p>
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
          uniqueId={uniqueId}
          receivedCode={uniqueId}
          receivedMobileNumber={mobileNumber}
          handleSubmission={event => this.handleSubmission(event)}
        />
        }
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    mobileNumber: state.get('reducer').mobileNumber,
    uniqueId: state.get('reducer').uniqueId,
    formStartTime: state.get('reducer').formStartTime,
    siteLaunch: state.get('reducer').siteLaunch,
    resultStartTime: state.get('reducer').resultStartTime,
  };
};

const mapDispatchToProps = {
  getWinningId,
  getTimeForm,
};

export default connect(mapStateToProps, mapDispatchToProps)(WinningId);