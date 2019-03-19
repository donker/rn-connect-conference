import {
  ITrack,
  ITag,
  IAttendee,
  ISpeaker,
  ISession,
  ISponsor,
  ISchedule
} from ".";
import { ISite, Site } from "./ISite";
import { ISecurity } from "./ISecurity";
import { ILocation } from "./ILocation";
import { ISlot } from "./ISlot";

export interface IConference {
  Site: ISite;
  Security: ISecurity;
  IsAttending: boolean;
  HasNotificationToken: boolean;
  Closed: boolean;
  OnGoing: boolean;
  ShouldRefresh: boolean;
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
  Days: { DayNr: number; DayDate: Date }[];
  Locations: ILocation[];
  Sessions: ISession[];
  Slots: ISlot[];
  Speakers: ISpeaker[];
  Sponsors: ISponsor[];
  Tracks: ITrack[];
  Tags: ITag[];
  Attendees?: IAttendee[];
  Schedule: ISchedule;
}

export class Conference implements IConference {
  Site: ISite;
  Security: ISecurity;
  IsAttending: boolean;
  HasNotificationToken: boolean;
  Closed: boolean;
  OnGoing: boolean;
  ShouldRefresh: boolean;
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
  Days: { DayNr: number; DayDate: Date }[];
  Locations: ILocation[];
  Sessions: ISession[];
  Slots: ISlot[];
  Speakers: ISpeaker[];
  Sponsors: ISponsor[];
  Tracks: ITrack[];
  Tags: ITag[];
  Attendees?: IAttendee[];
  Schedule: ISchedule;
  constructor() {
    this.Site = new Site();
    this.ShouldRefresh = false;
    this.ConferenceId = -1;
    this.PortalId = -1;
    this.Name = "";
    this.SessionVoting = false;
    this.SubmittedSessionsPublic = false;
    this.Days = [];
    this.Locations = [];
    this.Sessions = [];
    this.Slots = [];
    this.Speakers = [];
    this.Sponsors = [];
    this.Tracks = [];
    this.Tags = [];
  }
}
