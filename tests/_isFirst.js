var queued = "";
var lang = "sass";
var pfx = "$";
var braceL = lang == "less" ? "" : "{";
var braceR = lang == "less" ? "" : "}";
var query = lang == "less" ? "@{" : "#{$";
var rpx = .0625;

var isFirstHelper = function(points, key) {
    queued += pfx + points[key] + "-only: '" + query + "screen} and (max-width: " + (lib[0] - $rpx) + "rem)';\n";
    queued += "." + points[key] + "-only " + braceL + "\n\tdisplay: none;\n" + braceR + "\n\n";
    return queued;
};

describe("_isFirst", function(points, key) {
    "use strict";

    it("Should take an array of numbers as the first parameter.", function() {
        expect(points.constructor).toBe(Array);
        for(var x = 0; x < points.length; x++) {
            expect(typeof points[x]).toBe("number");
        }
    });
    
    it("Should take a number as the second parameter.", function() {
        expect(typeof key).toBe("number");
    });

    it("Should return an error if the first parameter is not an array.", function() {
        expect(isFirstHelper("test",3).toThrow(new Error()));
        it("Should return an error if any of the members of the array are not numbers.", function() {
            expect(isFirstHelper([1,2,"test"],4).toThrow(new Error()));
        });
    });

    it("Should return an error if the second parameter is not a number.", function() {
        expect(isFirstHelper([1,2,3],"test").toThrow(new Error()));
    });

    it("Should return a string.", function() {
        expect(isFirstHelper([10,20,30],0).toBe(pfx + points[key] + "-only'" + query + "screen} and (max-width: " + points[0] - rpx) + "rem)';\n");
    });
});