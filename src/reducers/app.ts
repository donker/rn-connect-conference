import {
  IAction,
  IAppState,
  ActionType,
  InitialAppState,
  IConference,
  IComment
} from "../models";

export default (
  state: IAppState = InitialAppState,
  action: IAction
): IAppState => {
  switch (action.type) {
    case ActionType.SET_NETWORK:
      return Object.assign({}, state, { network: action.payload as boolean });
    case ActionType.SET_CONFERENCE:
      return Object.assign({}, state, {
        conference: action.payload as IConference
      });
    case ActionType.REFRESH_CONFERENCE:
      let c = state.conference;
      c.ShouldRefresh = true;
      return Object.assign({}, state, {
        conference: c
      });
    case ActionType.REFRESH_ATTENDANCES:
      return Object.assign({}, state, {
        attendances: action.payload
      });
    case ActionType.UPDATE_ATTENDANCE:
      let found = false;
      let newList = state.attendances.map(a => {
        if (a.SessionId == action.payload.SessionId) {
          found = true;
          return action.payload;
        } else {
          return a;
        }
      });
      if (!found) newList.push(action.payload);
      return Object.assign({}, state, {
        attendances: newList
      });
    case ActionType.UPDATE_ATTENDEE:
      let c2 = state.conference;
      if (c2.Attendees)
        c2.Attendees = c2.Attendees.map(a =>
          a.UserId === action.payload.UserId ? action.payload : a
        );
      return Object.assign({}, state, {
        conference: c2
      });
    case ActionType.UPDATE_SPEAKER:
      let c3 = state.conference;
      c3.Speakers = c3.Speakers.map(s =>
        s.UserId === action.payload.UserId ? action.payload : s
      );
      return Object.assign({}, state, {
        conference: c3
      });
    case ActionType.ADD_COMMENTS:
      let comments = state.comments;
      if (comments.length === 0) {
        return Object.assign({}, state, {
          comments: action.payload,
          commentLastCheck: new Date()
        });
      } else {
        let newCommentList: IComment[] = action.payload;
        comments.forEach(c => {
          if (
            newCommentList.find(nc => nc.CommentId === c.CommentId) == undefined
          ) {
            newCommentList.push(c);
          }
        });
        newCommentList.sort((a, b) =>
          a.CommentId > b.CommentId ? -1 : b.CommentId > a.CommentId ? 1 : 0
        );
        return Object.assign({}, state, {
          comments: newCommentList
        });
      }
    default:
      return state;
  }
};
