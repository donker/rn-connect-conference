import * as React from "react";
import { createStackNavigator, NavigationScreenProps } from "react-navigation";
import Icon from "react-native-vector-icons/Ionicons";
import { View } from "react-native";
import SessionScreen from '../screens/SessionScreen';
import Schedule from '../screens/Schedule';
import SessionReviewScreen from '../screens/SessionReviewScreen';

const ScheduleStack = createStackNavigator({
  schs_schedule: {
    screen: Schedule,
    navigationOptions: ({ navigation }) => {
      return {
        headerTitle: "Schedule",
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
  schs_session: {
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
  },
  schs_reviewSession: { screen: SessionReviewScreen }
});

export default ScheduleStack;
