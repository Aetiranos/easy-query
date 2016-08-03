var languages = [ 'scss', 'sass', 'less' ];
var readLangHelper = function( cfg ) {
  'use strict';
  if ( typeof cfg === 'object' && cfg.hasOwnProperty( 'lang' ) ) {
    for ( var language in languages ) {
      if ( cfg.lang === languages[language] ) {
        return 'valid lang';
      }
    }
    return 'invalid: lang not supported';
  } else if ( typeof cfg === 'object' || typeof cfg === 'undefined' ) {
    return 'load default';
  } else {
    return 'invalid: unsupported parameter type';
  }
};

describe( '_readLang', function() {
  'use strict';
  it( 'Should ensure an object with a \'lang\' property and value is a supported language.', function() {
    expect( readLangHelper( { lang: 'scss' } ) ).toEqual( 'valid lang' );
    expect( readLangHelper( { lang: 'less' } ) ).toEqual( 'valid lang' );
    expect( readLangHelper( { lang: 'sass' } ) ).toEqual( 'valid lang' );
    expect( readLangHelper( { lang: 'test' } ) ).toEqual( 'invalid: lang not supported' );
  } );
  it( 'Should load the default language if a passed object parameter does not specify it.', function() {
    expect( readLangHelper() ).toEqual( 'load default' );
  } );
} );
