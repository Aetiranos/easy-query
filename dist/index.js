/// <reference path="../typings/index.d.ts" />
var fs = require("fs");
var _ = require("underscore");
var q = require("q");
var e = require("./errors.json")[0];
var EasyQuery = (function () {
    function EasyQuery(obj) {
        var _this = this;
        this.queued = "$screen: 'only screen' !default;\n\n@function lower-bound($range) {\n\n\t@if length($range) <= 0 {\n\t\t@return 0;\n\t}\n\n\t@return nth($range, 1);\n}\n\n@function upper-bound($range) {\n\n\t@if length($range) < 2 {\n\t\t@return 999999999999;\n\t}\n\n\t@return nth($range, 2);\n\n";
        this.languages = ["sass", "scss", "less"];
        /** PRIVATE FUNCTIONS **/
        this._initialize = function (config) {
            if (!!config) {
                _this._readLang(config);
                _this._readBuildCSS(config);
                _this._readBuildVars(config);
                _this._readRem(config);
                _this._readLib(config);
            }
            else {
                try {
                    _this.lib = require("./frameworks/bootstrap3");
                }
                catch (ex) {
                    _this._throwException(e.E2L002);
                }
            }
            _this.$rpx = _this._pxToRem(1);
        };
        this._readLib = function (cfg) {
            if (cfg.hasOwnProperty("lib") && !!cfg["lib"] === true && typeof cfg === "object") {
                var library = cfg["lib"];
                if (library.constructor === Array) {
                    _this._readCustomArray(library);
                }
                else if (typeof library === "string") {
                    try {
                        var framework = library.toString();
                        _this.lib = require("./frameworks/" + framework);
                    }
                    catch (ex) {
                        _this._throwException(e.E2L001);
                    }
                }
            }
            else if (typeof cfg === "string") {
                try {
                    var framework = cfg.toString();
                    _this.lib = require("./frameworks/" + framework);
                }
                catch (ex) {
                    _this._throwException(e.E2L001);
                }
            }
        };
        this._readLang = function (cfg) {
            if (cfg.hasOwnProperty("lang") && (_.contains(_this.languages, cfg["lang"].toLowerCase()))) {
                _this.lang = cfg["lang"];
            }
            else if (cfg.hasOwnProperty("lang")) {
                _this._throwException(e.E2G001);
            }
        };
        this._readRem = function (cfg) {
            if (cfg.hasOwnProperty("rem") && cfg["rem"] !== false && typeof cfg["rem"] === "number") {
                _this.remSize = cfg["rem"];
            }
            else if (cfg.hasOwnProperty("rem") && cfg["rem"] !== false) {
                _this._throwException(e.E2G008);
            }
        };
        this._readBuildCSS = function (cfg) {
            if (cfg.hasOwnProperty("buildCSS") && cfg["buildCSS"] === true) {
                _this.buildVars = true;
            }
            else if (cfg.hasOwnProperty("buildCSS") && cfg["buildCSS"] !== false) {
                _this._throwException(e.E2G002);
            }
            else {
                _this.buildVars = false;
            }
        };
        this._readBuildVars = function (cfg) {
            if (cfg.hasOwnProperty("buildVars") && cfg["buildVars"] === true) {
                _this.buildVars = true;
            }
            else if (cfg.hasOwnProperty("buildVars") && cfg["buildVars"] !== false) {
                _this._throwException(e.E2G003);
            }
            else {
                _this.buildVars = false;
            }
        };
        this._readCustomArray = function (config) {
            if (config.constructor === Array) {
                var strings = _.every(config, function (item) {
                    _this._validateArrayValue(item);
                });
                if (strings === false) {
                    _this._throwException(e.E2G004);
                }
                else {
                    _this._parseCustomArray(_this.config.lib);
                }
            }
            else if (typeof config === "string") {
                _this.lib = config["lib"];
            }
            else {
                _this._throwException(e.E2G005);
            }
        };
        this._validateArrayValue = function (item) {
            if (typeof item === "string") {
                return /^[0-9]+(px|em|rem)$/.test(item.toLowerCase());
            }
            else {
                _this._throwException(e.E2G006);
            }
        };
        this._parseCustomArray = function (lib) {
            _.each(lib, function (element, index) {
                var parsedItem = element.match(/^([-.\d]+(?:.\d+)?)(.*)$/);
                var value = parsedItem[1].trim();
                var unit = parsedItem[2].trim();
                if (_.contains("px", unit)) {
                    value = _this._pxToRem(value);
                }
                _this.lib[index] = value;
            });
        };
        this._pxToRem = function (pixels) {
            return pixels / _this.remSize;
        };
        this._throwException = function (e, exception) {
            if (!!e && typeof e === "object") {
                if (e["type"] === "Error") {
                    var excpt = "Error Details: " + exception ? exception : "";
                    throw new Error("easy-query: [" + e["code"] + "] " + e["title"] + ": " + e["message"] + excpt);
                }
                if (!_this.debugMode) {
                    if (e["type"] === "Warning") {
                        console.error("[" + e["code"] + "] " + e["title"] + ": " + e["message"]);
                    }
                    if (e["type"] === "Information") {
                        console.log("[" + e["code"] + "] " + e["title"] + ": " + e["message"]);
                    }
                }
            }
        };
        this._getBreakNames = function (count) {
            if (typeof count === "number" && count >= 1 && count <= 5) {
                switch (count) {
                    case 1: return ["sm", "lg"];
                    case 2: return ["sm", "md", "lg"];
                    case 3: return ["xs", "sm", "md", "lg"];
                    case 4: return ["xs", "sm", "md", "lg", "xl"];
                    case 5: return ["xs", "sm", "md", "lg", "xl", "xx"];
                }
            }
            else {
                _this._throwException(count < 1 || count > 5 ? "E2G007" : "E2G008");
            }
        };
        this._generateRange = function (points, key) {
            return _this.pfx + points[key] + "-range: (" + _this._pxToRem(_this.lib[key]) + ", " + _this._pxToRem(_this.lib[++key] - _this.$rpx) + ");\n";
        };
        this._isFirst = function (points, key) {
            _this.queued += _this.pfx + points[key] + "-only: '" + _this.query + "screen} and (max-width: " + (_this.lib[0] - _this.$rpx) + "rem)';\n";
            _this.queued += "." + points[key] + "-only " + _this.braceL + "\n\tdisplay: none;\n" + _this.braceR + "\n\n";
            return _this.queued;
        };
        this._isInner = function (points, key) {
            var pointAbove = points[key + 1];
            var pointBelow = points[key - 1];
            var pointCurrent = points[key];
            var bpBelow = _this.lib[key - 1];
            var bpCurrent = _this.lib[key];
            _this.queued += _this._generateRange(points, key);
            _this.queued += _this.pfx + pointCurrent + "-up: '#{$screen} and (min-width: " + bpBelow + "rem);";
            _this.queued += _this.pfx + pointCurrent + "-down: '" + _this.query + "screen} and (max-width: " + (bpCurrent - _this.$rpx) + "rem);";
            _this.queued += _this.pfx + pointCurrent + "-only: '" + _this.query + "screen} and (min-width: " + bpBelow + "rem) and (max-width: " + (bpCurrent - _this.$rpx) + "rem);";
            _this.queued += "." + pointCurrent + "-up " + _this.braceL + "\n\t@media " + _this.query + pointBelow + "-" + ((pointCurrent === "sm") ? "only" : "down") + _this.braceR + " " + _this.braceL + "\n\t\tdisplay: none;\n\t" + _this.braceR + "\n" + _this.braceR + "\n\n;";
            _this.queued += "." + pointCurrent + "-down " + _this.braceL + "\n\t@media " + _this.query + pointAbove + "-" + ((_this.lib.length - 1 === key) ? "only" : "up") + _this.braceR + " " + _this.braceL + "\n\t\tdisplay: none;\n}\n\t}\n\n;";
            _this.queued += "." + pointCurrent + "-only " + _this.braceL + "\n\t@media " + _this.query + pointBelow + "-" + ((pointCurrent === "sm") ? "only" : "down") + _this.braceR + " " + _this.braceL + "\n\t\tdisplay: none;\n\t" + _this.braceR + "\n\n\t@media " + _this.query + pointAbove + "-" + ((_this.lib.length - 1 === key) ? "only" : "up") + _this.braceR + " " + _this.braceL + "\n\t\tdisplay: none;\n" + _this.braceR + "\n\t" + _this.braceR + "\n\n";
            return _this.queued;
        };
        this._isLast = function (points, key) {
            _this.queued += _this.pfx + points[key] + "-only: '" + _this.query + "screen} and (min-width: " + _this.lib[key] + "rem);\n";
            _this.queued += "." + points[key] + "-only " + _this.braceL + "\n\t@media" + _this.query + points[0] + "-" + ((_this.lib.length === 1) ? "only" : "down") + _this.braceR + " " + _this.braceL + "\n\t\tdisplay: none; \n" + _this.braceR + "\n\t" + _this.braceR + "\n\n";
            return _this.queued;
        };
        this._build = function (path, que) {
            if (_this.lib.length) {
                var count = _this.lib.length;
                var points = _this._getBreakNames(count);
                for (var x = 0; x < count; x++) {
                    que += (x === 0) ? _this._isFirst(points, x) : (x === count - 1) ? _this._isLast(points, x) : _this._isInner(points, x);
                }
                return _this._writeFile(path, que).then(_this._handleWriteFulfill, _this._handleWriteError);
            }
            else {
                _this._throwException(e.E2I001);
            }
        };
        this._writeFile = function (path, que) {
            var deferred = q.defer();
            var language = _this.lang;
            fs.writeFile(path + "/_easy-query.scss", que, function (error) {
                if (error) {
                    deferred.reject("Could not write to file. Error Message: " + error);
                }
                else {
                    var returnPath = path + ((_.contains(["sass", "scss"], language)) ? "_" : "") + "easy-query." + language;
                    deferred.resolve(returnPath);
                }
            });
            return deferred.promise;
        };
        this._handleWriteFulfill = function (returnPath) {
            return returnPath;
        };
        this._handleWriteError = function (err) {
            _this._throwException(e.E2F001, err);
        };
        /** PUBLIC FUNCTIONS **/
        this.write = function (path, cb) {
            var returnPath = _this._build(path, _this.queued);
            if (!!cb) {
                cb(returnPath);
            }
        };
        this.getCSS = function () {
            try {
                if (_this.buildCSS) {
                    return _this.builtCSS;
                }
                else {
                    _this._throwException(e.E0G111);
                }
            }
            catch (ex) {
                _this._throwException(e.E1P005, ex);
            }
        };
        this.getVariables = function () {
            try {
                if (_this.buildVars === true) {
                    if (_this.builtVars) {
                        return _this.builtVars;
                    }
                    else {
                        _this._throwException(e.E2G213);
                    }
                }
                else {
                    /** ********************************************************** **/
                    /** ********************************************************** **/
                    /** ********************************************************** **/
                    _this._throwException(e.E0G112);
                }
            }
            catch (ex) {
                _this._throwException(e.E1P006, ex);
            }
        };
        this.getLanguage = function () {
            try {
                return _this.lang;
            }
            catch (ex) {
                _this._throwException(e.E1P001, ex);
            }
        };
        this.getLanguages = function () {
            try {
                return _this.languages;
            }
            catch (ex) {
                _this._throwException(e.E1P004, ex);
            }
        };
        this.setLanguage = function (lang) {
            if (_.contains(_this.languages, lang)) {
                _this.lang = lang;
            }
            else {
                _this._throwException(e.E1G109);
            }
        };
        this.getBreakpoints = function () {
            try {
                return _this.lib;
            }
            catch (ex) {
                _this._throwException(e.E1P003, ex);
            }
        };
        this.setBreakpoints = function (config) {
            _this._readCustomArray(config);
        };
        this.getRemSize = function () {
            try {
                return _this.remSize;
            }
            catch (ex) {
                _this._throwException(e.E1P002, ex);
            }
        };
        this.setRemSize = function (rem) {
            if (typeof rem === "number") {
                _this.remSize = rem;
            }
            else {
                _this._throwException(e.E2G110);
            }
        };
        this.getDebugMode = function () {
            try {
                return _this.debugMode;
            }
            catch (ex) {
                _this._throwException(e.E1P007, ex);
            }
        };
        this.setDebugMode = function (debugMode) {
            _this.debugMode = debugMode;
        };
        this.lang = "scss";
        this.remSize = 16;
        this.config = obj;
        this.buildCSS = true;
        this.buildVars = true;
        this.pfx = this.lang.toLowerCase() === "less" ? "@" : "$";
        this.braceL = this.lang.toLowerCase() === "scss" ? "{" : "";
        this.braceR = this.lang.toLowerCase() === "scss" ? "}" : "";
        this.query = this.lang.toLowerCase() === "less" ? "@{" : "#{$";
        this._initialize(this.config);
    }
    return EasyQuery;
}());
module.exports = function (object) {
    return new EasyQuery(object);
};
//# sourceMappingURL=index.js.map