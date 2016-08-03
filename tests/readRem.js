var readRemHelper = function( cfg ) {
  'use strict';
  if ( typeof cfg === 'undefined' ) {
    return 'load default';
  } else if ( cfg.hasOwnProperty( 'rem' ) ) {
    if (typeof cfg.rem === 'number') {
      return 'valid rem';
    } else {
      return 'invalid rem';
    }
  } else {
    return 'load default';
  }
};

describe( '_readRem', function() {
  'use strict';
  it( 'Should accept an object with a \'rem\' property passed in.', function() {
    expect( readRemHelper( { rem: 15 } ) ).toEqual( 'valid rem' );
  } );
  it( 'Should only accept \'rem\' if it is of type number.', function() {
    expect( readRemHelper( { rem: 12 } ) ).toEqual( 'valid rem' );
    expect( readRemHelper( { rem: 'test' } ) ).toEqual( 'invalid rem' );
  } );
  it( 'Should load the default value if \'rem\' is not specified.', function() {
    expect( readRemHelper() ).toEqual( 'load default' );
  });
} );
