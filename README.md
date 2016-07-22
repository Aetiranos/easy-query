#EasyQuery

An easy to use, easy to customize sheet of SCSS media queries tailored for use alongside or without popular frameworks such as Bootstrap and Foundation.

[![GitHub License](https://img.shields.io/badge/license-MIT-blue.svg?style=flat)](https://raw.githubusercontent.com/aetiranos/easy-query/master/LICENSE)
[![Project version](https://img.shields.io/badge/version-1.1.7-green.svg)](https://img.shields.io/badge/version-1.1.7-green.svg)
[![Travis](https://img.shields.io/travis/Aetiranos/easy-query.svg?maxAge=2592000)](https://travis-ci.org/Aetiranos/easy-query)
[![npm](https://img.shields.io/npm/v/npm.svg?maxAge=2592000)](http://npmjs.org/package/easy-query)
[![Bower](https://img.shields.io/bower/v/bootstrap.svg?maxAge=2592000)](https://GitHub.com/Aetiranos/easy-query)
[![NPM](https://nodei.co/npm/easy-query.png?downloads=true&downloadRank=true&stars=true)](https://nodei.co/npm/easy-query.png?downloads=true&downloadRank=true&stars=true)

###Getting Started

Install via NPM: `npm install easy-query`

Install via Bower: `bower install easy-query`

Clone via Git: `git clone https://github.com/Aetiranos/easy-query.git`

###How to Use EasyQuery

EasyQuery is a mobile-first responsive media query collection. With it, you have two ways of going about implementing it into your project.

**Method #1** is to simply copy the files you need directly into your project from the src folder. 

**Method #2** is to require it in your Gulp file, passing the desired framework as a parameter as depicted below and @import-ing the scss file in your CI process. 

For instructions on how to work with an automation pipeline, visit the [GulpJS Repo](https://github.com/gulpjs/gulp) or [GruntJS Repo](https://github.com/gruntjs/grunt).

If you do not specify a parameter when requiring the package, it will default to Bootstrap 3.

**NOTE: The ability to simply copy/paste framework SCSS files from EasyQuery to your project will be deprecated in a future release. Method #2 above is the recommended way.**

```
// require( ) EasyQuery, passing your choice of framework as a string or an custom array of breakpoints (in EM/REM units).
var gulp = require('gulp'),
    easyquery = require('easy-query')('bootstrap4'), // 'bootstrap4' could have been [30, 45, 64, 75] instead
    sass = require('gulp-sass');

```

At the top of your parent SCSS file, import the easy-query file **first** this way the media queries will be available throughout your project. It will be automatically generated in the same directory as your gulpfile.
```
@import 'path/to/gulpfiles/dir/easy-query';
@import 'core/variables';
@import 'core/layout';
@import 'core/theme';
```

Then just compile your sass like you normally would, including the easy-query scss file.
```
gulp.task('build', function() {
    gulp.src('/path/to/your/scss/**/*.scss')
    .pipe(sass())
    .pipe(gulp.dest('/path/to/dest/');
}
```

Once you've gotten the above all set up, you can use it in your code like this:

```
.block-object {
    display: block;
    width: auto;
    
    // Only resolutions within $md-range or higher will have this css applied to it.
    // All resolutions lower will fall back to the element's default, which is 'block' set by the base class definition.
    @media #{$md-up} {
        display: inline-block;
    }
    
    // Only resolutions within $lg-range will have this width.
    // Every resolution below this will fall back to the element's default, which is 'auto' set by the base class definition.
    @media #{$lg-only} {
        width: 100%;
    }
}
```

###Breakpoint Variables

When passing your own custom array of breakpoints, the breakpoint variable names will depend on how many elements are in the array. The following table describes each media query variable you can you use in your SCSS code.

| 1 Breakpoint | 2 | 3 | 4 | 5 |
|:---:|:---:|:---:|:---:|:---:|
| $sm-only  | $sm-only | $xs-only | $xs-only | $xs-only |
| $lg-only | $md-only | $sm-only | $sm-only | $sm-only |
|  | $lg-only | $md-only | $md-only | $md-only |
|  | $md-up | $lg-only | $lg-only | $lg-only |
|  | $md-down | $sm-up | $xl-only | $xl-only |
|  |  | $sm-down | $sm-up | $xx-only |
|  |  | $md-up | $sm-down | $sm-up |
|  |  | $md-down | $md-up | $sm-down |
|  |  |  | $md-down | $md-up |
|  |  |  | $lg-up | $md-down |
|  |  |  | $lg-down | $lg-up |
|  |  |  |  | $lg-down |
|  |  |  |  | $xl-up |
|  |  |  |  | $xl-down |

###Breakpoint Classes
As of 1.1.5, EasyQuery also produces a set of classes that mock your breakpoint variables so as to easily manipulate display or hide DOM elements with them without being forced to hardcode anything in SCSS. The generally work the same as Bootstrap's built-in grid variables (.hidden-xs, .visible-xs) just a lot less verbose.

```
<div class="sm-down">
    This will only appear on resolutions within the range of $sm-range and smaller.
    It will be hidden on all resolutions of $md-up.
</div>
```

It is the exact same as writing the below class definition in your SCSS file manually. It is what is generated for you automatically for use with these classes.

```
.sm-down {
    @media #{$md-up} {
        display: none;
    }
}
```

###Provided Framework Definitions

* Bootstrap 2
* Bootstrap 3
* Bootstrap 4
* Foundation 5
* Foundation 6 for Sites
* Foundation 6 for Apps
* Foundation 6 for Emails
* Open Framework
* Skeleton 2

For more in-depth SCSS info, visit the [SASS Guide](http://sass-lang.com/guide).

___

###Contributing

Anyone who is interested in contributing and building this project up, you're encouraged to do so! Collaboration is welcome!

If you find any bugs or issues with the source code, be sure to submit an issue or submit a pull request with a fix.

If you have a feature request, submit an issue ticket (particularly if this is a major request). 

For smaller requests, feel free to submit a pull request with the requested feature code.