import Service, { IServiceConfig } from "./service";
import { handleTokenErrors } from "../actions/errorActions";

export default class AuthService extends Service {
  constructor(config: IServiceConfig) {
    super(config);
  }

  authRequest(action: string, includeAuth: boolean, body: any): Promise<any> {
    var url = `https://${
      this.Site.Host
    }/DesktopModules/JwtAuth/API/mobile/${action}`;
    var headers: any = {
      "Content-Type": "application/json; charset=utf-8",
      Accept: "application/json; charset=utf-8",
      "Cache-Control": "no-cache"
    };
    if (includeAuth && this.Token) {
      headers.Authorization = "Bearer " + this.Token.accessToken;
    }
    var fetchParams: RequestInit = {
      method: "POST",
      mode: "cors",
      credentials: "omit",
      body,
      headers
    };
    // console.log("authRequest", url, fetchParams);
    return (
      fetch(url, fetchParams)
        .then(handleTokenErrors)
        .then(response => response.json())
        .catch(error => {
          throw error;
        })
    );
  }

  login(username, password) {
    return this.authRequest(
      "login",
      false,
      JSON.stringify({ u: username, p: password })
    );
  }

  refreshToken() {
    if (!this.Token) throw "Cannot refresh empty token";
    return this.authRequest(
      "extendtoken",
      true,
      JSON.stringify({ rtoken: this.Token.renewalToken })
    );
  }
}
