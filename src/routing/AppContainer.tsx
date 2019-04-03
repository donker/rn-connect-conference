import React, { Component } from "react";
import { connect } from "react-redux";
import { NetInfo, ConnectionInfo } from "react-native";

import AppSwitchNavigator from "./AppSwitchNavigator";
import { IRootState } from "../models/state/state";
import { IAppState } from "../models";
import {
  setNetwork,
  addComments,
  redirectToPath,
  loadData
} from "../actions/appActions";
import { createAppContainer, NavigationScreenProps } from "react-navigation";
import { Notifications } from "expo";
import { IAuthState } from "../models/state/authState";
import { IErrorState } from "../models/state/errorState";
import AppService from "../lib/appService";
import store from "../store";
import LoadScreen from "../screens/components/LoadScreen";

const App = createAppContainer(AppSwitchNavigator);

interface IAppContainerProps {}
interface IStateProps {
  appState: IAppState;
  authState: IAuthState;
  errorState: IErrorState;
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

interface IState {
  loaded: boolean;
}

export class AppContainer extends Component<IProps, IState> {
  constructor(props: IProps) {
    super(props);
    this.state = {
      loaded: false
    };
  }
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
      this.props.authState.tokens &&
      this.props.authState.tokens.ContainsKey(this.props.appState.conference.Site.Host)
    ) {
      var service = new AppService({
        site: this.props.appState.conference.Site,
        token: this.props.authState.tokens.Item(this.props.appState.conference.Site.Host)
      });
      service
        .pollComments(-1, 2, this.props.appState.commentLastCheck)
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
    store.dispatch(loadData() as any).then(loaded => {
      this.setState({
        loaded: true
      });
    });
  }
  render() {
    return this.state.loaded ? <App /> : <LoadScreen />;
  }
}

export default connect(
  (state: IRootState): IStateProps => {
    return {
      appState: state.app,
      authState: state.auth,
      errorState: state.error
    };
  },
  {
    setNetwork,
    addComments,
    redirectToPath
  }
)(AppContainer);
