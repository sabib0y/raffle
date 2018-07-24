import React from 'react';
import Footer from '../Footer/Footer.component';
import { connect } from "react-redux";
import Countdown from 'react-countdown-now';
import fire from '../../fire';
import './ComingSoon.scss';

export class ComingSoon extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      timeMathResultStartTime: ''
    };
    this.renderer = this.renderer.bind(this);
  }

  renderer(event) {
    //console.log('test', event)
    if (event.completed) {
      // Render a completed state
      return this.props.history.push('/home');
    } else {
      // Render a countdown  
      runthis();
    }    


  };

  runthis(){
    console.log('ping');    
  }


  componentDidMount() {
    let collectedData;
    fire.database().ref('setSiteLaunch/siteLaunch').once('value').then((snapshot) => {
      collectedData = snapshot.val();
      console.log('collectedData', collectedData);

      let timeNow = new Date();
      collectedData = new Date(collectedData);

      let timeMathResultStartTime = collectedData - timeNow;
      this.setState({
        timeMathResultStartTime
      });
    });
  }

//dynamic
  //on tick, populate static wrappers

  render() {
    const { timeMathResultStartTime } = this.state;
    return (
      <div className='container-fluid appWrapper'>
        <div>
          <h3 className="headerText">Dailychoppins comes to life in...</h3>
        </div>
        <div className="centreText">
          <Countdown
            date={Date.now() + timeMathResultStartTime}
            onTick={event => this.renderer(event)}
          >
          </Countdown>
        </div>
        <Footer/>
      </div>
    )
  }
}


const mapStateToProps = (state) => {
  return {
  };
};

const mapDispatchToProps = {
};

export default connect(mapStateToProps, mapDispatchToProps)(ComingSoon);