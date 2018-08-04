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
      winningCodeConfirmation: false,
      showPopup: false,
      message: null,
      error: null,
      outline: false
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

    receivedData.map(item => {
      if(code === item.winner.mobileNumber) {
        const winner = {
          mobileNumber: item.winner.mobileNumber,
          selectedNetwork: item.winner.selectedNetwork,
          uniqueId: item.winner.uniqueId,
          winningCodeConfirmation: true
        };

        let newPostKey = fire.database().ref().child('confirmedWinnerList').push().key;

        // Write the new post's data simultaneously in the posts list and the user's post list.
        let updates = {};
        updates[`/confirmedWinnerList/${newPostKey}/confirmedWinner/`] = winner;

        fire.database().ref('confirmedWinnerList/').once('value').then((snapshot) => {
          let receivedDataTime = snapshot.val();

          if(receivedDataTime !== null) {
            let vals = Object.keys(receivedDataTime).map(key => {
              return receivedDataTime[key];
            });

            for(let value of vals) {
              collectedNumbersArray.push(value.confirmedWinner.mobileNumber);
            }

            let exists = collectedNumbersArray.some(item => item === code);

            if(!exists) {
              this.setState({
                winningCodeConfirmation: true
              });
              fire.database().ref().update(updates);
              this.props.handleSubmission({
                winningCodeConfirmation: true,
                winner: true
              });
              this.props.getWinningCodeConfirmation(winner);
              this.togglePopup();
            } else {
              this.setState({
                message: 'Sorry, it seems like the winning code has already been redeemed.'
              });
              this.togglePopup();
            }
          } else {
            this.setState({
              winningCodeConfirmation: true
            });
            fire.database().ref().update(updates);
            this.props.handleSubmission({
              winningCodeConfirmation: true,
              winner: true
            });
            this.props.getWinningCodeConfirmation(winner);
            this.togglePopup();
          }
        });
      }

      if (code === null || code === "") {
        this.setState({
          error: 'Enter valid number.',
          outline: true
        });
      }
      else {
        this.setState({
          error: '',
          outline: false
        })
      }
    });
  }

  componentDidMount() {
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
                <input
                  type="text"
                  className={ this.state.outline ? 'outline' : 'noError' }
                  placeholder="validate code"
                  name="code"
                  onChange={event => this.handleSubmit(event)}
                />
                <span className="errorEmail">{this.state.error}</span>
                <button
                  className="btn btn-primary codeValidate"
                  type="button"
                  onClick={e => this.handleSubmitCode(e)}
                >
                  redeem code
                </button>
              </div>
            </fieldset>
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
