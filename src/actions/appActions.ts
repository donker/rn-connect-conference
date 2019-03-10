import { IAction, ActionType } from "../models";

export function setNetwork(value: boolean): IAction {
  return {
    type: ActionType.SET_NETWORK,
    payload: value
  };
}
