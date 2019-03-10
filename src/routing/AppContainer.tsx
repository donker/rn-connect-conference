import React, { Component } from "react";
import { connect } from "react-redux";
import { NetInfo, View } from "react-native";

// import AppSwitchNavigator from "./AppSwitchNavigator";
import { IRootState } from "../models/state/state";
import { IAppState } from "../models";
import { setNetwork } from "../actions/appActions";

interface IAppContainerProps {}
interface IStateProps {
  appState: IAppState;
}
interface IDispatchProps {
  setNetwork: typeof setNetwork;
}
interface IProps extends IAppContainerProps, IStateProps, IDispatchProps {}

export class AppContainer extends Component<IProps> {
  componentDidMount() {
    NetInfo.getConnectionInfo().then(connectionInfo => {
      this.props.setNetwork(connectionInfo.type != "none");
    });
    NetInfo.isConnected.addEventListener("connectionChange", c =>
      this.props.setNetwork(c)
    );
    // this.props.loadSites();
  }
  render() {
    // return <AppSwitchNavigator />;
    return <View />;
  }
}

export default connect<IStateProps, IDispatchProps>(
  (state: IRootState): IStateProps => {
    return {
      appState: state.app
    };
  },
  {
    setNetwork
  }
)(AppContainer);
