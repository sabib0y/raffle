import React from 'react';
import './PopUp.scss';
import moment from 'moment';
import uniqid from 'uniqid';
// import twilio from 'twilio';
import { connect } from "react-redux";
import { getUsers, getNumbers } from "../../redux/actions";
import { randomizedData } from '../../helpers/getDataFirebase';
import WinningID from '../WinningId/WinningId.component';
import './Home.scss';
import WinningCodeValidation from '../WinningCodeValidation/WinningCodeValidation';
import Select from 'react-select';
import 'react-select/dist/react-select.css';

import { PopupboxManager, PopupboxContainer } from 'react-popupbox';
import fire from "../../fire";

export class Home extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      fullName: null,
      emailAddress: null,
      mobileNumber: null,
      date: {},
      id: null,
      disabled: true,
      receivedData: {},
      randomWinningId: '',
      displayResults: '',
      showResults: false,
      uniqueId: null,
      dataCollected: false,
      revealRedeem: false,
      duplicateNumber: null,
      selectedNetwork: 'Select Mobile NetworkX',
      errorMessageNumber: '',
      errorNumber: false,
      selectedOption: '',
      network: ''
    };
    this.handleChangeNetwork = this.handleChangeNetwork.bind(this);
  }


  handleChangeNetwork(network) {
    this.setState({selectedNetwork: network.value});
  }

  displayResults() {
    this.setState({displayResults: 'test', showResults: true})
    setTimeout(() => {
      this.displayResults();
    }, 1000);
  }

  handleSubmit(event) {
    // event.preventDefault();
    let change = {};
    change[event.target.name] = event.target.value;
    this.setState(change);

    if(event.target.name === 'mobileNumber') {
      let reg = new RegExp('^[0-9]+$');
      if(isNaN(event.target.value)) {
        this.setState({
          errorMessageNumber: `Mobile number should only be numbers.`,
          errorNumber: true
        })
      }
      if (!isNaN(event.target.value)) {
        console.log('is a number')
        this.setState({
          errorMessageNumber: `Mobile number should only be numbers.`,
          errorNumber: false
        })
      }

      console.log('reg', reg)

      if(event.target.value) {
        this.setState({ disabled: false })
      }
      else {
        this.setState({ disabled: true})
      }
    }
  }

  handleSubmitForm(event) {
    event.preventDefault();
    let newDate = moment();
    newDate = newDate.format();

    this.state.id = Math.floor(Math.random() * Math.floor(100000));
    this.state.date = newDate;

    const unidueId = uniqid();
    this.state.uniqueId = unidueId;

    let collectedData = [];
    let collectedNumbers = [];
    let arrangedData = [];

    fire.database().ref('users').once('value').then((snapshot) => {

      const { fullName, emailAddress, selectedNetwork, mobileNumber, date, uniqueId } = this.state;
      const dataToSend = {
        fullName, emailAddress, selectedNetwork, mobileNumber, date, uniqueId
      };

      if (snapshot.exists()) {
        if (Object.entries !== null || Object.entries !== undefined) {
          let receivedData = Object.entries(snapshot.val());
          receivedData.map(item => {
            collectedData.push(item[1]);
          });
          collectedData.map(user => {
            collectedNumbers.push(user.user.mobileNumber);
          });

          if (collectedNumbers.indexOf(this.state.mobileNumber) > -1) {
            this.props.getNumbers({ fullName, emailAddress, mobileNumber, date, uniqueId });
            this.setState({disabled: true});
            document.getElementById("user-form").reset();
            this.openPopupbox();
          } else {
            this.props.getUsers(dataToSend);
            this.setState({disabled: true});
            document.getElementById("user-form").reset();
            this.openPopupbox();
          }
        }
      }
      else {
        this.props.getUsers(dataToSend);

        this.setState({disabled: true});
        document.getElementById("user-form").reset();
        this.openPopupbox();
      }
    });
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
          text: `Your unique entry ID is ${this.state.uniqueId}.
           We'll be in touch if you're our lucky winner!!!`

        },
        fadeIn: true,
        fadeInSpeed: 500
      }
    })
  }

  testFunc() {
    this.setState({showResults: !this.state.showResults});
  }

  redeemCode() {
    this.setState({revealRedeem: true});
  }

  render() {
    const options = [
      { value: 'MTN', label: 'MTN', },
      { value: '9 Mobile', label: '9 Mobile'},
      { value: 'Glo Network', label: 'Glo'},
      { value: 'AirTel', label: 'AirTel'},
    ];
    const { selectedNetwork } = this.state;

    return (
      <div>
      <div className="formWrapper">
        <PopupboxContainer />
        {/* eslint-disable */}
        {this.state.showResults === false &&
        <div>
          <div className="row">
            <div>
            <div>
              <p id="intro_tease">Enter your details in here daily to stand a chance to win  500 naira  top up! Winners will be announced at 7pm Nigerian time.</p>
              <form action="" id="user-form" noValidate="novalidate" onSubmit={e => this.handleSubmitForm(e)}>
                <fieldset>
                  <div className="form-group">
                    <label>Name</label>
                    <input
                      className="form-control formInput"
                      placeholder="Full Name"
                      name='fullName'
                      onChange={event => this.handleSubmit(event)}
                    />
                  </div>
                  <div className="form-group form-row form-row-edit">
                    <div className="network-wrapper">
                      <label>Network</label>
                      <Select
                        name="form-field-name"
                        className="basic-single"
                        classNamePrefix="select"
                        value={selectedNetwork}
                        options={options}
                        clearable={false}
                        onChange={this.handleChangeNetwork}
                      />
                    </div>
                    <div className="number-wrapper">
                      <label>Number</label>
                      <input
                        className="form-control formInput"
                        placeholder="Please Enter Mobile"
                        name='mobileNumber'
                        type='telephone'
                        onChange={event => this.handleSubmit(event)}
                      />
                    </div>
                  </div>
                  <div className="form-group">
                    <label>Email ** OPTIONAL **</label>
                    <input
                      className="form-control formInput"
                      placeholder="Please enter Email"
                      name='emailAddress'
                      onChange={event => this.handleSubmit(event)}
                    />
                  </div>
                  <button
                    disabled={this.state.disabled}
                    className="btn btn-primary custom-button"
                    type="submit">
                    Submit
                  </button>
                </fieldset>
              </form>
              </div>
            </div>
          </div>
        </div>
         }
        {/* eslint-disable */}
        {this.state.showResults === true &&
          <div>
            <WinningID
              id={this.props.id}
              uniqueId={this.props.uniqueId}
            />
            <div>
              Have a winning code?
              <a
                href="#"
                onClick={() => this.redeemCode()}
              >click to redeem code
              </a>
            </div>
            {this.state.revealRedeem &&
              <WinningCodeValidation
                uniqueId={this.props.uniqueId}
              />
            }
          </div>
        }
      </div>
      <div className="formWrapper">
        <button
          className="btn btn-primary formInput tempButton"
          onClick={() => this.testFunc()
          }>
            Test Random Generator
        </button>
      </div>
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
  getUsers,
  getNumbers
};

export default connect(mapStateToProps, mapDispatchToProps)(Home);
