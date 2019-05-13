import store from "../store";
import { IErrorAction, ActionType } from "../models";

export const connectionError: (error: string) => IErrorAction = error => {
  return {
    type: ActionType.CONNECTION_ERROR,
    error
  };
};
export const genericError: (error: string) => IErrorAction = error => {
  return {
    type: ActionType.GENERIC_ERROR,
    error
  };
};
export const showError: (error: string) => IErrorAction = error => {
  return {
    type: ActionType.SHOW_ERROR,
    error
  };
};
export const removeError: () => IErrorAction = () => {
  return {
    type: ActionType.REMOVE_ERROR
  };
};
// token errors handled here to keep out of service files
export const handleTokenErrors = response => {
  //console.log("handleTokenErrors", response);
  // console.log("handleTokenErrors", response.status);
  if (response.status == 401) {
    // unauthorized
    // console.log("handleTokenErrors 401", response);
    var state = store.getState();
    if (state.app.conference && state.app.conference.Site) {
      var token = state.auth.tokens.Item(state.app.conference.Site.Host);
      if (token) {
        store.dispatch({ type: ActionType.INVALID_TOKEN });
      }
    }
  } else if (response.status > 399) {
    // other errors
    // console.log("handleTokenErrors other error", response);
    throw "Invalid Request";
  }
  return response;
};

// general errors are for non-request specific problems that can occur with
// many requests, such as network errors and app specific, general errors
export const generalError = (response: string) => {
  if (response == "TypeError: Network request failed") {
    return store.dispatch(connectionError("Network request failed"));
    // other checks for connection issues
  } else {
    // generic errors
    return store.dispatch(genericError(response));
  }
};

export const asyncError = (response: string) => {
  if (response == "TypeError: Network request failed") {
    return store.dispatch(connectionError("Some async error"));
    // other checks for connection issues
  } else {
    // generic errors
    return store.dispatch(genericError(response));
  }
};
