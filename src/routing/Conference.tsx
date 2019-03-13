import React from "react";
import { createDrawerNavigator } from "react-navigation";
import ConferenceDetails from "../screens/ConferenceDetails";
import SideBar from '../screens/components/SideBar';
import Sponsors from '../screens/Sponsors';
import SpeakersStack from './SpeakersStack';

const Conference = createDrawerNavigator({
  details: {
    screen: ConferenceDetails,
    navigationOptions: () => {
      return {
        title: "Overview"
      };
    }
  },
  sponsors: {
    screen: Sponsors,
    navigationOptions: () => {
      return {
        title: "Sponsors"
      };
    }
  },
  speakers: {
    screen: SpeakersStack,
    navigationOptions: () => {
      return {
        title: "Speakers"
      };
    }
  },
},
{
  contentComponent: (props: any) => <SideBar {...props} />
});

export default Conference;
