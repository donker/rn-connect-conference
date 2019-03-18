import { Alert } from "react-native";
import {
  ISite,
  IJwtToken,
  IConference,
  ISessionAttendee,
  ISessionEvaluation,
  IAttendee,
  IUserProfile
} from "../models";

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

  static renewToken(site: ISite): Promise<IJwtToken> {
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
    })
      .then(response => {
        if (response.status == 200) {
          return response.json();
        } else if (response.status == 401) {
          throw new Error("Token expired");
        } else {
          throw new Error("Unexpected error");
        }
      })
      .then(jwt => {
        // updateJwt(site, jwt);
        return JSON.parse(jwt);
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
    controller: string,
    action: string,
    conferenceId: number | null,
    id: number | null,
    qsParams: any,
    params: any
  ): Promise<T> {
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
    console.log(url, { method, headers, body });
    return fetch(url, { method, headers, body }).then(response => {
      if (response.status == 200) {
        // console.log('In one go');
        return response.json();
      } else if (response.status == 401) {
        // console.log('Unauth 1');
        // careful: this could also be because of XSS prevention token
        return this.renewToken(site).then(jwt => {
          site.Token = jwt;
          return this.request<T>(
            site,
            controller,
            action,
            conferenceId,
            id,
            qsParams,
            params
          );
        });
      } else if (response.status == 406) {
        response.text().then(body => {
          Alert.alert(body);
        });
        throw new Error("Request failed");
      } else {
        console.log(response);
        Alert.alert("Request failed");
        throw new Error("Request failed");
      }
    });
  }

  static getConference(
    site: ISite,
    conferenceId: number
  ): Promise<IConference> {
    return this.request<IConference>(
      site,
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
    conferenceId: number
  ): Promise<ISessionAttendee[]> {
    return this.request<ISessionAttendee[]>(
      site,
      "SessionAttendees",
      "Attendances",
      conferenceId,
      null,
      null,
      {}
    );
  }

  static submitEvaluation(
    site: ISite,
    conferenceId: number,
    evaluation: ISessionEvaluation
  ): Promise<string> {
    return this.request<string>(
      site,
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
    conferenceId: number,
    sessionId: number
  ): Promise<ISessionAttendee> {
    return this.request<ISessionAttendee>(
      site,
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
    conferenceId: number,
    userId: number,
    base64: string
  ): Promise<IAttendee> {
    return this.request<IAttendee>(
      site,
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
    conferenceId: number,
    userId: number,
    profile: IUserProfile
  ): Promise<IUserProfile> {
    console.log(profile);
    return this.request<IUserProfile>(
      site,
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
}
