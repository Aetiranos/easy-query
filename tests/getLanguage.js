function getLanguageHelper(lang) {
  'use strict';
  if ( typeof lang === 'string' && lang.length > 0) {
    return lang;
  } else {
    return 'unable to retrieve language';
  }
}

describe( 'getLanguage', function() {
  'use strict';
  it( 'Should return a string.', function() {
    var lang = 'scss';
    expect( getLanguageHelper( lang ) ).toEqual( 'scss' );
  });
  it( 'Should throw an error if \'lang\' is not set.', function() {
    var lang = '';
    expect( getLanguageHelper( lang ) ).toEqual( 'unable to retrieve language' );
  });
});
