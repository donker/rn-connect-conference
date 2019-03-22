import * as React from "react";
import { NavigationScreenProps } from "react-navigation";
import { bindActionCreators, Dispatch } from "redux";
import { IAppState } from "../models";
import { AsyncStorage } from "react-native";
import { setConference, refreshAttendances } from "../actions/appActions";
import LoadScreen from "../screens/components/LoadScreen";
import { connect } from "react-redux";
import { IRootState } from "../models/state/state";

interface IStateProps {
  appState: IAppState;
}
interface IDispatchProps {
  setConference: typeof setConference;
  refreshAttendances: typeof refreshAttendances;
}
interface IProps extends IStateProps, IDispatchProps, NavigationScreenProps {}

class SwitchScreen extends React.Component<IProps> {
  componentDidMount() {
    AsyncStorage.getItem("conference")
      .then(value => {
        if (value) {
          // console.log("data", value);
          this.props.setConference(JSON.parse(value));
        }
      })
      .then(() => {
        if (this.props.appState.conference.ConferenceId == -1) {
          // goto scan page
          this.props.navigation.navigate("Scan");
        } else {
          // goto conference page
          if (this.props.appState.network) {
            this.props.refreshAttendances(
              this.props.appState.conference.Site,
              this.props.navigation,
              this.props.appState.conference.ConferenceId
            );
          }
          this.props.navigation.navigate("Conference");
        }
      })
      .catch(err => {
        console.log(err);
        this.props.navigation.navigate("Scan");
      });
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
        setConference,
        refreshAttendances
      },
      dispatch
    )
)(SwitchScreen);
