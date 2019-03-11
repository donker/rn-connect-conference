export interface ISessionTag {
  SessionId?: number;
  TagId: number;
  TagName: string;
}

export class SessionTag implements ISessionTag {
  SessionId?: number;
  TagId: number;
  TagName: string;
  constructor() {
    this.TagId = -1;
    this.TagName = "";
  }
}
