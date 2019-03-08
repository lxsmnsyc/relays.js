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
        it('should execute the processor', function (done){
            let result;
            const A = new Relay(x => {result = true;});

            A.receive("Hello World");

            result ? done() : done(false);
        });
        it('should terminate if the processor throws an error.', function (done){
            let result = true;
            const A = new Relay(x => {throw "Oops!";});
            A.pass(x => {result = false});
            A.receive("Hello World");

            result ? done() : done(false);
        });
    });
    describe('#pass', function (){
        it('should return the same Relay reference', function (){
            const A = new Relay();

            assert(A === A.pass(x => x));
        });
        it('should execute on receive', function (done){
            let result;
            const A = new Relay(x => x);
            A.pass(x => {result = true;});
            A.receive("Hello World");

            result ? done() : done(false);
        });
    });
});