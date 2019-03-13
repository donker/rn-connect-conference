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

interface ISpeakersProps {}
interface IStateProps {
  appState: IAppState;
}
interface IDispatchProps {
  setConference: typeof setConference;
  refreshConference: typeof refreshConference;
}
interface IProps
  extends ISpeakersProps,
    IStateProps,
    IDispatchProps,
    NavigationScreenProps {}

class Speakers extends React.Component<IProps> {
  public render() {
    var conf = this.props.appState.conference;
    var speakers = conf.Speakers.map(s => (
      <ListItem key={s.UserId} thumbnail>
        <Left>
          <Image
            uri={`https://${
              conf.Site.Host
            }/DnnImageHandler.ashx?mode=profilepic&w=60&h=60&userId=${
              s.UserId
            }`}
            style={{ height: 60, width: 60 }}
            resizeMode="contain"
          />
        </Left>
        <Body>
          <Text>{s.DisplayName}</Text>
          <Text note numberOfLines={1}>
            {s.NrSessions} Sessions
          </Text>
        </Body>
        <Right>
          <Button
            transparent
            onPress={() =>
              this.props.navigation.navigate("speaker", {
                host: conf.Site.Host,
                person: s
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
              <List>{speakers}</List>
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
)(Speakers);

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
