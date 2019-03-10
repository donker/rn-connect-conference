import { IAction, IAppState, ActionType, InitialAppState } from "../models";

export default (
  state: IAppState = InitialAppState,
  action: IAction
): IAppState => {
  switch (action.type) {
    case ActionType.SET_NETWORK:
      return Object.assign({}, state, { network: action.payload as boolean });
    default:
      return state;
  }
};
