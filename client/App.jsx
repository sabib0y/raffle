import React, {Component} from 'react';
import Home from './components/Home/Home.component';

class App extends Component {
  render() {

    return (
      // base content sists here
      <div className="container-fluid">
      <div className="draw_content_container">
        <h1>Welcome to Dailychoppins!</h1>
        <Home/>
      </div>
      </div>
    );
  }
}

export default App;
