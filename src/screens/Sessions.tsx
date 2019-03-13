import * as React from "react";
import { NavigationScreenProps } from "react-navigation";
import { setConference, refreshConference } from "../actions/appActions";
import { IAppState } from "../models";
import { connect } from "react-redux";
import { IRootState } from "../models/state/state";
import { StyleSheet, ScrollView, SafeAreaView, Dimensions } from "react-native";
import {
  Container,
  Content,
  List,
  ListItem,
  Left,
  Body,
  Text,
  Right,
  Button
} from "native-base";
import { Image } from "react-native-expo-image-cache";

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
    var conf = this.props.appState.conference;
    var sessions = conf.Sessions.map(s => (
      <ListItem key={s.SessionId}>
        <Body>
          <Text>{s.Title}</Text>
          <Text note numberOfLines={1}>
            {s.SubTitle}
          </Text>
        </Body>
        <Right>
          <Button
            transparent
            onPress={() =>
              this.props.navigation.navigate("session", {
                host: conf.Site.Host,
                session: s
              })
            }
          >
            <Text>View</Text>
          </Button>
        </Right>
      </ListItem>
    ));
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
        <ScrollView style={styles.container}>
          <Container>
            <Content>
              <List>{sessions}</List>
            </Content>
          </Container>
        </ScrollView>
      </SafeAreaView>
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
  container: {},
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
