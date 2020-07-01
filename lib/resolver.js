"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function ResolverModule() {
    const mongodbUri = require("mongodb-uri");
    const _ = require("lodash");
    function resolve(input, someHost) {
        if (!_.isString(input)) {
            return "";
        }
        const str = input;
        // URI format: redis://x:942t4dff@192.168.0.17:6379,192.168.0.18:1234/sample
        let urlParts;
        try {
            urlParts = mongodbUri.parse(str);
        }
        catch (e) {
            return str;
        }
        if (!_.isObject(urlParts)) {
            return str;
        }
        let defaultHost = {
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
    function buildPair(defaultValue, a, b) {
        let built = defaultValue;
        if (_.isString(a) && _.trim(a) !== "") {
            built = `${a}`;
            const asString = _.isString(b) && _.trim(b) !== "";
            const asNumber = _.isFinite(b) && b > 0;
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
exports.default = ResolverModule;
module.exports = ResolverModule;
//# sourceMappingURL=resolver.js.map