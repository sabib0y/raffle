import React from 'react';
// import './WinningCodeValidation.scss';
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

  openPopupbox() {
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
          text: `Congratulations ${this.props.user.fullName}!!`

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
    e.preventDefault();
    if(this.state.code !== this.props.user.mobileNumber) {
      console.log('Sorry Try Again')
    } else {
      this.setState({ winningCodeConfirmation: true });

      this.props.getWinningCodeConfirmation({winningCodeConfirmation: true, selectedNetwork: this.props.user.selectedNetwork, mobileNumber: this.props.user.mobileNumber});
      console.log('pop up appears here');
      this.openPopupbox();
    }
  }

  render() {
    console.log('this.propsWICV', this.props.user.winningCodeConfirmation);
    return (
      <div>
        <PopupboxContainer />
        <form action="" id="user-form" noValidate="noValidate">
          <fieldset>
            {this.props.user.winningCodeConfirmation === false &&
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
            }
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