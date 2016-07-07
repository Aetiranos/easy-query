#EasyQuery

EasyQuery is a porting of Foundation media queries to be usable with any web project, providing users with easy to use methods of shorthand writing customizable media queries. The package by default includes various SCSS files with settings set to the breakpoints of popular, existing frameworks such as Bootstrap 3 and Foundation 5. It is a compliment to the frameworks, enhancing but not replacing them. If you would rather just use the media queries without any framework, that works too!

###Getting Started

Install via NPM: `npm install easy-query`

Install via Bower: `bower install easy-query`

Clone via Git: `git clone https://github.com/Aetiranos/easy-query.git`

###How to Use EasyQuery

EasyQuery is a mobile-first responsive media query collection. In your SCSS file, add media queries easily with predefined SCSS files or create your own by filling in the _custom.scss file.

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

In your build automation pipeline (Gulp, Grunt, etc), parse in the queries.scss file which contains an import reference to whichever media query template you'd like to use (only one, however. Things will get nasty if you import multiple.). 

For instructions on how to work with an automation pipeline, visit the [GulpJS Repo](https://github.com/gulpjs/gulp) or [GruntJS Repo](https://github.com/gruntjs/grunt).

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


###Customizing the Media Queries

All of the media queries were meant to be easily customizable to suit your needs. This project does not require Bootstrap in any way nor any other dependencies other than something to compile the SCSS (Gulp, Grunt, etc).
 
A note about the media queries: If you are unfamiliar with some of the more advanced concepts of SCSS, the `#{}` part may be confusing. This is how SCSS interpolates variables to be used, much like other languages such as PHP. Placing your media query variables within this interpolation will render their style rules when output to CSS.

For more in-depth SCSS info, visit the [SASS Guide](http://sass-lang.com/guide).

___

###Contributing

Anyone who is interested in contributing and building this project up, feel free to do so! The more, the merrier!

If you find any bugs or issues with the source code, be sure to submit an issue or submit a pull request with a fix.

If you have a feature request, submit an issue ticket (particularly if this is a major request). For smaller requests, feel free to submit a pull request with the requested feature code.

####Submitting an Issue or Requesting a Feature

Before you submit an issue, search the project issues and discussion to ensure that it hasn't already been reported or requested (in the event of a feature). If you do encounter a problem, please be as specific as possible when reporting it (browser, browser version, any frameworks you're using in conjunction, how to recreate the issue, etc.). 

####Creating a Pull Request

Like with submitting an issue, be sure to search the project and discussions for previous pull requests that relate to yours. Duplicate efforts are wasted efforts!

Make any changes in a new branch, making sure to not only provide the code to fix or introduce a feature, but provide commented documentation explaining the code as well. 

Creating your new branch: 

`git checkout -b my-branch master`

For any contributed JavaScript code, please annotate it descriptively. 

Finally, when pushing commits, try to be to the point but descriptive with your commit message. Essays are unnecessary. :)

Pushing your code back to GitHub: 

`git push origin my-branch`

Then send us the pull request. 