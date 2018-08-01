import React from 'react';
import fire from '../../fire';
import {getTimeForm, getWinningId} from "../../redux/actions";
import WinningCodeValidation from '../WinningCodeValidation/WinningCodeValidation.container';
import {connect} from "react-redux";
import moment from 'moment-timezone';

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
      formStartTime: null,
      resultEnd: null,
      formEndTime: null
    }
  }

  componentWillMount(){

    fire.database().ref('setSiteLaunch/').once('value').then((snapshot) => {
      if (Object.entries !== null || Object.entries !== undefined) {
        let siteLaunchTime = snapshot.val();

        this.setState({
          siteLaunch: new Date("2015-07-06T07:00:34+01:00"),
        })
      }
    });

    fire.database().ref('setTimeForm/').once('value').then((snapshot) => {
      if (Object.entries !== null || Object.entries !== undefined) {
        let siteForm = snapshot.val();

        if (siteForm !== null || siteForm !== undefined) {

          let postData = {
            formStart: new Date(siteForm.postData.formStart),
            formEnd: new Date(siteForm.postData.formEnd),
            resultStart: new Date(siteForm.postData.resultStart),
            resultEnd: new Date(siteForm.postData.resultEnd),
          };

          this.setState({
            formStartTime: new Date(postData.formStart),
            formEndTime: new Date(postData.formEnd),
            resultStart: new Date(postData.resultStart),
            resultEnd: new Date(postData.resultEnd),
          })
        }
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
          resultEnd: this.state.resultEnd,
          formEndTime: this.state.formEndTime,
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

    let nowTime = new Date();
    const { winningConfirmation } = this.state;
    const { mobileNumber, uniqueId, formEndTime, siteLaunch, resultStartTime, resultsEndTime  } = this.props;

    if(nowTime > formEndTime && nowTime < resultStartTime && resultStartTime !== undefined) {
      this.props.history.push('/');
    }

    if(nowTime > formEndTime && nowTime > resultsEndTime && resultStartTime !== undefined) {
      this.props.history.push('/');
    }

    let uniqueCodeSplit;
    if(this.state.uniqueId !== null) {
      uniqueCodeSplit = uniqueId.replace(/(\w{4})/g, '$1 ').replace(/(^\s+|\s+$)/,'');
    }
    this.isWinningId(siteLaunch, nowTime);

    return (
      <div className="winning_validation draw_content_container">
        <div>
        <h1 className="headerText">Redeem voucher!</h1>
        </div>
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
    formEndTime: state.get('reducer').formEndTime,
    siteLaunch: state.get('reducer').siteLaunch,
    resultStartTime: state.get('reducer').resultStartTime,
    resultsEndTime: state.get('reducer').resultsEndTime,
  };
};

const mapDispatchToProps = {
  getWinningId,
  getTimeForm,
};

export default connect(mapStateToProps, mapDispatchToProps)(WinningId);