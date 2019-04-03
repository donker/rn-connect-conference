import { createStore, applyMiddleware } from "redux";
import rootReducer from "../reducers";
// import loggerMiddleware from "redux-logger";
import ReduxThunk from "redux-thunk";
import { jwt } from '../middelware/jwt';

const store = createStore(rootReducer, applyMiddleware(jwt, ReduxThunk));

export default store;
