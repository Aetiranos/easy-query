"use strict";
var fs = require("fs");

/**
 *
 * @param scss - Either a valid string representing the name of framework's breakpoints you'd wish to use or a custom array of
 *                 breakpoints. Must follow the structure shown below to be valid (given values are for example only).
 *                 The breakpoints will be named numerically so that one could have any number of breakpoints without running out of
 *                 size words (small, medium, etc). And so you wont be left with an ugly xxxxxxxxxl-breakpoint if you happened to go
 *                 that not-so-recommended route.
 *
 *                 ['bp1-px','bp2-px','bp3-px']
 *
 *                 This will generate your breakpoint SCSS code that will resemble:
 *
 *                 $break-1: (null, calc(bp1 - 1px);
 *                 $break-2: (bp1, calc(bp2 - 1px);
 *                 $break-3: (bp2, calc(bp3 - 1px);
 *                 $break-4: (bp3, null);
 *
 * @returns {string}
 */
module.exports = function EasyQuery(scss) {
    var framework;
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
            throw new Error('Could not write _easy-query.scss. Error message: ' + ex);
        }
    });
    
    function generateRange(framework,key) {
        return "-range: (" + framework[key] + "rem, calc(" + framework[key + 1] + " - 1px));\n";
    }

    function buildLibrary(framework) {
        var $xs = "$xs", $sm = "$sm", $md = "$md", $lg = "$lg", $xl = "$xl", $xx = "$xx";
        switch(framework.length) {
            case 1: {
                queued +=
                    $sm + "-only: '#{$screen} and (max-width: calc(" + framework[0] + "rem - 1px))';\n" +
                    $lg + "-only: '#{$screen} and (min-width: " + framework[0] + "rem)';";
                break;
            }
            case 2: {
                queued +=
                    $md + generateRange(framework,0) +

                    $sm + "-only: '#{$screen} and (max-width: calc(" + framework[0] + "rem - 1px))';\n" +

                    $md + "-only: '#{$screen} and (min-width: " + framework[0] + "rem) and (max-width: #{upper-bound(" + $md + "-range)})';\n" +
                    $md + "-up: '#{$screen} and (min-width: " + framework[0] + "rem)';\n" +
                    $md + "-down: '#{$screen} and (max-width: #{upper-bound(" + $md + "-range)})';\n" +

                    $lg + "-only: '#{$screen} and (min-width: " + framework[1] + "rem)';\n";
                break;
            }
            case 3: {
                queued +=
                    $sm + generateRange(framework,0) +
                    $md + generateRange(framework,1) +

                    $xs + "-only: '#{$screen} and (max-width: calc(" + framework[0] + "rem - 1px))';\n" +

                    $sm + "-only: '#{$screen} and (min-width: " + framework[0] + "rem) and (max-width: #{upper-bound(" + $sm + "-range)})';\n" +
                    $sm + "-up: '#{$screen} and (min-width: " + framework[0] + "rem)';\n" +
                    $sm + "-down: '#{$screen} and (max-width: #{upper-bound(" + $sm + "-range)})';\n" +

                    $md + "-only: '#{$screen} and (min-width: " + framework[1] + "rem) and (max-width: #{upper-bound(" + $md + "-range)})';\n" +
                    $md + "-up: '#{$screen} and (min-width: " + framework[1] + "rem)';\n" +
                    $md + "-down: '#{$screen} and (max-width: #{upper-bound(" + $md + "-range)})';\n" +

                    $lg + "-only: '#{$screen} and (min-width: " + framework[2] + "rem)';\n";
                break;
            }
            case 4: {
                queued +=
                    $sm + generateRange(framework,0)+
                    $md + generateRange(framework,1) +
                    $lg + generateRange(framework,2) +

                    $xs + "-only: '#{$screen} and (max-width: calc(" + framework[0] + "rem - 1px))';\n" +

                    $sm + "-only: '#{$screen} and (min-width: " + framework[0] + "rem) and (max-width: #{upper-bound(" + $sm + "-range)})';\n" +
                    $sm + "-up: '#{$screen} and (min-width: " + framework[0] + "rem)';\n" +
                    $sm + "-down: '#{$screen} and (max-width: #{upper-bound(" + $sm + "-range)})';\n" +

                    $md + "-only: '#{$screen} and (min-width: " + framework[1] + "rem) and (max-width: #{upper-bound(" + $md + "-range)})';\n" +
                    $md + "-up: '#{$screen} and (min-width: " + framework[1] + "rem)';\n" +
                    $md + "-down: '#{$screen} and (max-width: #{upper-bound(" + $md + "-range)})';\n" +

                    $lg + "-only: '#{$screen} and (min-width: " + framework[2] + "rem) and (max-width: #{upper-bound(" + $lg + "-range)})';\n" +
                    $lg + "-up: '#{$screen} and (min-width: " + framework[2] + "rem)';\n" +
                    $lg + "-down: '#{$screen} and (max-width: #{upper-bound(" + $lg + "-range)})';\n" +

                    $xl + "-only: '#{$screen} and (min-width: " + framework[3] + "rem)';\n";

                break;
            }
            case 5: {
                queued +=
                    $sm + generateRange(framework,0) +
                    $md + generateRange(framework,1) +
                    $lg + generateRange(framework,2) +
                    $xl + generateRange(framework,3) +

                    $xs + "-only: '#{$screen} and (max-width: calc(" + framework[0] + "rem - 1px)';\n" +

                    $sm + "-only: '#{$screen} and (min-width: " + framework[0] + "rem) and (max-width: #{upper-bound(" + $sm + "-range)})';\n" +
                    $sm + "-up: '#{$screen} and (min-width: " + framework[3] + "rem)';\n" +
                    $sm + "-down: '#{$screen} and (max-width: #{upper-bound(" + $sm + "-range)})';\n" +

                    $md + "-only: '#{$screen} and (min-width: " + framework[1] + "rem) and (max-width: #{upper-bound(" + $md + "-range)})';\n" +
                    $md + "-up: '#{$screen} and (min-width: " + framework[3] + "rem)';\n" +
                    $md + "-down: '#{$screen} and (max-width: #{upper-bound(" + $md + "-range)})';\n" +

                    $lg + "-only: '#{$screen} and (min-width: " + framework[2] + "rem) and (max-width: #{upper-bound(" + $lg + "-range)})';\n" +
                    $lg + "-up: '#{$screen} and (min-width: " + framework[2] + "rem)';\n" +
                    $lg + "-down: '#{$screen} and (max-width: #{upper-bound(" + $lg + "-range)})';\n" +

                    $xl + "-only: '#{$screen} and (min-width: " + framework[3] + "rem) and (max-width: #{upper-bound(" + $xl + "-range)})';\n" +
                    $xl + "-up: '#{$screen} and (min-width: " + framework[3] + "rem)';\n" +
                    $xl + "-down: '#{$screen} and (max-width: #{upper-bound(" + $xl + "-range)})';\n" +

                    $xx + "-only: '#{$screen} and (min-width: " + framework[4] + "rem);\n";
                break;
            }
        }
    }
};