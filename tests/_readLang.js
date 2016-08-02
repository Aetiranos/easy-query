var readLangHelper = function(cfg) {
    if (cfg.hasOwnProperty("lang") && (_.contains(this.languages, cfg["lang"].toLowerCase()))) {
        return true;
    } else if (cfg.hasOwnProperty("lang")) {
        throw new Error();
    }
};

describe("_readLang", function(cfg) {
    "use strict";

    it("Should take a object as a parameter.", function() {
        expect(typeof cfg).toBe("object");
    });

    it("Should throw an error if the parameter is not an object.", function() {
        expect(readLangHelper("test").toThrow(new Error()))
    });

    it("Should throw an error if the parameter is missing.", function() {
        expect(readLangHelper().toThrow(new Error()));
    });

    it("Should check for the existence of a 'lang' key in the object.", function() {
        expect(readLangHelper({lang: "scss"}).toBe(true));
    });

    it("Should throw an error if an object is passed but does not contain 'lang'.", function() {
        expect(readLangHelper({test: "test"}).toThrow(new Error()));
    });

    it("Should ensure the passed 'lang' is a supported language.", function() {
        expect(readLangHelper({lang: "scss"}).toBe(true));
        expect(readLangHelper({lang: "less"}).toBe(true));
        expect(readLangHelper({lang: "sass"}).toBe(true));
    });

    it("Should throw an error if the 'lang' key is present but does not contain a supported language.", function() {
        expect(readLangHelper({lang: "javascript"}).toThrow(new Error()));
    });
});