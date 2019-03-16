import * as React from "react";
import { StyleSheet, ScrollView, SafeAreaView } from "react-native";
import {
  ISession,
  Session,
  IAppState,
  ISessionAttendee,
  SessionAttendee
} from "../models";
import { NavigationScreenProps } from "react-navigation";
import { material, materialColors } from "react-native-typography";
import { List, ListItem, Left, Body, Text, Button } from "native-base";
import { Image } from "react-native-expo-image-cache";
import PropValue from "./components/PropValue";
import Moment from "moment";
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
  session: ISession;
  attendance: ISessionAttendee;
}

class SessionScreen extends React.Component<IProps, IState> {
  constructor(props: IProps) {
    super(props);
    let session: ISession = props.navigation.getParam("session", new Session());
    var attendance = props.appState.attendances.find(
      a => a.SessionId === session.SessionId
    );
    this.state = {
      host: props.navigation.getParam("host", ""),
      session: session,
      attendance: attendance ? attendance : new SessionAttendee()
    };
  }
  render() {
    let speakers = this.state.session.SessionSpeakers.map(ss => (
      <ListItem
        thumbnail
        key={ss.UserId}
        style={{ marginTop: 20, marginBottom: 20 }}
      >
        <Left>
          <Image
            uri={`https://${
              this.state.host
            }/DnnImageHandler.ashx?mode=profilepic&w=40&h=40&userId=${
              ss.UserId
            }`}
            style={{ height: 40, width: 40 }}
            resizeMode="contain"
          />
        </Left>
        <Body>
          <Text>{ss.DisplayName}</Text>
          <Text note>{ss.Company}</Text>
        </Body>
      </ListItem>
    ));
    let tags = this.state.session.SessionTags.map(t => (
      <Button rounded small info key={t.TagId} style={{ margin: 5 }}>
        <Text>{t.TagName}</Text>
      </Button>
    ));
    let whereAndWhen = this.state.session.IsScheduled ? (
      <PropValue
        prop="Where and when"
        value={`${this.state.session.LocationName} on ${Moment(
          this.state.session.SessionDateAndTime
        ).format("ddd D MMM")} at ${Moment(
          this.state.session.SessionDateAndTime
        ).format("HH:mm")}`}
      />
    ) : null;
    let stack = this.props.navigation.getParam("stack", "");
    var btn = this.state.attendance ? (
      this.state.attendance.HasEvaluated ? (
        <Button success bordered block>
          <Text>You attended this session</Text>
        </Button>
      ) : (
        <Button
          success
          block
          onPress={() => {
            this.props.navigation.navigate(stack + "reviewSession", {
              session: this.state.session,
              attendance: this.state.attendance
            });
          }}
        >
          <Text>Evaluate session</Text>
        </Button>
      )
    ) : null;
    return (
      <ScrollView
        style={styles.container}
        contentInsetAdjustmentBehavior="automatic"
      >
        <SafeAreaView>
          <Text style={styles.title}>{this.state.session.Title}</Text>
          <Text style={styles.subtitle}>{this.state.session.SubTitle}</Text>
          <List>{speakers}</List>
          <ScrollView
            horizontal={false}
            style={styles.footerWrapperNC}
            contentContainerStyle={[styles.footerWrapper]}
          >
            {tags}
          </ScrollView>
          {whereAndWhen}
          <PropValue prop="Level" value={this.state.session.Level} />
          <PropValue prop="Abstract" value={this.state.session.Description} />
          {btn}
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
)(SessionScreen);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 10
  },
  title: {
    ...material.headlineObject,
    color: materialColors.blackPrimary
  },
  subtitle: {
    ...material.subheadingObject,
    color: materialColors.blackSecondary
  },
  tags: {
    ...material.body2Object,
    color: "blue"
  },
  footerWrapper: {
    flexWrap: "wrap",
    alignItems: "flex-start",
    flexDirection: "row"
  },
  footerWrapperNC: {
    flexDirection: "column"
  }
});
