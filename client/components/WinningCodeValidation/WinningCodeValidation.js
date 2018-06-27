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
          text: `Congratulations ${this.props.user.firstName}!!`

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

    if(this.state.code !== this.props.user.uniqueId) {
      console.log('test test', this.props.user.uniqueId, this.state.code)
    } else {
      this.setState({ winningCodeConfirmation: true });
      this.props.getWinningCodeConfirmation({winningCodeConfirmation: true});
      this.openPopupbox();
    }
  }

  render() {
    console.log('this.propsWICV', this.props.user.winningCodeConfirmation);
    return (
      <div>
        <form action="" id="user-form" noValidate="noValidate">
          <fieldset>
            {this.state.winningCodeConfirmation === false &&
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
            {
              <div>

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
    user: state.reducer
  };
};

const mapDispatchToProps = {
  getWinningCode,
  getWinningCodeConfirmation
};

export default connect(mapStateToProps, mapDispatchToProps)(WinningCodeValidation);