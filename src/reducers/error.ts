import { IErrorState, InitialErrorState } from "../models/state/errorState";
import { IErrorAction, ActionType } from "../models";

export default (
  state: IErrorState = InitialErrorState,
  action: IErrorAction
): IErrorState => {
  switch (action.type) {
    case ActionType.CONNECTION_ERROR:
      return {
        ...state,
        error: true,
        errorMessage: action.error
      };
    case ActionType.SHOW_ERROR:
      return {
        ...state,
        error: true,
        errorMessage: action.error
      };
    case ActionType.REMOVE_ERROR:
      return {
        ...state,
        error: false,
        errorMessage: null
      };
    default:
      return state;
  }
};
