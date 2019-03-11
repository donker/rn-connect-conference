import { Alert } from "react-native";
import { ISite, IJwtToken, IConference } from "../models";

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
    })
      .then(response => {
        // console.log(response);
        if (response.status == 200) {
          return response.json();
        }
        throw new Error("Login failed");
      })
      .then(jwt => {
        return JSON.parse(jwt);
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
        Authorization: "Bearer " + site.Token
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
    id: number
  ): string {
    var url = `https://${
      site.Host
    }/API/Connect/Conference/${controller}/${action}`;
    if (id) url += "/" + id.toString();
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
    id: number,
    params: any
  ): Promise<T> {
    var method = params.method || "GET";
    var qs = "";
    var body;
    var headers = {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: "Bearer " + site.Token
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

    var url = this.getServiceUrl(site, controller, action, id) + qs;
    console.log(url);
    return fetch(url, { method, headers, body })
      .then(response => {
        if (response.status == 200) {
          // console.log('In one go');
          return response.json();
        } else if (response.status == 401) {
          // console.log('Unauth 1');
          return this.renewToken(site).then(jwt => {
            site.Token = jwt;
            return this.request<T>(site, controller, action, id, params);
          });
        } else {
          Alert.alert("Request failed");
          throw new Error("Request failed");
        }
      })
      .then(json => {
        // console.log(json);
        return JSON.parse(json);
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
      conferenceId,
      {}
    );
  }

}
