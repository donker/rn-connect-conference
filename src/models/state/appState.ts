import { IConference, Conference } from "../IConference";
import { ISessionAttendee } from "../ISessionAttendee";

export interface IAppState {
  network: boolean;
  conference: IConference;
  attendances: ISessionAttendee[];
}

export const InitialAppState: IAppState = {
  network: false,
  conference: new Conference(),
  attendances: []
};
