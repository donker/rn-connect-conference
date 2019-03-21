import * as React from "react";
import { createSwitchNavigator } from "react-navigation";
import ScanStack from "./ScanStack";
import LoadConfScreen from "../screens/LoadConfScreen";
import Conference from "./Conference";
import SwitchScreen from '../screens/SwitchScreen';

const AppSwitchNavigator = createSwitchNavigator({
  Switch: { screen: SwitchScreen },
  Scan: { screen: ScanStack },
  LoadConference: { screen: LoadConfScreen },
  Conference: { screen: Conference }
});

export default AppSwitchNavigator;
