#EasyQuery

EasyQuery is a porting of Foundation media queries to be usable with any web project, providing users with easy to use methods of shorthand writing customizable media queries. The package by default includes various SCSS files with settings set to the breakpoints of popular, existing frameworks such as Bootstrap 3 and Foundation 5. It is a compliment to the frameworks, enhancing but not replacing them. If you would rather just use the media queries without any framework, that works too!

[![GitHub License](https://img.shields.io/badge/license-MIT-blue.svg?style=flat)](https://raw.githubusercontent.com/aetiranos/easy-query/master/LICENSE)
[![Project version](https://img.shields.io/badge/version-1.0.6-orange.svg)](https://img.shields.io/badge/version-1.0.6-orange.svg)
[![npm](https://img.shields.io/npm/dt/easy-query.svg?maxAge=2592000)](http://npmjs.org/package/easy-query)
[![npm](https://img.shields.io/npm/v/npm.svg?maxAge=2592000)](http://npmjs.org/package/easy-query)
[![Bower](https://img.shields.io/bower/v/bootstrap.svg?maxAge=2592000)](https://GitHub.com/Aetiranos/easy-query)
  
###Getting Started

Install via NPM: `npm install easy-query`

Install via Bower: `bower install easy-query`

Clone via Git: `git clone https://github.com/Aetiranos/easy-query.git`

###How to Use EasyQuery

EasyQuery is a mobile-first responsive media query collection. With it, you have two ways of going about implementing it into your project.

**Method #1** is to simply copy the files you need directly into your project from the src folder. 

**Method #2** is to require it in your SCSS file, passing the desired framework as a parameter as depicted below. 

If you do not specify a framework or supply a custom array, it will default to Bootstrap 3

**NOTE: The ability to simply copy/paste framework SCSS files from EasyQuery to your project will be deprecated in a future release. Method #2 above is the recommended way.**


```
var gulp = require('gulp'),
    easyquery = require('easy-query')('bootstrap4'),
    sass = require('gulp-sass');

```

At the top of your parent SCSS file, import the easy-query file **first**. It will be automatically generated in the same directory as your gulpfile.
```
@import 'core/easy-query';
@import 'core/variables';
@import 'core/layout';
@import 'core/theme';
```

Then just compile your sass like you normally would, including the easy-query scss file.
```
gulp.task('build', function() {
    gulp.src('/path/to/your/scss/**/*.scss)
    .pipe(sass())
    .pipe(gulp.dest('/path/to/dest');
}
```

Once you've gotten the above all set up, you can use it in your code like this:

```
.block-object {
    display: block;
    width: auto;
    
    @media #{$md-up} {
        display: inline-block;
    }
    
    @media #{$lg-only} {
        width: 100%;
    }
}
```

You don't have to be restricted to using popular frameworks' breakpoints. You can easily define your own as an array of rem units and pass it as the parameter when requiring EasyQuery. 

```
var gulp = require('gulp'),
    sass = require('gulp-sass'),
    easyquery = require('easy-query/')([30, 45, 62, 75]);
```

Or obviously passing in a prebuilt array, but the above was for structure example purposes. Be careful of where you place values - the breakpoints should ascend like above.

When passing your own custom array of breakpoints, the breakpoint variable names will depend on how many elements are in the array.

###Breakpoint Variables

The following table describes each media query variable you can you use in your SCSS code.

| 1 Breakpoint | 2 Breakpoints | 3 Breakpoints | 4 Breakpoints | 5 Breakpoints |
|---|---|---|---|---|
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

For instructions on how to work with an automation pipeline, visit the [GulpJS Repo](https://github.com/gulpjs/gulp) or [GruntJS Repo](https://github.com/gruntjs/grunt).

###Provided Framework Definitions

* Bootstrap 2
* Bootstrap 3
* Bootstrap 4
* Foundation 5
* Foundation 6 for Sites
* Foundation 6 for Apps
* Foundation 6 for Emails
* Skeleton 2

For more in-depth SCSS info, visit the [SASS Guide](http://sass-lang.com/guide).

___

###Contributing

Anyone who is interested in contributing and building this project up, is encouraged to do so! The more, the merrier!

If you find any bugs or issues with the source code, be sure to submit an issue or submit a pull request with a fix.

If you have a feature request, submit an issue ticket (particularly if this is a major request). For smaller requests, feel free to submit a pull request with the requested feature code.