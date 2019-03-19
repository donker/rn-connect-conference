import * as React from "react";
import { NavigationScreenProps } from "react-navigation";
import { bindActionCreators, Dispatch } from "redux";
import { setConference, refreshAttendances } from "../actions/appActions";
import { IAppState } from "../models";
import { connect } from "react-redux";
import { IRootState } from "../models/state/state";
import Service from "../lib/service";
import LoadScreen from "./components/LoadScreen";
import { Permissions, Notifications } from "expo";

interface ILoadConfScreenProps {}
interface IStateProps {
  appState: IAppState;
}
interface IDispatchProps {
  setConference: typeof setConference;
  refreshAttendances: typeof refreshAttendances;
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
    Service.setNotificationToken(
      this.props.appState.conference.Site,
      this.props.appState.conference.ConferenceId,
      this.props.appState.conference.Security.UserId,
      token
    );
  };

  async componentDidMount() {
    if (
      this.props.appState.conference.ShouldRefresh &&
      this.props.appState.conference.ConferenceId != -1
    ) {
      let c = await Service.getConference(
        this.props.appState.conference.Site,
        this.props.appState.conference.ConferenceId
      );
      c.Site = this.props.appState.conference.Site;
      c.ShouldRefresh = false;
      this.props.setConference(c);
      await this.registerForPushNotificationsAsync();
    } else if (this.props.appState.conference.ConferenceId != -1) {
      if (this.props.appState.network) {
        this.props.refreshAttendances(
          this.props.appState.conference.Site,
          this.props.appState.conference.ConferenceId
        );
        await this.registerForPushNotificationsAsync();
      }
      this.props.navigation.navigate("Conference");
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
        refreshAttendances: refreshAttendances
      },
      dispatch
    )
)(LoadConfScreen);
