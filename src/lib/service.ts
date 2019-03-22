import { Alert } from "react-native";
import {
  ISite,
  IJwtToken,
  IConference,
  ISessionAttendee,
  ISessionEvaluation,
  IAttendee,
  IUserProfile,
  IComment,
  IPagedList,
  IPollCommentResult
} from "../models";
import {
  NavigationScreenProp,
  NavigationRoute,
  NavigationParams
} from "react-navigation";

export default class Service {
  static authenticate(
    host: string,
    username: string,
    password: string
  ): Promise<IJwtToken> {
    var url = `https://${host}/DesktopModules/JwtAuth/API/mobile/login`;
    // console.log(url);
    return fetch(url, {
      method: "POST",
      mode: "cors",
      body: JSON.stringify({ u: username, p: password }),
      credentials: "omit",
      headers: {
        "Content-Type": "application/json; charset=utf-8",
        Accept: "application/json; charset=utf-8",
        "Cache-Control": "no-cache"
      }
    }).then(response => {
      // console.log(response);
      if (response.status == 200) {
        return response.json();
      }
      throw new Error("Login failed");
    });
  }

  static renewToken(
    site: ISite,
    navigation: NavigationScreenProp<
      NavigationRoute<NavigationParams>,
      NavigationParams
    >
  ): Promise<IJwtToken> {
    var url = `https://${
      site.Host
    }/DesktopModules/JwtAuth/API/mobile/extendtoken`;
    return fetch(url, {
      method: "POST",
      mode: "cors",
      body: JSON.stringify({ rtoken: site.Token.renewalToken }),
      credentials: "omit",
      headers: {
        "Content-Type": "application/json; charset=utf-8",
        Accept: "application/json; charset=utf-8",
        "Cache-Control": "no-cache",
        Authorization: "Bearer " + site.Token.accessToken
      }
    }).then(response => {
      if (response.status == 200) {
        return response.json();
      } else if (response.status == 401) {
        // throw new Error("Token expired");
        navigation.navigate("Login", { username: site.Username });
        return Promise.reject("Token expired");
      } else {
        throw new Error("Unexpected error");
      }
    });
  }

  static getServiceUrl(
    site: ISite,
    controller: string,
    action: string,
    conferenceId: number | null,
    id: number | null
  ): string {
    var url =
      conferenceId == null
        ? `https://${
            site.Host
          }/DesktopModules/Connect/Conference/API/${controller}/${action}`
        : `https://${
            site.Host
          }/DesktopModules/Connect/Conference/API/Conference/${conferenceId}/${controller}/${action}`;
    if (id != null) url += "/" + id.toString();
    url += `?moduleId=${site.ModuleId}&tabId=${site.TabId}`;
    return url;
  }

  static getQueryString(params: any): string {
    var esc = encodeURIComponent;
    return Object.keys(params)
      .map(k => esc(k) + "=" + esc(params[k]))
      .join("&");
  }

  static request<T>(
    site: ISite,
    navigation: NavigationScreenProp<
      NavigationRoute<NavigationParams>,
      NavigationParams
    >,
    controller: string,
    action: string,
    conferenceId: number | null,
    id: number | null,
    qsParams: any,
    params: any
  ): Promise<T> {
    if (site.Token == undefined) {
      navigation.navigate("Login", { username: site.Username });
      return Promise.reject("Should log in");
    }
    // console.log(site.Token);
    var method = params.method || "GET";
    var qs = "";
    var body;
    var headers = {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: "Bearer " + site.Token.accessToken
    };
    if (params.headers) {
      headers = Object.assign({}, headers, params.headers);
    }

    if (params.data) {
      if (["GET", "DELETE"].indexOf(method) > -1)
        qs = "&" + this.getQueryString(params.data);
      // POST or PUT
      else body = JSON.stringify(params.data);
    }

    if (qsParams) {
      qs = "&" + this.getQueryString(qsParams);
    }

    var url =
      this.getServiceUrl(site, controller, action, conferenceId, id) + qs;
    // console.log(url, { method, headers, body });
    return fetch(url, { method, headers, body }).then(response => {
      if (response.status == 200) {
        // console.log('In one go');
        return response.json();
      } else if (response.status == 401) {
        // console.log('Unauth 1');
        // careful: this could also be because of XSS prevention token
        return this.renewToken(site, navigation).then(jwt => {
          site.Token = jwt;
          return this.request<T>(
            site,
            navigation,
            controller,
            action,
            conferenceId,
            id,
            qsParams,
            params
          );
        })
      } else if (response.status == 406) {
        response.text().then(body => {
          Alert.alert(body);
        });
        throw new Error("Request failed");
      } else {
        // console.log(response);
        Alert.alert("Request failed");
        throw new Error("Request failed");
      }
    });
  }

