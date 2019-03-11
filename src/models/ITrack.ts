export interface ITrack {
  TrackId: number;
  ConferenceId?: number;
  SessionVoting: boolean;
  BackgroundColor: string;
  Sort?: number;
  Title: string;
  Description: string;
  NrSessions?: number;
}

export class Track implements ITrack {
  TrackId: number;
  ConferenceId?: number;
  SessionVoting: boolean;
  BackgroundColor: string;
  Sort?: number;
  Title: string;
  Description: string;
  NrSessions?: number;
  constructor() {
    this.TrackId = -1;
    this.SessionVoting = false;
  }
}
