"use strict";
var fs = require("fs");

/**
 *
 * @param {string|Array<int>} scss - Either a valid string representing the name of framework's breakpoints you'd wish
 *  to use or a custom array of breakpoints (in EM/REM units). Must follow the structure shown below to be valid (given values are for
 *  example only). The breakpoints will be named according to how many breakpoints are being used in the given framework
 *  or array. Please consult the README.md file to reference this table of breakpoint variable names.
 *
 *  Note: At the present time, only up to 5 breakpoints are supported. If more are necessary for your project, submit
 *    a feature request.
 *
 *  If you pass the array [30, 40, 50, 60]: this will generate your breakpoint SCSS code that will resemble:
 *
 *   // (0.0625 === 1px @ 16px HTML)
 *   $break-1: (null, (bp1 - .0625);
 *   $break-2: (bp1, (bp2 - .0625);
 *   $break-3: (bp2, (bp3 - .0625);
 *   $break-4: (bp3, null);
 *
 * @returns {string}
 */
module.exports = function EasyQuery(scss) {
    const $rpx = .0625;
    var framework;
    var queued = "$screen: 'only screen' !default;\n\n@function lower-bound($range) {\n\n\t@if length($range) <= 0 {\n\t\t@return 0;\n\t}\n\n\t@return nth($range, 1);\n}\n\n@function upper-bound($range) {\n\n\t@if length($range) < 2 {\n\t\t@return 999999999999;\n\t}\n\n\t@return nth($range, 2);\n\n";
    
    function toRem(px) {
        return (px / 16) + "rem";
    }

    function generateRange(points, key) {
        return "$" + points[key] + "-range: (" + toRem(framework[key]) + ", " + toRem(framework[++key] - $rpx) + ");\n";
    }

    function getBreakNames(count) {
        if(typeof count === "number" && count >= 1 && count <= 5) {
            switch (count) {
                case 1:
                    return ['sm', 'lg'];
                    break;
                case 2:
                    return ['sm', 'md', 'lg'];
                    break;
                case 3:
                    return ['xs', 'sm', 'md', 'lg'];
                    break;
                case 4:
                    return ['xs', 'sm', 'md', 'lg', 'xl'];
                    break;
                case 5:
                    return ['xs', 'sm', 'md', 'lg', 'xl', 'xx'];
                    break;
            }
        } else {
            if(count < 1 || count > 5) {
                easyError('The number of breakpoints supplied were out of bounds. Supply only 1 to 5 breakpoints. ');
            } else {
                easyError('The supplied parameter was not a number. ');
            }
        }
    }

    function easyError(errorMessage) {
        throw new Error('easy-query: ' + errorMessage);
    }

    // If this is the very first index, then we know that everything above it should be hidden.
    function isFirst(points, key) {
        queued += "$" + points[key] + "-only: '#{$screen} and (max-width: " + (framework[0] - $rpx) + "rem)';\n";
        queued += "." + points[key] + "-only { \n\t\tdisplay: none; \n\t}\n}\n\n";
    }

    // If this isn't the first or last breakpoint variable in points[]...
    function isInner(points,key) {
        var pointAbove = points[key + 1];
        var pointBelow = points[key - 1];
        var pointCurrent = points[key];
        //var bpAbove = framework[key + 1];
        var bpBelow = framework[key - 1];
        var bpCurrent = framework[key];

        // Generate the Range.
        queued += generateRange(points, x);

        // Generate the SCSS variables.
        queued += "$" + pointCurrent + "-up: '#{$screen} and (min-width: " + bpBelow + "rem);";
        queued += "$" + pointCurrent + "-down: '#{$screen} and (max-width: " + (bpCurrent - $rpx) + "rem);";
        queued += "$" + pointCurrent + "-only: '#{$screen} and (min-width: " + bpBelow + "rem) and (max-width: " + (bpCurrent - $rpx) + "rem);";

        // Generate the CSS classes.
        queued += "." + pointCurrent + "-up { \n\t@media #{$" + pointBelow + "-" + ((pointCurrent === "sm") ? "only" : "down") + "} {\n\t\tdisplay: none;\n\t}\n}\n\n;";
        queued += "." + pointCurrent + "-down {\n\t@media #{$" + pointAbove + "-" + ((--framework.length === key) ? "only" : "up") + "} {\n\t\tdisplay: none;\n}\n\t}\n\n;";
        queued += "." + pointCurrent + "-only {\n\t@media #{$" + pointBelow + "-" + ((pointCurrent === "sm") ? "only" : "down") + "} {\n\t\tdisplay: none;\n\t}\n\n\t@media #{$" + pointAbove + "-" + ((--framework.length === key) ? "only" : "up") + "} {\n\t\tdisplay: none;\n}\n\t}\n\n";
    }

    // If this is the very last index, then we know that everything below it should be hidden.
    function isLast(points, key) {
        queued += "$" + points[key] + "-only: '#{$screen} and (min-width: " + framework[key] + "rem);\n";
        queued += "." + points[key] + "-only {\n\t@media#{$" + points[0] + "-" + ((framework.length === 1) ? "only" : "down") + "} {\n\t\tdisplay: none; \n}\n\t}\n\n";
    }

    function buildScss(framework) {
        if(framework.length) {
            var count = framework.length;
            var points = getBreakNames(count);

            for(var x = 0; x < count; x++) {
                if(x === 0) {
                    buildFns.isFirst(points,x);
                } else if(x === --count) {
                    buildFns.isLast(points,x);
                } else {
                    buildFns.isInner(points,x);
                }
            }

        } else {
            easyError('No breakpoints were supplied to buildScss.');
        }
    }


    if (arguments.length === 0 || arguments.length === 1) {
        if ((arguments.length === 1 && typeof arguments[0] === 'string' ) || (arguments.length === 1 && arguments[0].constructor === Array)) {
            try {
                if (typeof arguments[0] === 'string') {
                    framework = require('./frameworks/' + scss);
                } else if (arguments[0].constructor === Array) {
                    framework = arguments[0].sort();
                }
                buildLibrary(framework);
            } catch (ex) {
                throw new Error('Could not parse library: ' + scss + '. Does it exist? Error message: ' + ex);
            }
        } else {
            framework = require("./frameworks/bootstrap3");
            buildLibrary(framework);
        }
    } else {
        throw new Error('Too many arguments passed to EasyQuery. Expected 0 or 1, got ' + arguments.length);
    }

    fs.writeFile('./_easy-query.scss', queued, function (err) {
        if (err) throw new Error('Could not write _easy-query.scss. Error message: ' + err);
    });
};