import React, { Component } from "react";
import { connect } from "react-redux";
import { NetInfo, ConnectionInfo } from "react-native";

import AppSwitchNavigator from "./AppSwitchNavigator";
import { IRootState } from "../models/state/state";
import { IAppState } from "../models";
import { setNetwork, addComments, redirectToPath } from "../actions/appActions";
import { createAppContainer, NavigationScreenProps } from "react-navigation";
import { Notifications } from "expo";
import Service from "../lib/service";

const App = createAppContainer(AppSwitchNavigator);

interface IAppContainerProps {}
interface IStateProps {
  appState: IAppState;
}
interface IDispatchProps {
  setNetwork: typeof setNetwork;
  addComments: typeof addComments;
  redirectToPath: typeof redirectToPath;
}
interface IProps
  extends IAppContainerProps,
    IStateProps,
    IDispatchProps,
    NavigationScreenProps {}

export class AppContainer extends Component<IProps> {
  _notificationSubscription: any;
  _pollingTimer: any;
  private pollingTimerTime = 10000;
  private _handleNotification = (notification: Notifications.Notification) => {
    // console.log("notification", notification);
    if (notification.origin === "selected") {
      if (this.props.appState.conference.ConferenceLoaded) {
        this.props.navigation.navigate("news");
      } else {
        this.props.redirectToPath("news");
      }
    }
  };
  private _handleTimer = () => {
    if (
      this.props.appState.network &&
      this.props.appState.conference.ConferenceLoaded &&
      this.props.appState.conference.Site.Token != undefined
    ) {
      Service.pollComments(
        this.props.appState.conference.Site,
        this.props.navigation,
        this.props.appState.conference.ConferenceId,
        -1,
        2,
        this.props.appState.commentLastCheck
      )
        .then(res => {
          this.props.addComments(
            res.Comments,
            res.CheckTime,
            res.NewTotalComments
          );
        })
        .catch(err => {
          return;
        });
    }
    this._pollingTimer = setTimeout(
      () => this._handleTimer(),
      this.pollingTimerTime
    );
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
    this._pollingTimer = setTimeout(
      () => this._handleTimer(),
      this.pollingTimerTime
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
    setNetwork,
    addComments,
    redirectToPath
  }
)(AppContainer);
