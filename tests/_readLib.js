var readLibHelper = function(cfg) {
    var library = cfg["lib"];
    var framework = library.toString();
    
    if (cfg.hasOwnProperty("lib") && !!cfg["lib"] === true && typeof cfg === "object") {
        if (library.constructor === Array) {
            this._readCustomArray(library);
        } else if (typeof library === "string") {
            try {
                this.lib = require("./frameworks/" + framework);
            } catch (ex) {
                this._throwException(e.E2L001);
            }
        }
    } else if (typeof cfg === "string") {
        try {
            this.lib = require("./frameworks/" + framework);
        } catch (ex) {
            this._throwException(e.E2L001);
        }
    }
};

describe("_readLib", function() {
    "use strict";
    
    it("Should only accept an object that has a 'lib' property.", function() {
        expect(readLibHelper({lib: 'bootstrap3'}).toBe(true));
        expect(readLibHelper({}).toThrow(new Error()));
    });

    it("Should throw an error if something other than an object is passed in.", function() {
        expect(readLibHelper(true).toThrow(new Error()));
        expect(readLibHelper(4).toThrow(new Error()));
        expect(readLibHelper(["one","two"]).toThrow(new Error()));
        expect(readLibHelper("testing").toThrow(new Error()));
    });
});