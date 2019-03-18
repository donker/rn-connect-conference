import * as React from "react";
import Icon from "react-native-vector-icons/Ionicons";
import { createStackNavigator } from "react-navigation";
import MyProfile from "../screens/MyProfile";
import EditProfile from '../screens/EditProfile';

const ProfileStack = createStackNavigator({
  ps_profile: {
    screen: MyProfile,
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
  ps_editprofile: {
    screen: EditProfile
  }
});

export default ProfileStack;
