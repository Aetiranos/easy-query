var readRemHelper = function(cfg) {
    if (cfg.hasOwnProperty("rem") && cfg["rem"] !== false && typeof cfg["rem"] === "number") {
        this.remSize = cfg["rem"];
        return true;
    } else if (cfg.hasOwnProperty("rem") && cfg["rem"] !== false) {
       throw new Error();
    }
};

describe("_readRem", function() {
    "use strict";
   
    it("Should ensure an object with 'rem' property is passed in.", function() {
        expect(readRemHelper({rem: 15}).toBe(true));
    });
    
    it("Should throw an error if an object without the 'rem' property is passed in.", function() {
        expect(readRemHelper({test: "test"}).toThrow(new Error));
    });
    
    it("Should only accept 'rem' if it is of type number.", function() {
        expect(readRemHelper({rem: 12}).toBe(true));
    });
    
    it("Should throw an error if 'rem' is of a type other than number.", function() {
        expect(readRemHelper({rem: "test"}).toThrow(new Error()));
    });
});