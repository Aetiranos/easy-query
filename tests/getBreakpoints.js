function getBreakpointsHelper(lib) {
  'use strict';
  if ( lib.constructor === Array && lib.length > 0) {
    for ( var x = 0; x < lib.length; x++ ) {
      if ( typeof lib[x] !== 'number' ) {
        return 'invalid: member of \'lib\' is not a number';
      }
    }
    return lib;
  } else {
    return 'unable to retrieve breakpoints';
  }
}

describe( 'getBreakpoints', function() {
  'use strict';
  it( 'Should return an array of numbers.', function() {
    var lib = [10, 30, 50];
    expect( getBreakpointsHelper( lib ) ).toEqual( [10, 30, 50] );
  });
  it( 'Should throw an error if \'lib\' is not set.', function() {
    var lib = [];
    expect( getBreakpointsHelper( lib ) ).toEqual( 'unable to retrieve breakpoints' );
  });
});
