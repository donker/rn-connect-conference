export interface IAction {
  type: ActionType;
  payload: any;
}

export enum ActionType {
  SET_NETWORK,
  SET_CONFERENCE,
  REFRESH_CONFERENCE,
  REFRESH_ATTENDANCES,
  UPDATE_ATTENDANCE,
  UPDATE_ATTENDEE,
  UPDATE_SPEAKER
}
