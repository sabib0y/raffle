import React from 'react';
import { getRaffle } from "../../redux/actions";
import {connect} from "react-redux";
import { PopUpText } from '../PopUpText/PopUpText';


class Home extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      submitted: false
    }
  }

  handleSubmit(e) {
    this.setState({
      submitted: true
    })
  }

  render() {
    console.log('render', this.props);
    const { submitted } = this.state;
    return (
      <div>
        <PopUpText />
        {submitted === false &&
        <div className="container">
          <div className="row">
            <div className="col-lg-6">
              <form action="" noValidate="novalidate" onSubmit={e => this.handleSubmit(e)}>
                <fieldset>
                  <div className="form-group">
                    <label>Name</label>
                    <input
                      className="form-control"
                      placeholder="name"
                      value={this.props.name}
                      onChange={e => this.setState({
                        firstName: e.target.value
                      })}
                    />
                  </div>
                  <div className="form-group">
                    <label>Surname</label>
                    <input
                      className="form-control"
                      placeholder="Last Name"
                      value={this.props.surname}
                      onChange={e => this.setState({
                        lastName: e.target.value
                      })}
                    />
                  </div>
                  <div className="form-group">
                    <label>Email ** OPTIONAL **</label>
                    <input
                      className="form-control"
                      placeholder="Please enter Email"
                      value={this.props.surname}
                      onChange={e => this.setState({
                        email: e.target.value
                      })}
                    />
                  </div>
                  <div className="form-group">
                    <label>Number</label>
                    <input
                      className="form-control"
                      placeholder="Please Enter Mobile"
                      value={this.props.mobile}
                      type='telephone'
                      onChange={e => this.setState({
                        password: e.target.value
                      })}
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
        {submitted === true &&
          <PopUp/>
        }
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    items: state.reducer.items
  };
};

const mapDispatchToProps = {
  getRaffle,
};

export default connect(mapStateToProps, mapDispatchToProps)(Home);

