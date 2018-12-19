"use strict";
module.exports = function () {
    var mongodbUri = require("mongodb-uri");
    var _ = require("lodash");
    function resolve(input, someHost) {
        if (!_.isString(input)) {
            return "";
        }
        var str = input;
        // URI format: redis://x:942t4dff@192.168.0.17:6379,192.168.0.18:1234/sample
        var urlParts;
        try {
            urlParts = mongodbUri.parse(str);
        }
        catch (e) {
            return str;
        }
        if (!_.isObject(urlParts)) {
            return str;
        }
        var defaultHost = {
            host: "localhost",
        };
        if (_.isObject(someHost)) {
            defaultHost = someHost;
        }
        var hostPort = buildPair("localhost", defaultHost.host, defaultHost.port);
        var usernamePassword = buildPair("", urlParts.username, urlParts.password);
        if (usernamePassword !== "") {
            usernamePassword = usernamePassword + "@";
        }
        if (_.isArray(urlParts.hosts) && urlParts.hosts.length > 0) {
            var randomIndex = Math.floor(Math.random() * urlParts.hosts.length);
            var srv = urlParts.hosts[randomIndex];
            hostPort = buildPair("", srv.host, srv.port);
        }
        var databaseOpts = "";
        if (_.isString(urlParts.database) && _.trim(urlParts.database) !== "") {
            databaseOpts = "/" + urlParts.database;
        }
        return urlParts.scheme + "://" + usernamePassword + hostPort + databaseOpts;
    }
    function buildPair(defaultValue, a, b) {
        var built = defaultValue;
        if (_.isString(a) && _.trim(a) !== "") {
            built = "" + a;
            var asString = _.isString(b) && _.trim(b) !== "";
            var asNumber = _.isFinite(b) && b > 0;
            if (asString || asNumber) {
                built = a + ":" + b;
            }
        }
        return built;
    }
    return {
        buildPair: buildPair,
        resolve: resolve,
    };
};
