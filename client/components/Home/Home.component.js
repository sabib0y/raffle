import React from 'react';
import './PopUp.css';
import moment from 'moment';
import uniqid from 'uniqid';
// import twilio from 'twilio';
import { connect } from "react-redux";
import { getUsers, getNumbers } from "../../redux/actions";
import { randomizedData } from '../../helpers/getDataFirebase';
import WinningID from '../WinningId/WinningId.component';
import './Home.scss';
import WinningCodeValidation from '../WinningCodeValidation/WinningCodeValidation';

import { PopupboxManager, PopupboxContainer } from 'react-popupbox';
import fire from "../../fire";

export class Home extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      firstName: null,
      lastName: null,
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
      duplicateNumber: null
    }
  }

  displayResults() {
    this.setState({displayResults: 'test', showResults: true})
    setTimeout(() => {
      console.log('timeOut')
      this.displayResults();
    }, 1000);
  }

  handleSubmit(event) {
    // event.preventDefault();
    let change = {};
    change[event.target.name] = event.target.value;
    this.setState(change);

    if(event.target.name === 'mobileNumber') {
      if(event.target.value) {
        this.setState({ disabled: false })
      }
      else {
        this.setState({ disabled: true})
      }
    }

    console.log('disabled', this.state.disabled)
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

      const { firstName, lastName, emailAddress, mobileNumber, date, uniqueId } = this.state;
      const dataToSend = {
        firstName, lastName, emailAddress, mobileNumber, date, uniqueId
      };

      if (snapshot.exists()) {
        console.log('Database has users');
        if (Object.entries !== null || Object.entries !== undefined) {
          let receivedData = Object.entries(snapshot.val());
          receivedData.map(item => {
            collectedData.push(item[1]);
          });
          collectedData.map(user => {
            collectedNumbers.push(user.user.mobileNumber);
          });

          if (collectedNumbers.indexOf(this.state.mobileNumber) > -1) {
            console.log('Found duplicate numbers', this.state.mobileNumber);
            this.props.getNumbers({ firstName, lastName, emailAddress, mobileNumber, date, uniqueId });
            this.setState({disabled: true});
            document.getElementById("user-form").reset();
            this.openPopupbox();
          } else {
            console.log('New number detected', this.state.mobileNumber);

            this.props.getUsers(dataToSend);
            this.setState({disabled: true});
            document.getElementById("user-form").reset();
            this.openPopupbox();
          }
        }
      }
      else {
        console.log('New User, empty database');
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
    return (
      <div>
        <PopupboxContainer />
        {this.state.showResults === false &&
        <div className="container">
          <div className="row">
            <div className="col-lg-6">
              <form action="" id="user-form" noValidate="novalidate" onSubmit={e => this.handleSubmitForm(e)}>
                <fieldset>
                  <div className="form-group">
                    <label>Name</label>
                    <input
                      className="form-control"
                      placeholder="name"
                      name='firstName'
                      onChange={event => this.handleSubmit(event)}
                    />
                  </div>
                  <div className="form-group">
                    <label>Surname</label>
                    <input
                      className="form-control"
                      placeholder="Last Name"
                      name='lastName'
                      onChange={event => this.handleSubmit(event)}
                    />
                  </div>
                  <div className="form-group">
                    <label>Email ** OPTIONAL **</label>
                    <input
                      className="form-control"
                      placeholder="Please enter Email"
                      name='emailAddress'
                      onChange={event => this.handleSubmit(event)}
                    />
                  </div>
                  <div className="form-group">
                    <label>Number</label>
                    <input
                      className="form-control"
                      placeholder="Please Enter Mobile"
                      name='mobileNumber'
                      type='telephone'
                      onChange={event => this.handleSubmit(event)}
                    />
                  </div>

                  <button
                    disabled={this.state.disabled}
                    className="btn btn-primary"
                    type="submit">
                    Submit
                  </button>
                </fieldset>
              </form>
            </div>
          </div>
        </div>
         }
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

        <div>
          <button
            className="btn btn-primary tempButton"
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
