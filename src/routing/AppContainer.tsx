import React, { Component } from "react";
import { connect } from "react-redux";
import { NetInfo, ConnectionInfo } from "react-native";

import AppSwitchNavigator from "./AppSwitchNavigator";
import { IRootState } from "../models/state/state";
import { IAppState } from "../models";
import { setNetwork } from "../actions/appActions";
import { createAppContainer, NavigationScreenProps } from "react-navigation";
import { Notifications } from "expo";

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
  _notificationSubscription: any;
  private _handleNotification = (notification: Notifications.Notification) => {
    console.log(notification);
    if (notification.origin === "selected") {
      // navigate to comments - but first ensure conference is loaded
      if (this.props.appState.conference.ConferenceId !== -1 
        && !this.props.appState.conference.ShouldRefresh) {
          // can navigate to comments
        } else {
          // load conf first so store in state and then let 
          // loading take care of this
        }
    }
  };
  componentDidMount() {
    NetInfo.getConnectionInfo().then((connectionInfo: ConnectionInfo) => {
      this.props.setNetwork(connectionInfo.type != "none");
    });
    NetInfo.isConnected.addEventListener("connectionChange", c =>
      this.props.setNetwork(c)
    );
    this._notificationSubscription = Notifications.addListener(
      this._handleNotification
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
