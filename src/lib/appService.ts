import Service, { IServiceConfig } from "./service";
import {
  IConference,
  ISessionAttendee,
  IPagedList,
  IComment,
  IPollCommentResult,
  ISessionEvaluation,
  IAttendee,
  IUserProfile
} from "../models";

export default class AppService extends Service {
  constructor(config: IServiceConfig) {
    super(config);
  }
  
  getConference(conferenceId: number): Promise<IConference> {
    return this.requestWithoutConferenceId<IConference>(
      "Conferences",
      "Complete",
      conferenceId,
      null,
      null
    );
  }

  getAttendances(): Promise<ISessionAttendee[]> {
    return this.requestWithConferenceId<ISessionAttendee[]>(
      "SessionAttendees",
      "Attendances",
      null,
      null,
      null
    );
  }

  getComments(
    sessionId: number,
    visibility: number,
    pageIndex: number,
    pageSize: number
  ): Promise<IPagedList<IComment>> {
    return this.requestWithConferenceId<IPagedList<IComment>>(
      "Comments",
      "List",
      null,
      {
        sessionId: sessionId,
        visibility: visibility,
        pageIndex: pageIndex,
        pageSize: pageSize
      },
      null
    );
  }

  pollComments(
    sessionId: number,
    visibility: number,
    lastCheck: Date
  ): Promise<IPollCommentResult> {
    return this.requestWithConferenceId<IPollCommentResult>(
      "Comments",
      "Poll",
      null,
      {
        sessionId: sessionId,
        visibility: visibility,
        lastCheck: Service.toUTCDateTimeDigits(lastCheck)
      },
      null
    );
  }

  submitEvaluation(evaluation: ISessionEvaluation): Promise<string> {
    return this.requestWithConferenceId<string>(
      "SessionEvaluations",
      "Set",
      null,
      null,
      {
        method: "POST",
        data: evaluation
      }
    );
  }

  attendSession(sessionId: number): Promise<ISessionAttendee> {
    return this.requestWithConferenceId<ISessionAttendee>(
      "SessionAttendees",
      "Attend",
      sessionId,
      null,
      {
        method: "POST"
      }
    );
  }

  changeProfilePic(userId: number, base64: string): Promise<IAttendee> {
    return this.requestWithConferenceId<IAttendee>(
      "Attendees",
      "UpdateImage",
      userId,
      null,
      {
        method: "POST",
        data: {
          Image: base64
        }
      }
    );
  }

  editProfile(userId: number, profile: IUserProfile): Promise<IUserProfile> {
    return this.requestWithConferenceId<IUserProfile>(
      "Users",
      "Edit",
      userId,
      null,
      {
        method: "POST",
        data: profile
      }
    );
  }

  setNotificationToken(userId: number, token: string): Promise<IAttendee> {
    return this.requestWithConferenceId<IAttendee>(
      "Attendees",
      "SetNotificationToken",
      userId,
      null,
      {
        method: "POST",
        data: {
          Token: token
        }
      }
    );
  }
}
