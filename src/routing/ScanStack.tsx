import { createStackNavigator } from "react-navigation";
import ScanScreen from "../screens/ScanScreen";
import LoginScreen from "../screens/LoginScreen";

const ScanStack = createStackNavigator({
  Scanning: { screen: ScanScreen },
  Login: { screen: LoginScreen }
});

export default ScanStack;
