import React from "react";
import { createDrawerNavigator } from "react-navigation";
import SideBar from "../screens/components/SideBar";
import Sponsors from "../screens/Sponsors";
import SpeakersStack from "./SpeakersStack";
import SessionsStack from "./SessionsStack";
import ConferenceDetailsStack from './ConferenceDetailsStack';
import ScheduleStack from './ScheduleStack';
import ProfileStack from './ProfileStack';

const Conference = createDrawerNavigator(
  {
    details: {
      screen: ConferenceDetailsStack,
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
    sessions: {
      screen: SessionsStack,
      navigationOptions: () => {
        return {
          title: "Sessions"
        };
      }
    },
    schedule: {
      screen: ScheduleStack
    },
    profile: {
      screen: ProfileStack
    }
  },
  {
    contentComponent: (props: any) => <SideBar {...props} />
  }
);

export default Conference;
