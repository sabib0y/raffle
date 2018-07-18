import React from 'react';
import './WinningCodeValidation.scss';
import {getWinningCode, getWinningCodeConfirmation} from "../../redux/actions";
import {connect} from "react-redux";
import Popup from '../PopUp/PopUp.component';

export class WinningCodeValidation extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      code: null,
      matchMessage: 'Congratulations!',
      winningCodeConfirmation: false,
      showPopup: false
    }
  }

  handleSubmit(event) {
    this.setState({
      code: event.target.value
    });
  }

  handleSubmitCode(e) {
    e.preventDefault();
    if(this.state.code !== this.props.receivedMobileNumber) {
      const postData = {
        winningCodeConfirmation: false,
      };
      this.props.getWinningCodeConfirmation(postData);
      this.togglePopup();
    } else {
      this.setState({ winningCodeConfirmation: true });
      const postData = {
        winningCodeConfirmation: true
      };
      this.props.getWinningCodeConfirmation(postData);
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

    if(this.state.code !== this.props.receivedMobileNumber) {
      message = `Sorry ..not a winner blah blah`;
    } else {
      message = `Congratulations! send you your prize blah blah`;
    }

    return (
      <div className="validate_form">
        {this.state.showPopup ?
          <Popup
            info={message}
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
                  className="form-control codeValidate"
                  placeholder="validate code"
                  name="code"
                  onChange={event => this.handleSubmit(event)}
                />
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
    user: state.reducer.user
  };
};

const mapDispatchToProps = {
  getWinningCode,
  getWinningCodeConfirmation
};

export default connect(mapStateToProps, mapDispatchToProps)(WinningCodeValidation);
