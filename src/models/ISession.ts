import { ISessionSpeaker, ISessionTag, ISessionAttendee } from ".";

export interface ISession {
  SessionId: number;
  ConferenceId?: number;
  LocationId?: number;
  Level: string;
  Sort?: number;
  Capacity?: number;
  SlotId: number;
  Title: string;
  SubTitle: string;
  Description: string;
  Status?: number;
  IsPlenary: boolean;
  DayNr: number;
  Notes?: string;
  TrackId?: number;
  TimeZoneId: string;
  SessionDateAndTime?: Date;
  SessionEnd?: Date;
  LocationName: string;
  SlotTitle: string;
  TrackTitle: string;
  BackgroundColor: string;
  NrAttendees?: number;
  NrSpeakers?: number;
  NrVotes?: number;
  NrResources?: number;
  SessionSpeakers: ISessionSpeaker[];
  SessionTags: ISessionTag[];
  Attendees?: ISessionAttendee[];
  Speakers: { Key: number; Value: string }[];
  Tags: { Key: number; Value: string }[];
}

export class Session implements ISession {
  SessionId: number;
  ConferenceId?: number;
  LocationId?: number;
  Level: string;
  Sort?: number;
  Capacity?: number;
  SlotId: number;
  Title: string;
  SubTitle: string;
  Description: string;
  Status?: number;
  IsPlenary: boolean;
  DayNr: number;
  Notes?: string;
  TrackId?: number;
  TimeZoneId: string;
  SessionDateAndTime?: Date;
  SessionEnd?: Date;
  LocationName: string;
  SlotTitle: string;
  TrackTitle: string;
  BackgroundColor: string;
  NrAttendees?: number;
  NrSpeakers?: number;
  NrVotes?: number;
  NrResources?: number;
  SessionSpeakers: ISessionSpeaker[];
  SessionTags: ISessionTag[];
  Attendees?: ISessionAttendee[];
  Speakers: { Key: number; Value: string }[];
  Tags: { Key: number; Value: string }[];
  constructor() {
    this.SessionId = -1;
    this.SlotId = -1;
    this.IsPlenary = false;
    this.DayNr = -1;
    this.SessionSpeakers = [];
    this.SessionTags = [];
    this.Speakers = [];
    this.Tags = [];
  }
}
