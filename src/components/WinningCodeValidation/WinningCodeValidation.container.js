import React from 'react';
import './WinningCodeValidation.scss';
import {getWinningCode, getWinningCodeConfirmation} from "../../redux/actions";
import {connect} from "react-redux";
import { PopupboxManager, PopupboxContainer } from 'react-popupbox';

export class WinningCodeValidation extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      code: null,
      matchMessage: 'Congratulations!',
      winningCodeConfirmation: false
    }
  }

  openPopupbox(message) {
    const content = (
      <div>
        {/*<button onClick={() => this.updatePopupbox()}>Update!</button>*/}
      </div>
    );
    PopupboxManager.open({
      content,
      config: {
        titleBar: {
          enable: true,
          text: `${message}`

        },
        fadeIn: true,
        fadeInSpeed: 500
      }
    })
  }

  handleSubmit(event) {
    this.setState({
      code: event.target.value
    });
  }

  handleSubmitCode(e) {
    let message;
    e.preventDefault();
    if(this.state.code !== this.props.receivedMobileNumber) {
      message = `Sorry ..not a winner blah blah`;
      const postData = {
        winningCodeConfirmation: false,
      };
      this.props.getWinningCodeConfirmation(postData);
      this.openPopupbox(message);
    } else {
      this.setState({ winningCodeConfirmation: true });
      message = `Congratulations! send you your prize blah blah`;
      const postData = {
        winningCodeConfirmation: true
      };
      this.props.getWinningCodeConfirmation(postData);
      this.openPopupbox(message);
    }
  }

  render() {
    return (
      <div>
        <PopupboxContainer />
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