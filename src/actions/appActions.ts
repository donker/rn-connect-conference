import {
  IAction,
  ActionType,
  IConference,
  Schedule,
  ISessionAttendee,
  IAttendee,
  ISpeaker,
  IComment,
  IJwtToken,
  KeyedCollection
} from "../models";
import { IRootState } from "../models/state/state";
import { AsyncStorage } from "react-native";
import { Dispatch } from "redux";
import { setTokens, setLoginSuccess } from "./authActions";
import { asyncError } from "./errorActions";
import store from "../store";
import AppService from "../lib/appService";

// used on app startup
export const loadData = () => async (dispatch: Dispatch) => {
  try {
    const authTokensString = await AsyncStorage.getItem("tokens");
    if (authTokensString != null) {
      const authTokens = new KeyedCollection<IJwtToken>(authTokensString);
      dispatch(setTokens(authTokens));
      const conferenceValue = await AsyncStorage.getItem("conference");
      if (conferenceValue != null) {
        const conference: IConference = JSON.parse(conferenceValue);
        dispatch(setConference(conference));
        if (authTokens.ContainsKey(conference.Site.Host)) {
          setLoginSuccess();
        }
        return true;
      }
    }
  } catch (error) {
    dispatch(asyncError(error));
  }
  return null;
};

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

export function refreshAttendances() {
  return (dispatch: Function, getState: () => IRootState) => {
    var state = store.getState();
    var service = new AppService({
      site: state.app.conference.Site,
      token: state.auth.tokens.Item(state.app.conference.Site.Host)
    });
    service
      .getAttendances()
      .then(attendances => {
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
