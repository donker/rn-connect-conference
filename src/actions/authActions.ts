import { AsyncStorage } from "react-native";
import {
  IAuthAction,
  ActionType,
  IJwtToken,
  IKeyedCollection
} from "../models";
import { generalError, asyncError } from "./errorActions";
import store from "../store";
import AuthService from "../lib/authService";
import { Dispatch } from "redux";

export const setAuthPending: () => IAuthAction = () => {
  return {
    type: ActionType.SET_AUTH_PENDING
  };
};
export const setTokens: (
  tokens: IKeyedCollection<IJwtToken>
) => IAuthAction = tokens => {
  return {
    type: ActionType.SET_TOKENS,
    tokens
  };
};
export const saveTokens: (
  tokens: IKeyedCollection<IJwtToken>
) => Promise<void> = async tokens => {
  try {
    await AsyncStorage.setItem("tokens", JSON.stringify(tokens));
  } catch (error) {
    throw error;
  }
};
export const setLoginSuccess: () => IAuthAction = () => {
  return {
    type: ActionType.SET_LOGIN_SUCCESS
  };
};
export const setLoginError: (
  loginError: string
) => IAuthAction = loginError => {
  return {
    type: ActionType.SET_LOGIN_ERROR,
    loginError
  };
};
export const setLogout: () => IAuthAction = () => {
  return {
    type: ActionType.SET_LOGOUT
  };
};

const _getAuthService = () => {
  var state = store.getState();
  return new AuthService({
    site: state.app.conference.Site,
    token: state.auth.tokens.Item(state.app.conference.Site.Host)
  });
};

export const login = (username: string, password: string) => (
  dispatch: Function
) => {
  dispatch(setAuthPending());
  var service = _getAuthService();
  // console.log("logging in", username, password);
  return service
    .login(username, password)
    .then((jwt: IJwtToken) => {
      // console.log("login response", jwt);
      dispatch(setLoginSuccess());
      var tokens = store.getState().auth.tokens;
      if (tokens.ContainsKey(service.Site.Host)) {
        tokens.Remove(service.Site.Host);
      }
      tokens.Add(service.Site.Host, jwt);
      dispatch(setTokens(tokens));
      saveTokens(tokens);
      return Promise.resolve(jwt);
    })
    .catch(error => {
      // console.log("what, what?", error);
      dispatch(generalError(error));
      throw error;
    });
};

export const refreshToken = () => (dispatch: Dispatch) => {
  var service = _getAuthService();
  // console.log("refreshing");
  return service
    .refreshToken()
    .then(jwt => {
      // console.log("refresh response", response);
      var tokens = store.getState().auth.tokens;
      if (tokens.ContainsKey(service.Site.Host)) {
        tokens.Remove(service.Site.Host);
      }
      tokens.Add(service.Site.Host, jwt);
      dispatch(setTokens(tokens));
      saveTokens(tokens);
    })
    .catch(error => {
      dispatch(generalError(error));
    });
};

export const logout = () => async (dispatch: Dispatch) => {
  var service = _getAuthService();
  dispatch(setLogout());
  try {
    var tokens = store.getState().auth.tokens;
    if (tokens.ContainsKey(service.Site.Host)) {
      tokens.Remove(service.Site.Host);
    }
    dispatch(setTokens(tokens));
    saveTokens(tokens);
    // App.startApp();
  } catch (error) {
    dispatch(asyncError(error));
  }
};
