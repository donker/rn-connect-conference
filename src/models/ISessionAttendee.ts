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
  constructor() {
    this.DisplayName = "";
    this.SessionAttendeeName = "";
  }
}
