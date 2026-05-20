"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = ResolverModule;
const mongodb_uri_1 = __importDefault(require("mongodb-uri"));
const lodash_1 = __importDefault(require("lodash"));
function ResolverModule() {
    function resolve(input, someHost) {
        if (!lodash_1.default.isString(input)) {
            return "";
        }
        const str = input;
        // URI format: redis://x:942t4dff@192.168.0.17:6379,192.168.0.18:1234/sample
        let urlParts;
        try {
            urlParts = mongodb_uri_1.default.parse(str);
        }
        catch {
            return str;
        }
        if (!lodash_1.default.isObject(urlParts)) {
            return str;
        }
        let defaultHost = {
            host: "localhost",
        };
        if (lodash_1.default.isObject(someHost)) {
            defaultHost = someHost;
        }
        let hostPort = buildPair("localhost", defaultHost.host, defaultHost.port);
        let usernamePassword = buildPair("", urlParts.username, urlParts.password);
        if (usernamePassword !== "") {
            usernamePassword = `${usernamePassword}@`;
        }
        if (lodash_1.default.isArray(urlParts.hosts) && urlParts.hosts.length > 0) {
            const randomIndex = Math.floor(Math.random() * urlParts.hosts.length);
            const srv = urlParts.hosts[randomIndex];
            hostPort = buildPair("", srv.host, srv.port);
        }
        let databaseOpts = "";
        if (lodash_1.default.isString(urlParts.database) && lodash_1.default.trim(urlParts.database) !== "") {
            databaseOpts = `/${urlParts.database}`;
        }
        return `${urlParts.scheme}://${usernamePassword}${hostPort}${databaseOpts}`;
    }
    function buildPair(defaultValue, a, b) {
        let built = defaultValue;
        if (lodash_1.default.isString(a) && lodash_1.default.trim(a) !== "") {
            built = `${a}`;
            const asString = lodash_1.default.isString(b) && lodash_1.default.trim(b) !== "";
            const asNumber = lodash_1.default.isFinite(b) && b > 0;
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
//# sourceMappingURL=resolver.js.map