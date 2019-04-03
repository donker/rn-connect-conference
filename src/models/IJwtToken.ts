export interface IJwtToken {
  displayName: string;
  accessToken: string;
  renewalToken: string;
}

export interface IJwtPayload {
  sid: string;
  role: string[];
  iss: string;
  exp: number;
  nbf: number;
}
