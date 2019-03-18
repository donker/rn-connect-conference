import * as React from "react";
import { StyleSheet, ScrollView, SafeAreaView, Dimensions } from "react-native";
import {
  View,
  Text,
  Card,
  CardItem,
  Body,
  List,
  ListItem,
  Right,
  Icon,
  Button
} from "native-base";
import { Image } from "react-native-expo-image-cache";
import { ISpeaker, Speaker, IAppState } from "../models";
import { NavigationScreenProps } from "react-navigation";
import PropValue from "./components/PropValue";
import { material, materialColors } from "react-native-typography";
import { connect } from "react-redux";
import { IRootState } from "../models/state/state";

interface ISessionProps {}
interface IStateProps {
  appState: IAppState;
}
interface IDispatchProps {}
interface IProps
  extends ISessionProps,
    IStateProps,
    IDispatchProps,
    NavigationScreenProps {}

interface IState {
  host: string;
  person: ISpeaker;
  showSessions: boolean;
}

class PersonScreen extends React.Component<IProps, IState> {
  constructor(props: IProps) {
    super(props);
    this.state = {
      host: this.props.navigation.getParam("host", ""),
      person: this.props.navigation.getParam("person", new Speaker()),
      showSessions: this.props.navigation.getParam("showSessions", true)
    };
  }
  changePhoto() {}
  render() {
    let screenWidth = Dimensions.get("window").width;
    let stack = this.props.navigation.getParam("stack", "");
    let thisIsMyProfile =
      this.state.person.UserId ===
      this.props.appState.conference.Security.UserId;
    let sessions =
      this.state.person.Sessions == undefined || !this.state.showSessions
        ? null
        : this.state.person.Sessions.map(s => (
            <ListItem
              key={s.SessionId}
              onPress={() => {
                this.props.navigation.navigate(stack + "session", {
                  host: this.state.host,
                  session: this.props.appState.conference.Sessions.find(
                    ss => ss.SessionId == s.SessionId
                  ),
                  stack: stack
                });
              }}
            >
              <Body>
                <Text>{s.Title}</Text>
                <Text note numberOfLines={1}>
                  {s.SubTitle}
                </Text>
              </Body>
              <Right>
                <Icon name="arrow-forward" />
              </Right>
            </ListItem>
          ));
    return (
      <ScrollView
        style={styles.container}
        contentInsetAdjustmentBehavior="automatic"
      >
        <SafeAreaView>
          <View>
            <Image
              uri={`https://${
                this.state.host
              }/DnnImageHandler.ashx?mode=profilepic&w=${screenWidth}&h=${screenWidth}&userId=${
                this.state.person.UserId
              }`}
              style={{ height: screenWidth }}
              resizeMode="cover"
            />
            {thisIsMyProfile ? (
              <Button block bordered info onPress={() => this.changePhoto()}>
                <Text>Change Photo</Text>
              </Button>
            ) : null}
          </View>
          <Card>
            <CardItem header>
              <View style={{ flexDirection: "column" }}>
                <Text>{this.state.person.DisplayName}</Text>
                <Text style={{ color: "#666", fontWeight: "normal" }}>
                  {this.state.person.Company}
                </Text>
              </View>
            </CardItem>
            <CardItem>
              <Body>
                <PropValue prop="About" value={this.state.person.Biography} />
              </Body>
            </CardItem>
          </Card>
          <View style={{ padding: 10 }}>
            <Text style={styles.sectionTitle}>Sessions</Text>
          </View>
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
)(PersonScreen);

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
  },
  sectionTitle: {
    ...material.headlineObject,
    color: materialColors.blackPrimary
  }
});
