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
export const saveTokens = () => (dispatch: Dispatch) => {
  try {
    var state = store.getState();
    AsyncStorage.setItem("tokens", JSON.stringify(state.auth.tokens));
  } catch (error) {
    throw error;
  }
};
export const setLoginSuccess: (
  host: string,
  authToken: IJwtToken
) => IAuthAction = (host, authToken) => {
  return {
    type: ActionType.SET_LOGIN_SUCCESS,
    host,
    authToken
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
export const setLogout: (host: string) => IAuthAction = host => {
  return {
    type: ActionType.SET_LOGOUT,
    host
  };
};
export const saveAppToken: (
  host: string,
  authToken: IJwtToken
) => IAuthAction = (host, authToken) => {
  return {
    type: ActionType.SAVE_APP_TOKEN,
    host,
    authToken
  };
};
export const clearAppToken: (host: string) => IAuthAction = host => {
  AsyncStorage.removeItem("tokens");
  return {
    type: ActionType.CLEAR_APP_TOKEN,
    host
  };
};

const _saveItem = async (item: string, selectedValue: object) => {
  try {
    await AsyncStorage.setItem(item, JSON.stringify(selectedValue));
  } catch (error) {
    throw error;
  }
};

const _getAuthService = () => {
  var state = store.getState();
  return new AuthService({
    site: state.app.conference.Site,
    token: state.auth.tokens.Item(state.app.conference.Site.Host)
  });
};

export const login: (username: string, password: string) => Promise<void> = (
  username,
  password
) => (dispatch: Function) => {
  dispatch(setAuthPending());
  var service = _getAuthService();
  // console.log("logging in", username, password);
  return service
    .login(username, password)
    .then((jwt: IJwtToken) => {
      // console.log("login response", jwt);
      dispatch(setLoginSuccess(service.Site.Host, jwt));
      saveTokens();
      // _saveItem("tokens", ).catch(error => {
      //   dispatch(asyncError(error));
      // });
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
    .then(response => {
      // console.log("refresh response", response);
      dispatch(saveAppToken(service.Site.Host, response));
      _saveItem("tokens", response)
        .then(resp => {
          // console.log("Refresh finished");
        })
        .catch(error => {
          dispatch(asyncError(error));
        });
    })
    .catch(error => {
      dispatch(generalError(error));
    });
};

export const logout = () => async (dispatch: Dispatch) => {
  var service = _getAuthService();
  await dispatch(setLogout(service.Site.Host));
  try {
    saveTokens();
    // App.startApp();
  } catch (error) {
    dispatch(asyncError(error));
  }
};
