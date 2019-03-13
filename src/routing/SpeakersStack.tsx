import * as React from "react";
import { createStackNavigator, NavigationScreenProps } from "react-navigation";
import Speakers from "../screens/Speakers";
import PersonScreen from "../screens/PersonScreen";
import Icon from "react-native-vector-icons/Ionicons";
import { View } from "react-native";

const SpeakersStack = createStackNavigator({
  speakers: {
    screen: Speakers,
    navigationOptions: ({ navigation }) => {
      return {
        headerTitle: "Speakers",
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
  speaker: {
    screen: PersonScreen,
    navigationOptions: (props: NavigationScreenProps) => {
      return {
        headerTitle: "Speaker",
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

export default SpeakersStack;
