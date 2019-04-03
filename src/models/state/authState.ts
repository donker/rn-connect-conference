import { IJwtToken } from '../IJwtToken';
import { IKeyedCollection, KeyedCollection } from '../IKeyedCollection';

export interface IAuthState {
    authPending: boolean;
	loggedIn: boolean;
	loginError: string | null | undefined;
	tokenIsValid: boolean | null;
	pendingRefreshingToken: boolean | null;
	tokens: IKeyedCollection<IJwtToken>;
}

export const InitialAuthState: IAuthState = {
    authPending: false,
	loggedIn: false,
	loginError: null,
	tokenIsValid: null,
	pendingRefreshingToken: null,
	tokens: new KeyedCollection<IJwtToken>()
}