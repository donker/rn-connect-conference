import * as React from "react";
import Icon from "react-native-vector-icons/Ionicons";
import { createStackNavigator } from "react-navigation";
import ConferenceDetails from "../screens/ConferenceDetails";
import SessionScanScreen from "../screens/SessionScanScreen";
import SessionReviewScreen from "../screens/SessionReviewScreen";

const ConferenceDetailsStack = createStackNavigator({
  cd_conference: {
    screen: ConferenceDetails,
    navigationOptions: ({ navigation }) => {
      return {
        headerTitle: "Overview",
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
  cd_scanSession: { screen: SessionScanScreen },
  cd_reviewSession: { screen: SessionReviewScreen }
});

export default ConferenceDetailsStack;