  static getConference(
    site: ISite,
    navigation: NavigationScreenProp<
      NavigationRoute<NavigationParams>,
      NavigationParams
    >,
    conferenceId: number
  ): Promise<IConference> {
    return this.request<IConference>(
      site,
      navigation,
      "Conferences",
      "Complete",
      null,
      conferenceId,
      null,
      {}
    );
  }

  static getAttendances(
    site: ISite,
    navigation: NavigationScreenProp<
      NavigationRoute<NavigationParams>,
      NavigationParams
    >,
    conferenceId: number
  ): Promise<ISessionAttendee[]> {
    return this.request<ISessionAttendee[]>(
      site,
      navigation,
      "SessionAttendees",
      "Attendances",
      conferenceId,
      null,
      null,
      {}
    );
  }

  static getComments(
    site: ISite,
    navigation: NavigationScreenProp<
      NavigationRoute<NavigationParams>,
      NavigationParams
    >,
    conferenceId: number,
    sessionId: number,
    visibility: number,
    pageIndex: number,
    pageSize: number
  ): Promise<IPagedList<IComment>> {
    return this.request<IPagedList<IComment>>(
      site,
      navigation,
      "Comments",
      "List",
      conferenceId,
      null,
      {
        sessionId: sessionId,
        visibility: visibility,
        pageIndex: pageIndex,
        pageSize: pageSize
      },
      {}
    );
  }

  static pollComments(
    site: ISite,
    navigation: NavigationScreenProp<
      NavigationRoute<NavigationParams>,
      NavigationParams
    >,
    conferenceId: number,
    sessionId: number,
    visibility: number,
    lastCheck: Date
  ): Promise<IPollCommentResult> {
    return this.request<IPollCommentResult>(
      site,
      navigation,
      "Comments",
      "Poll",
      conferenceId,
      null,
      {
        sessionId: sessionId,
        visibility: visibility,
        lastCheck: Service.toUTCDateTimeDigits(lastCheck)
      },
      {}
    );
  }

  static submitEvaluation(
    site: ISite,
    navigation: NavigationScreenProp<
      NavigationRoute<NavigationParams>,
      NavigationParams
    >,
    conferenceId: number,
    evaluation: ISessionEvaluation
  ): Promise<string> {
    return this.request<string>(
      site,
      navigation,
      "SessionEvaluations",
      "Set",
      conferenceId,
      null,
      null,
      {
        method: "POST",
        data: evaluation
      }
    );
  }

  static attendSession(
    site: ISite,
    navigation: NavigationScreenProp<
      NavigationRoute<NavigationParams>,
      NavigationParams
    >,
    conferenceId: number,
    sessionId: number
  ): Promise<ISessionAttendee> {
    return this.request<ISessionAttendee>(
      site,
      navigation,
      "SessionAttendees",
      "Attend",
      conferenceId,
      sessionId,
      null,
      {
        method: "POST"
      }
    );
  }

  static changeProfilePic(
    site: ISite,
    navigation: NavigationScreenProp<
      NavigationRoute<NavigationParams>,
      NavigationParams
    >,
    conferenceId: number,
    userId: number,
    base64: string
  ): Promise<IAttendee> {
    return this.request<IAttendee>(
      site,
      navigation,
      "Attendees",
      "UpdateImage",
      conferenceId,
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

  static editProfile(
    site: ISite,
    navigation: NavigationScreenProp<
      NavigationRoute<NavigationParams>,
      NavigationParams
    >,
    conferenceId: number,
    userId: number,
    profile: IUserProfile
  ): Promise<IUserProfile> {
    return this.request<IUserProfile>(
      site,
      navigation,
      "Users",
      "Edit",
      conferenceId,
      userId,
      null,
      {
        method: "POST",
        data: profile
      }
    );
  }

  static setNotificationToken(
    site: ISite,
    navigation: NavigationScreenProp<
      NavigationRoute<NavigationParams>,
      NavigationParams
    >,
    conferenceId: number,
    userId: number,
    token: string
  ): Promise<IAttendee> {
    return this.request<IAttendee>(
      site,
      navigation,
      "Attendees",
      "SetNotificationToken",
      conferenceId,
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

  static toUTCDateTimeDigits = function(input: Date) {
    if (typeof input === "string") {
      input = new Date(input);
    }
    return (
      input.getUTCFullYear() +
      "-" +
      Service.pad(input.getUTCMonth() + 1) +
      "-" +
      Service.pad(input.getUTCDate()) +
      "T" +
      Service.pad(input.getUTCHours()) +
      ":" +
      Service.pad(input.getUTCMinutes()) +
      ":" +
      Service.pad(input.getUTCSeconds()) +
      "Z"
    );
  };

  static pad = (number: number) => {
    if (number < 10) {
      return "0" + number;
    }
    return number.toString();
  };
}
