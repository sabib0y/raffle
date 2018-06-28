import React, {Component} from 'react';
import Home from './components/Home/Home.component';
import moment from 'moment';
import Countdown from 'react-sexy-countdown';

class App extends Component {
  render() {

    return (
      // base content sists here
      <div className="container-fluid">
      <div className="draw_content_container">
        <h1>Welcome to Dailychoppins!</h1>
        <Home/>
        {/*<Countdown*/}
          {/*date={moment().utc().add(12, 'hours').format()}*/}
          {/*onEndCountdown={ (count) => console.log(count) }*/}
          {/*lang="th"*/}
          {/*displayText={{*/}
            {/*Days: 'Days',*/}
            {/*Day: 'Day',*/}
            {/*Hours: 'Hours',*/}
            {/*Min: 'Minutes',*/}
            {/*Sec: 'Seconds',*/}
          {/*}}*/}
          {/*lastTextTime={{*/}
            {/*Day: 'D'*/}
          {/*}}*/}
          {/*isDayDoubleZero={ true }*/}
        {/*/>*/}
      </div>
      </div>
    );
  }
}

export default App;
