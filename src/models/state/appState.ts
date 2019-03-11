import { IConference, Conference } from "../IConference";

export interface IAppState {
  network: boolean;
  conference: IConference;
}

export const InitialAppState: IAppState = {
  network: false,
  conference: new Conference()
};
