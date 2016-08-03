var mode = null;
function setDebugModeHelper(debugMode) {
  'use strict';
  if ( typeof debugMode !== 'boolean' ) {
    return 'invalid debugMode';
  } else if (mode !== debugMode) {
    mode = debugMode;
  } else {
    return 'valid: param matches value';
  }
  return mode === debugMode ? 'valid debugMode' : 'invalid debugMode';
}

describe( 'setDebugMode', function() {
  'use strict';
  it( 'Should only take a boolean.', function() {
    expect( setDebugModeHelper( true ) ).toEqual( 'valid debugMode' );
    expect( setDebugModeHelper( 'test') ).toEqual( 'invalid debugMode' );
    expect( setDebugModeHelper( 12 ) ).toEqual( 'invalid debugMode' );
    expect( setDebugModeHelper( 1 ) ).toEqual( 'invalid debugMode' );
    expect( setDebugModeHelper( { 'test': 'error' } ) ).toEqual( 'invalid debugMode' );
    expect( setDebugModeHelper( [ 'one', 'two' ] ) ).toEqual( 'invalid debugMode' );
    expect( setDebugModeHelper( false ) ).toEqual( 'valid debugMode' );
  } );
} );
