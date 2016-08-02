#EasyQuery Changelog


##1.2.0

#####Added

- Better debugging issues through easy-to-understand error messages.

- Public functions allow users to output the media query code wherever they please or change configuration on the fly.

- Users can now use EM, REM or PX for their units in the custom array option.

- Development now uses TypeScript for a stricter, type-safe, and more compatible codebase. 

- Users can now specify the basis for the REM units. 

#####Removed

#####Modified

- Rewrote the application to support LESS and SASS.

- The package now accepts a configuration object as a parameter.

- Improved (and increased) unit testing.

- Significantly modularized the code to ease development and maintenance of the package.

##1.1.7

#####Added
n/a

#####Removed
n/a

#####Modified
- Hotfixed issue where '$' was mistakenly placed in the classnames, breaking that functionality. 
- Formatted the generated SCSS file so as to better please the default gulp-scss-lint plugin. 


##1.1.6

#####Added
n/a

#####Removed
n/a

#####Modified
- Hotfixed mistake where gulp wasn't ran and thus `dist/` wasn't populated with updates from [1.1.5](https://github.com/Aetiranos/easy-query/blob/master/CHANGELOG.md#115).


##1.1.5

#####Added
- Breakpoint Classes
- Changelog File
- Nodei.co NPM Block

#####Removed
n/a

#####Modified
- A few syntactical typographical errors in `README.md`.
- Added a bit more documentation to the `easy-query.js` file.
- Updated `package.json` and `bower.json`.


##1.1.4

#####Added
n/a

#####Removed
n/a

#####Modified
- Hotfixed mistake where gulp was not ran before closing [1.1.3](https://github.com/Aetiranos/easy-query/blob/master/CHANGELOG.md#113), thus changes weren't pushed to the `/dist` directory.


##1.1.3

#####Added
n/a

#####Removed
n/a

#####Modified
- Corrected the breakpoints for Bootstrap 2 & 3.
- Variablized the offset for the upper range of each breakpoint range.


##1.1.2

#####Added
n/a

#####Removed
n/a

#####Modified
- Hotfixed issue where the unit type was missing from a location during computation, thus breakpoint definitions were broken. 


##1.1.1

#####Added
n/a

#####Removed
n/a

#####Modified
- Updated versions and shields.
- Added browserify which is required for Karma but was missing.
- Fixed minor typographical errors.


##1.1.0

#####Added
- Added Karma+Jasmine testing. Split project from just a `src/` to both `src/` and `dist/` for better distribution.
- Updated `package.json` to reflect new location for the main file.
- Added Gulp for better continuous integration, linting, testing, compressing, and deploying of the project.
- Added minified version of `easy-query.js`.
- Added documentation to each framework source file.

#####Removed
n/a

#####Modified
n/a

##1.0.9

#####Added
- Added Stanford University's OpenFramework framework definition. 

#####Removed
n/a

#####Modified
n/a

##1.0.8

#####Added
n/a

#####Removed
n/a

#####Modified
- Hotfixed mistake where version numbers were not updated properly.


##1.0.7

#####Added
- Added Travis-CI testing functionality.

#####Removed
n/a

#####Modified
n/a


##1.0.6

#####Added
n/a

#####Removed
n/a

#####Modified
- Adjusted file-generation functionality to correct a couple of issues that was breaking the file generation process.
- Also adjusted the file-generation functionality to be a little DRYer. 


##1.0.5

#####Added
- Added simplified framework definitions via framework files in `frameworks/`. These are now require( )ed when a named framework is passed.

#####Removed
n/a

#####Modified
- Added additional documentation to the `README.md` file.
- Adjusted documentation in `easy-query.js` file.
- Adjusted file-generation functionality in `easy-query.js` to be DRYer. 

##1.0.4


#####Added
- Added project license file.
- Added framework definitions for Foundation 6 (All three versions: For Sites, For Email, and For Apps).
- Added `easy-query.js` for better breakpoint calculations and file generation.

#####Removed
n/a

#####Modified
- Updated "ignore" files to include JetBrains-developed IDEs' `.idea/` directory.
- Added additional documentation in the `README.md` file.


##1.0.3

#####Added
- Framework definition for Skeleton 2.

#####Removed
- Removed `CONTRIBUTING.md`.

#####Modified
- Added the `CONTRIBUTING.md` file contents to the `README.md` file.
- Fixed a myriad of typos (syntatical and literal). 
- Adjusted the calculations for Foundation 5.
- Added documentation to the `README.md file`.


##1.0.2

#####Added
- Added the `README.md` file.
 Added documentation to the EasyQuery object in `easy-query.js`.
 Added "ignore" files (`.npmignore` and `.gitignore`).

#####Removed
n/a

#####Modified
n/a


##1.0.1

#####Added
- Added Foundation 5 breakpoint parameters.

#####Removed
n/a

#####Modified
n/a
