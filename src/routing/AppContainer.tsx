import React, { Component } from "react";
import { connect } from "react-redux";
import { NetInfo, ConnectionInfo } from "react-native";

import AppSwitchNavigator from "./AppSwitchNavigator";
import { IRootState } from "../models/state/state";
import { IAppState } from "../models";
import { setNetwork } from "../actions/appActions";
import { createAppContainer, NavigationScreenProps } from "react-navigation";

const App = createAppContainer(AppSwitchNavigator);

interface IAppContainerProps {}
interface IStateProps {
  appState: IAppState;
}
interface IDispatchProps {
  setNetwork: typeof setNetwork;
}
interface IProps
  extends IAppContainerProps,
    IStateProps,
    IDispatchProps,
    NavigationScreenProps {}

export class AppContainer extends Component<IProps> {
  componentDidMount() {
    NetInfo.getConnectionInfo().then((connectionInfo: ConnectionInfo) => {
      this.props.setNetwork(connectionInfo.type != "none");
    });
    NetInfo.isConnected.addEventListener("connectionChange", c =>
      this.props.setNetwork(c)
    );
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
    setNetwork
  }
)(AppContainer);
