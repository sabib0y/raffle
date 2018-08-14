import React from 'react';
import {connect} from "react-redux";
import { NavLink } from 'react-router-dom';

export class Error extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {}
  }

  render() {
    return (
      <div className='container-fluid appWrapper'>
        <h3 className="errorMessagePage">Oopsy :( Page Not Found </h3>
        <p className="centreText">
          <NavLink to='/'>
            Go home
          </NavLink>
        </p>
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