import { IAuthState, InitialAuthState } from "../models/state/authState";
import { ActionType, IAuthAction } from "../models";

export default (
  state: IAuthState = InitialAuthState,
  action: IAuthAction
): IAuthState => {
  switch (action.type) {
    case ActionType.SET_AUTH_PENDING:
      return {
        ...state,
        authPending: true
      };
    case ActionType.SET_TOKENS:
      if (action.tokens)
        return {
          ...state,
          tokens: action.tokens
        };
    case ActionType.SET_LOGIN_SUCCESS:
      var tokens = state.tokens;
      if (action.authToken && action.host) {
        if (tokens.ContainsKey(action.host)) {
          tokens.Remove(action.host);
        }
        tokens.Add(action.host, action.authToken);
      }
      return {
        ...state,
        authPending: false,
        loggedIn: true,
        loginError: null,
        tokens: tokens
      };
    case ActionType.SET_LOGIN_ERROR:
      return {
        ...state,
        authPending: false,
        loggedIn: false,
        loginError: action.loginError
      };
    case ActionType.SET_LOGOUT:
      var tokens = state.tokens;
      if (action.host && tokens.ContainsKey(action.host)) {
        tokens.Remove(action.host);
      }
      return {
        ...state,
        loggedIn: false,
        tokens: tokens
      };
    case ActionType.INVALID_TOKEN:
      return {
        ...state,
        tokenIsValid: false
      };
    case ActionType.REFRESHING_TOKEN:
      return {
        ...state,
        pendingRefreshingToken: true,
        tokenIsValid: false
      };
    case ActionType.TOKEN_REFRESHED:
      return {
        ...state,
        pendingRefreshingToken: null,
        tokenIsValid: true
      };
    case ActionType.SAVE_APP_TOKEN:
      if (action.authToken && action.host) {
        var tokens = state.tokens;
        if (tokens.ContainsKey(action.host)) {
          tokens.Remove(action.host);
        }
        tokens.Add(action.host, action.authToken);
        return {
          ...state,
          tokens: tokens
        };
      }
    case ActionType.CLEAR_APP_TOKEN:
      var tokens = state.tokens;
      if (action.host && tokens.ContainsKey(action.host)) {
        tokens.Remove(action.host);
      }
      return {
        ...state,
        tokens: tokens
      };

    default:
      return state;
  }
};
