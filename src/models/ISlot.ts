export interface ISlot {
  SlotId: number;
  ConferenceId: number;
  Start: Date;
  DurationMins: number;
  SlotType: number;
  Title: string;
  Description: string;
  DayNr?: number;
  LocationId?: number;
  CreatedByUserID: number;
  CreatedOnDate: Date;
  LastModifiedByUserID: number;
  LastModifiedOnDate: Date;
  LocationName: string;
  CreatedByUser: string;
  LastModifiedByUser: string;
}

export class Slot implements ISlot {
  SlotId: number;
  ConferenceId: number;
  Start: Date;
  DurationMins: number;
  SlotType: number;
  Title: string;
  Description: string;
  DayNr?: number;
  LocationId?: number;
  CreatedByUserID: number;
  CreatedOnDate: Date;
  LastModifiedByUserID: number;
  LastModifiedOnDate: Date;
  LocationName: string;
  CreatedByUser: string;
  LastModifiedByUser: string;
    constructor() {
  this.SlotId = -1;
  this.ConferenceId = -1;
  this.Start = new Date();
  this.DurationMins = -1;
  this.SlotType = -1;
  this.CreatedByUserID = -1;
  this.CreatedOnDate = new Date();
  this.LastModifiedByUserID = -1;
  this.LastModifiedOnDate = new Date();
   }
}

