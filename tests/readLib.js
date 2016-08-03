function readLibHelper(cfg) {
  'use strict';
  if ( ( typeof cfg === 'object' && cfg.hasOwnProperty( 'lib' ) && cfg.lib.constructor === Array ) || cfg.constructor === Array) {
    if ( cfg.constructor !== Array ) {
      cfg = cfg.lib;
    }

    var isStrings = true;
    for ( var x = 0; x < cfg.length; x++ ) {
      if ( typeof cfg[x] !== 'string' || ( typeof cfg[x] === 'string' && /^[0-9]+(px|em|rem)$/.test(cfg[x].toLowerCase() === false ) ) ) {
        isStrings = false;
      }
    }
    if ( isStrings && cfg.length > 0 && cfg.length < 6 ) {
      return 'valid array';
    } else {
      if (cfg.length < 1 || cfg.length > 5) {
        return 'invalid: out of bounds';
      } else {
        return 'invalid: other';
      }
    }
  } else if ( typeof cfg === 'object' && cfg.hasOwnProperty('lib') && typeof cfg.lib === 'string' ) {
    cfg = cfg.lib;
  }
  if ( typeof cfg === 'string' ) {
    var elements = [
      'bootstrap3',
      'bootstrap4',
      'foundation5',
      'foundation6forsites',
      'foundation6forapps',
      'foundation6foremail',
      'skeleton2',
      'openframework'
    ];
    for ( var elem in elements ) {
      if ( cfg === elements[elem] ) {
        return 'valid framework';
      }
    }
    return 'invalid: unsupported framework';
  } else if ( typeof cfg === 'undefined' ) {
    return 'load default';
  } else {
    return 'invalid: unsupported parameter type';
  }
}

describe( '_readLib', function() {
  'use strict';
  it( 'Should accept objects.', function() {
    it( 'Should load defaults if the object does not contain a \'lib\' property.', function() {
      expect( readLibHelper( { } ) ).toEqual( 'load default' );
    });
    it( 'Should have a \'lib\' property that is an array of strings or a string representing a valid framework.', function() {
      expect( readLibHelper( { lib: 'bootstrap3' } ) ).toEqual( 'valid framework' );
      expect( readLibHelper( { lib: [ '10px', '20em', '30rem' ] } ) ).toEqual( 'valid array' );
      expect( readLibHelper( { lib: 'test' } ) ).toEqual( 'invalid: unsupported framework' );
      expect( readLibHelper( { lib: [ 10, 20, 30 ] } ) ).toEqual( 'invalid: other' );
      expect( readLibHelper( { lib: true } ) ).toEqual( 'invalid: unsupported framework' );
    });
  });
  it( 'Should accept arrays if all array elements are strings.', function() {
    expect( readLibHelper( '10px', '20px', '5rem', '200em' ) ).toEqual( 'invalid: unsupported framework' );
    expect( readLibHelper( [ 10, 20, 30 ] ) ).toEqual( 'invalid: other' );
    expect( readLibHelper( [true, false, false ]) ).toEqual( 'invalid: other' );
    it( 'Should not accept arrays with zero members or arrays with more than 5 members.', function() {
      expect( readLibHelper( [ '10px', '20em', '30rem', '40px', '50em', '60rem' ] ) ).toEqual( 'invalid: out of bounds' );
      expect( readLibHelper( [ ] ) ).toEqual( 'invalid: out of bounds' );
    });
  });
  it( 'Should accept strings representing valid frameworks.', function() {
    expect( readLibHelper( 'bootstrap3' ) ).toEqual( 'valid framework' );
    expect( readLibHelper( 'testing' ) ).toEqual( 'invalid: unsupported framework' );
  });
  it( 'Should not accept numbers.', function() {
    expect( readLibHelper( 16 ) ).toEqual( 'invalid: unsupported parameter type' );
  });
  it( 'Should not accept booleans.', function() {
    expect( readLibHelper( true ) ).toEqual( 'invalid: unsupported parameter type' );
  });
} );
