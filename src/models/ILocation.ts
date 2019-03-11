export interface ILocation {
  LocationId: number;
  ConferenceId?: number;
  Name: string;
  Description: string;
  Capacity?: number;
  Sort?: number;
  BackgroundColor: string;
  NrSessions?: number;
}

export class Location implements ILocation {
  LocationId: number;
  ConferenceId?: number;
  Name: string;
  Description: string;
  Capacity?: number;
  Sort?: number;
  BackgroundColor: string;
  NrSessions?: number;
  constructor() {
    this.LocationId = -1;
    this.Name = "";
  }
}
