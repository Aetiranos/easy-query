var terms = [ 'sm', 'md', 'lg', 'xl' ];
var rpx = 0.0625;
function pxToRem(num) {
  'use strict';
  return num / 16;
}
function generateRangeHelper( points, key, lang) {
  'use strict';
  var pfx = lang === 'less' ? '@' : '$';
  if ( points.constructor !== Array ) {
    return 'invalid: points must be an array';
  } else if ( typeof key !== 'number' ) {
    return 'invalid: key must be a number';
  } else {
    for ( var x = 0; x < points.length; x++ ) {
      if ( typeof points[x] !== 'number' ) {
        return 'invalid: points must be an array of numbers';
      }
    }
    return pfx + terms[key] + '-range: (' + pxToRem(points[key]) +
      ', ' + ( pxToRem(points[++key]) - rpx ) + ');\n';
  }
}

describe( 'generateRange', function() {
  'use strict';
  it( 'Should only take an array of strings as the first parameter.', function() {
    expect( generateRangeHelper( 'test', 2, 'sass' ) ).toEqual( 'invalid: points must be an array' );
    expect( generateRangeHelper( [160, 480, 1200], 0, 'scss' ) ).toEqual( '$sm-range: (10, 29.9375);\n' );
  });
  it( 'Should only take a number as the second parameter.', function() {
    expect( generateRangeHelper( [160, 480, 1200], 'test', 'scss' ) ).toEqual( 'invalid: key must be a number' );
    expect( generateRangeHelper( [160, 480, 1200], 0, 'scss' ) ).toEqual( '$sm-range: (10, 29.9375);\n' );
  });
  it( 'Should return a properly formatted string. (scss)', function() {
    expect( generateRangeHelper( [160, 480, 1200], 0, 'scss' ) ).toEqual( '$sm-range: (10, 29.9375);\n' );
  });
  it( 'Should return a properly formatted string. (sass)', function() {
    expect( generateRangeHelper( [160, 480, 1200], 0, 'sass' ) ).toEqual( '$sm-range: (10, 29.9375);\n' );
  });
  it( 'Should return a properly formatted string. (less)', function() {
    expect( generateRangeHelper( [160, 480, 1200], 0, 'less' ) ).toEqual( '@sm-range: (10, 29.9375);\n' );
  });
});
