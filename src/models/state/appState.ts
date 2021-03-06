import { IConference, Conference } from "../IConference";
import { ISessionAttendee } from "../ISessionAttendee";
import { IComment } from "../IComment";

export interface IAppState {
  network: boolean;
  conference: IConference;
  attendances: ISessionAttendee[];
  comments: IComment[];
  commentLastCheck: Date;
  commentsTotal: number;
  goto: string;
}

export const InitialAppState: IAppState = {
  network: false,
  conference: new Conference(),
  attendances: [],
  comments: [],
  commentLastCheck: new Date(),
  commentsTotal: 0,
  goto: ""
};
