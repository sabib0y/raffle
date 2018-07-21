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

export class Home extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      fullName: null,
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
      selectedNetwork: 'Select Mobile NetworkX',
      errorMessageNumber: '',
      errorEmail: '',
      errorNumber: false,
      selectedOption: '',
      network: '',
      clickedClass: '',
      showPopup: false,
      emailDisable: false,
      errorPresent: false,
      errorName: ''
    };
  }

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
            errorEmail: 'Please enter a valid email address',
            disabled: true
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
      if (event.target.value.length > 0) {
        event.target.parentNode.parentNode.classList.add('active')
        if (isNaN(parseInt(event.target.value))) {
          this.setState({
            errorMessageNumber: 'Valid mobile number required.',
            errorNumber: true
          });
          event.target.classList.add('errorOutline')
        }
        if (!isNaN(parseInt(event.target.value))) {
          this.setState({
            errorMessageNumber: ``,
            errorNumber: false
          });
          event.target.classList.remove('errorOutline')
        }
      }
      else {
        this.setState({
          errorMessageNumber: 'Valid mobile number required.',
          errorNumber: true
        });
        event.target.classList.add('errorOutline')
        event.target.parentNode.parentNode.classList.remove('active')
      }
    }

    if(event.target.name === 'fullName') {
      if(event.target.value.length > 0) {
        event.target.parentNode.classList.add('active')
      }
      else {
        event.target.parentNode.classList.remove('active')
      }
    }
  }

  isSubmit(){
    // if(this.state.mobileNumber.length === 11) {
    //   return true
    // }

    if(this.state.mobileNumber !== null) {
      if(this.state.mobileNumber.length < 11 || this.state.mobileNumber.length > 11) {
        return true
      }
    }

    return false;
  }

  handleSubmitForm(event) {
    event.preventDefault();

    if (this.state.mobileNumber === null) {
      let classTest = document.getElementsByClassName('mobileInput');

      classTest.mobileNumber.classList.add('errorOutline')

      console.log('number is null', classTest);
      this.setState({
        errorMessageNumber: 'Valid mobile number required.',
      });
    }

    else {
      if(this.state.mobileNumber.length < 11 || this.state.mobileNumber.length > 11) {
        let classTest = document.getElementsByClassName('mobileInput');

        classTest.mobileNumber.classList.add('errorOutline')
        this.setState({
          errorMessageNumber: 'Valid mobile number required.',
        });
      }
      else {


        let classTest = document.getElementsByClassName('mobileInput');

        let re = /\S+@\S+\.\S+/;
        let classEmail = document.getElementsByClassName('emailInput');

        if (this.state.emailAddress.length > 0 && re.test(this.state.emailAddress) === false) {
          console.log('igbo', re.test(this.state.emailAddress))
          // classEmail.emailAddress.classList.add('errorOutline');
        }


        let resultName = /^[a-zA-Z ]+$/;
        if (this.state.fullName.length > 0 && resultName.test(this.state.fullName) === false) {
          console.log('name', re.test(this.state.fullName))
          // classEmail.emailAddress.classList.add('errorOutline');
          this.setState({
            errorName: 'Name contains numbers'
          })
        }

        else {

          classTest.mobileNumber.classList.remove('errorOutline')
          this.setState({
            errorMessageNumber: '',
          });
          let newDate = moment();
          newDate = newDate.format();

          this.state.id = Math.floor(Math.random() * Math.floor(100000));
          this.state.date = newDate;

          const unidueId = uniqid();
          this.state.uniqueId = unidueId;

          let collectedData = [];
          let collectedNumbers = [];

          fire.database().ref('users').once('value').then((snapshot) => {

            const {fullName, emailAddress, selectedNetwork, mobileNumber, date, uniqueId} = this.state;
            const dataToSend = {
              fullName, emailAddress, selectedNetwork, mobileNumber, date, uniqueId
            };

            if (snapshot.exists()) {
              if (Object.entries !== null || Object.entries !== undefined) {
                let receivedData = Object.entries(snapshot.val());
                receivedData.map(item => {
                  return collectedData.push(item[1]);
                });
                collectedData.map(user => {
                  return collectedNumbers.push(user.user.mobileNumber);
                });

                if (collectedNumbers.indexOf(this.state.mobileNumber) > -1) {
                  this.props.getNumbers({fullName, emailAddress, mobileNumber, date, uniqueId});
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
      }
    }
  }

  togglePopup() {
    this.setState({
      showPopup: !this.state.showPopup,
      mobileNumber: ''
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
                      className={`form-control formInput`}
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
