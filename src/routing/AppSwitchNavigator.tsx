import * as React from "react";
import { createSwitchNavigator, NavigationScreenProps } from "react-navigation";
import ScanStack from "./ScanStack";
import LoadConfScreen from "../screens/LoadConfScreen";
import Conference from "./Conference";
import { IAppState } from "../models";
import { AsyncStorage } from "react-native";
import { setConference, refreshAttendances } from "../actions/appActions";
import LoadScreen from "../screens/components/LoadScreen";

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
              this.props.appState.conference.ConferenceId
            );
          }
          this.props.navigation.navigate("Conference");
        }
      })
      .catch(() => {
        this.props.navigation.navigate("Scan");
      });
  }
  render() {
    return <LoadScreen />;
  }
}
const AppSwitchNavigator = createSwitchNavigator({
  Switch: { screen: SwitchScreen },
  Scan: { screen: ScanStack },
  LoadConference: { screen: LoadConfScreen },
  Conference: { screen: Conference }
});

export default AppSwitchNavigator;
