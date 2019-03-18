export interface IUserProfile {
  DisplayName: string;
  FirstName: string;
  LastName: string;
  Biography: string;
  ShortBiography: string;
  Company: string;
}

export class UserProfile implements IUserProfile {
  DisplayName: string;
  FirstName: string;
  LastName: string;
  Biography: string;
  ShortBiography: string;
  Company: string;
}
