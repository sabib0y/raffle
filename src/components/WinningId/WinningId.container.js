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
      uniqueId: [],
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

    fire.database().ref('randomWinnerSetWebNew/').once('value').then((snapshot) => {
      if (Object.entries !== null || Object.entries !== undefined) {
        let receivedData = snapshot.val();
        let collectedData = [];

        if (receivedData !== null) {
          let vals = Object.keys(receivedData).map(key => {
            return receivedData[key];
          });
          collectedData.push(vals);
        }

        const dataToPost = {
          collectedData: collectedData[0],
          formStartTime: this.state.formStartTime,
          resultStartTime: this.state.resultStart,
          siteLaunch: this.state.siteLaunch,
          resultEnd: this.state.resultEnd,
          formEndTime: this.state.formEndTime,
        };

        this.props.getWinningId(dataToPost);

        // this.setState({
        //   receivedMobileNumber: receivedData.postDataWeb.mobileNumber,
        //   receivedCode: receivedData.postDataWeb.uniqueId,
        // })
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

  getWinningCodes() {
    const { collectedData } = this.props;

  }

  render() {

    console.log('collectedData', this.state.uniqueId);

    let nowTime = new Date();
    const { winningConfirmation } = this.state;
    const { mobileNumber, uniqueId, formEndTime, siteLaunch, resultStartTime, resultsEndTime, collectedData  } = this.props;

    if(nowTime > formEndTime && nowTime < resultStartTime && resultStartTime !== undefined) {
      this.props.history.push('/');
    }

    if(nowTime > formEndTime && nowTime > resultsEndTime && resultStartTime !== undefined) {
      this.props.history.push('/');
    }

    let collectedItems = [];
    let collectedNumbers = [];

    if(collectedData !== undefined) {
      collectedData.map(item => {
        collectedItems.push(item.winner.uniqueId);
        collectedNumbers.push(item.winner.mobileNumber);
      })
    }
   console.log('collectedItems', collectedItems);

    // let uniqueCodeSplit;
    // if(this.state.uniqueId.length > 0) {
    //   uniqueCodeSplit = uniqueId.replace(/(\w{4})/g, '$1 ').replace(/(^\s+|\s+$)/,'');
    // }

    this.isWinningId(siteLaunch, nowTime);

    return (
      <div className="winning_validation draw_content_container">
        <div>
        <h1 className="headerText">Redeem voucher!</h1>
        </div>
        {winningConfirmation === false &&
        <div>
          <div className="winningId">
            the winning ID is
            {collectedItems.map((item, i) => {
              return (
                <div
                  key={i}
                >{item}</div>
              )
            })}
            <div>** <i>test purposes: copy phone number</i>
              {collectedNumbers.map((item, i) => {
                return (
                  <div
                    key={i}
                  >{item}</div>
                )
              })}
              **</div>
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
          receivedData={this.props.collectedData}
          uniqueId={collectedItems}
          receivedCode={collectedItems}
          receivedMobileNumber={collectedNumbers}
          handleSubmission={event => this.handleSubmission(event)}
        />
        }
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    collectedData: state.get('reducer').collectedData,
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