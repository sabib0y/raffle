import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import Home from './components/Home/Home.component';

class App extends Component {
  render() {
    return (
      <div className="container-fluid appWrapper">
        <h1 className="headerText">Welcome to Dailychoppins!</h1>
        <Home />
      </div>
    );
  }
}

export default App;
