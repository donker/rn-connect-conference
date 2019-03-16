import {
  IAction,
  ActionType,
  IConference,
  IJwtToken,
  Schedule,
  ISite,
  ISessionAttendee
} from "../models";
import { IRootState } from "../models/state/state";
import Service from "../lib/service";

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
    dispatch(setConference(conf));
  };
}

export function refreshConference() {
  return {
    type: ActionType.REFRESH_CONFERENCE
  };
}

export function setAttendances(attendances: ISessionAttendee[]) {
  return {
    type: ActionType.REFRESH_ATTENDANCES,
    payload: attendances
  };
}

export function refreshAttendances(site: ISite, conferenceId: number) {
  return (dispatch: Function, getState: () => IRootState) => {
    console.log("about to get attendances");
    Service.getAttendances(site, conferenceId).then(attendances => {
      console.log("got", attendances);
      dispatch(setAttendances(attendances));
    });
  };
}

export function updateAttendance(attendance: ISessionAttendee) {
  return {
    type: ActionType.UPDATE_ATTENDANCE,
    payload: attendance
  };
}
