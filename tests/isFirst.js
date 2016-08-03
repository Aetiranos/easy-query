var terms = [ 'sm', 'md', 'lg', 'xl' ];
var rpx = 0.0625;

var isFirstHelper = function( points, key, lang) {
  'use strict';
  var pfx = lang === 'less' ? '@' : '$';
  var braceL = lang === 'scss' ? '{' : '';
  var braceR = lang === 'scss' ? '}' : '';
  var query = lang === 'less' ? '@{' : '#{$';
  var nl = lang === 'scss' ? '\n\n' : '\n';
  var nl2 = lang === 'scss' ? '\n' : '';
  var gap = lang === 'scss' ? ' ' : '';
  if ( points.constructor !== Array ) {
    return 'invalid: points must be an array';
  } else if ( typeof key !== 'number' ) {
    return 'invalid: key must be a number';
  } else {
    for ( var x = 0; x < points.length; x++ ) {
      if ( typeof points[x] !== 'number' ) {
        return 'invalid: the points array must only contain numbers';
      }
    }
    return pfx + terms[key] + '-only: \'' + query + 'screen} and (max-width: ' + (points[0] - rpx) + 'rem)\';\n' +
      '.' + terms[key] + '-only' + gap + braceL + '\n    display: none;' + nl2 + braceR + nl;
  }
};

describe( '_isFirst', function() {
  'use strict';
  /** SCSS ****************************************************************************************************************** **/
  it( 'Should only take an array of numbers as the first parameter. (scss)', function() {
    expect( isFirstHelper( 'test', 0, 'scss' ) ).toEqual( 'invalid: points must be an array' );
    expect( isFirstHelper( [10, 20, 30], 0, 'scss' ) ).toEqual( '$sm-only: \'#{$screen} and (max-width: 9.9375rem)\';\n' +
      '.sm-only {\n    display: none;\n}\n\n' );
    expect( isFirstHelper( 'test', 3, 'scss' ) ).toEqual( 'invalid: points must be an array' );
    it( 'Should return an error if any of the members of the array are not numbers.', function() {
      expect( isFirstHelper( [ 1, 2, 'test' ], 4, 'scss' ) ).toEqual( 'invalid: the points array must only contain numbers' );
    } );
  } );
  it( 'Should only take a number as the second parameter. (scss)', function() {
    expect( isFirstHelper( [10, 20, 30], 'test', 'scss' ) ).toEqual( 'invalid: key must be a number' );
    expect( isFirstHelper( [10, 20, 30], 0, 'scss' ) ).toEqual( '$sm-only: \'#{$screen} and (max-width: 9.9375rem)\';\n' +
      '.sm-only {\n    display: none;\n}\n\n' );
  } );
  /** SASS ****************************************************************************************************************** **/
  it( 'Should only take an array of numbers as the first parameter. (sass)', function() {
    expect( isFirstHelper( 'test', 0, 'sass' ) ).toEqual( 'invalid: points must be an array' );
    expect( isFirstHelper( [10, 20, 30], 0, 'sass' ) ).toEqual( '$sm-only: \'#{$screen} and (max-width: 9.9375rem)\';\n' +
      '.sm-only\n    display: none;\n' );
    expect( isFirstHelper( 'test', 3, 'sass' ) ).toEqual( 'invalid: points must be an array' );
    it( 'Should return an error if any of the members of the array are not numbers.', function() {
      expect( isFirstHelper( [ 1, 2, 'test' ], 4, 'sass' ) ).toEqual( 'invalid: the points array must only contain numbers' );
    } );
  } );
  it( 'Should only take a number as the second parameter. (sass)', function() {
    expect( isFirstHelper( [10, 20, 30], 'test', 'sass' ) ).toEqual( 'invalid: key must be a number' );
    expect( isFirstHelper( [10, 20, 30], 0, 'sass' ) ).toEqual( '$sm-only: \'#{$screen} and (max-width: 9.9375rem)\';\n' +
      '.sm-only\n    display: none;\n' );
  } );
  /** LESS ****************************************************************************************************************** **/
  it( 'Should only take an array of numbers as the first parameter. (less)', function() {
    expect( isFirstHelper( 'test', 0, 'less' ) ).toEqual( 'invalid: points must be an array' );
    expect( isFirstHelper( [10, 20, 30], 0, 'less' ) ).toEqual( '@sm-only: \'@{screen} and (max-width: 9.9375rem)\';\n' +
      '.sm-only\n    display: none;\n' );
    expect( isFirstHelper( 'test', 3, 'less' ) ).toEqual( 'invalid: points must be an array' );
    it( 'Should return an error if any of the members of the array are not numbers.', function() {
      expect( isFirstHelper( [ 1, 2, 'test' ], 4, 'less' ) ).toEqual( 'invalid: the points array must only contain numbers' );
    } );
  } );
  it( 'Should only take a number as the second parameter. (less)', function() {
    expect( isFirstHelper( [10, 20, 30], 'test', 'less' ) ).toEqual( 'invalid: key must be a number' );
    expect( isFirstHelper( [10, 20, 30], 0, 'less' ) ).toEqual( '@sm-only: \'@{screen} and (max-width: 9.9375rem)\';\n' +
      '.sm-only\n    display: none;\n' );
  } );
} );
