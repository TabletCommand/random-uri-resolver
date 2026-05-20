"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const node_test_1 = require("node:test");
const resolver_1 = __importDefault(require("../resolver"));
const resolver = (0, resolver_1.default)();
(0, node_test_1.describe)("resolver", () => {
    (0, node_test_1.describe)("buildPair", () => {
        (0, node_test_1.it)("returns default if not set", () => {
            const pair = resolver.buildPair("abcd", undefined, 12);
            chai_1.assert.equal(pair, "abcd");
        });
        (0, node_test_1.it)("returns host, if it's defined", () => {
            const pair = resolver.buildPair("abcd", "cde", undefined);
            chai_1.assert.equal(pair, "cde");
        });
        (0, node_test_1.it)("returns host:port, if both are defined", () => {
            const pair = resolver.buildPair("abcd", "cde", 12);
            chai_1.assert.equal(pair, "cde:12");
        });
    });
    (0, node_test_1.describe)("resolve", () => {
        const defaultHost = {
            host: "local",
            port: 1234
        };
        (0, node_test_1.it)("returns same if it cannot parse uri", () => {
            const resolved = resolver.resolve("abcd", defaultHost);
            chai_1.assert.equal(resolved, "abcd");
        });
        (0, node_test_1.it)("returns same for one host", () => {
            const oneHost = "redis://x:abcd@192.168.0.18:1234/sample";
            const resolved = resolver.resolve(oneHost, defaultHost);
            chai_1.assert.equal(resolved, oneHost);
        });
        (0, node_test_1.it)("returns random for two host", () => {
            const twoHosts = "redis://x:abcd@192.168.0.18:1234,192.168.0.21:1901/sample";
            const resolved = resolver.resolve(twoHosts, defaultHost);
            const foundOne = resolved === "redis://x:abcd@192.168.0.18:1234/sample";
            const foundTwo = resolved === "redis://x:abcd@192.168.0.21:1901/sample";
            chai_1.assert.equal(foundOne || foundTwo, true, `1:${foundOne}, 2:${foundTwo}`);
        });
        (0, node_test_1.it)("returns same for one host, no password", () => {
            const oneHost = "redis://x@192.168.0.18:1234/sample";
            const resolved = resolver.resolve(oneHost, defaultHost);
            chai_1.assert.equal(resolved, oneHost);
        });
        (0, node_test_1.it)("returns same for one host, no username, no password", () => {
            const oneHost = "redis://192.168.0.18:1234/sample";
            const resolved = resolver.resolve(oneHost, defaultHost);
            chai_1.assert.equal(resolved, oneHost);
        });
        (0, node_test_1.it)("returns same for one host, no database", () => {
            const oneHost = "redis://a:b@192.168.0.18:1234";
            const resolved = resolver.resolve(oneHost, defaultHost);
            chai_1.assert.equal(resolved, oneHost);
        });
        (0, node_test_1.it)("returns something even if default host is not supplied", () => {
            const oneHost = "redis://a:b@192.168.0.18:1234";
            const resolved = resolver.resolve(oneHost);
            chai_1.assert.equal(resolved, oneHost);
        });
    });
});
//# sourceMappingURL=resolver.js.map