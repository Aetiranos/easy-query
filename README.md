# EasyQuery ![GitHub License][license] ![Project version][version] ![Travis][travis] ![david][david]

<div style="text-align: center;"><img src="https://nodei.co/npm/easy-query.png?downloads=true&downloadRank=true&stars=true"/></div>

___

Finally, an easy to use, easy to customize package of SCSS media queries tailored for use alongside or without popular frameworks such as Bootstrap and Foundation.

<p style="text-align: center";>Pure Javascript out of the box with <span style="text-decoration: underline;">zero</span> dependencies!</p> 


### Getting Started

![install][npm]

![install][bower]

![install][github]


### How to Use EasyQuery

EasyQuery is a mobile-first responsive media query collection. With it, you have two ways of going about implementing SCSS breakpoint variables into your gulp workflow:

**Method #1** is to simply copy the SCSS files you need directly into your project from the src folder. 

**Method #2** is to require it in your Gulp file as described below, either passing the desired framework as a string parameter or providing an array of breakpoints in EM/REM units then @import-ing the scss file in your CI process. 

For instructions on how to work with an automation pipeline, visit the [GulpJS Repo](https://github.com/gulpjs/gulp) or [GruntJS Repo](https://github.com/gruntjs/grunt) (demonstrations here use Gulp, though the same principles apply to usage with Grunt).

If you do not specify a parameter when requiring the package, it will default to Bootstrap 3.

**Note: The ability to simply copy/paste framework SCSS files from EasyQuery to your project will be deprecated in a future release. Method #2 above is the recommended way.**

Just `require()` EasyQuery, passing your choice of framework as a string or a custom array of breakpoints (in EM/REM units).

```
var gulp = require('gulp'),
    easyquery = require('easy-query')('bootstrap4'), 
    // same as = require('easy-query')([30,45,64,75]),
    sass = require('gulp-sass');

```

At the top of your parent SCSS file, import the easy-query file *first* (this way the media queries will be available throughout your project). It will be automatically generated in the same directory as your `gulpfile.js`.

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

    @media #{$md-up} {
        display: inline-block;
    }

    @media #{$lg-only} {
        width: 100%;
    }
}
```


### Breakpoint Variables

When passing your own custom array of breakpoints, the breakpoint variable names will depend on how many elements are in the array. The following table describes every media query variable you can you use in your SCSS code based on the number of breakpoints.

<style>.center { text-align: center; } .bold { font-weight: bold; } tbody { border-bottom: 3px solid #ddd; }</style>
<table>
    <thead>
        <tr>
            <td colspan="6" class="center bold">Breakpoints by Count</td>
        </tr>
        <tr>
            <td class="bold">Variables Available</td>
            <td class="center bold">1</td>
            <td class="center bold">2</td>
            <td class="center bold">3</td>
            <td class="center bold">4</td>
            <td class="center bold">5</td>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td>$xs-only</td>
            <td></td>
            <td></td>
            <td><img src="http://findicons.com/files/icons/767/wp_woothemes_ultimate/16/checkmark.png" /></td>
            <td><img src="http://findicons.com/files/icons/767/wp_woothemes_ultimate/16/checkmark.png" /></td>
            <td><img src="http://findicons.com/files/icons/767/wp_woothemes_ultimate/16/checkmark.png" /></td>
        </tr>
        <tr>
            <td>$sm-only</td>
            <td><img src="http://findicons.com/files/icons/767/wp_woothemes_ultimate/16/checkmark.png" /></td>
            <td><img src="http://findicons.com/files/icons/767/wp_woothemes_ultimate/16/checkmark.png" /></td>
            <td><img src="http://findicons.com/files/icons/767/wp_woothemes_ultimate/16/checkmark.png" /></td>
            <td><img src="http://findicons.com/files/icons/767/wp_woothemes_ultimate/16/checkmark.png" /></td>
            <td><img src="http://findicons.com/files/icons/767/wp_woothemes_ultimate/16/checkmark.png" /></td>
        </tr>
        <tr>
            <td>$md-only</td>
            <td></td>
            <td><img src="http://findicons.com/files/icons/767/wp_woothemes_ultimate/16/checkmark.png" /></td>
            <td><img src="http://findicons.com/files/icons/767/wp_woothemes_ultimate/16/checkmark.png" /></td>
            <td><img src="http://findicons.com/files/icons/767/wp_woothemes_ultimate/16/checkmark.png" /></td>
            <td><img src="http://findicons.com/files/icons/767/wp_woothemes_ultimate/16/checkmark.png" /></td>
        </tr>
        <tr>
            <td>$lg-only</td>
            <td><img src="http://findicons.com/files/icons/767/wp_woothemes_ultimate/16/checkmark.png" /></td>
            <td><img src="http://findicons.com/files/icons/767/wp_woothemes_ultimate/16/checkmark.png" /></td>
            <td><img src="http://findicons.com/files/icons/767/wp_woothemes_ultimate/16/checkmark.png" /></td>
            <td><img src="http://findicons.com/files/icons/767/wp_woothemes_ultimate/16/checkmark.png" /></td>
            <td><img src="http://findicons.com/files/icons/767/wp_woothemes_ultimate/16/checkmark.png" /></td>
        </tr>
        <tr>
            <td>$xl-only</td>
            <td></td>
            <td></td>
            <td></td>
            <td><img src="http://findicons.com/files/icons/767/wp_woothemes_ultimate/16/checkmark.png" /></td>
            <td><img src="http://findicons.com/files/icons/767/wp_woothemes_ultimate/16/checkmark.png" /></td>
        </tr>
        <tr>
            <td>$xx-only</td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td><img src="http://findicons.com/files/icons/767/wp_woothemes_ultimate/16/checkmark.png" /></td>
        </tr>
    </tbody>
    <tbody>
        <tr>
            <td>$sm-down</td>
            <td></td>
            <td></td>
            <td><img src="http://findicons.com/files/icons/767/wp_woothemes_ultimate/16/checkmark.png" /></td>
            <td><img src="http://findicons.com/files/icons/767/wp_woothemes_ultimate/16/checkmark.png" /></td>
            <td><img src="http://findicons.com/files/icons/767/wp_woothemes_ultimate/16/checkmark.png" /></td>
        </tr>
        <tr>
            <td>$md-down</td>
            <td></td>
            <td><img src="http://findicons.com/files/icons/767/wp_woothemes_ultimate/16/checkmark.png" /></td>
            <td><img src="http://findicons.com/files/icons/767/wp_woothemes_ultimate/16/checkmark.png" /></td>
            <td><img src="http://findicons.com/files/icons/767/wp_woothemes_ultimate/16/checkmark.png" /></td>
            <td><img src="http://findicons.com/files/icons/767/wp_woothemes_ultimate/16/checkmark.png" /></td>
        </tr>
        <tr>
            <td>$lg-down</td>
            <td></td>
            <td></td>
            <td></td>
            <td><img src="http://findicons.com/files/icons/767/wp_woothemes_ultimate/16/checkmark.png" /></td>
            <td><img src="http://findicons.com/files/icons/767/wp_woothemes_ultimate/16/checkmark.png" /></td>
        </tr>
        <tr>
            <td>$xl-down</td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td><img src="http://findicons.com/files/icons/767/wp_woothemes_ultimate/16/checkmark.png" /></td>
        </tr>
    </tbody>
    <tbody>
        <tr>
            <td>$sm-up</td>
            <td></td>
            <td></td>
            <td><img src="http://findicons.com/files/icons/767/wp_woothemes_ultimate/16/checkmark.png" /></td>
            <td><img src="http://findicons.com/files/icons/767/wp_woothemes_ultimate/16/checkmark.png" /></td>
            <td><img src="http://findicons.com/files/icons/767/wp_woothemes_ultimate/16/checkmark.png" /></td>
        </tr>
        <tr>
            <td>$md-up</td>
            <td></td>
            <td><img src="http://findicons.com/files/icons/767/wp_woothemes_ultimate/16/checkmark.png" /></td>
            <td><img src="http://findicons.com/files/icons/767/wp_woothemes_ultimate/16/checkmark.png" /></td>
            <td><img src="http://findicons.com/files/icons/767/wp_woothemes_ultimate/16/checkmark.png" /></td>
            <td><img src="http://findicons.com/files/icons/767/wp_woothemes_ultimate/16/checkmark.png" /></td>
        </tr>
        <tr>
            <td>$lg-up</td>
            <td></td>
            <td></td>
            <td></td>
            <td><img src="http://findicons.com/files/icons/767/wp_woothemes_ultimate/16/checkmark.png" /></td>
            <td><img src="http://findicons.com/files/icons/767/wp_woothemes_ultimate/16/checkmark.png" /></td>
        </tr>
        <tr>
            <td>$xl-up</td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td><img src="http://findicons.com/files/icons/767/wp_woothemes_ultimate/16/checkmark.png" /></td>
        </tr>
    </tbody>
</table>

### Breakpoint Classes

As of 1.1.5, EasyQuery also produces a set of classes that mock your breakpoint variables so as to easily display or hide DOM elements without being forced to hardcode anything in SCSS. They generally work the same as Bootstrap's built-in grid variables (.hidden-xs, et al) just a lot less verbose.

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


### Provided Framework Definitions

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

### Contributing

Anyone who is interested in contributing and building this project up, you're encouraged to do so! Collaboration is welcome!
If you find any bugs or issues with the source code, be sure to submit an issue or submit a pull request with a fix.
If you have a feature request, submit an issue ticket (particularly if this is a major request). 
For smaller requests, feel free to submit a pull request with the requested feature code.

[license]: https://img.shields.io/badge/license-MIT-blue.svg?style=flat
[version]: https://img.shields.io/badge/version-1.1.7-green.svg
[travis]: https://img.shields.io/travis/Aetiranos/easy-query.svg?maxAge=2592000
[david]: https://david-dm.org/Aetiranos/easy-query.svg
[npm]: https://img.shields.io/badge/Install-npm_install_easy--query_----save--dev-b84dff.svg
[bower]:https://img.shields.io/badge/Install-bower_install_easy--query_----save--dev-b84dff.svg
[github]:https://img.shields.io/badge/Install-git_clone_https\:\/\/github.com\/Aetiranos\/easy--query.git-b84dff.svg