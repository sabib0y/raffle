import React from 'react';
import './PopUp.scss';
import moment from 'moment';
import uniqid from 'uniqid';
// import twilio from 'twilio';
import { connect } from "react-redux";
import { getUsers, getNumbers } from "../../redux/actions";
import { randomizedData } from '../../helpers/getDataFirebase';
import 'react-select/dist/react-select.css';
import './Home.scss';
import Popup from '../PopUp/PopUp.component';
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
      network: '',
      clickedClass: '',
      showPopup: false
    };
  }Ó

  handleChangeNetwork() {
    let elements = document.getElementById('dropDown-custom');
    let selectedValue = elements.options[elements.selectedIndex].value;
    this.setState({ selectedNetwork: selectedValue});
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
        this.setState({
          errorMessageNumber: `Mobile number should only be numbers.`,
          errorNumber: false
        })
      }

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
            this.togglePopup();
          } else {
            this.props.getUsers(dataToSend);
            this.setState({disabled: true});
            document.getElementById("user-form").reset();
            this.togglePopup();
          }
        }
      }
      else {
        this.props.getUsers(dataToSend);

        this.setState({disabled: true});
        document.getElementById("user-form").reset();
      }
    });
  }

  togglePopup() {
    this.setState({
      showPopup: !this.state.showPopup
    });
  }

  testFunc() {
    this.setState({showResults: !this.state.showResults});
  }

  redeemCode() {
    this.setState({revealRedeem: true});
  }

  labelHandler(e){
    console.log(e);
    this.setState({clickedClass: 'active'})
  }

  render() {
    const options = [
      { value: 'Select Network', label: 'select network', id: 'select-network'},
      { value: 'MTN', label: 'MTN', id: 'mtn' },
      { value: '9 Mobile', label: '9 Mobile', id: '9-mobile'},
      { value: 'Glo Network', label: 'Glo', id: 'glo-mobile'},
      { value: 'AirTel', label: 'AirTel', id: 'airtel'},
    ];

    const popUpInfo = (
      <div>
        <h3>Competition Entered!</h3>
        <div className="uniqueCodePopUp">Your unique code is <span className="codeTransform">{this.state.uniqueId}</span></div>
        <div>We'll be in touch if you're our lucky winner!!!</div>
        <p><i>By closing, you confirm that you have copied your unique code and saved it.</i></p>
      </div>
    )

    return (
      <div>
      <div className="formWrapper">
        {this.state.showPopup ?
          <Popup
            info={popUpInfo}
            closePopup={() => this.togglePopup()}
          />
          : null
        }
        <div>
          <div className="row">
            <div className="draw_content_container">
              <p id="intro_tease">Enter your details in here daily to stand a chance to win  <span className="large_text">500 naira</span>  top up! Winners will be announced at 7pm Nigerian time.</p>
            <div className = "main_form">
              <form action="" id="user-form" noValidate="novalidate" onSubmit={e => this.handleSubmitForm(e)}>
                <fieldset>
                  <div className={`form-group ${this.state.clickedClass ? 'active' : ''}`}>
                    <label>Name</label>
                    <input
                      className={`form-control formInput`}
                      placeholder="Full Name"
                      name='fullName'
                      onChange={event => this.handleSubmit(event)}
                      onClick={event => this.labelHandler(event)}
                    />
                  </div>
                  <div className={`form-group form-row form-row-edit ${this.state.clickedClass ? 'active' : ''}`}>
                    <div className="number-wrapper">
                      <label>Number</label>
                      <input
                        className="form-control formInput"
                        placeholder="Please Enter Mobile"
                        name='mobileNumber'
                        type='telephone'
                        onChange={event => this.handleSubmit(event)}
                        onClick={event => this.labelHandler(event)}
                      />
                    </div>
                    <div className="network-wrapper">
                        <label>Network</label>
                        <div className="form-group">
                          <select
                            className="dropDown-custom"
                            id="dropDown-custom"
                            onChange={() => this.handleChangeNetwork()}
                          >
                            {options.map((item, i) => {
                              return (
                                <option
                                  key={i}
                                  className="dropdown-option"
                                  value={item.label}
                                >
                                  {item.value}
                                </option>
                              )
                            })}
                          </select>
                        </div>
                      </div>
                  </div>
                  <div className={`form-group ${this.state.clickedClass ? 'active' : ''}`}>
                    <label>Email ** OPTIONAL **</label>
                    <input
                      className="form-control formInput"
                      placeholder="Please enter Email"
                      name='emailAddress'
                      onChange={event => this.handleSubmit(event)}
                      onClick={event => this.labelHandler(event)}
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
      </div>
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
  getUsers,
  getNumbers
};

export default connect(mapStateToProps, mapDispatchToProps)(Home);
