#EasyQuery

EasyQuery is a porting of Foundation media queries to be usable with any web project, providing users with easy to use methods of shorthand writing customizable media queries. The package by default includes various SCSS files with settings set to the breakpoints of popular, existing frameworks such as Bootstrap 3 and Foundation 5. It is a compliment to the frameworks, enhancing but not replacing them. If you would rather just use the media queries without any framework, that works too!

###Getting Started

Install via NPM: `npm install easy-query`

Install via Bower: `bower install easy-query`

Clone via Git: `git clone https://github.com/Aetiranos/easy-query.git`

###How to Use EasyQuery

EasyQuery is a mobile-first responsive media query collection. With it, you have two ways of going about implementing it into your project.

The first way is to simply copy the files you need directly into your project from the src folder. 

The second is to require it in your SCSS file, passing the desired framework as a parameter like so:

```
var gulp = require('gulp'),
    easyquery = require('path/to/easy-query')('bootstrap4'),
    sass = require('gulp-sass');
    
gulp.task('build', function() {
    gulp.src(easyquery.path)
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

You don't have to be restricted to using popular frameworks' breakpoints. You can easily define your own as an array of objects and pass it as the parameter when requiring EasyQuery. 

```
var gulp = require('gulp'),
    sass = require('gulp-sass'),
    easyquery = require('/path/to/easy-query/')([
        // $break-1
        {
            "min": null,
            "max": calc(30rem - 1px),
        },
        // $break-2
        {
            "min": 30rem,
            "max": calc(40rem - 1px)
        },
        // $break-3
        {
            "min": 40rem,
            "max": calc(75rem - 1px)
            },
        // $break-4
        {
            "min": 75rem,
            "max": null
        }
        // Etcetera
    ]);
```

Or obviously passing in a prebuilt array, but the above was for structure example purposes. Be careful of where you place values - the breakpoints should ascend like above.

When passing your own custom array of breakpoints, they will be auto named to `$break-#` where the number starts at 1 and ascends the more breakpoints you add. 

if you peruse the require method of implementing EasyQuery, you can use the `easyquery.path` property to get the filepath to the custom SCSS file that was created on the fly. You can of course then just parse it like any other SCSS file. 

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

###Media Queries

Here are a few examples of some of the media queries you can use, but there are others!

`$rt-only` Only displays styles on viewports with a pixel width less than 320px.

`$xs-only` Only displays styles on viewports with a pixel width between 321px and 480px.

`$sm-only` Only displays styles on viewports with a pixel width between 481px and 768px.

`$md-only` Only displays styles on viewports with a pixel width between 769px and 992px.

`$lg-only` Only displays styles on viewports with a pixel width greater than 992px.

`$xs-down` Only displays styles on viewports with a pixel width less than 480px.

`$sm-down` Only displays styles on viewports with a pixel width less than 768px.

`$md-down` Only displays styles on viewports with a pixel width less than 992px.

`$xs-up` Only displays styles on viewports with a pixel width greater than 320px.

`$sm-up` Only displays styles on viewports with a pixel width greater than 480px.

`$md-up` Only displays styles on viewports with a pixel width greater than 768px.

For more in-depth SCSS info, visit the [SASS Guide](http://sass-lang.com/guide).

___

###Contributing

Anyone who is interested in contributing and building this project up, feel free to do so! The more, the merrier!

If you find any bugs or issues with the source code, be sure to submit an issue or submit a pull request with a fix.

If you have a feature request, submit an issue ticket (particularly if this is a major request). For smaller requests, feel free to submit a pull request with the requested feature code.