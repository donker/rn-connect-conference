import * as React from "react";
import Icon from "react-native-vector-icons/Ionicons";
import { createStackNavigator } from "react-navigation";
import ConferenceDetails from "../screens/ConferenceDetails";
import SessionScanScreen from "../screens/SessionScanScreen";
import SessionReviewScreen from "../screens/SessionReviewScreen";

const ConferenceDetailsStack = createStackNavigator({
  conference: {
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
  scanSession: { screen: SessionScanScreen },
  reviewSession: { screen: SessionReviewScreen }
});

export default ConferenceDetailsStack;
