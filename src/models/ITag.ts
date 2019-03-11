export interface ITag {
  TagId: number;
  ConferenceId?: number;
  TagName: string;
  NrSessions?: number;
  NrVotes?: number;
}

export class Tag implements ITag {
  TagId: number;
  ConferenceId?: number;
  TagName: string;
  NrSessions?: number;
  NrVotes?: number;
  constructor() {
    this.TagId = -1;
    this.TagName = "";
  }
}
