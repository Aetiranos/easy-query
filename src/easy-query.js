"use strict";
var fs = require("fs");

/**
 * EasyQuery()
 *
 * Please refer to the README.md file for package documentation and resources.
 */
module.exports = function EasyQuery(scss) {
    var $rpx = .0625;
    var framework;
    var queued = "$screen: 'only screen' !default;\n\n@function lower-bound($range) {\n\n\t@if length($range) <= 0 {\n\t\t@return 0;\n\t}\n\n\t@return nth($range, 1);\n}\n\n@function upper-bound($range) {\n\n\t@if length($range) < 2 {\n\t\t@return 999999999999;\n\t}\n\n\t@return nth($range, 2);\n\n";

    // Optional configuration for instance with default values.
    function init(confObj) {
        var lang = confObj.lang || "scss";
        var lib = confObj.lib || "bootstrap3";
        var rem = confObj.lib || 16;
        
        if(typeof lib === "string") {
            
        } else if(lib.constructor === Array) {
            
        } else {
            throw new EasyError()
        }
    }

    // Utility function to convert px to REM.
    function toRem(px) {
        return (px / 16) + "rem";
    }

    // Generator for breakpoint ranges.
    function generateRange(points, key) {
        return "$" + points[key] + "-range: (" + toRem(framework[key]) + ", " + toRem(framework[++key] - $rpx) + ");\n";
    }

    // Retrieve the proper breakpoint terms based on number of breakpoints.
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
                EasyError('The number of breakpoints supplied were out of bounds. Supply only 1 to 5 breakpoints. ');
            } else {
                EasyError('The supplied parameter was not a number. ');
            }
        }
    }

    // Custom error wrapper to prepend "easy-query:" .
    function EasyError(errorMessage) {
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
        queued += "." + pointCurrent + "-down {\n\t@media #{$" + pointAbove + "-" + ((framework.length - 1 === key) ? "only" : "up") + "} {\n\t\tdisplay: none;\n}\n\t}\n\n;";
        queued += "." + pointCurrent + "-only {\n\t@media #{$" + pointBelow + "-" + ((pointCurrent === "sm") ? "only" : "down") + "} {\n\t\tdisplay: none;\n\t}\n\n\t@media #{$" + pointAbove + "-" + ((framework.length - 1 === key) ? "only" : "up") + "} {\n\t\tdisplay: none;\n}\n\t}\n\n";
    }

    // If this is the very last index, then we know that everything below it should be hidden.
    function isLast(points, key) {
        queued += "$" + points[key] + "-only: '#{$screen} and (min-width: " + framework[key] + "rem);\n";
        queued += "." + points[key] + "-only {\n\t@media#{$" + points[0] + "-" + ((framework.length === 1) ? "only" : "down") + "} {\n\t\tdisplay: none; \n}\n\t}\n\n";
    }

    // Use the build functions to generate our SCSS code.
    function buildScss(framework) {
        if(framework.length) {
            var count = framework.length;
            var points = getBreakNames(count);

            for(var x = 0; x < count; x++)
                (x === 0) ? isFirst(points,x) : (x === count - 1) ? isLast(points,x) : isInner(points,x);

        } else EasyError('No breakpoints were supplied to the build function. ');
    }

    function writeFile() {
        fs.writeFile('./_easy-query.scss', queued, function (err) {
            if (err) {
                throw new EasyError('Could not write to ' + __dirname + '/_easy-query.scss. Error message: ' + err);
            }
        });
    }
    
    function write() {
        
    }
};