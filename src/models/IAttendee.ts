export interface IAttendee {
  ConferenceId?: number;
  UserId?: number;
  Status?: number;
  ReceiveNotifications?: boolean;
  Company: string;
  AttCode?: string;
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
  ProfileCompany: string;
}

export class Attendee implements IAttendee {
  ConferenceId?: number;
  UserId?: number;
  Status?: number;
  ReceiveNotifications?: boolean;
  Company: string;
  AttCode?: string;
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
  ProfileCompany: string;
  constructor() {
    this.Company = "";
    this.PhotoFilename = "";
    this.PhotoFolder = "";
    this.PhotoContentType = "";
    this.Biography = "";
    this.ProfileCompany = "";
    this.DisplayName = "";
    this.FirstName = "";
    this.LastName = "";
    this.Username = "";
  }
}
