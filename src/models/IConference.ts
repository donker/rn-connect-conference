import { ITrack, ITag, IAttendee, ISpeaker, ISession, ISponsor } from ".";
import { ISite, Site } from './ISite';

export interface IConference {
  Site: ISite;
  ConferenceId: number;
  PortalId?: number;
  Name: string;
  Description: string;
  StartDate?: Date;
  EndDate?: Date;
  MaxCapacity?: number;
  SessionVoting: boolean;
  Location: string;
  Url: string;
  SubmittedSessionsPublic: boolean;
  TimeZoneId: string;
  NrAttendees?: number;
  NrSpeakers?: number;
  NrLocations?: number;
  NrTracks?: number;
  NrSessions?: number;
  Sessions: ISession[];
  Speakers: ISpeaker[];
  Sponsors: ISponsor[];
  Tracks: ITrack[];
  Tags: ITag[];
  Attendees?: IAttendee[];
}

export class Conference implements IConference {
  Site: ISite;
  ConferenceId: number;
  PortalId?: number;
  Name: string;
  Description: string;
  StartDate?: Date;
  EndDate?: Date;
  MaxCapacity?: number;
  SessionVoting: boolean;
  Location: string;
  Url: string;
  SubmittedSessionsPublic: boolean;
  TimeZoneId: string;
  NrAttendees?: number;
  NrSpeakers?: number;
  NrLocations?: number;
  NrTracks?: number;
  NrSessions?: number;
  Sessions: ISession[];
  Speakers: ISpeaker[];
  Sponsors: ISponsor[];
  Tracks: ITrack[];
  Tags: ITag[];
  Attendees?: IAttendee[];
  constructor() {
    this.Site=new Site();
    this.ConferenceId = -1;
    this.PortalId = -1;
    this.Name = "";
    this.SessionVoting = false;
    this.SubmittedSessionsPublic = false;
    this.Sessions = [];
    this.Speakers = [];
    this.Sponsors = [];
    this.Tracks = [];
    this.Tags = [];
  }
}
