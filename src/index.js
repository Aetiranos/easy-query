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
        /** PRIVATE FUNCTIONS ****************************************************************************************** **/
        /**
         * @description A post-Constructor initialization function that collects the many steps to initializing the software
         *      such as checking parameter integrity, et al.
         *
         *      The configuration object that is passed to initialize * must * be an object limited to the following parameters,
         *      all of which are optional with the exception of a no parametered object:
         *
         *      lang: <string> - Describes which language should be output from the software. Options are: less, sass, and scss.
         *      buildCSS: <boolean> - Decision to also output CSS classes. Options are: true and false.
         *      buildVars: <boolean> - Decision to also output variables compatible with the chosen language. If the lang
         *          parameter is not passed, it will default to "scss".
         *      rem: <number> - Describes how many pixels an EM/REM unit should be designated as. It should match the baseline
         *          font-size for the html element on your webpage(s). If this is not passed in the configuration object, it
         *          will default to 16.
         *      lib: <string>|Array<number> - Describes a chosen prebuilt framework to implement in lieu of a custom array of breakpoints. It
         *          will check to ensure the existence and support for chosen framework or throw an error if it does not exist or
         *          is not readable. Otherwise, it will load the chosen framework and all associated parameters.
         *
         *      You may also choose to not pass an object at all. If this is the case, the software will continue with all default
         *          parameter values.
         *
         * @unit_test "tests/_initialize.js"
         * @param {Object} config - The configuration object
         * @returns {void}
         *
         * @private
         */
        this._initialize = function (config) {
            // If a configuration object is present as the parameter...
            if (!!config) {
                // Each of the _read* functions will fire, individually checking for object properties and assigning or defaulting as appropriate.
                _this._readLang(config);
                _this._readBuildCSS(config);
                _this._readBuildVars(config);
                _this._readRem(config);
                _this._readLib(config);
            }
            else {
                // If no configuration object is passed, default to Bootstrap 3...
                try {
                    _this.lib = require("./frameworks/bootstrap3");
                }
                catch (ex) {
                    _this._throwException(e.E2L002);
                }
            }
            // Now that the remSize is set, we can determine the size of 1px in EM/REM units (if default remSize (16px), this will be 0.0625).
            _this.$rpx = _this._pxToRem(1);
        };
        /**
         * @description
         *
         * @unit_test "tests/_readLib.js"
         * @param {Object} cfg - Configuration Object
         * @returns {void}
         *
         * @private
         */
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
        /**
         * @description
         *
         * @unit_test "tests/_readLang.js"
         * @param {Object} cfg - The configuration object.
         * @returns {boolean} - Returns true if the function completed successfully or throws an exception if it does not.
         *
         * @private
         */
        this._readLang = function (cfg) {
            // If the configuration object contains a property called "lang" and it has a value compatible with the software...
            if (cfg.hasOwnProperty("lang") && (_.contains(_this.languages, cfg["lang"].toLowerCase()))) {
                _this.lang = cfg["lang"];
                return true;
            }
            else if (cfg.hasOwnProperty("lang")) {
                _this._throwException(e.E2G001);
            }
        };
        /**
         * @description
         *
         * @unit_test "tests/_readRem.js"
         * @param {Object} cfg - The configuration object.
         * @returns {void}
         *
         * @private
         */
        this._readRem = function (cfg) {
            if (cfg.hasOwnProperty("rem") && cfg["rem"] !== false && typeof cfg["rem"] === "number") {
                _this.remSize = cfg["rem"];
            }
            else if (cfg.hasOwnProperty("rem") && cfg["rem"] !== false) {
                _this._throwException(e.E2G008);
            }
        };
        /**
         * @description
         *
         * @unit_test "tests/_readBuildCSS.js"
         * @param {Object} cfg - The configuration object.
         * @returns {void}
         *
         * @private
         */
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
        /**
         * @description
         *
         * @unit_test "tests/_readBuildVars.js"
         * @param {Object} cfg - The configuration object.
         * @returns {void}
         *
         * @private
         */
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
        /**
         * @description
         *
         * @unit_test "tests/_readCustomArray.js"
         * @param {Object} config - The configuration object.
         * @returns {void}
         *
         * @private
         */
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
        /**
         * @description
         *
         * @unit_test "tests/_validateArrayValue.js"
         * @param {string} item - The string value passed in a custom framework array.
         * @returns {boolean}
         *
         * @private
         */
        this._validateArrayValue = function (item) {
            if (typeof item === "string") {
                return /^[0-9]+(px|em|rem)$/.test(item.toLowerCase());
            }
            else {
                _this._throwException(e.E2G006);
            }
        };
        /**
         * @description
         *
         * @unit_test "tests/_parseCustomArray.js"
         * @param { Array<string>} lib - A custom framework array passed in lieu of a built-in framework.
         * @returns {void}
         *
         * @private
         */
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
        /**
         * @description
         *
         * @unit_test "tests/_pxToRem.js"
         * @param {number} pixels - The number of pixels to be converted to EM/REM units.
         * @returns {number}
         *
         * @private
         */
        this._pxToRem = function (pixels) {
            return pixels / _this.remSize;
        };
        /**
         * @description
         *
         * @unit_test "tests/_throwException.js"
         * @param {Object} e - The error object.
         * @param {[string]} exception - A caught exception detail from try/catch.
         * @returns {void}
         *
         * @private
         */
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
        /**
         * @description
         *
         * @unit_test "tests/_getBreakNames.js"
         * @param {number} count - The number of breakpoints in the currently selected framework.
         * @returns {Array<string>}
         *
         * @private
         */
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
        /**
         * @description
         *
         * @unit_test "tests/_generateRange.js"
         * @param {Array<number>} points - The breakpoints for the given framework.
         * @param {number} key - The current array key on which we are working.
         * @returns {string}
         *
         * @private
         */
        this._generateRange = function (points, key) {
            return _this.pfx + points[key] + "-range: (" + _this._pxToRem(_this.lib[key]) + ", " + _this._pxToRem(_this.lib[++key] - _this.$rpx) + ");\n";
        };
        this._isFirst = function (points, key) {
            if (points.constructor !== Array || typeof key !== "number") {
                _this._throwException(e.E2X001);
            }
            else {
                if (_.every(points, function (num) { return typeof num === "number"; })) {
                    _this._throwException(e.E2X001);
                }
                _this.queued += _this.pfx + points[key] + "-only: '" + _this.query + "screen} and (max-width: " + (_this.lib[0] - _this.$rpx) + "rem)';\n";
                _this.queued += "." + points[key] + "-only " + _this.braceL + "\n\tdisplay: none;\n" + _this.braceR + "\n\n";
            }
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
        /** PUBLIC FUNCTIONS ******************************************************************************************* **/
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
        /**
         * @description
         *
         * @unit_test "tests/setLanguage.js"
         * @param {string} lang - String representation of the chosen output language.
         *
         * @return {void}
         */
        this.setLanguage = function (lang) {
            if (_.contains(_this.languages, lang)) {
                _this.lang = lang;
            }
            else {
                _this._throwException(e.E1G109);
            }
        };
        /**
         * @description
         *
         * @unit_test "tests/getBreakpoints.js"
         * @returns {Array<number>}
         *
         * @public
         */
        this.getBreakpoints = function () {
            try {
                return _this.lib;
            }
            catch (ex) {
                _this._throwException(e.E1P003, ex);
            }
        };
        /**
         * @description
         *
         * @unit_test "tests/setBreakpoints.js"
         * @param {Object} config - The configuration object.
         * @returns {void}
         *
         * @publicter
         */
        this.setBreakpoints = function (config) {
            _this._readCustomArray(config);
        };
        /**
         * @description
         *
         * @unit_test "tests/getRemSize.js"
         * @returns {number}
         *
         * @public
         */
        this.getRemSize = function () {
            try {
                return _this.remSize;
            }
            catch (ex) {
                _this._throwException(e.E1P002, ex);
            }
        };
        /**
         * @description
         *
         * @unit_test "tests/setRemSize.js"
         * @param {number} rem
         * @returns {void}
         *
         * @public
         */
        this.setRemSize = function (rem) {
            if (typeof rem === "number") {
                _this.remSize = rem;
            }
            else {
                _this._throwException(e.E2G110);
            }
        };
        /**
         * @description
         *
         * @unit_test "tests/getDebugMode.js"
         * @returns {boolean}
         *
         * @public
         */
        this.getDebugMode = function () {
            try {
                return _this.debugMode;
            }
            catch (ex) {
                _this._throwException(e.E1P007, ex);
            }
        };
        /**
         * @description
         *
         * @unit_test "tests/setDebugMode.js"
         * @param {boolean} debugMode - Determines if debug mode is enabled or disabled.
         * @returns {void}
         *
         * @public
         */
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