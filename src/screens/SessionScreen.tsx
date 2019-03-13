import * as React from "react";
import { StyleSheet, ScrollView, SafeAreaView, View } from "react-native";
import { ISession, Session } from "../models";
import { NavigationScreenProps } from "react-navigation";
import { material, materialColors } from "react-native-typography";
import { List, ListItem, Left, Body, Text, Button } from "native-base";
import { Image } from "react-native-expo-image-cache";
import PropValue from "./components/PropValue";
import Moment from "moment";

const SessionScreen = (props: NavigationScreenProps) => {
  let host = props.navigation.getParam("host", "");
  let session: ISession = props.navigation.getParam("session", new Session());
  let speakers = session.Speakers.map(ss => (
    <ListItem
      thumbnail
      key={ss.Key}
      style={{ marginTop: 20, marginBottom: 20 }}
    >
      <Left>
        <Image
          uri={`https://${host}/DnnImageHandler.ashx?mode=profilepic&w=40&h=40&userId=${
            ss.Key
          }`}
          style={{ height: 40, width: 40 }}
          resizeMode="contain"
        />
      </Left>
      <Body>
        <Text>{ss.Value}</Text>
      </Body>
    </ListItem>
  ));
  let tags = session.Tags.map(t => (
    <Button rounded small info key={t.Key} style={{ margin: 5 }}>
      <Text>{t.Value}</Text>
    </Button>
  ));
  let whereAndWhen = session.SessionDateAndTime ? (
    <PropValue
      prop="Where and when"
      value={`${session.LocationName} on ${Moment(
        session.SessionDateAndTime
      ).format("ddd D MMM")} at ${Moment(session.SessionDateAndTime).format(
        "HH:mm"
      )}`}
    />
  ) : null;
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
      <ScrollView style={styles.container}>
        <Text style={styles.title}>{session.Title}</Text>
        <Text style={styles.subtitle}>{session.SubTitle}</Text>
        <List>{speakers}</List>
        <ScrollView
          horizontal={false}
          style={styles.footerWrapperNC}
          contentContainerStyle={[styles.footerWrapper]}
        >
          {tags}
        </ScrollView>
        {whereAndWhen}
        <PropValue prop="Level" value={session.Level} />
        <PropValue prop="Abstract" value={session.Description} />
      </ScrollView>
    </SafeAreaView>
  );
};

export default SessionScreen;

const styles = StyleSheet.create({
  container: {
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
