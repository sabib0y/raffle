import React from 'react';
import './PopUp.css';
import moment from 'moment';
import uniqid from 'uniqid';
// import twilio from 'twilio';
import writeNewPost from '../../helpers/firebasePostHelper';
import getPosts from '../../helpers/getDataFirebase';
import { randomizedData } from '../../helpers/getDataFirebase';
import WinningID from '../WinningId/WinningId';
import './Home.css';
import isEmpty from 'lodash';

import { PopupboxManager, PopupboxContainer } from 'react-popupbox';

export default class Home extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      firstName: null,
      lastName: null,
      email: null,
      number: '',
      date: {},
      id: null,
      receivedData: {},
      randomWinningId: '',
      displayResults: '',
      showResults: false,
      uniqueId: null
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
    event.preventDefault();
    let change = {};
    change[event.target.name] = event.target.value;
    this.setState(change);
  }

  handleSubmitForm(event) {
    event.preventDefault();
    let newDate = moment();
    newDate = newDate.format();

    this.state.id = Math.floor(Math.random() * Math.floor(100000));
    this.state.date = newDate;

    const unidueId = uniqid();
    this.state.uniqueId = unidueId;

    writeNewPost(
      this.state.firstName,
      this.state.lastName,
      this.state.email,
      this.state.number,
      this.state.date,
      this.state.uniqueId
    );

    this.openPopupbox();
    document.getElementById("user-form").reset();
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
                      name='email'
                      onChange={event => this.handleSubmit(event)}
                    />
                  </div>
                  <div className="form-group">
                    <label>Number</label>
                    <input
                      className="form-control"
                      placeholder="Please Enter Mobile"
                      name='number'
                      type='telephone'
                      onChange={event => this.handleSubmit(event)}
                    />
                  </div>

                  <button className="btn btn-primary" type="submit">
                    Sign Up
                  </button>
                </fieldset>
              </form>
            </div>
          </div>
        </div>
        }
        {this.state.showResults === true &&
          <WinningID/>
        }

        <div>
          <button
            className="btn btn-primary"
            onClick={() => this.testFunc()
            }>
            Test Random Generator
          </button>
        </div>
      </div>
    )
  }
}
//
// const mapStateToProps = (state) => {
//   return {
//     items: state.reducer.items
//   };
// };
//
// const mapDispatchToProps = {
//   getRaffle,
// };
//
// export default connect(mapStateToProps, mapDispatchToProps)(Home);
