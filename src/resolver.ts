// Based on https://github.com/mongolab/mongodb-uri-node/blob/master/mongodb-uri.js
export declare interface IParsedURIHost {
  host: string;
  port?: number;
}

export declare interface IParsedURI {
  scheme: string;
  username?: string;
  password?: string;
  hosts: [IParsedURIHost];
  database?: string;
  options?: unknown;
}

import mongodbUri from "mongodb-uri";
import _ from "lodash";

export default function ResolverModule() {

  function resolve(input: unknown, someHost?: IParsedURIHost): string {
    if (!_.isString(input)) {
      return "";
    }

    const str = input;

    // URI format: redis://x:942t4dff@192.168.0.17:6379,192.168.0.18:1234/sample
    let urlParts: IParsedURI;
    try {
      urlParts = mongodbUri.parse(str);
    } catch {
      return str;
    }

    if (!_.isObject(urlParts)) {
      return str;
    }

    let defaultHost: IParsedURIHost = {
      host: "localhost",
    };

    if (_.isObject(someHost)) {
      defaultHost = someHost;
    }

    let hostPort = buildPair("localhost", defaultHost.host, defaultHost.port);
    let usernamePassword = buildPair("", urlParts.username, urlParts.password);
    if (usernamePassword !== "") {
      usernamePassword = `${usernamePassword}@`;
    }

    if (_.isArray(urlParts.hosts) && urlParts.hosts.length > 0) {
      const randomIndex = Math.floor(Math.random() * urlParts.hosts.length);
      const srv = urlParts.hosts[randomIndex];
      hostPort = buildPair("", srv.host, srv.port);
    }

    let databaseOpts = "";
    if (_.isString(urlParts.database) && _.trim(urlParts.database) !== "") {
      databaseOpts = `/${urlParts.database}`;
    }

    return `${urlParts.scheme}://${usernamePassword}${hostPort}${databaseOpts}`;
  }

  function buildPair(defaultValue: string, a?: string, b?: string | number): string {
    let built = defaultValue;

    if (_.isString(a) && _.trim(a) !== "") {
      built = `${a}`;

      const asString = _.isString(b) && _.trim(b) !== "";
      const asNumber = _.isFinite(b) && (b as number) > 0;

      if (asString || asNumber) {
        built = `${a}:${b}`;
      }
    }

    return built;
  }

  return {
    buildPair,
    resolve,
  };
}

module.exports = ResolverModule;
