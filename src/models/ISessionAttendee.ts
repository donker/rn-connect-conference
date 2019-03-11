export interface ISessionAttendee {
  DisplayName: string;
  SessionId?: number;
  UserId?: number;
  Title?: string;
  ConferenceId?: number;
  SessionDateAndTime?: Date;
  SessionEnd?: Date;
  SessionAttendeeName: string;
}

export class SessionAttendee implements ISessionAttendee {
  DisplayName: string;
  SessionId?: number;
  UserId?: number;
  Title?: string;
  ConferenceId?: number;
  SessionDateAndTime?: Date;
  SessionEnd?: Date;
  SessionAttendeeName: string;
  constructor() {
    this.DisplayName = "";
    this.SessionAttendeeName = "";
  }
}
