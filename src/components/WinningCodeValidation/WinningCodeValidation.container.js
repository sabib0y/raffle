import React from 'react';
import './WinningCodeValidation.scss';
import {getWinningCode, getWinningCodeConfirmation} from "../../redux/actions";
import {connect} from "react-redux";
import fire from '../../fire';
import Popup from '../PopUp/PopUp.component';

export class WinningCodeValidation extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      code: null,
      matchMessage: 'Congratulations!',
      showPopup: false,
      message: null,
      error: null,
      outline: false,
      won: false,
      winningCodeEntered: false,
      winningCodeConfirmation: false,
      exists: false,
      winner: false
    }
  }

  handleSubmit(event) {
    this.setState({
      code: event.target.value
    });

    let formGroupClass = document.getElementsByClassName('form-group');

    if(event.target.value.length > 0) {
      event.target.parentNode.classList.add('active');
    } else {

      event.target.parentNode.classList.remove('active');
    }

    console.log('formGroupClass', formGroupClass, event.target.value.length);
  }

  handleSubmitCode(e) {
    e.preventDefault();
    const { code } = this.state;
    const { receivedData } = this.props;
    let collectedNumbersArray = [];
    let winner = {};

    receivedData.map(item => {
      if(code === item.user.mobileNumber) {
        winner = {
          mobileNumber: item.user.mobileNumber,
          selectedNetwork: item.user.selectedNetwork,
          uniqueId: item.user.uniqueId,
          winningCodeConfirmation: true
        };
      }
    });

    if(code === winner.mobileNumber) {
      let newPostKey = fire.database().ref().child('confirmedWinnerList').push().key;

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
            this.setState({
              winningCodeConfirmation: false,
              exists: false,
              winner: true
            });
            this.togglePopup();
            this.props.handleSubmission({
              winningCodeConfirmation: true,
              winner: true,
              exists: false,
              won: true
            });
            fire.database().ref().update(updates);
            this.props.getWinningCodeConfirmation(winner);
          }
          if (exists) {
            this.setState({
              winningCodeConfirmation: false,
              exists: true,
              winner: false
            });
            this.togglePopup();
          }
        }
        else {
          this.setState({
            winningCodeConfirmation: false,
            exists: false,
            winner: true,
            won: true
          });
          this.togglePopup();
          this.props.handleSubmission({
            winningCodeConfirmation: true,
            winner: true,
            won: true
          });
          fire.database().ref().update(updates);
          this.props.getWinningCodeConfirmation(winner);
        }
      });
    }
    else {
      this.setState({
        winningCodeConfirmation: false,
        exists: false,
        winner: false
      });
      this.togglePopup();
    }
  }

  togglePopup() {
    this.setState({
      showPopup: !this.state.showPopup
    });
  }

  render() {
    let popUpInfo;

    const { winningCodeEntered, exists, winner } = this.state;

    if(exists === false && winningCodeEntered === false && winner === true) {
      popUpInfo = (
        <div>
          <p className="popUpHeaderText">Congrats!</p>
          <p className="uniqueCodePopUp">Your code has been redeemed!</p>
          <div className="uniqueCodePopUpText">We'll send you your winnings shortly</div>
        </div>
      );
    }

    if(exists === true && winningCodeEntered === false && winner === false) {
      popUpInfo = (
        <div>
          <p className="popUpHeaderText">Sorry!</p>
          <p className="uniqueCodePopUp">Your code has been already been redeemed.</p>
          <div className="uniqueCodePopUpText">Double check your code.</div>
        </div>
      );
    }

    if(exists === false && winningCodeEntered === false && winner === false){
      popUpInfo = (
        <div>
          <p className="popUpHeaderText">Unlucky... :(</p>
          <p className="uniqueCodePopUp">You do not hold a winning number this time</p>
          <div className="uniqueCodePopUpText">Thank you for participating</div>
        </div>
      );
    }

    return (
      <div className="validate_form">
        {this.state.showPopup ?
          <Popup
            info={popUpInfo}
            handleSubmission={this.props.handleSubmission}
            closePopup={() => this.togglePopup()}
          />
          : null
        }
        {this.state.winningCodeConfirmation === false &&
          <form action="" id="user-form" noValidate="noValidate" onSubmit={e => this.handleSubmitCode(e)}>
            <fieldset>
              <div className="form-group">
                <label>Enter your number here</label>
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
              type="submit"
            >
              redeem code
            </button>
          </form>
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
