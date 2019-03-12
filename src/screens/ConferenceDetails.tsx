import * as React from "react";
import { NavigationScreenProps } from "react-navigation";
import { setConference } from "../actions/appActions";
import { IAppState } from "../models";
import { connect } from "react-redux";
import { IRootState } from "../models/state/state";
import { View, Text } from "native-base";
import { StyleSheet } from "react-native";

interface IConferenceDetailsProps {}
interface IStateProps {
  appState: IAppState;
}
interface IDispatchProps {
  setConference: typeof setConference;
}
interface IProps
  extends IConferenceDetailsProps,
    IStateProps,
    IDispatchProps,
    NavigationScreenProps {}

class ConferenceDetails extends React.Component<IProps> {
  public render() {
    return (
      <View style={styles.container}>
        <Text>{this.props.appState.conference.Name}</Text>
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
  {
    setConference
  }
)(ConferenceDetails);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center"
  }
});
