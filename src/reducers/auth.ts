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
      return {
        ...state,
        authPending: false,
        loggedIn: true,
        loginError: null
      };
    case ActionType.SET_LOGIN_ERROR:
      return {
        ...state,
        authPending: false,
        loggedIn: false,
        loginError: action.loginError
      };
    case ActionType.SET_LOGOUT:
      return {
        ...state,
        loggedIn: false
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
    default:
      return state;
  }
};
