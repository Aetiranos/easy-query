var gulp = require('gulp'),
    plumber = require('gulp-plumber'),
    uglify = require('gulp-uglify'),
    jshint = require('gulp-jshint'),
    maps = require('gulp-sourcemaps'),
    rename = require('gulp-rename');

gulp.task('default', ['build','assets'], deployJS);
gulp.task('assets', copyAssets);
gulp.task('build', buildJS);

function buildJS() {
    gulp.src('src/easy-query.js')
        .pipe(plumber())
        .pipe(jshint())
        .pipe(gulp.dest('dist/'));
}

function deployJS() {
    gulp.src('dist/easy-query.js')
        .pipe(plumber())
        .pipe(maps.init())
        .pipe(uglify({
            compress: true,
            mangle: true,
            keepComments: false
        }))
        .pipe(rename('easy-query.min.js'))
        .pipe(maps.write('./'))
        .pipe(gulp.dest('dist/'));
}

function copyAssets() {
    gulp.src('src/frameworks/*')
        .pipe(gulp.dest('dist/frameworks/'));

    gulp.src('src/styles/*')
        .pipe(gulp.dest('dist/styles/'));
}