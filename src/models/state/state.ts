import { IAppState } from "./appState";
import { IAuthState } from './authState';
import { IErrorState } from './errorState';

export interface IRootState {
  app: IAppState;
  auth: IAuthState;
  error: IErrorState;
}
