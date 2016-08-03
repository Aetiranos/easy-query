var mode;
function getDebugModeHelper() {
  'use strict';
  return mode;
}

function setDebug(m) {
  'use strict';
  mode = m;
}

describe('getDebugMode', function() {
  'use strict';
  it('Should return true if debugMode is true.', function() {
    setDebug(true);
    expect(getDebugModeHelper()).toEqual(true);
  });
  it('Should return false if debugMode is false.', function() {
    setDebug(false);
    expect(getDebugModeHelper()).toEqual(false);
  });
});
