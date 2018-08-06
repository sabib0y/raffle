import React from 'react';
import './WinningId.scss';
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
      formEndTime: null,
      won: false
    }
  }

  componentWillMount(){

    const { formEndTime, resultStartTime, resultsEndTime } = this.props;
    let nowTime = new Date();

    if (nowTime >= resultStartTime && nowTime <= resultStartTime && resultsEndTime !== null) {
      this.props.history.push('/claim-winnings');
    }

    if(nowTime > formEndTime && nowTime < resultStartTime && resultStartTime !== undefined) {
      this.props.history.push('/');
    }

    if(nowTime > formEndTime && nowTime > resultsEndTime && resultStartTime !== undefined) {
      this.props.history.push('/');
    }

    if(nowTime < resultStartTime) {
      this.props.history.push('/')
    }

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

    fire.database().ref('dailyWinningNumbers/').once('value').then((snapshot) => {
      if (Object.entries !== null || Object.entries !== undefined) {
        let receivedData = snapshot.val();
        receivedData = receivedData.winners;
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
    // this.setState({
    //   receivedMobileNumber: null,
    //   receivedCode: null,
    // });
  }

  redeemCode(e) {
    e.preventDefault();
    this.setState({revealRedeem: true});
  }

  handleSubmission(event) {
    if(event.winningCodeConfirmation) {
      this.setState({ winningConfirmation: true })
    }
    if(event.won) {
      this.setState({ won: true })
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

    console.log('collectedData', this.state.uniqueId);

    let nowTime = new Date();
    const { formEndTime, siteLaunch, resultStartTime, resultsEndTime, collectedData  } = this.props;

    if (nowTime >= resultStartTime && nowTime <= resultStartTime && resultsEndTime !== null) {
      this.props.history.push('/claim-winnings');
    }

    if(nowTime > formEndTime && nowTime < resultStartTime && resultStartTime !== undefined) {
      this.props.history.push('/');
    }

    if(nowTime > formEndTime && nowTime > resultsEndTime && resultStartTime !== undefined) {
      this.props.history.push('/');
    }

    if(nowTime < resultStartTime) {
      this.props.history.push('/')
    }

    let collectedItems = [];
    let collectedNumbers = [];

    if(collectedData !== undefined) {
      collectedData.map(item => {
        collectedItems.push(item.user.uniqueId);
        collectedNumbers.push(item.user.mobileNumber);
      })
    }

    // let uniqueCodeSplit;
    // if(this.state.uniqueId.length > 0) {
    //   uniqueCodeSplit = uniqueId.replace(/(\w{4})/g, '$1 ').replace(/(^\s+|\s+$)/,'');
    // }

    this.isWinningId(siteLaunch, nowTime);

    return (
      <div className="winning_validation draw_content_container">
        <div>
          {this.state.won === false &&
          <h1 className="headerText">Redeem voucher!</h1>
          }
          {this.state.won === true &&
          <h1 className="headerText">Redeem another?</h1>
          }
        </div>
        <div>
          <div className="winningId">
            Today’s winning codes are:
            <div className="winning_codes">
            {collectedItems.map((item, i) => {
              return (
                <div
                  key={i}
                >{item}</div>
              )
            })}
            </div>
          </div>
          {!this.state.revealRedeem &&
            <div id="claim_teaser">
              <p>
                Have a winning code?
              </p>
              <p>
                <a
                  onClick={(e) => this.redeemCode(e)}
                >click here to redeem code
                </a>
              </p>
            </div>
          }
        </div>
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
