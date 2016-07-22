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
    var framework,
        $rpx = .0625;
    var queued = "$screen: 'only screen' !default;\n\n@function lower-bound($range) {\n\n  @if length($range) <= 0 {\n    @return 0;\n  }\n\n  @return nth($range, 1);\n}\n\n@function upper-bound($range) {\n\n  @if length($range) < 2 {\n    @return 999999999999;\n  }\n\n  @return nth($range, 2);\n}\n\n";
    if(arguments.length === 0 || arguments.length === 1) {
        if((arguments.length === 1 && typeof arguments[0] === 'string' ) || (arguments.length === 1 && arguments[0].constructor === Array)) {
            try {
                if(typeof arguments[0] === 'string') {
                    framework = require('./frameworks/' + scss);
                } else if(arguments[0].constructor === Array) {
                    framework = arguments[0].sort();
                }
                buildLibrary(framework);
                console.dir(framework);
            } catch(ex) {
                throw new Error('Could not parse library: ' + scss + '. Does it exist? Error message: ' + ex);
            }
        } else {
            framework = require('./frameworks/bootstrap3');
            buildLibrary(framework);
        }
    } else {
        throw new Error('Too many arguments passed to EasyQuery. Expected 0 or 1, got ' + arguments.length);
    }

    fs.writeFile('./_easy-query.scss', queued, function(err) {
        if(err) {
            throw new Error('Could not write _easy-query.scss. Error message: ' + err);
        }
    });
    
    function generateRange(framework,key) {
        return "-range: (" + framework[key] + "rem, " + (framework[key + 1] - $rpx) + "rem);\n";
    }

    function buildLibrary(framework) {
        var $xs = "$xs", $sm = "$sm", $md = "$md", $lg = "$lg", $xl = "$xl", $xx = "$xx";
        switch(framework.length) {
            case 1: {
                queued +=
                    // Breakpoint Variables
                    $sm + "-only: '#{$screen} and (max-width: " + (framework[0] - $rpx) + "rem)';\n" +
                    $lg + "-only: '#{$screen} and (min-width: " + framework[0] + "rem)';\n" +

                    // Breakpoint Classes
                    '.' + $sm + "-only {\n@media #{" + $lg + "-only} {\ndisplay: none;\n}\n}" +
                    '.' + $lg + "-only {\n@media #{" + $sm + "-only} {\ndisplay: none;\n}\n}";
                break;
            } case 2: {
                queued +=
                    // Breakpoint Ranges
                    $md + generateRange(framework,0) +

                    // Breakpoint Variables
                    $sm + "-only: '#{$screen} and (max-width: " + (framework[0] - $rpx) + "rem)';\n" +
                    $md + "-only: '#{$screen} and (min-width: " + framework[0] + "rem) and (max-width: #{upper-bound(" + $md + "-range)})';\n" +
                    $lg + "-only: '#{$screen} and (min-width: " + framework[1] + "rem)';\n" +
                    $md + "-up: '#{$screen} and (min-width: " + framework[0] + "rem)';\n" +
                    $md + "-down: '#{$screen} and (max-width: #{upper-bound(" + $md + "-range)})';\n" +

                    // Breakpoint Classes
                    '.' + $sm + "-only {\n@media #{" + $md + "-up} {\ndisplay: none;\n}\n}" +
                    '.' + $md + "-only {\n@media #{" + $sm + "-only},\n@media #{" + $lg + "-only} {\ndisplay: none;\n}\n}" +
                    '.' + $lg + "-only {\n@media #{" + $md + "-down} {\ndisplay: none;\n}\n}" +
                    '.' + $md + "-up {\n@media #{" + $sm + "-only} {\ndisplay: none;\n}\n}" +
                    '.' + $md + "-down {\n@media #{" + $lg + "-only} {\ndisplay: none;\n}\n}";
                break;
            } case 3: {
                queued +=
                    // Breakpoint Ranges
                    $sm + generateRange(framework,0) +
                    $md + generateRange(framework,1) +

                    // Breakpoint Variables
                    $xs + "-only: '#{$screen} and (max-width: " + (framework[0] - $rpx) + "rem)';\n" +
                    $sm + "-only: '#{$screen} and (min-width: " + framework[0] + "rem) and (max-width: #{upper-bound(" + $sm + "-range)})';\n" +
                    $md + "-only: '#{$screen} and (min-width: " + framework[1] + "rem) and (max-width: #{upper-bound(" + $md + "-range)})';\n" +
                    $lg + "-only: '#{$screen} and (min-width: " + framework[2] + "rem)';\n" +
                    $sm + "-up: '#{$screen} and (min-width: " + framework[0] + "rem)';\n" +
                    $md + "-up: '#{$screen} and (min-width: " + framework[1] + "rem)';\n" +
                    $sm + "-down: '#{$screen} and (max-width: #{upper-bound(" + $sm + "-range)})';\n" +
                    $md + "-down: '#{$screen} and (max-width: #{upper-bound(" + $md + "-range)})';\n" +

                    // Breakpoint Classes
                    '.' + $xs + "-only {\n@media #{" + $sm + "-up} {\ndisplay: none;\n}\n}" +
                    '.' + $sm + "-only {\n@media #{" + $xs + "-only},\n@media #{" + $md + "-up} {\ndisplay: none;\n}\n}" +
                    '.' + $md + "-only {\n@media #{" + $sm + "-down},\n@media #{" + $lg + "-only} {\ndisplay: none;\n}\n}" +
                    '.' + $lg + "-only {\n@media #{" + $md + "-down} {\ndisplay: none;\n}\n}" +
                    '.' + $sm + "-up {\n@media #{" + $xs + "-only} {\ndisplay: none;\n}\n}" +
                    '.' + $md + "-up {\n@media #{" + $sm + "-down} {\ndisplay: none;\n}\n}" +
                    '.' + $sm + "-down {\n@media #{" + $md + "-up} {\ndisplay: none;\n}\n}" +
                    '.' + $md + "-down {\n@media #{" + $lg + "-only} {\ndisplay: none;\n}\n}";
                break;
            } case 4: {
                queued +=
                    // Breakpoint Ranges
                    $sm + generateRange(framework,0)+
                    $md + generateRange(framework,1) +
                    $lg + generateRange(framework,2) +

                    // Breakpoint Variables
                    $xs + "-only: '#{$screen} and (max-width: " + (framework[0] - $rpx) + "rem)';\n" +
                    $sm + "-only: '#{$screen} and (min-width: " + framework[0] + "rem) and (max-width: #{upper-bound(" + $sm + "-range)})';\n" +
                    $md + "-only: '#{$screen} and (min-width: " + framework[1] + "rem) and (max-width: #{upper-bound(" + $md + "-range)})';\n" +
                    $lg + "-only: '#{$screen} and (min-width: " + framework[2] + "rem) and (max-width: #{upper-bound(" + $lg + "-range)})';\n" +
                    $xl + "-only: '#{$screen} and (min-width: " + framework[3] + "rem)';\n" +
                    $sm + "-up: '#{$screen} and (min-width: " + framework[0] + "rem)';\n" +
                    $md + "-up: '#{$screen} and (min-width: " + framework[1] + "rem)';\n" +
                    $lg + "-up: '#{$screen} and (min-width: " + framework[2] + "rem)';\n" +
                    $sm + "-down: '#{$screen} and (max-width: #{upper-bound(" + $sm + "-range)})';\n" +
                    $md + "-down: '#{$screen} and (max-width: #{upper-bound(" + $md + "-range)})';\n" +
                    $lg + "-down: '#{$screen} and (max-width: #{upper-bound(" + $lg + "-range)})';\n" +

                    // Breakpoint Classes
                    '.' + $xs + "-only {\n@media #{" + $sm + "-up} {\ndisplay: none;\n}\n}" +
                    '.' + $sm + "-only {\n@media #{" + $xs + "-only},\n@media #{" + $md + "-up} {\ndisplay: none;\n}\n}" +
                    '.' + $md + "-only {\n@media #{" + $sm + "-down},\n@media #{" + $lg + "-up} {\ndisplay: none;\n}\n}" +
                    '.' + $lg + "-only {\n@media #{" + $md + "-down},\n@media #{" + $xl + "-only} {\ndisplay: none;\n}\n}" +
                    '.' + $xl + "-only {\n@media #{" + $lg + "-down} {\ndisplay: none;\n}\n}" +
                    '.' + $sm + "-up {\n@media #{" + $xs + "-only} {\ndisplay: none;\n}\n}" +
                    '.' + $md + "-up {\n@media #{" + $sm + "-down} {\ndisplay: none;\n}\n}" +
                    '.' + $lg + "-up {\n@media #{" + $md + "-down} {\ndisplay: none;\n}\n}" +
                    '.' + $sm + "-down {\n@media #{" + $md + "-up} {\ndisplay: none;\n}\n}" +
                    '.' + $md + "-down {\n@media #{" + $lg + "-only} {\ndisplay: none;\n}\n}" +
                    '.' + $lg + "-down {\n@media #{" + $xl + "-only} {\ndisplay: none;\n}\n}";
                break;
            } case 5: {
                queued +=
                    // Breakpoint Ranges
                    $sm + generateRange(framework,0) +
                    $md + generateRange(framework,1) +
                    $lg + generateRange(framework,2) +
                    $xl + generateRange(framework,3) +

                    // Breakpoint Variables
                    $xs + "-only: '#{$screen} and (max-width: " + (framework[0] - $rpx) + "rem)';\n" +
                    $sm + "-only: '#{$screen} and (min-width: " + framework[0] + "rem) and (max-width: #{upper-bound(" + $sm + "-range)})';\n" +
                    $md + "-only: '#{$screen} and (min-width: " + framework[1] + "rem) and (max-width: #{upper-bound(" + $md + "-range)})';\n" +
                    $lg + "-only: '#{$screen} and (min-width: " + framework[2] + "rem) and (max-width: #{upper-bound(" + $lg + "-range)})';\n" +
                    $xl + "-only: '#{$screen} and (min-width: " + framework[3] + "rem) and (max-width: #{upper-bound(" + $xl + "-range)})';\n" +
                    $xx + "-only: '#{$screen} and (min-width: " + framework[4] + "rem);\n" +
                    $sm + "-up: '#{$screen} and (min-width: " + framework[3] + "rem)';\n" +
                    $md + "-up: '#{$screen} and (min-width: " + framework[3] + "rem)';\n" +
                    $lg + "-up: '#{$screen} and (min-width: " + framework[2] + "rem)';\n" +
                    $xl + "-up: '#{$screen} and (min-width: " + framework[3] + "rem)';\n" +
                    $sm + "-down: '#{$screen} and (max-width: #{upper-bound(" + $sm + "-range)})';\n" +
                    $md + "-down: '#{$screen} and (max-width: #{upper-bound(" + $md + "-range)})';\n" +
                    $lg + "-down: '#{$screen} and (max-width: #{upper-bound(" + $lg + "-range)})';\n" +
                    $xl + "-down: '#{$screen} and (max-width: #{upper-bound(" + $xl + "-range)})';\n" +

                    // Breakpoint Classes
                    '.' + $xs + "-only {\n@media #{" + $sm + "-up} {\ndisplay: none;\n}\n}" +
                    '.' + $sm + "-only {\n@media #{" + $xs + "-only},\n@media #{" + $md + "-up} {\ndisplay: none;\n}\n}" +
                    '.' + $md + "-only {\n@media #{" + $sm + "-down},\n@media #{" + $lg + "-up} {\ndisplay: none;\n}\n}" +
                    '.' + $lg + "-only {\n@media #{" + $md + "-down},\n@media #{" + $xl + "-up} {\ndisplay: none;\n}\n}" +
                    '.' + $xl + "-only {\n@media #{" + $lg + "-down},\n@media #{" + $xx + "-only} {\ndisplay: none;\n}\n}" +
                    '.' + $xx + "-only {\n@media #{" + $xl + "-down} {\ndisplay: none;\n}\n}" +
                    '.' + $sm + "-up {\n@media #{" + $xs + "-only} {\ndisplay: none;\n}\n}" +
                    '.' + $md + "-up {\n@media #{" + $sm + "-down} {\ndisplay: none;\n}\n}" +
                    '.' + $lg + "-up {\n@media #{" + $md + "-down} {\ndisplay: none;\n}\n}" +
                    '.' + $xl + "-up {\n@media #{" + $lg + "-down} {\ndisplay: none;\n}\n}" +
                    '.' + $sm + "-down {\n@media #{" + $md + "-up} {\ndisplay: none;\n}\n}" +
                    '.' + $md + "-down {\n@media #{" + $lg + "-only} {\ndisplay: none;\n}\n}" +
                    '.' + $lg + "-down {\n@media #{" + $xl + "-only} {\ndisplay: none;\n}\n}" +
                    '.' + $xl + "-down {\n@media #{" + $xx + "-only} {\ndisplay: none;\n}\n}";
                break;
            }
        }
    }
};