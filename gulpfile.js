var gulp = require("gulp"),
    plumber = require("gulp-plumber"),
    uglify = require("gulp-uglify"),
    jshint = require("gulp-jshint"),
    maps = require("gulp-sourcemaps"),
    rename = require("gulp-rename");


gulp.task("default",['deploy']);
gulp.task("deploy",['build'], deployJS);
gulp.task("assets", copyAssets);
gulp.task("build",['assets'], buildJS);

function buildJS() {
    gulp.src("src/index.js")
        .pipe(plumber())
        .pipe(jshint())
        .pipe(gulp.dest("dist/"));
}

function deployJS() {
    gulp.src("dist/index.js")
        .pipe(plumber())
        .pipe(maps.init())
        .pipe(uglify({
            compress: true,
            mangle: true,
            keepComments: false
        }))
        .pipe(rename("index.min.js"))
        .pipe(maps.write("./"))
        .pipe(gulp.dest("dist/"));
}

function copyAssets() {
    gulp.src("src/frameworks/*")
        .pipe(gulp.dest("dist/frameworks/"));

    gulp.src("src/errors.json")
        .pipe(gulp.dest("dist/"));
}

var EasyQuery = require("./dist/index.js")({lib: 'skeleton2'});

var x = EasyQuery.getVariables();
