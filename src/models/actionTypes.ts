import { IJwtToken } from './IJwtToken';
import { IKeyedCollection } from './IKeyedCollection';

export interface IAction {
  type: ActionType;
  payload?: any;
}

export interface IAuthAction extends IAction {
  host?: string;
  authToken?: IJwtToken;
  refreshToken?: string;
  loginError?: string;
  regError?: string;
  tokens?: IKeyedCollection<IJwtToken>
}

export interface IErrorAction extends IAction {
  error?: string;
}

export enum ActionType {
  SET_NETWORK,
  SET_CONFERENCE,
  REFRESH_CONFERENCE,
  CLEAR_CONFERENCE,
  REFRESH_ATTENDANCES,
  UPDATE_ATTENDANCE,
  UPDATE_ATTENDEE,
  UPDATE_SPEAKER,
  ADD_COMMENTS,
  CLEAR_COMMENTS,
  CLEAR_REDIRECT,
  SET_REDIRECT,

  SET_AUTH_PENDING,
  SET_LOGIN_SUCCESS,
  SET_LOGIN_ERROR,
  SET_LOGOUT,
  INVALID_TOKEN,
  REFRESHING_TOKEN,
  TOKEN_REFRESHED,
  REFRESH_EXPIRED,
  SAVE_APP_TOKEN,
  CLEAR_APP_TOKEN,
  RESEND,
  SET_TOKENS,

  CONNECTION_ERROR,
  GENERIC_ERROR,
  SHOW_ERROR,
  REMOVE_ERROR
}
