import React from 'react';
import { getRaffle } from "../../redux/actions";
import {connect} from "react-redux";
import fire from '../../fire';
import { PopUpText } from '../PopUpText/PopUpText';
import './PopUp.css';
import moment from 'moment';

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
      id: null
    }
  }

  handleSubmit(event) {
    event.preventDefault();
    let change = {};

    change[event.target.name] = event.target.value;
    this.setState(change);
  }

  handleSubmitForm(event) {
    event.preventDefault();

    this.state.id = Math.floor(Math.random() * Math.floor(100000));
    this.state.date = new Date();

    let sessionsRef = fire.database().ref("users");
    sessionsRef.push(
      this.state
    );

    // fire.database().ref('users').push(this.state,  fire.database.ServerValue.TIMESTAMP);
    this.openPopupbox();
  }

  openPopupbox() {
    const content = (
      <div>
        {/*<button onClick={() => this.updatePopupbox()}>Update!</button>*/}
      </div>
    );


    // let leadsRef = database.ref('users');
    // leadsRef.on('value', function(snapshot) {
    //   snapshot.forEach(function(childSnapshot) {
    //     let childData = childSnapshot.val();
    //   });
    // });



    PopupboxManager.open({
      content,
      config: {
        titleBar: {
          enable: true,
          text: `Your unique entry ID is ${this.state.id}.
           We'll be in touch if you're our lucky winner!!!`

        },
        fadeIn: true,
        fadeInSpeed: 500
      }
    })
  }

  render() {

    // fetch('https://console.firebase.google.com/project/dailychoppin/database/data/users')
    //   .then(response => {
    //     console.log('response', response)
    //   })
    //   .catch(error => {
    //     console.log('error', error)
    //   });
    //

    let ref = fire.database().ref("users");

    ref.on("value", function(snapshot) {
      let childData = snapshot.val();
      let itemsUsers = snapshot.numChildren();
      console.log(itemsUsers, childData)

    });

    return (
      <div>
        <PopupboxContainer />
        <div className="container">
          <div className="row">
            <div className="col-lg-6">
              <form action="" noValidate="novalidate" onSubmit={e => this.handleSubmitForm(e)}>
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
