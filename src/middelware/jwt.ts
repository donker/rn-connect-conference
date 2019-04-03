import { Dispatch, Middleware, MiddlewareAPI } from 'redux';
import { ActionType } from '../models';
import { IRootState } from '../models/state/state';
import { refreshToken } from '../actions/authActions';

let buffer: any[] = [];

export const jwt: Middleware<{}, IRootState> = (store: MiddlewareAPI) => (next: Dispatch) => action => {
	buffer.push(action);
	if (action.type === ActionType.INVALID_TOKEN) {
		let theStore: IRootState = store.getState();
		if (
			theStore.auth &&
			theStore.app &&
			theStore.app.conference &&
			theStore.app.conference.Site &&
			theStore.auth.tokens.ContainsKey(theStore.app.conference.Site.Host)
		) {
			if (!theStore.auth.pendingRefreshingToken) {
				store.dispatch({ type: ActionType.REFRESHING_TOKEN });
				store.dispatch(refreshToken() as any).then(() => {
					// this will fire even if the refresh token is still valid or not.
					// if the refresh token is not valid (and therefore not able to retrieve
					// a new auth token), the REFRESH_EXPIRED action is fired from errors.api.
					store.dispatch({ type: ActionType.TOKEN_REFRESHED });

					//get the action before the last INVALID_TOKEN (the one which got denied because of token expiration)
					let pos = buffer.map(e => e.type).indexOf(ActionType.INVALID_TOKEN) - 1;

					// count back from the invalid token dispatch, and fire off the last dispatch again which was
					// a function. These are to be dispatched, and have the dispatch function passed through to them.
					for (var i = pos; i > -1; i -= 1) {
						if (typeof buffer[i] === 'function') {
							store.dispatch({
								type: ActionType.RESEND,
								action: buffer[i](store.dispatch)
							});
							break;
						}
					}
					buffer = [];
				});
			}
		}
	} else if (action.type === ActionType.REFRESH_EXPIRED) {
		buffer = [];
		// store.dispatch(logout());
	} else {
		if (buffer.length > 20) {
			//remove all items but keep the last 20 which forms the buffer
			buffer.splice(0, buffer.length - 20);
		}
		return next(action);
	}
};
