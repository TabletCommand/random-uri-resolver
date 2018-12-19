// Based on https://github.com/mongolab/mongodb-uri-node/blob/master/mongodb-uri.js
declare interface IParsedURIHost {
  host: string;
  port?: number;
}

declare interface IParsedURI {
  scheme: string;
  username?: string;
  password?: string;
  hosts: [IParsedURIHost];
  database?: string;
  options?: any;
}

module.exports = () => {
  const mongodbUri = require("mongodb-uri");
  const _ = require("lodash");

  function resolve(input: unknown, defaultHost: IParsedURIHost): string {
    if (!_.isString(input)) {
      return "";
    }

    const str = input as string;

    // URI format: redis://x:942t4dff@192.168.0.17:6379,192.168.0.18:1234
    let urlParts: IParsedURI;
    try {
      urlParts = mongodbUri.parse(str);
    } catch (e) {
      return str;
    }

    if (!_.isObject(urlParts)) {
      return str;
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
};
