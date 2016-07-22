#EasyQuery Changelog



###1.1.5

#####Added

* Breakpoint Classes

* Changelog File

* Nodei.co NPM Block

#####Removed

#####Modified

* A few syntactical typographical errors in `README.md`.

* Added a bit more documentation to the `easy-query.js` file.

* Updated `package.json` and `bower.json`.



###1.1.4

#####Added

#####Removed

#####Modified

* Hotfixed mistake where gulp was not ran before closing 1.1.3, thus changes weren't pushed to the `/dist` directory.



###1.1.3

#####Added

#####Removed

#####Modified

* Corrected the breakpoints for Bootstrap 2 & 3.

* Variablized the offset for the upper range of each breakpoint range.



###1.1.2

#####Added

#####Removed

#####Modified

* Hotfixed issue where the unit type was missing from a location during computation, thus breakpoint definitions were broken. 



###1.1.1

#####Added

#####Removed

#####Modified

* Updated versions and shields.

* Added browserify which is required for Karma but was missing.

* Fixed minor typographical errors.



###1.1.0

#####Added

* Added Karma+Jasmine testing. Split project from just a `src/` to both `src/` and `dist/` for better distribution.

* Updated `package.json` to reflect new location for the main file.

* Added Gulp for better continuous integration, linting, testing, compressing, and deploying of the project.

* Added minified version of `easy-query.js`.

* Added documentation to each framework source file.

#####Removed

#####Modified



###1.0.9

#####Added

* Added Stanford University's OpenFramework framework definition. 

#####Removed

#####Modified



###1.0.8

#####Added

#####Removed

#####Modified

* Hotfixed mistake where version numbers were not updated properly.



###1.0.7

#####Added

* Added Travis-CI testing functionality.

#####Removed

#####Modified



###1.0.6

#####Added

#####Removed

#####Modified

* Adjusted file-generation functionality to correct a couple of issues that was breaking the file generation process.

* Also adjusted the file-generation functionality to be a little DRYer. 



###1.0.5

#####Added

* Added simplified framework definitions via framework files in `frameworks/`. These are now require( )ed when a named framework is passed.

#####Removed

#####Modified

* Added additional documentation to the `README.md` file.

* Adjusted documentation in `easy-query.js` file.

* Adjusted file-generation functionality in `easy-query.js` to be DRYer. 



###1.0.4

#####Added

* Added project license file.

* Added framework definitions for Foundation 6 (All three versions: For Sites, For Email, and For Apps).

* Added `easy-query.js` for better breakpoint calculations and file generation.

#####Removed

#####Modified

* Updated "ignore" files to include JetBrains-developed IDEs' `.idea/` directory.

* Added additional documentation in the `README.md` file.



###1.0.3

#####Added

* Framework definition for Skeleton 2.

#####Removed

* Removed `CONTRIBUTING.md`.

#####Modified

* Added the `CONTRIBUTING.md` file contents to the `README.md` file.

* Fixed a myriad of typos (syntatical and literal). 

* Adjusted the calculations for Foundation 5.

* Added documentation to the `README.md file`.



###1.0.2

#####Added

* Added the `README.md` file.
* Added documentation to the EasyQuery object in `easy-query.js`.
* Added "ignore" files (`.npmignore` and `.gitignore`).

#####Removed

#####Modified



###1.0.1

#####Added

* Added Foundation 5 breakpoint parameters.

#####Removed

#####Modified
