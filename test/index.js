const assert = require("assert");

const Relay = require("../index.js");

describe('Relay', function (){
    describe('#connectTo', function (){
        it('should return the same Relay reference', function (){
            const A = new Relay();
            const B = new Relay();

            assert(A === A.connectTo(B));
        });
    });

    describe('#connectFrom', function (){
        it('should return the same Relay reference', function (){
            const A = new Relay();
            const B = new Relay();

            assert(A === A.connectFrom(B));
        });
    });
    describe('#receive', function (){
        it('should return the same Relay reference', function (){
            const A = new Relay();

            assert(A === A.receive("Hello World"));
        });
    });
    describe('#pass', function (){
        it('should return the same Relay reference', function (){
            const A = new Relay();

            assert(A === A.pass(x => x));
        });
    });
});