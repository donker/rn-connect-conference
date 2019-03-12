import { createSwitchNavigator } from "react-navigation";
import ScanStack from "./ScanStack";
import LoadConfScreen from "../screens/LoadConfScreen";
import Conference from './Conference';

const AppSwitchNavigator = createSwitchNavigator({
  Scan: { screen: ScanStack },
  LoadConference: { screen: LoadConfScreen },
  Conference: { screen: Conference }
});

export default AppSwitchNavigator;
