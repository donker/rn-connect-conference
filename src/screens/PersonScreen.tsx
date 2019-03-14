import * as React from "react";
import { StyleSheet, ScrollView, SafeAreaView, Dimensions } from "react-native";
import { View, Text, Card, CardItem, Body, List, ListItem } from "native-base";
import { Image } from "react-native-expo-image-cache";
import { ISpeaker, Speaker } from "../models";
import { NavigationScreenProps } from "react-navigation";
import PropValue from "./components/PropValue";
import { material, materialColors } from "react-native-typography";

const PersonScreen = (props: NavigationScreenProps) => {
  let screenWidth = Dimensions.get("window").width;
  let host = props.navigation.getParam("host", "");
  let person: ISpeaker = props.navigation.getParam("person", new Speaker());
  let sessions =
    person.Sessions == undefined
      ? null
      : person.Sessions.map(s => (
          <ListItem key={s.SessionId} thumbnail>
            <Body>
              <Text>{s.Title}</Text>
              <Text note numberOfLines={1}>
                {s.SubTitle}
              </Text>
            </Body>
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
            uri={`https://${host}/DnnImageHandler.ashx?mode=profilepic&w=${screenWidth}&h=${screenWidth}&userId=${
              person.UserId
            }`}
            style={{ height: screenWidth }}
            resizeMode="cover"
          />
        </View>
        <Card>
          <CardItem header>
            <View style={{ flexDirection: "column" }}>
              <Text>{person.DisplayName}</Text>
              <Text style={{ color: "#666", fontWeight: "normal" }}>
                {person.Company}
              </Text>
            </View>
          </CardItem>
          <CardItem>
            <Body>
              <PropValue prop="About" value={person.Biography} />
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
};

export default PersonScreen;

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
