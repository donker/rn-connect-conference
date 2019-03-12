import { IAction, ActionType, IConference, IJwtToken } from "../models";
import { IRootState } from "../models/state/state";

export function setNetwork(value: boolean): IAction {
  return {
    type: ActionType.SET_NETWORK,
    payload: value
  };
}

export function setConference(value: IConference): IAction {
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
