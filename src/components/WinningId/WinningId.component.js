import React from 'react';
import fire from '../../fire';
import { getWinningId } from "../../redux/actions";
import WinningCodeValidation from '../WinningCodeValidation/WinningCodeValidation.container';
import {connect} from "react-redux";

export class WinningId extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      randomizedData: null,
      uniqueCodeSplit: '',
      uniqueId: null,
      revealRedeem: false
    }
  }

  componentDidMount(){
    fire.database().ref('randomWinnerSetWeb').once('value').then((snapshot) => {
      if (Object.entries !== null || Object.entries !== undefined) {
        let receivedData = snapshot.val();
        this.props.getWinningId(receivedData.postDataWeb)
      }
    });

    let uniqueCodeSplit;
    if(this.props.user.uniqueId !== null) {
      uniqueCodeSplit = this.props.user.uniqueId.replace(/(\w{4})/g, '$1 ').replace(/(^\s+|\s+$)/,'');
    }

    this.setState({ uniqueCodeSplit })
  }

  redeemCode() {
    this.setState({revealRedeem: true});
  }

  render() {
    console.log('props', this.props)

    return (
      <div>
        <div className="winningId">
          the winning ID is <span>{this.state.uniqueCodeSplit} --- ({this.props.user.mobileNumber})</span>
        </div>
        <div>
          Have a winning code?
          <a
            href="#"
            onClick={() => this.redeemCode()}
          >click to redeem code
          </a>
        </div>
        {this.state.revealRedeem &&
        <WinningCodeValidation
          uniqueId={this.props.user.uniqueId}
        />
        }
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    user: state.reducer.user
  };
};

const mapDispatchToProps = {
  getWinningId,
};

export default connect(mapStateToProps, mapDispatchToProps)(WinningId);