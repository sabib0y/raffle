import React from 'react';
import './PopUp.scss';
import moment from 'moment';
import uniqid from 'uniqid';
// import twilio from 'twilio';
import { connect } from "react-redux";
import { getUsers, getNumbers } from "../../redux/actions";
import 'react-select/dist/react-select.css';
import './Home.scss';
import Popup from '../PopUp/PopUp.component';
import fire from "../../fire";
import _ from 'lodash';

export class Home extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      fullName: '',
      emailAddress: '',
      mobileNumber: '',
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
      selectedNetwork: 'Select Mobile Network',
      errorMessageNumber: '',
      errorEmail: '',
      errorNumber: false,
      selectedOption: '',
      network: '',
      clickedClass: '',
      showPopup: false,
      emailDisable: false,
      errorPresent: false,
      errorName: '',
      hasError: false,
      errorNetworkMessage: ''
    };
  }

  handleChangeNetwork(event) {
    let elements = document.getElementById('dropDown-custom');
    let selectedValue = elements.options[elements.selectedIndex].value;
    this.setState({ selectedNetwork: selectedValue});

    if(event.target.value === 'select network') {
      event.target.classList.add('errorOutline');
      this.setState({
        errorNetworkMessage: ''
      })
    }
    else {
      event.target.classList.remove('errorOutline');
      this.setState({
        errorNetworkMessage: ''
      })
    }
  }

  componentDidMount() {
    fire.database().ref('users/').once('value').then(snapshot => {
      let receivedData = snapshot.val();
      let collectedData = [];


      if (receivedData !== null) {
        let vals = Object.keys(receivedData).map(key => {
          return receivedData[key];
        });
        vals.map(item => {
          collectedData.push(item.user);
        });
      }

      console.log('before', collectedData);
      _.uniqWith(collectedData, _.isEqual);

      console.log('after', collectedData);
    });
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

    if(event.target.name === 'emailAddress') {
      let re = /\S+@\S+\.\S+/;
      if(event.target.value.length > 0) {
        event.target.parentNode.classList.add('active');
        if (re.test(event.target.value) === true) {
          this.setState({
            emailDisable: false,
            disabled: false
          });
          event.target.classList.remove('errorOutline');
        } else {
          this.setState({
            emailDisable: true,
            errorEmail: '',
            disabled: true,
            hasError: true
          });
          event.target.classList.add('errorOutline');
        }
      }
      else
        if(event.target.value.length <= 0) {
          event.target.classList.remove('errorOutline');
          event.target.parentNode.classList.remove('active');
          this.setState({
            disabled: false,
            errorEmail: ''
          });
        }
      else {
        this.setState({ emailDisable: false });
        event.target.parentNode.classList.remove('active');
        event.target.classList.remove('errorOutline');
      }
    }

    if(event.target.name === 'mobileNumber') {
      if(event.target.value.length !== 11){
        event.target.classList.add('errorOutline')
      }
      if(event.target.value.length === 11){
        event.target.classList.remove('errorOutline')
      }
      if (event.target.value.length > 0) {
        event.target.parentNode.parentNode.classList.add('active')
        if (isNaN(parseInt(event.target.value, 10))) {
          this.setState({
            errorMessageNumber: '',
            errorNumber: true,
            hasError: true
          });
          event.target.classList.add('errorOutline')
        }
        if (!isNaN(parseInt(event.target.value, 10))) {
          this.setState({
            errorMessageNumber: ``,
            errorNumber: false,
            hasError: false
          });
        }
      }
      else {
        this.setState({
          errorMessageNumber: '',
          errorNumber: true,
          hasError: true
        });
        event.target.classList.remove('errorOutline');
        event.target.parentNode.parentNode.classList.remove('active')
      }
    }

    if(event.target.name === 'fullName') {
      if(event.target.value.length > 0) {
        event.target.parentNode.classList.add('active');
        event.target.classList.remove('errorOutline');
        this.setState({
          errorName: '',
          hasError: false
        });

        let resultName = /^[a-zA-Z ]+$/;
        if (resultName.test(event.target.value) === false) {
          event.target.classList.add('errorOutline');
          this.setState({
            errorName: '',
            hasError: true,
            fullName: ''
          })
        }

      }
      else {
        event.target.parentNode.classList.remove('active');
        event.target.classList.add('errorOutline');
        this.setState({
          errorName: '',
          hasError: true,
          fullName: ''
        })
      }
    }
  }

  handleSubmitForm(event) {
    event.preventDefault();
    let resultName = /^[a-zA-Z ]+$/;
    let className = document.getElementsByClassName('nameInput');
    let classTest = document.getElementsByClassName('mobileInput');
    let classSelect = document.getElementsByClassName('dropDown-custom');

    let re = /\S+@\S+\.\S+/;

    if (this.state.mobileNumber.length < 1) {
      let classTest = document.getElementsByClassName('mobileInput');

      classTest.mobileNumber.classList.add('errorOutline')

      this.setState({
        errorMessageNumber: 'Valid mobile number required',
        mobileNumber: '',
        hasError: true
      });
    }

    if(this.state.fullName.length < 1) {
      className.fullName.classList.add('errorOutline');
      this.setState({
        errorName: 'Valid name required',
        fullName: '',
        hasError: true
      })
    }

    if(this.state.selectedNetwork === 'Select Mobile Network' || this.state.selectedNetwork === 'select network') {
      classSelect.selectNetwork.classList.add('errorOutline');
      this.setState({
        errorNetworkMessage: 'Valid network required',
      })
    }

    else
    if(this.state.selectedNetwork === 'Select Mobile Network' || this.state.selectedNetwork === 'select network') {
      classSelect.selectNetwork.classList.add('errorOutline');
      this.setState({
        errorNetworkMessage: 'Valid network required',
      })
    }

    else
      if(this.state.mobileNumber.length !== 11) {
      let classTest = document.getElementsByClassName('mobileInput');

      classTest.mobileNumber.classList.add('errorOutline');
      this.setState({
        errorMessageNumber: 'Valid mobile number required',
        mobileNumber: '',
        hasError: true
      });
    }

    else
      if (this.state.emailAddress.length > 0 && re.test(this.state.emailAddress) === false) {
      // classEmail.emailAddress.classList.add('errorOutline');
    }

    else
      if (resultName.test(this.state.fullName) === false) {
      className.fullName.classList.add('errorOutline');
      this.setState({
        errorName: 'Valid name required',
        fullName: '',
        hasError: true
      })
    }

    else
      {

      classTest.mobileNumber.classList.remove('errorOutline');
      className.fullName.classList.remove('errorOutline');
      classSelect.selectNetwork.classList.remove('errorOutline');
      this.setState({
        errorMessageNumber: '',
        errorNetworkMessage: '',
        errorName: '',
      });
      let newDate = moment();
      newDate = newDate.format();

      const unidueId = uniqid();
      this.setState({
        id: Math.floor(Math.random() * Math.floor(100000)),
        date: newDate,
        uniqueId: unidueId
      });
      // this.state.id = Math.floor(Math.random() * Math.floor(100000));
      // this.state.date = newDate;

      // this.state.uniqueId = unidueId;

      const {fullName, emailAddress, selectedNetwork, mobileNumber, date, uniqueId} = this.state;
      const dataToSend = {
        fullName, emailAddress, selectedNetwork, mobileNumber, date, uniqueId
      };
      this.props.getUsers(dataToSend);
      this.setState({disabled: true});
      document.getElementById("user-form").reset();
      this.togglePopup();

      let classRemove = document.getElementsByClassName('form-group');
      for ( let value of classRemove) {
        value.classList.remove('active');
      }
    }
  }

  togglePopup() {
    this.setState({
      showPopup: !this.state.showPopup,
      mobileNumber: '',
      fullName: '',
      emailAddress: '',
      selectedNetwork: 'Select Mobile Network'
    });
  }

  testFunc() {
    this.setState({showResults: !this.state.showResults});
  }

  redeemCode() {
    this.setState({revealRedeem: true});
  }

  labelHandler(e){
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
        <p className="popUpHeaderText">Competition Entered!</p>
        <p className="uniqueCodePopUp">Your unique code is <span className="codeTransform">{this.state.uniqueId}</span></p>
        <div className="uniqueCodePopUpText">We'll be in touch if you're our lucky winner!!!
        <p className="uniqueCodePopUpDisclaimer"><i>By closing, you confirm that you have copied your unique code and saved it.</i></p>
        </div>
      </div>
    )

    return (
      <div>
        <div>
        <h1 className="headerText">Welcome to Dailychoppins!</h1>
        </div>
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
                  <div className='form-group '>
                    <label>Name</label>
                    <input
                      className='form-control formInput nameInput'
                      placeholder="Full Name"
                      name='fullName'
                      type="text"
                      onChange={event => this.handleSubmit(event)}
                    />
                    <span className="errorEmail">{this.state.errorName}</span>
                  </div>
                  <div className='form-group form-row form-row-edit '>
                    <div className="number-wrapper">
                      <label>Number</label>
                      <input
                        className="form-control formInput mobileInput"
                        placeholder="Please Enter Mobile"
                        name='mobileNumber'
                        type='number'
                        onChange={event => this.handleSubmit(event)}
                      />
                      <span className="errorEmail">{this.state.errorMessageNumber}</span>
                    </div>
                    <div className="network-wrapper">
                        <label>Network</label>
                        <div className="form-group">
                          <select
                            className="dropDown-custom"
                            id="dropDown-custom"
                            name='selectNetwork'
                            onChange={item => this.handleChangeNetwork(item)}
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
                          <span className="errorEmail">{this.state.errorNetworkMessage}</span>
                        </div>
                      </div>
                  </div>
                  <div className='form-group '>
                    <label>Email ** OPTIONAL **</label>
                    <input
                      className="form-control formInput emailInput"
                      placeholder="Please enter Email"
                      name='emailAddress'
                      type="email"
                      onChange={event => this.handleSubmit(event)}
                    />
                    {this.state.emailDisable === true &&
                      <div className="errorEmail">{this.state.errorEmail}</div>
                    }
                  </div>
                  <button
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
        <p className="disclaimerText">By entering the competition, you consent to your details being used for marketing purposes.</p>
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    user: state.get('reducer').user
  };
};

const mapDispatchToProps = {
  getUsers,
  getNumbers
};

export default connect(mapStateToProps, mapDispatchToProps)(Home);
