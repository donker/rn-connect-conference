import * as React from "react";
import { NavigationScreenProps } from "react-navigation";
import { bindActionCreators, Dispatch } from "redux";
import { setConference, refreshAttendances } from "../actions/appActions";
import { IAppState } from "../models";
import { connect } from "react-redux";
import { IRootState } from "../models/state/state";
import Service from "../lib/service";
import LoadScreen from "./components/LoadScreen";

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
  componentDidMount() {
    if (
      this.props.appState.conference.ShouldRefresh &&
      this.props.appState.conference.ConferenceId != -1
    ) {
      Service.getConference(
        this.props.appState.conference.Site,
        this.props.appState.conference.ConferenceId
      ).then(c => {
        c.Site = this.props.appState.conference.Site;
        c.ShouldRefresh = false;
        this.props.setConference(c);
      });
    } else if (this.props.appState.conference.ConferenceId != -1) {
      if (this.props.appState.network) {
        this.props.refreshAttendances(
          this.props.appState.conference.Site,
          this.props.appState.conference.ConferenceId
        );
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
