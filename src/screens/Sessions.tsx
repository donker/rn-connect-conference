import * as React from "react";
import { NavigationScreenProps } from "react-navigation";
import { setConference, refreshConference } from "../actions/appActions";
import { IAppState } from "../models";
import { connect } from "react-redux";
import { IRootState } from "../models/state/state";
import { StyleSheet, ScrollView, SafeAreaView, Dimensions } from "react-native";
import { List, ListItem, Body, Text, Right, Icon } from "native-base";

interface ISessionsProps {}
interface IStateProps {
  appState: IAppState;
}
interface IDispatchProps {
  setConference: typeof setConference;
  refreshConference: typeof refreshConference;
}
interface IProps
  extends ISessionsProps,
    IStateProps,
    IDispatchProps,
    NavigationScreenProps {}

class Sessions extends React.Component<IProps> {
  public render() {
    let conf = this.props.appState.conference;
    let sessions = conf.Sessions.map(s => {
      let speakers = s.SessionSpeakers.map(s => s.DisplayName).join(", ");
      return (
        <ListItem
          key={s.SessionId}
          onPress={() =>
            this.props.navigation.navigate("session", {
              host: conf.Site.Host,
              session: s
            })
          }
        >
          <Body>
            <Text>{s.Title}</Text>
            <Text note numberOfLines={1}>
              {speakers}
            </Text>
          </Body>
          <Right>
            <Icon name="arrow-forward" />
          </Right>
        </ListItem>
      );
    });
    return (
      <ScrollView
        style={styles.container}
        contentInsetAdjustmentBehavior="automatic"
      >
        <SafeAreaView>
          <List>{sessions}</List>
        </SafeAreaView>
      </ScrollView>
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
)(Sessions);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff"
  },
  mainImg: {
    height: Dimensions.get("window").width / 2.5
  },
  titleBox: {
    height: 40,
    padding: 10,
    backgroundColor: "#FFFFFF",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center"
  },
  buttonContainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center"
  },
  button: {
    padding: 10,
    flex: 1
  }
});
