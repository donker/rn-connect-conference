export interface ISessionAttendee {
  DisplayName: string;
  SessionId: number;
  UserId: number;
  Title?: string;
  ConferenceId?: number;
  SessionDateAndTime?: Date;
  SessionEnd?: Date;
  SessionAttendeeName: string;
  ReviewStars: number;
  HasEvaluated: boolean;
}

export class SessionAttendee implements ISessionAttendee {
  DisplayName: string;
  SessionId: number;
  UserId: number;
  Title?: string;
  ConferenceId?: number;
  SessionDateAndTime?: Date;
  SessionEnd?: Date;
  SessionAttendeeName: string;
  ReviewStars: number;
  HasEvaluated: boolean;
  constructor() {
    this.DisplayName = "";
    this.SessionAttendeeName = "";
  }
}
