import { ISite, IJwtToken } from "../models";
import { handleTokenErrors } from "../actions/errorActions";

export interface IServiceConfig {
  token?: IJwtToken | null;
  site: ISite;
}

export default class Service {
  Token: IJwtToken | null | undefined;
  Site: ISite;
  constructor(config: IServiceConfig) {
    this.Token = config.token;
    this.Site = config.site;
  }

  getServiceUrl(
    controller: string,
    action: string,
    conferenceId: number | null,
    id: number | null
  ): string {
    var url =
      conferenceId === null
        ? `https://${
            this.Site.Host
          }/DesktopModules/Connect/Conference/API/${controller}/${action}`
        : `https://${
            this.Site.Host
          }/DesktopModules/Connect/Conference/API/Conference/${conferenceId}/${controller}/${action}`;
    if (id != null) url += "/" + id.toString();
    url += `?moduleId=${this.Site.ModuleId}&tabId=${this.Site.TabId}`;
    return url;
  }

  getQueryString(params: any): string {
    var esc = encodeURIComponent;
    return Object.keys(params)
      .map(k => esc(k) + "=" + esc(params[k]))
      .join("&");
  }

  requestWithConferenceId<T>(
    controller: string,
    action: string,
    id: number | null,
    qsParams: any,
    params: any
  ): Promise<T> {
    return this.request(
      controller,
      action,
      this.Site.ConferenceId,
      id,
      qsParams,
      params
    );
  }

  requestWithoutConferenceId<T>(
    controller: string,
    action: string,
    id: number | null,
    qsParams: any,
    params: any
  ): Promise<T> {
    return this.request(controller, action, null, id, qsParams, params);
  }

  request<T>(
    controller: string,
    action: string,
    conferenceId: number | null,
    id: number | null,
    qsParams: any,
    params: any
  ): Promise<T> {
    if (!this.Token) {
      return Promise.reject("Should log in");
    }
    // console.log(site.Token);
    params = Object.assign(
      {},
      {
        method: "GET"
      },
      params
    );
    var method = params.method || "GET";
    var qs = "";
    var body;
    var headers = {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: "Bearer " + this.Token.accessToken
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
    var url = this.getServiceUrl(controller, action, conferenceId, id) + qs;
    // console.log(url, { method, headers, body });
    return fetch(url, { method, headers, body })
      .then(handleTokenErrors)
      .then(response => response.json())
      .catch(error => {
        throw error;
      });
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
