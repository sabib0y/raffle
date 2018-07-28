import React from 'react';
import {connect} from "react-redux";
import {App} from "../../App.container";
import {getTimeForm} from "../../redux/actions";

export class Error extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {}
  }
  isSiteLauched() {}
  render() {
    console.log('this.props', this.props);
    return (
      <div className='container-fluid appWrapper'>
        <div>
          <h3 className="headerText">Oopsy :( We'll be wheels up soon... </h3>
        </div>
        <p className="centreText">...meantime... Feel free to chat to us about our products or sponsorship.... </p>
        <div>
        </div>
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    user: state.get('reducer')
  };
};

const mapDispatchToProps = {
};

export default connect(mapStateToProps, mapDispatchToProps)(Error);