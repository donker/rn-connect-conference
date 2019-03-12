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
              source={require("../../../assets/images/screen_curved.png")}
              style={{
                height: this.state.width / 2,
                width: "100%",
                alignSelf: "stretch",
                position: "absolute"
              }}
            />
            <Image
              style={{
                height: 80,
                width: 70,
                position: "absolute",
                alignSelf: "center",
                top: 20
              }}
              source={require("../../../assets/images/logo.png")}
            />
            <List style={{ marginTop: this.state.width / 2 }}>
              <ListItem
                button
                onPress={() => this.props.navigation.navigate("details")}
              >
                <Text>Overview</Text>
              </ListItem>
            </List>
          </Content>
        </Container>
      </SafeAreaView>
    );
  }
}
