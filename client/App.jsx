import React, {Component} from 'react';
import Home from './components/Home/Home.component';

class App extends Component {
  render() {

    return (
      <div className="container">
        <h1>DailyChops</h1>
        <Home/>
      </div>
    );
  }
}

export default App;