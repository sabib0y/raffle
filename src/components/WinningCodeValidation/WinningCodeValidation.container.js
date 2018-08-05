import React from 'react';
import './WinningCodeValidation.scss';
import {getWinningCode, getWinningCodeConfirmation} from "../../redux/actions";
import {connect} from "react-redux";
import fire from '../../fire';
import Popup from '../PopUp/PopUp.component';
import _ from 'lodash';
import moment from 'moment-timezone';
import Immutable from 'immutable'

export class WinningCodeValidation extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      code: null,
      matchMessage: 'Congratulations!',
      winningCodeConfirmation: false,
      showPopup: false,
      message: null,
      error: null,
      outline: false,
      won: false
    }
  }

  handleSubmit(event) {
    this.setState({
      code: event.target.value
    });
  }

  handleSubmitCode(e) {
    e.preventDefault();
    const { code } = this.state;
    const { receivedData } = this.props;
    let collectedNumbersArray = [];
    let winner = {};

    receivedData.map(item => {
      if(code === item.winner.mobileNumber) {
        winner = {
          mobileNumber: item.winner.mobileNumber,
          selectedNetwork: item.winner.selectedNetwork,
          uniqueId: item.winner.uniqueId,
          winningCodeConfirmation: true
        };
      }
    });

    if(code === winner.mobileNumber) {
      // console.log('matched')
      let newPostKey = fire.database().ref().child('confirmedWinnerList').push().key;

      // Write the new post's data simultaneously in the posts list and the user's post list.
      let updates = {};
      updates[`/confirmedWinnerList/${newPostKey}/confirmedWinner/`] = winner;

      fire.database().ref('confirmedWinnerList/').once('value').then((snapshot) => {
        let receivedDataTime = snapshot.val();

        if (receivedDataTime !== null) {
          let vals = Object.keys(receivedDataTime).map(key => {
            return receivedDataTime[key];
          });

          for (let value of vals) {
            collectedNumbersArray.push(value.confirmedWinner.mobileNumber);
          }

          let exists = collectedNumbersArray.some(item => item === code);

          if (!exists) {
            // console.log('does not exist')
            this.setState({
              // winningCodeConfirmation: false,
            });
            this.togglePopup();
            this.props.handleSubmission({
              winningCodeConfirmation: true,
              winner: true,
              won: true
            });
            this.setState({
              won: true
            });
            fire.database().ref().update(updates);
            this.props.getWinningCodeConfirmation(winner);
          }
          if (exists) {
            this.setState({
              message: 'Sorry, it seems like the winning code has already been redeemed.'
            });
            this.togglePopup();
          }
        }
        else {
          // console.log('empty database');
          this.setState({
            winningCodeConfirmation: false
          });
          this.togglePopup();
          this.props.handleSubmission({
            winningCodeConfirmation: true,
            winner: true
          });
          fire.database().ref().update(updates);
          this.props.getWinningCodeConfirmation(winner);

          // this.setState({
          //   winningCodeConfirmation: true
          // });
          // fire.database().ref().update(updates);
          // this.props.handleSubmission({
          //   winningCodeConfirmation: true,
          //   winner: true
          // });
          // this.props.getWinningCodeConfirmation(winner);
          // this.togglePopup();
        }
      });
    }
    else {
      // console.log('no match');
      this.setState({
        message: 'Unlucky, you do not hold a winning number this time.'
      });
      this.togglePopup();
    }

      // }

      // if (code === null || code === "") {
      //   this.setState({
      //     error: 'Enter valid number.',
      //     outline: true
      //   });
      // }
      // if(code !== item.winner.mobileNumber) {
      //
      //   this.setState({
      //     message: 'Unlucky, you do not hold a winning number this time.'
      //   });
      //   this.togglePopup();
      //   console.log('not equal to')
      // }
      // else {
      //   this.setState({
      //     error: '',
      //     outline: false
      //   });
      // }
  }

  componentDidMount() {

    /**
     * @TODO extend this code to remove duplicate mobile number data
     */
/*
    fire.database().ref('users/').once('value').then((snapshot) => {
      let receivedDataTime = snapshot.val();
      let newArray = [];

      if (receivedDataTime !== null) {
        let valsNew = Object.keys(receivedDataTime).map(key => {
          return receivedDataTime[key];
        });
        for(let value of valsNew) {
          newArray.push(value.user)
        }

        console.log('newArray', newArray);
        let uniq = _.uniqBy(valsNew, (o) => {
          return o.user.mobileNumber;
        });
        let newDataToStore = [];
        for (let value of uniq) {
          newDataToStore.push(value)
        }
        console.log('afterX', newDataToStore);
        fire.database().ref('setNumberOfWinners/').once('value').then(snapshot => {
          let receivedData = snapshot.val();

          if (receivedData !== null) {
            let randomData = [];
            let winners = [];
            let parseVal = parseInt(receivedData.winners);
            let postData, dataState;
            let timeNow = moment().tz("Africa/Lagos").format('YYYY-MM-DD');
            let uniqRandom = [];

            do {
              // for (let i = 0; i < parseVal; i++) {
                let randomIndex = Math.floor(Math.random() * newDataToStore.length);
                let randomElement = newDataToStore[randomIndex];
                randomData.push(randomElement);

                uniqRandom = _.uniqBy(randomData, (o) => {
                  return o.user.mobileNumber;
                });
              // }
            }
            while (uniqRandom.length < parseVal);

            for (let value of uniqRandom) {
              winners.push(value);
            }

          winners.map(value => {
              postData = value;
              const postDataWeb = {
                fullName: value.user.fullName,
                emailAddress: value.user.emailAddress,
                mobileNumber: value.user.mobileNumber,
                selectedNetwork: value.user.selectedNetwork,
                uniqueId: value.user.uniqueId,
                winningCodeConfirmation: value.user.winningCodeConfirmation
              };

              let newPostKeySet = fire.database().ref().child('allWinningNumbers').push().key;
              let newPostKeyNew = fire.database().ref().child('winningNumbers').push().key;

              // Write the new post's data simultaneously in the posts list and the user's post list.
              let updates = {};
              let updatesWeb = {};
              updates[`/allWinningNumbers/${timeNow}/${newPostKeySet}/`] = postDataWeb;
              updatesWeb[`/dailyWinningNumbers/${newPostKeyNew}/winner/`] = postDataWeb;
              fire.database().ref().update(updates);
              fire.database().ref().update(updatesWeb);
            });
          }
        });
      }
    });
*/
    const { winningCodeConfirmation } = this.props;
    if (winningCodeConfirmation === true ) {
      this.props.handleSubmission({ winningCodeConfirmation });
      this.togglePopup();
    }

  }

  togglePopup() {
    this.setState({
      showPopup: !this.state.showPopup
    });
  }

  render() {
    let message;

    if(this.props.winningCodeConfirmation === false) {
      message = `Unlucky, you do not hold a winning number this time.`;
    }
    if(this.props.winningCodeConfirmation === true) {
      message = `Congratulations! send you your prize blah blah`;
    }

    if(this.state.message !== null){
      message = this.state.message;
    }
    if(this.state.message !== null){
      message = this.state.message;
    }

    return (
      <div className="validate_form">
        {this.state.showPopup ?
          <Popup
            info={message}
            handleSubmission={this.props.handleSubmission}
            closePopup={() => this.togglePopup()}
          />
          : null
        }
        {this.state.winningCodeConfirmation === false &&
          <form action="" id="user-form" noValidate="noValidate">
            <fieldset>
              <div className="form-group">
                <label>Validate code</label>
                <input
                  type="text"
                  className={ this.state.outline ? 'outline' : 'noError' }
                  placeholder="validate code"
                  name="code"
                  onChange={event => this.handleSubmit(event)}
                />
                <span className="errorEmail">{this.state.error}</span>
              </div>
            </fieldset>
            <button
              className="btn btn-primary custom-button"
              type="button"
              onClick={e => this.handleSubmitCode(e)}
            >
              redeem code
            </button>
          </form>
        }
        {this.state.winningCodeConfirmation === true &&
          <div>
            Osas P Official to make some slick animation to show the code has been redeem.
            This is to not show the redeem page again for the session incase the user gets confused.
          </div>
        }
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    mobileNumber: state.get('reducer').mobileNumber,
    selectedNetwork: state.get('reducer').selectedNetwork,
    uniqueId: state.get('reducer').uniqueId,
    winningCodeConfirmation: state.get('reducer').winningCodeConfirmation,
  };
};

const mapDispatchToProps = {
  getWinningCode,
  getWinningCodeConfirmation
};

export default connect(mapStateToProps, mapDispatchToProps)(WinningCodeValidation);
