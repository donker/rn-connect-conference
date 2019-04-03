import { combineReducers } from "redux";
import app from "./app";
import auth from './auth';
import error from './error';

export default combineReducers({
  app,
  auth,
  error
});
