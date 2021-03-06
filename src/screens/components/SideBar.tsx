import React from "react";
import { Image, SafeAreaView } from "react-native";
import { NavigationScreenProps } from "react-navigation";
import { Text, Container, List, ListItem, Content } from "native-base";

interface SideBarState {
  width: number;
}

export default class SideBar extends React.Component<
  NavigationScreenProps,
  SideBarState
> {
  constructor(props: NavigationScreenProps) {
    super(props);
    this.state = {
      width: 100
    };
  }

  render() {
    return (
      <SafeAreaView
        style={{ flex: 1, backgroundColor: "#fff" }}
        onLayout={e => {
          var { width } = e.nativeEvent.layout;
          this.setState({
            width: width
          });
        }}
      >
        <Container>
          <Content>
            <Image
              source={require("../../../assets/images/drawer-cover.png")}
              style={{
                height: this.state.width / 2,
                width: "100%",
                alignSelf: "stretch",
                position: "absolute"
              }}
            />
            <List style={{ marginTop: this.state.width / 2 }}>
              <ListItem
                button
                onPress={() => this.props.navigation.navigate("details")}
              >
                <Text>Overview</Text>
              </ListItem>
              <ListItem
                button
                onPress={() => this.props.navigation.navigate("sponsors")}
              >
                <Text>Sponsors</Text>
              </ListItem>
              <ListItem
                button
                onPress={() => this.props.navigation.navigate("news")}
              >
                <Text>News</Text>
              </ListItem>
              <ListItem
                button
                onPress={() => this.props.navigation.navigate("speakers")}
              >
                <Text>Speakers</Text>
              </ListItem>
              <ListItem
                button
                onPress={() => this.props.navigation.navigate("sessions")}
              >
                <Text>Sessions</Text>
              </ListItem>
              <ListItem
                button
                onPress={() => this.props.navigation.navigate("schedule")}
              >
                <Text>Schedule</Text>
              </ListItem>
              <ListItem
                button
                onPress={() => this.props.navigation.navigate("profile")}
              >
                <Text>My Profile</Text>
              </ListItem>
            </List>
          </Content>
        </Container>
      </SafeAreaView>
    );
  }
}
