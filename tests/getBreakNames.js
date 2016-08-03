function getBreakNamesHelper(count) {
  'use strict';
  if (typeof count === 'number' && count >= 1 && count <= 5) {
    switch (count) {
      case 1: return ['sm', 'lg'];
      case 2: return ['sm', 'md', 'lg'];
      case 3: return ['xs', 'sm', 'md', 'lg'];
      case 4: return ['xs', 'sm', 'md', 'lg', 'xl'];
      case 5: return ['xs', 'sm', 'md', 'lg', 'xl', 'xx'];
    }
  } else {
    if ( typeof count !== 'number' ) {
      return 'invalid: unsupported parameter type';
    } else {
      return 'invalid: out of bounds';
    }
  }
}

describe( 'getBreakNames', function() {
  'use strict';
  it( 'Should only take a number as a parameter.', function() {
    expect( getBreakNamesHelper( 'test' ) ).toEqual( 'invalid: unsupported parameter type' );
    expect( getBreakNamesHelper( 3 ) ).toEqual( ['xs', 'sm', 'md', 'lg'] );
    it( 'Must be greater than zero.', function() {
      expect( getBreakNamesHelper( 0 ) ).toEqual( 'invalid: out of bounds' );
      expect( getBreakNamesHelper( 1 ) ).toEqual( ['sm', 'lg'] );
    });
    it( 'Must be less than six.', function() {
      expect( getBreakNamesHelper( 6 ) ).toEqual( 'invalid: out of bounds' );
      expect( getBreakNamesHelper( 1 ) ).toEqual( ['sm', 'lg'] );
    });
  });
  it( 'Should return a properly formatted array of strings.', function() {
    expect( getBreakNamesHelper( 1 ) ).toEqual( ['sm', 'lg']);
    expect( getBreakNamesHelper( 2 ) ).toEqual( ['sm', 'md', 'lg']);
    expect( getBreakNamesHelper( 3 ) ).toEqual( ['xs', 'sm', 'md', 'lg']);
    expect( getBreakNamesHelper( 4 ) ).toEqual( ['xs', 'sm', 'md', 'lg', 'xl']);
    expect( getBreakNamesHelper( 5 ) ).toEqual( ['xs', 'sm', 'md', 'lg', 'xl', 'xx']);
  });
});
