import { Alert } from "react-native";
import { ISite } from "../models";

var renewingToken: boolean = false;
var loggingIn: boolean = false;

export default class Service {
  static authenticate(
    host: string,
    username: string,
    password: string,
    success: Function,
    fail?: Function
  ) {
    var url = `https://${host}/DesktopModules/JwtAuth/API/mobile/login`;
    // console.log(url);
    fetch(url, {
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
        throw "Login failed";
      })
      .then(jwt => {
        success(jwt);
      })
      .catch(function(err) {
        // console.log(err);
        if (fail) {
          fail(err);
        }
      });
  }

  static renewToken(
    updateJwt: Function,
    site: ISite,
    expired: Function,
    fail?: Function
  ) {
    var url = `https://${
      site.Host
    }/DesktopModules/JwtAuth/API/mobile/extendtoken`;
    if (renewingToken) return;
    renewingToken = true;
    fetch(url, {
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
        renewingToken = false;
        if (response.status == 200) {
          return response.json();
        } else if (response.status == 401) {
          expired();
          throw "Token expired";
        } else {
          throw "Unexpected error";
        }
      })
      .then(jwt => {
        updateJwt(site, jwt);
      })
      .catch(function(err) {
        // console.log(err);
        if (fail) {
          fail(err);
        }
      });
  }

  static getServiceUrl(
    site: ISite,
    controller: string,
    action: string,
    id: number
  ) {
    var url = `https://${
      site.Host
    }/API/FormaMed/Clients/${controller}/${action}`;
    if (id) url += "/" + id.toString();
    url += "?moduleId=649&tabId=167";
    return url;
  }
  static getQueryString(params: any) {
    var esc = encodeURIComponent;
    return Object.keys(params)
      .map(k => esc(k) + "=" + esc(params[k]))
      .join("&");
  }

  static request(
    updateJwt: Function,
    site: ISite,
    controller:string,
    action: string,
    id: number,
    params: any,
    success: Function,
    fail?: Function
  ) {
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
    fetch(url, { method, headers, body })
      .then(response => {
        if (response.status == 200) {
          // console.log('In one go');
          return response.json();
        } else if (response.status == 401) {
          // console.log('Unauth 1');
          this.renewToken(updateJwt, site, () => {
            // expired ...
            // must log in again
            if (!loggingIn) {
              loggingIn = true;
              if (fail != undefined) {
                fail("expired");
            }
            }
            throw "Must log in again";
          });
          throw "Trying to renew token";
        } else {
          Alert.alert("Request failed");
          throw "Request failed";
        }
      })
      .then(json => {
        // console.log(json);
        success(json);
      })
      .catch(err => {
        // console.log(err);
        if (fail != undefined) {
          fail(err);
        }
      });
  }

//   static getProduct(updateJwt, site, productId, success, fail) {
//     this.request(
//       updateJwt,
//       site,
//       "Products",
//       "ProductsContentsTree",
//       null,
//       { data: { productId: productId } },
//       success,
//       fail
//     );
//   }
}
