import React, { Component } from 'react';
import './App.scss';
import Home from './components/Home/Home.component';
import WinningID, {WinningId} from './components/WinningId/WinningId.container';
import InterimPage from './components/InterimPage/InterimPage';
import moment from 'moment-timezone';
import fire from './fire';
import {connect} from "react-redux";
import {getTimeForm} from "./redux/actions";




export class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      revealRedeem: false,
      formStartTime: null,
      formEndTime: null,
      resultsStartTime: null,
      resultsEndTime: null,
      time: 10,
      timeNow: new Date(),
      testData: '',
      testTime: ''
    }
  }

  isTimeForm(formStartTime, formEndTime, nowTime) {
    if(nowTime >= formStartTime && nowTime <= formEndTime && formStartTime !== null) {
      this.props.history.push('/awaiting-page');
      return true;
    }
    return false;
  }

  isTimeResults(resultsStartTime, resultsEndTime, nowTime) {
    if(nowTime >= resultsStartTime && nowTime <= resultsEndTime && resultsEndTime !== null) {
      this.props.history.push('/claim-winnings');
      return true;
    }
    return false;
  }

  isIntervalPreResults(formEndTime, resultsStartTime, nowTime) {
    if(nowTime > formEndTime && nowTime < resultsStartTime && formEndTime !== null) {
      this.props.history.push('/awaiting-page');
      return true;
    }
    return false;
  }

  isIntervalPreForm(formStartTime, resultsEndTime, newValueTomorrow, nowTime) {
    if(nowTime > resultsEndTime && nowTime < newValueTomorrow && resultsEndTime !== null) {

      return true;
    }
    return false;
  }

  redeemCode(e) {
    e.preventDefault();
    this.setState({revealRedeem: true});
  }

  componentDidMount() {
    fire.database().ref('setTimeForm/').once('value').then((snapshot) => {
      let receivedDataTime = snapshot.val();

      const dataToSend = {
        formStartTime: new Date(receivedDataTime.postData.formStart),
        formEndTime: new Date(receivedDataTime.postData.formEnd),
        resultsStartTime: new Date(receivedDataTime.postData.resultStart),
        resultsEndTime: new Date(receivedDataTime.postData.resultEnd)
      };
      this.props.getTimeForm(dataToSend)
    });
  }

  render() {
    let nowTime = new Date();
    let newValueTomorrow;

    const { formStartTime, resultsEndTime, formEndTime, resultsStartTime } = this.props.user.reducer;

    this.isTimeForm(formStartTime, formEndTime, nowTime);
    this.isTimeResults(resultsStartTime, resultsEndTime, nowTime);

    console.log('this.props', this.props);
      return (
      <div className="container-fluid appWrapper">
        {this.isTimeResults(resultsStartTime, resultsEndTime, nowTime) &&
          <div className="winning_validation draw_content_container">
            <WinningID
              id={this.props.id}
              uniqueId={this.props.uniqueId}
            />
          </div>
        }
        {this.isIntervalPreForm(formStartTime, resultsEndTime, newValueTomorrow, nowTime) &&
          <InterimPage
            textInterim='New competition entry will be available in:'
            schedule="form"
          />
        }
         {this.isIntervalPreResults(formEndTime, resultsStartTime, nowTime) &&
          <InterimPage
            textInterim='Results will be published in:'
            schedule="results"
          />
        }
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    user: state.toJS()
  };
};

const mapDispatchToProps = {
  getTimeForm,
};

export default connect(mapStateToProps, mapDispatchToProps)(App);
