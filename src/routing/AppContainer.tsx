import React, { Component } from "react";
import { connect } from "react-redux";
import { NetInfo, ConnectionInfo, AsyncStorage } from "react-native";

import AppSwitchNavigator from "./AppSwitchNavigator";
import { IRootState } from "../models/state/state";
import { IAppState } from "../models";
import { setNetwork, setConference } from "../actions/appActions";
import { createAppContainer, NavigationScreenProps } from 'react-navigation';

const App = createAppContainer(AppSwitchNavigator);

interface IAppContainerProps {
}
interface IStateProps {
  appState: IAppState;
}
interface IDispatchProps {
  setNetwork: typeof setNetwork;
  setConference: typeof setConference;
}
interface IProps extends IAppContainerProps, IStateProps, IDispatchProps, NavigationScreenProps {}

export class AppContainer extends Component<IProps> {
  componentDidMount() {
    NetInfo.getConnectionInfo().then((connectionInfo: ConnectionInfo) => {
      this.props.setNetwork(connectionInfo.type != "none");
    });
    NetInfo.isConnected.addEventListener("connectionChange", c =>
      this.props.setNetwork(c)
    );
    AsyncStorage.getItem("conference")
      .then(value => {
        if (value) {
          this.props.setConference(JSON.parse(value));
        }
      })
      .then(() => {
        if (this.props.appState.conference.ConferenceId == -1) {
          // goto scan page
          this.props.navigation.navigate("Scan")
        } else {
          // goto conference page
        }
      });
    // this.props.loadSites();
  }
  render() {
    return <App />;
  }
}

export default connect(
  (state: IRootState): IStateProps => {
    return {
      appState: state.app
    };
  },
  {
    setNetwork,
    setConference
  }
)(AppContainer);
