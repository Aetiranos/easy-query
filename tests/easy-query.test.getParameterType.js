describe('getParameterType', function() {
    var param = arguments[0];
    it('Should be a string, an array, or undefined', function() {
        if(param) {
            expect(typeof param).toBe('string');
            expect(param.constructor).toBe(Array);

            if(param.constructor === Array) {
                it('Should contain only numbers', function() {
                    for(var x = 0; x < param.length; x++) {
                        expect(typeof param[x]).toBe('number');
                    }
                });
            }
        } else {
            expect(param).toBeUndefined();
        }
    })
});