/// <reference path="../typings/index.d.ts" />
let fs = require("fs");
let _ = require("underscore");
let q = require("q");
let e = require("./errors.json")[0];

class EasyQuery {

    /** MEMBERS **************************************************************************************************** **/

    private $rpx: number;
    private queued: string = "$screen: 'only screen' !default;\n\n@function lower-bound($range) {\n\n\t@if length($range) <= 0 {\n\t\t@return 0;\n\t}\n\n\t@return nth($range, 1);\n}\n\n@function upper-bound($range) {\n\n\t@if length($range) < 2 {\n\t\t@return 999999999999;\n\t}\n\n\t@return nth($range, 2);\n\n";
    private lib: Array<number>;
    private lang: string;
    private buildCSS: boolean;
    private builtCSS: string;
    private buildVars: boolean;
    private builtVars: string;
    private remSize: number;
    private config: any;
    private debugMode: boolean;
    private languages: Array<string> = ["sass", "scss", "less"];
    private pfx: string;
    private braceL: string;
    private braceR: string;
    private query: string;

    constructor(obj: string) {
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
    private _initialize = (config) => {
        // If a configuration object is present as the parameter...
        if (!!config) {
            // Each of the _read* functions will fire, individually checking for object properties and assigning or defaulting as appropriate.
            this._readLang(config);
            this._readBuildCSS(config);
            this._readBuildVars(config);
            this._readRem(config);
            this._readLib(config);
        } else {
            // If no configuration object is passed, default to Bootstrap 3...
            try {
                this.lib = require("./frameworks/bootstrap3");
            } catch (ex) {
                this._throwException(e.E2L002);
            }
        }
        // Now that the remSize is set, we can determine the size of 1px in EM/REM units (if default remSize (16px), this will be 0.0625).
        this.$rpx = this._pxToRem(1);
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
    private _readLib = (cfg: Object): void => {
        if (cfg.hasOwnProperty("lib") && !!cfg["lib"] === true && typeof cfg === "object") {
            let library = cfg["lib"];
            if (library.constructor === Array) {
                this._readCustomArray(library);
            } else if (typeof library === "string") {
                try {
                    let framework = library.toString();
                    this.lib = require("./frameworks/" + framework);
                } catch (ex) {
                    this._throwException(e.E2L001);
                }
            }
        } else if (typeof cfg === "string") {
            try {
                let framework = cfg.toString();
                this.lib = require("./frameworks/" + framework);
            } catch (ex) {
                this._throwException(e.E2L001);
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
    private _readLang = (cfg: Object): boolean => {
        // If the configuration object contains a property called "lang" and it has a value compatible with the software...
        if (cfg.hasOwnProperty("lang") && (_.contains(this.languages, cfg["lang"].toLowerCase()))) {
            this.lang = cfg["lang"];
            return true;
        // Else if the configuration contains the property caled "lang" but does not have a value compatible with the software...
        } else if (cfg.hasOwnProperty("lang")) {
            this._throwException(e.E2G001);
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
    private _readRem = (cfg: Object): void => {
        if (cfg.hasOwnProperty("rem") && cfg["rem"] !== false && typeof cfg["rem"] === "number") {
            this.remSize = cfg["rem"];
        } else if (cfg.hasOwnProperty("rem") && cfg["rem"] !== false) {
           this._throwException(e.E2G008);
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
    private _readBuildCSS = (cfg: Object): void => {
        if (cfg.hasOwnProperty("buildCSS") && cfg["buildCSS"] === true) {
            this.buildVars = true;
        } else if (cfg.hasOwnProperty("buildCSS") && cfg["buildCSS"] !== false) {
            this._throwException(e.E2G002);
        } else {
            this.buildVars = false;
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
    private _readBuildVars = (cfg: Object): void => {
        if (cfg.hasOwnProperty("buildVars") && cfg["buildVars"] === true) {
            this.buildVars = true;
        } else if (cfg.hasOwnProperty("buildVars") && cfg["buildVars"] !== false) {
            this._throwException(e.E2G003);
        } else {
            this.buildVars = false;
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
    private _readCustomArray = (config: any) => {
        if (config.constructor === Array) {
            let strings = _.every(config, (item) => {
                this._validateArrayValue(item);
            });
            if (strings === false) {
                this._throwException(e.E2G004);
            } else {
                this._parseCustomArray(this.config.lib);
            }
        } else if (typeof config === "string") {
            this.lib = config["lib"];
        } else {
            this._throwException(e.E2G005);
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
    private _validateArrayValue = (item: string): boolean => {
        if (typeof item === "string") {
            return /^[0-9]+(px|em|rem)$/.test(item.toLowerCase());
        } else {
            this._throwException(e.E2G006);
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
    private _parseCustomArray = (lib) => {
        _.each(lib, (element, index) => {
            let parsedItem = element.match(/^([-.\d]+(?:.\d+)?)(.*)$/);
            let value = parsedItem[1].trim();
            let unit = parsedItem[2].trim();

            if (_.contains("px", unit)) {
                value = this._pxToRem(value);
            }

            this.lib[index] = value;
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
    private _pxToRem = (pixels: number): number => {
        return pixels / this.remSize;
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
    private _throwException = (e: Object, exception?: string): void => {
        if (!!e && typeof e === "object") {
            if (e["type"] === "Error") {
                let excpt = "Error Details: " + exception ? exception : "";
                throw new Error("easy-query: [" + e["code"] + "] " + e["title"] + ": " + e["message"] + excpt);
            }

            if (!this.debugMode) {
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
    private _getBreakNames = (count: number): Array<string> => {
        if (typeof count === "number" && count >= 1 && count <= 5) {
            switch (count) {
                case 1: return ["sm", "lg"];
                case 2: return ["sm", "md", "lg"];
                case 3: return ["xs", "sm", "md", "lg"];
                case 4: return ["xs", "sm", "md", "lg", "xl"];
                case 5: return ["xs", "sm", "md", "lg", "xl", "xx"];
            }
        } else {
            this._throwException(count < 1 || count > 5 ? "E2G007" : "E2G008");
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
    private _generateRange = (points: Array<number>, key: number): string => {
        return this.pfx + points[key] + "-range: (" + this._pxToRem(this.lib[key]) + ", " + this._pxToRem(this.lib[++key] - this.$rpx) + ");\n";
    };

    private _isFirst = (points, key): string => {
        if (points.constructor !== Array || typeof key !== "number") {
            this._throwException(e.E2X001);
        } else {
            if (_.every(points, function(num) { return typeof num === "number"; })) {
                this._throwException(e.E2X001);
            }
            this.queued += this.pfx + points[key] + "-only: '" + this.query + "screen} and (max-width: " + (this.lib[0] - this.$rpx) + "rem)';\n";
            this.queued += "." + points[key] + "-only " + this.braceL + "\n\tdisplay: none;\n" + this.braceR + "\n\n";
        }

        return this.queued;
    };

    private _isInner = (points, key): string => {
        let pointAbove = points[key + 1];
        let pointBelow = points[key - 1];
        let pointCurrent = points[key];
        let bpBelow = this.lib[key - 1];
        let bpCurrent = this.lib[key];
        this.queued += this._generateRange(points, key);
        this.queued += this.pfx + pointCurrent + "-up: '#{$screen} and (min-width: " + bpBelow + "rem);";
        this.queued += this.pfx + pointCurrent + "-down: '" + this.query + "screen} and (max-width: " + (bpCurrent - this.$rpx) + "rem);";
        this.queued += this.pfx + pointCurrent + "-only: '" + this.query + "screen} and (min-width: " + bpBelow + "rem) and (max-width: " + (bpCurrent - this.$rpx) + "rem);";
        this.queued += "." + pointCurrent + "-up " + this.braceL + "\n\t@media " + this.query + pointBelow + "-" + ((pointCurrent === "sm") ? "only" : "down") + this.braceR + " " + this.braceL + "\n\t\tdisplay: none;\n\t" + this.braceR + "\n" + this.braceR + "\n\n;";
        this.queued += "." + pointCurrent + "-down " + this.braceL + "\n\t@media " + this.query + pointAbove + "-" + ((this.lib.length - 1 === key) ? "only" : "up") + this.braceR + " " + this.braceL + "\n\t\tdisplay: none;\n}\n\t}\n\n;";
        this.queued += "." + pointCurrent + "-only " + this.braceL + "\n\t@media " + this.query + pointBelow + "-" + ((pointCurrent === "sm") ? "only" : "down") + this.braceR + " " + this.braceL + "\n\t\tdisplay: none;\n\t" + this.braceR + "\n\n\t@media " + this.query + pointAbove + "-" + ((this.lib.length - 1 === key) ? "only" : "up") + this.braceR + " " + this.braceL + "\n\t\tdisplay: none;\n" + this.braceR + "\n\t" + this.braceR + "\n\n";
        return this.queued;
    };

    private _isLast = (points, key): string => {
        this.queued += this.pfx + points[key] + "-only: '" + this.query + "screen} and (min-width: " + this.lib[key] + "rem);\n";
        this.queued += "." + points[key] + "-only " + this.braceL + "\n\t@media" + this.query + points[0] + "-" + ((this.lib.length === 1) ? "only" : "down") + this.braceR + " " + this.braceL + "\n\t\tdisplay: none; \n" + this.braceR + "\n\t" + this.braceR + "\n\n";
        return this.queued;
    }; 

    private _build = (path: string, que: string): void => {
        if (this.lib.length) {
            let count = this.lib.length;
            let points = this._getBreakNames(count);
            for (let x = 0; x < count; x++) {
                que += (x === 0) ? this._isFirst(points, x) : (x === count - 1) ? this._isLast(points, x) : this._isInner(points, x);
            } 
            return this._writeFile(path, que).then(this._handleWriteFulfill, this._handleWriteError);
        } else {
            this._throwException(e.E2I001);
        }
    };

    private _writeFile = (path: string, que: string) => {
        let deferred = q.defer();
        let language = this.lang;
        fs.writeFile(path + "/_easy-query.scss", que, function (error) {
            if (error) {
                deferred.reject("Could not write to file. Error Message: " + error);
            } else {
                let returnPath = path + ((_.contains(["sass", "scss"], language)) ? "_" : "") + "easy-query." + language;
                deferred.resolve(returnPath);
            }
        });
        return deferred.promise;
    };

    private _handleWriteFulfill = (returnPath: string): string => {
        return returnPath;
    };

    private _handleWriteError = (err: string): void => {
        this._throwException(e.E2F001, err);
    };

    /** PUBLIC FUNCTIONS ******************************************************************************************* **/

    public write = (path: string, cb: Function): void => {
        let returnPath = this._build(path, this.queued);
        if (!!cb) {
            cb(returnPath);
        }
    };

    public getCSS = (): string => {
        try {
            if (this.buildCSS) {
                return this.builtCSS;
            } else {
                this._throwException(e.E0G111);
            }
        } catch (ex) {
            this._throwException(e.E1P005, ex);
        }
    };

    public getVariables = (): string => {
        try {
            if (this.buildVars === true) {
                if (this.builtVars) {
                    return this.builtVars;
                } else {
                    this._throwException(e.E2G213);
                }
            } else {
                this._throwException(e.E0G112);
            }
        } catch (ex) {
            this._throwException(e.E1P006, ex);
        }
    };

    public getLanguage = (): string => {
        try {
            return this.lang;
        } catch (ex) {
            this._throwException(e.E1P001, ex);
        }
    };

    public getLanguages = (): Array<string> => {
        try {
            return this.languages;
        } catch (ex) {
            this._throwException(e.E1P004, ex)
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
    public setLanguage = (lang: string): void => {
        if (_.contains(this.languages, lang)) {
            this.lang = lang;
        } else {
            this._throwException(e.E1G109);
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
    public getBreakpoints = (): Array<number> => {
        try {
            return this.lib;
        } catch (ex) {
            this._throwException(e.E1P003, ex);
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
    public setBreakpoints = (config: any): void => {
        this._readCustomArray(config);
    };

    /**
     * @description
     *
     * @unit_test "tests/getRemSize.js"
     * @returns {number}
     *
     * @public
     */
    public getRemSize = (): number => {
        try {
            return this.remSize;
        } catch (ex) {
            this._throwException(e.E1P002, ex);
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
    public setRemSize = (rem: number): void => {
        if (typeof rem === "number") {
            this.remSize = rem;
        } else {
            this._throwException(e.E2G110);
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
    public getDebugMode = (): boolean => {
        try {
            return this.debugMode;
        } catch (ex) {
            this._throwException(e.E1P007, ex);
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
    public setDebugMode = (debugMode: boolean): void => {
        this.debugMode = debugMode
    };
}

module.exports = (object) => {
    return new EasyQuery(object);
};