"use strict";

const assert = require("chai").assert;
const resolver = require("../lib/resolver")();


describe("resolver", () => {
  context("buildPair", () => {
    it("returns default if not set", () => {
      const pair = resolver.buildPair("abcd", null, 12);
      assert.equal(pair, "abcd");
    });

    it("returns host, if it's defined", () => {
      const pair = resolver.buildPair("abcd", "cde", null);
      assert.equal(pair, "cde");
    });

    it("returns host:port, if both are defined", () => {
      const pair = resolver.buildPair("abcd", "cde", 12);
      assert.equal(pair, "cde:12");
    });
  });

  context("resolve", () => {
    const defaultHost = {
      host: "local",
      port: 1234
    };

    it("returns same if it cannot parse uri", () => {
      const resolved = resolver.resolve("abcd", defaultHost);
      assert.equal(resolved, "abcd");
    });

    it("returns same for one host", () => {
      const oneHost = "redis://x:abcd@192.168.0.18:1234/sample";
      const resolved = resolver.resolve(oneHost, defaultHost);
      assert.equal(resolved, oneHost);
    });

    it("returns random for two host", () => {
      const twoHosts = "redis://x:abcd@192.168.0.18:1234,192.168.0.21:1901/sample";
      const resolved = resolver.resolve(twoHosts, defaultHost);

      const foundOne = resolved === "redis://x:abcd@192.168.0.18:1234/sample";
      const foundTwo = resolved === "redis://x:abcd@192.168.0.21:1901/sample";

      assert.equal(foundOne || foundTwo, true, `1:${foundOne}, 2:${foundTwo}`);
    });

    it("returns same for one host, no password", () => {
      const oneHost = "redis://x@192.168.0.18:1234/sample";
      const resolved = resolver.resolve(oneHost, defaultHost);
      assert.equal(resolved, oneHost);
    });

    it("returns same for one host, no username, no password", () => {
      const oneHost = "redis://192.168.0.18:1234/sample";
      const resolved = resolver.resolve(oneHost, defaultHost);
      assert.equal(resolved, oneHost);
    });

    it("returns same for one host, no database", () => {
      const oneHost = "redis://a:b@192.168.0.18:1234";
      const resolved = resolver.resolve(oneHost, defaultHost);
      assert.equal(resolved, oneHost);
    });
  });
});
