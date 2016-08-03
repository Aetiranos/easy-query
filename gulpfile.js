var gulp = require( 'gulp' );
var plumber = require( 'gulp-plumber' );
var uglify = require( 'gulp-uglify' );
var jshint = require( 'gulp-jshint' );
var maps = require( 'gulp-sourcemaps' );
var rename = require( 'gulp-rename' );

function buildJS() {
  'use strict';
  gulp.src( 'src/index.js' )
    .pipe( plumber() )
    .pipe( jshint() )
    .pipe( gulp.dest( 'dist/' ) );
}

function deployJS() {
  'use strict';
  gulp.src( 'dist/index.js' )
    .pipe( plumber() )
    .pipe( maps.init() )
    .pipe( uglify( {
      compress: true,
      mangle: true,
      keepComments: false
    } ) )
    .pipe( rename( 'index.min.js' ) )
    .pipe( maps.write( './' ) )
    .pipe( gulp.dest( 'dist/' ) );
}

function copyAssets() {
  'use strict';
  gulp.src( 'src/frameworks/*' )
    .pipe( gulp.dest( 'dist/frameworks/' ) );

  gulp.src( 'src/errors.json' )
    .pipe( gulp.dest( 'dist/' ) );
}

gulp.task( 'default', [ 'deploy' ] );
gulp.task( 'deploy', [ 'build' ], deployJS );
gulp.task( 'assets', copyAssets );
gulp.task( 'build', [ 'assets' ], buildJS );

var EasyQuery = require( './dist/index.js' )( { lib: 'skeleton2' } );

EasyQuery.getVariables();
