import {
  IAction,
  ActionType,
  IConference,
  IJwtToken,
  Schedule,
  ISite,
  ISessionAttendee,
  IAttendee,
  ISpeaker,
  IComment
} from "../models";
import { IRootState } from "../models/state/state";
import Service from "../lib/service";
import { AsyncStorage } from "react-native";

export function setNetwork(value: boolean): IAction {
  return {
    type: ActionType.SET_NETWORK,
    payload: value
  };
}

export function setConference(value: IConference): IAction {
  if (value.Schedule == undefined) {
    value.Schedule = new Schedule(value);
  }
  return {
    type: ActionType.SET_CONFERENCE,
    payload: value
  };
}

export function setJwtToken(jwt: IJwtToken) {
  return (dispatch: Function, getState: () => IRootState) => {
    let conf = getState().app.conference;
    conf.Site.Token = jwt;
    AsyncStorage.setItem("conference", JSON.stringify(conf));
    dispatch(setConference(conf));
  };
}

export function refreshConference() {
  return {
    type: ActionType.REFRESH_CONFERENCE
  };
}

export function clearConference() {
  AsyncStorage.setItem("conference", JSON.stringify({}));
  return {
    type: ActionType.CLEAR_CONFERENCE
  };
}

export function setAttendances(attendances: ISessionAttendee[]) {
  return {
    type: ActionType.REFRESH_ATTENDANCES,
    payload: attendances
  };
}

export function refreshAttendances(site: ISite, navigation: any, conferenceId: number) {
  return (dispatch: Function, getState: () => IRootState) => {
    Service.getAttendances(site, navigation, conferenceId).then(attendances => {
      dispatch(setAttendances(attendances));
    })
    .catch(err => {
      // do nothing
    });
  };
}

export function updateAttendance(attendance: ISessionAttendee) {
  return {
    type: ActionType.UPDATE_ATTENDANCE,
    payload: attendance
  };
}

export function updateAttendee(attendee: IAttendee) {
  return {
    type: ActionType.UPDATE_ATTENDEE,
    payload: attendee
  };
}

export function updateSpeaker(speaker: ISpeaker) {
  return {
    type: ActionType.UPDATE_SPEAKER,
    payload: speaker
  };
}

export function clearComments() {
  return {
    type: ActionType.CLEAR_COMMENTS
  };
}

export function addComments(
  comments: IComment[],
  lastCheck: Date,
  totalComments: number
) {
  return {
    type: ActionType.ADD_COMMENTS,
    payload: { comments, lastCheck, totalComments }
  };
}

export function clearRedirect() {
  return {
    type: ActionType.CLEAR_REDIRECT
  };
}

export function redirectToPath(path: string) {
  return {
    type: ActionType.SET_REDIRECT,
    payload: path
  };
}
