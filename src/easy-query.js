"use strict";
var fs = require("fs");

/**
 *
 * @param scss - Either a valid string representing the name of framework's breakpoints you'd wish to use or a custom array of
 *                 breakpoints. Must follow the structure shown below to be valid (given values are for example only).
 *                 The breakpoints will be named numerically so that one could have any number of breakpoints without running out of
 *                 size words (small, medium, etc). And so you wont be left with an ugly xxxxxxxxxl-breakpoint if you happened to go
 *                 that not-so-recommended route.
 *      [
 *          // $break-1
 *           {
 *              "min": null,
 *              "max": calc(30rem - 1px),
 *           },
 *          // $break-2
 *           {
 *              "min": 30rem,
 *              "max": calc(40rem - 1px)
 *           },
 *          // $break-3
 *           {
 *              "min": 40rem,
 *              "max": calc(75rem - 1px)
 *           },
 *          // $break-4
 *           {
 *              "min": 75rem,
 *              "max": null
 *           }
 *          // Etcetera
 *      ]
 * @returns {{path: string, library: *, libraryPath: string}}
 */
module.exports = function EasyQuery(scss) {
    if(arguments.length < 1) console.log('You must supply either a supported library name or a custom configuration object.');
    else if(arguments.length === 1 && typeof arguments[0] === 'string') {
        var path = "./__eq__.scss";
        var base;
        var library;

        fs.readFile(__dirname + "/styles/_base.scss", function(err, baseData) {
            if(err) console.log('Could not read base. Message: ' + err);
            else {
                fs.readFile(__dirname + "/styles/_" + scss + ".scss", function(err, libData) {
                    if(err) console.log('Could not read library. Message: ' + err);
                    else {
                        fs.writeFile('./__eq__.scss', baseData);
                        fs.appendFile('./__eq__.scss', libData);
                    }
                });
            }
        });

        return {
            path: path,
            library: scss,
            libraryPath: __dirname + '/styles/_' + scss + '.scss'
        };
    } else if(arguments.length === 1 && typeof arguments[0] === 'object') {
        var lib = "";
        for(var i = 0; i < custom.length; i++) {
            var index = i + 1;
            if(custom[i].min === null) {
                if(i !== 0) {
                    console.log('Only the very first breakpoint should have a "min" property set to 0 or null!');
                }
                lib += "$break-" + index + ": calc(" + custom[index].min + " - 1px);\n";
            } else if(custom[i].max === null) {
                if(i < custom.length) {
                    console.log('Only the very last breakpoint should have a "max" property set to null!');
                }
                lib += "$break-" + index + ": " + custom[i].min + ";\n";
            } else {
                if(i === (custom.length - 1)) {
                    console.log('Your largest breakpoint should have a "max" property set to null!');
                    lib += "$break-" + index + ": " + custom[i].min + ";\n";
                } else {
                    lib += "$break-" + index + ": (" + custom[i].min + ", calc(" + custom[index].min + " - 1px);\n";
                }
            }
        }
    } else if(arguments.length > 1 ) console.log('You cannot supply both a supported library name and a custom configuration object.');
    else console.log('The given parameter was neither a valid library name string or custom configuration object.');
};