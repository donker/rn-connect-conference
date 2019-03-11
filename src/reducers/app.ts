import {
  IAction,
  IAppState,
  ActionType,
  InitialAppState,
  IConference
} from "../models";

export default (
  state: IAppState = InitialAppState,
  action: IAction
): IAppState => {
  switch (action.type) {
    case ActionType.SET_NETWORK:
      return Object.assign({}, state, { network: action.payload as boolean });
    case ActionType.SET_CONFERENCE:
      return Object.assign({}, state, {
        conference: action.payload as IConference
      });
    default:
      return state;
  }
};
