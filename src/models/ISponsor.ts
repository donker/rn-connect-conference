export interface ISponsor {
  SponsorId: number;
  ConferenceId?: number;
  Name: string;
  Url: string;
  Description: string;
  ViewOrder: number;
  SponsorLevel: string;
}

export class Sponsor implements ISponsor {
  SponsorId: number;
  ConferenceId?: number;
  Name: string;
  Url: string;
  Description: string;
  ViewOrder: number;
  SponsorLevel: string;
  constructor() {
    this.SponsorId = -1;
    this.Name = "";
    this.ViewOrder = -1;
  }
}
