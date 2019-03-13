import * as React from "react";
import { createStackNavigator, NavigationScreenProps } from "react-navigation";
import Sessions from "../screens/Sessions";
import Icon from "react-native-vector-icons/Ionicons";
import { View } from "react-native";
import SessionScreen from '../screens/SessionScreen';

const SessionsStack = createStackNavigator({
  sessions: {
    screen: Sessions,
    navigationOptions: ({ navigation }) => {
      return {
        headerTitle: "Sessions",
        headerLeft: (
          <Icon
            style={{ paddingLeft: 10 }}
            onPress={() => navigation.openDrawer()}
            name="md-menu"
            size={30}
          />
        )
      };
    }
  },
  session: {
    screen: SessionScreen,
    navigationOptions: (props: NavigationScreenProps) => {
      return {
        headerTitle: "Session",
        headerLeft: (
          <View style={{ flexDirection: "row" }}>
            <Icon
              style={{ paddingLeft: 10 }}
              onPress={() => props.navigation.openDrawer()}
              name="md-menu"
              size={30}
            />
            <Icon
              style={{ paddingLeft: 10 }}
              onPress={() => props.navigation.goBack()}
              name="ios-arrow-round-back"
              size={30}
            />
          </View>
        )
      };
    }
  }
});

export default SessionsStack;
