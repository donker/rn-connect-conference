export interface ISessionSpeaker {
  SpeakerId: number;
  SessionId?: number;
  Sort?: number;
  Company: string;
  Description?: string;
  DescriptionShort: string;
  Url?: string;
  DisplayName: string;
  FirstName: string;
  LastName: string;
  Email?: string;
  Username?: string;
}

export class SessionSpeaker implements ISessionSpeaker {
  SpeakerId: number;
  SessionId?: number;
  Sort?: number;
  Company: string;
  Description?: string;
  DescriptionShort: string;
  Url?: string;
  DisplayName: string;
  FirstName: string;
  LastName: string;
  Email?: string;
  Username?: string;
  constructor() {
    this.SpeakerId = -1;
    this.DisplayName = "";
    this.FirstName = "";
    this.LastName = "";
    this.Username = "";
  }
}
