import { createDrawerNavigator } from "react-navigation";
import ConferenceDetails from "../screens/ConferenceDetails";

const Conference = createDrawerNavigator({
  details: {
    screen: ConferenceDetails,
    navigationOptions: () => {
      return {
        title: "Overview"
      };
    }
  }
});

export default Conference;
