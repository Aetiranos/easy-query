describe('getArgumentCount', function() {
    var count = arguments.length;
    it('Should be 0 or 1', function() {
        expect(count).toBeGreaterThan(-1);
        expect(count).toBeLessThan(2);
    });
});