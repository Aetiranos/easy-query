function getLanguagesHelper(lang) {
  'use strict';
  if ( lang.constructor === Array && lang.length > 0) {
    for ( var x = 0; x < lang.length; x++ ) {
      if ( typeof lang[x] !== 'string' ) {
        return 'invalid: member of \'lang\' is not a string';
      }
    }
    return lang;
  } else {
    return 'unable to retrieve languages';
  }
}

describe( 'getLanguages', function() {
  'use strict';
  it( 'Should return an array of supported languages.', function() {
    var lang = ['scss', 'less', 'sass'];
    expect( getLanguagesHelper( lang ) ).toEqual( ['scss', 'less', 'sass'] );
  });
  it( 'Should throw an error if \'lang\' is not set.', function() {
    var lang = [];
    expect( getLanguagesHelper( lang ) ).toEqual( 'unable to retrieve languages' );
  });
});
