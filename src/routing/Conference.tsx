import React from "react";
import { createDrawerNavigator } from "react-navigation";
import SideBar from "../screens/components/SideBar";
import Sponsors from "../screens/Sponsors";
import SpeakersStack from "./SpeakersStack";
import SessionsStack from "./SessionsStack";
import ConferenceDetailsStack from './ConferenceDetailsStack';
import ScheduleStack from './ScheduleStack';
import ProfileStack from './ProfileStack';
import Comments from '../screens/Comments';

const Conference = createDrawerNavigator(
  {
    details: {
      screen: ConferenceDetailsStack
    },
    sponsors: {
      screen: Sponsors
    },
    news: {
      screen: Comments
    },
    speakers: {
      screen: SpeakersStack
    },
    sessions: {
      screen: SessionsStack
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
