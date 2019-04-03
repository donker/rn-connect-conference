import * as React from "react";
import { NavigationScreenProps } from "react-navigation";
import { bindActionCreators, Dispatch } from "redux";
import { IAppState } from "../models";
import { refreshAttendances } from "../actions/appActions";
import LoadScreen from "../screens/components/LoadScreen";
import { connect } from "react-redux";
import { IRootState } from "../models/state/state";

interface IStateProps {
  appState: IAppState;
}
interface IDispatchProps {
  refreshAttendances: typeof refreshAttendances;
}
interface IProps extends IStateProps, IDispatchProps, NavigationScreenProps {}

class SwitchScreen extends React.Component<IProps> {
  componentDidMount() {
    if (this.props.appState.conference.ConferenceId != -1) {
      if (this.props.appState.network) this.props.refreshAttendances();
      this.props.navigation.navigate("Conference");
    } else {
      this.props.navigation.navigate("Scan");
    }
  }
  render() {
    return <LoadScreen />;
  }
}

export default connect(
  (state: IRootState): IStateProps => {
    return {
      appState: state.app
    };
  },
  (dispatch: Dispatch) =>
    bindActionCreators(
      {
        refreshAttendances
      },
      dispatch
    )
)(SwitchScreen);
