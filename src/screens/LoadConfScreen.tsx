import * as React from "react";
import { NavigationScreenProps } from "react-navigation";
import { bindActionCreators, Dispatch } from "redux";
import {
  setConference,
  refreshAttendances,
  addComments,
  clearComments
} from "../actions/appActions";
import { IAppState } from "../models";
import { connect } from "react-redux";
import { IRootState } from "../models/state/state";
import Service from "../lib/service";
import LoadScreen from "./components/LoadScreen";
import { Permissions, Notifications } from "expo";
import { AsyncStorage } from "react-native";

interface ILoadConfScreenProps {}
interface IStateProps {
  appState: IAppState;
}
interface IDispatchProps {
  setConference: typeof setConference;
  refreshAttendances: typeof refreshAttendances;
  addComments: typeof addComments;
  clearComments: typeof clearComments;
}
interface IProps
  extends ILoadConfScreenProps,
    IStateProps,
    IDispatchProps,
    NavigationScreenProps {}

class LoadConfScreen extends React.Component<IProps> {
  registerForPushNotificationsAsync = async () => {
    const { status: existingStatus } = await Permissions.getAsync(
      Permissions.NOTIFICATIONS
    );
    let finalStatus = existingStatus;
    if (existingStatus !== "granted") {
      const { status } = await Permissions.askAsync(Permissions.NOTIFICATIONS);
      finalStatus = status;
    }
    if (finalStatus !== "granted") {
      return;
    }
    let token = await Notifications.getExpoPushTokenAsync();
    console.log("token", token);
    Service.setNotificationToken(
      this.props.appState.conference.Site,
      this.props.appState.conference.ConferenceId,
      this.props.appState.conference.Security.UserId,
      token
    );
  };

  async componentDidMount() {
    let c = this.props.appState.conference;
    if (c.ConferenceId != -1) {
      if (this.props.appState.network) {
        if (c.ShouldRefresh) {
          c = await Service.getConference(c.Site, c.ConferenceId);
          c.Site = this.props.appState.conference.Site;
          c.ShouldRefresh = false;
          this.props.setConference(c);
          this.props.clearComments();
          // await this.props.saveConference(c);
          await AsyncStorage.setItem("conference", JSON.stringify(c));
        }
        this.props.refreshAttendances(c.Site, c.ConferenceId);
        let comments = await Service.getComments(
          c.Site,
          c.ConferenceId,
          -1,
          2,
          0,
          10
        );
        this.props.addComments(comments, new Date(), comments.TotalCount);
        await this.registerForPushNotificationsAsync();
        // if (!c.HasNotificationToken) {
        //   console.log("checking notification");
        //   await this.registerForPushNotificationsAsync();
        // }
      }
    }
  }

  componentWillReceiveProps(nextProps: IProps) {
    if (!nextProps.appState.conference.ShouldRefresh) {
      if (this.props.appState.network) {
        this.props.refreshAttendances(
          this.props.appState.conference.Site,
          this.props.appState.conference.ConferenceId
        );
      }
      this.props.navigation.navigate("Conference");
    }
  }

  public render() {
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
        setConference: setConference,
        refreshAttendances: refreshAttendances,
        addComments: addComments,
        clearComments: clearComments
      },
      dispatch
    )
)(LoadConfScreen);
