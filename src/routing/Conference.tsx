import React from "react";
import { createDrawerNavigator } from "react-navigation";
import ConferenceDetails from "../screens/ConferenceDetails";
import SideBar from '../screens/components/SideBar';

const Conference = createDrawerNavigator({
  details: {
    screen: ConferenceDetails,
    navigationOptions: () => {
      return {
        title: "Overview"
      };
    }
  }
},
{
  contentComponent: (props: any) => <SideBar {...props} />
});

export default Conference;
