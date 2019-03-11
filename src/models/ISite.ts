export interface ISite {
  Host: string;
  ModuleId: number;
  TabId: number;
  Username: string;
  Token: IJwtToken;
}

export class Site implements ISite {
  Host: string;
  ModuleId: number;
  TabId: number;
  Username: string;
  Token: IJwtToken;
  constructor() {
    this.Host = "";
    this.ModuleId = -1;
    this.TabId = -1;
    this.Username = "";
  }
}

export interface IJwtToken {
  displayName: string;
  accessToken: string;
  renewalToken: string;
}

export interface IScannedSite {
  h: string;
  m: number;
  t: number;
  u: string;
  c: number;
}