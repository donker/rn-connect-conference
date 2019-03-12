import * as React from "react";
import { createSwitchNavigator, NavigationScreenProps } from "react-navigation";
import ScanStack from "./ScanStack";
import LoadConfScreen from "../screens/LoadConfScreen";
import Conference from "./Conference";
import { IAppState } from "../models";
import { AsyncStorage } from "react-native";
import { setConference } from "../actions/appActions";
import LoadScreen from "../screens/components/LoadScreen";

interface IStateProps {
  appState: IAppState;
}
interface IDispatchProps {
  setConference: typeof setConference;
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
