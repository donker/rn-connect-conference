import * as React from "react";
import { NavigationScreenProps } from "react-navigation";
import { setConference } from "../actions/appActions";
import { IAppState } from "../models";
import { connect } from "react-redux";
import { IRootState } from "../models/state/state";
import { View, Text } from "native-base";
import { ActivityIndicator, StyleSheet } from "react-native";
import Service from "../lib/service";

interface ILoadConfScreenProps {}
interface IStateProps {
  appState: IAppState;
}
interface IDispatchProps {
  setConference: typeof setConference;
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
      this.props.navigation.navigate("Conference");
    }
  }
  componentWillReceiveProps(nextProps: IProps) {
    if (!nextProps.appState.conference.ShouldRefresh) {
      this.props.navigation.navigate("Conference");
    }
  }
  public render() {
    return (
      <View style={styles.container}>
        <Text>Loading</Text>
        <ActivityIndicator />
      </View>
    );
  }
}

export default connect(
  (state: IRootState): IStateProps => {
    return {
      appState: state.app
    };
  },
  {}
)(LoadConfScreen);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center"
  }
});
