export interface ISite {
  Host: string;
  ModuleId: number;
  TabId: number;
  ConferenceId: number;
  Username: string;
}

export class Site implements ISite {
  Host: string;
  ModuleId: number;
  TabId: number;
  ConferenceId: number;
  Username: string;
  constructor() {
    this.Host = "";
    this.ModuleId = -1;
    this.TabId = -1;
    this.ConferenceId = -1;
    this.Username = "";
  }
}

export interface IScannedSite {
  h: string;
  m: number;
  t: number;
  u: string;
  c: number;
}