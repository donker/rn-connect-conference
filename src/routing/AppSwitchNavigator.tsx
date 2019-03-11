import { createSwitchNavigator } from "react-navigation";
import ScanStack from './ScanStack';

const AppSwitchNavigator = createSwitchNavigator({
  Scan: { screen: ScanStack},
});

export default AppSwitchNavigator;
