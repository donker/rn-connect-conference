export interface ISpeaker {
  ConferenceId?: number;
  UserId: number;
  Company: string;
  Sort?: number;
  Url: string;
  Description: string;
  DescriptionShort: string;
  DisplayName: string;
  FirstName: string;
  LastName: string;
  Email?: string;
  Username?: string;
  PhotoVisibility?: number;
  PhotoFilename: string;
  PhotoFolder: string;
  PhotoWidth?: number;
  PhotoHeight?: number;
  PhotoContentType: string;
  Biography: string;
  Sessions: ISessionExtract[];
}

export interface ISessionExtract {
  SessionId: number;
  Title: string;
  SubTitle: string;
}

export class Speaker implements ISpeaker {
  ConferenceId?: number;
  UserId: number;
  Company: string;
  Sort?: number;
  Url: string;
  Description: string;
  DescriptionShort: string;
  DisplayName: string;
  FirstName: string;
  LastName: string;
  Email?: string;
  Username?: string;
  PhotoVisibility?: number;
  PhotoFilename: string;
  PhotoFolder: string;
  PhotoWidth?: number;
  PhotoHeight?: number;
  PhotoContentType: string;
  Biography: string;
  Sessions: ISessionExtract[];
  constructor() {
    this.UserId = -1;
    this.DisplayName = "";
    this.FirstName = "";
    this.LastName = "";
    this.Username = "";
    this.Sessions = [];
  }
}
