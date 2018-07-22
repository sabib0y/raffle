import React from 'react';
import Footer from '../Footer/Footer.component';
import { connect } from "react-redux";
import Countdown from 'react-countdown-now';
import './ComingSoon.scss';

export class ComingSoon extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      testThis: ''
    };
    this.renderer = this.renderer.bind(this);
  }

  renderer() {
    console.log('event', this);
    this.props.history.push('/app');
  };

  render() {
    console.log('this.props', this);
    return (
      <div className='container-fluid appWrapper'>
        <div>
          <h3 className="headerText">coming soon</h3>
        </div>
        <Countdown
          date={Date.now() + 40000}
          onComplete={this.renderer}
        >
        </Countdown>
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