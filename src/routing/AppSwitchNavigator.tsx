import { createSwitchNavigator } from "react-navigation";
import ScanStack from "./ScanStack";
import LoadConfScreen from "../screens/LoadConfScreen";
import ConferenceDetails from "../screens/ConferenceDetails";

const AppSwitchNavigator = createSwitchNavigator({
  Scan: { screen: ScanStack },
  LoadConference: { screen: LoadConfScreen },
  Conference: { screen: ConferenceDetails }
});

export default AppSwitchNavigator;
