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
    describe("#isConnectedTo", function (){
        it('should return a boolean value', function (){
            const A = new Relay();
            const B = new Relay();

            A.connectTo(B);

            assert(typeof A.isConnectedTo(B) === 'boolean');
        });
        it('should return true if the relay is connected to another relay', function (){
            const A = new Relay();
            const B = new Relay();

            A.connectTo(B);

            assert(A.isConnectedTo(B) === true);
        });
        it('should return false if the relay is not connected to another relay', function (){
            const A = new Relay();
            const B = new Relay();

            assert(A.isConnectedTo(B) === false);
        });
        it('should return false if the relay is connected to another relay but on the opposite way', function (){
            const A = new Relay();
            const B = new Relay();

            B.connectTo(A);

            assert(A.isConnectedTo(B) === false);
        });
        it('should return false if the parameter is not a Relay', function (){
            const A = new Relay();

            assert(A.isConnectedTo() === false);
            assert(A.isConnectedTo([]) === false);
            assert(A.isConnectedTo({}) === false);
            assert(A.isConnectedTo(1) === false);
            assert(A.isConnectedTo("") === false);
            assert(A.isConnectedTo(true) === false);
        });
    });
    describe("#isConnectedFrom", function (){
        it('should return a boolean value', function (){
            const A = new Relay();
            const B = new Relay();

            A.connectFrom(B);

            assert(typeof A.isConnectedFrom(B) === 'boolean');
        });
        it('should return true if the relay is connected from another relay', function (){
            const A = new Relay();
            const B = new Relay();

            A.connectFrom(B);

            assert(A.isConnectedFrom(B) === true);
        });
        it('should return false if the relay is not connected from another relay', function (){
            const A = new Relay();
            const B = new Relay();

            assert(A.isConnectedFrom(B) === false);
        });
        it('should return false if the relay is connected from another relay but on the opposite way', function (){
            const A = new Relay();
            const B = new Relay();

            B.connectFrom(A);

            assert(A.isConnectedFrom(B) === false);
        });

        it('should return false if the parameter is not a Relay', function (){
            const A = new Relay();

            assert(A.isConnectedFrom() === false);
            assert(A.isConnectedFrom([]) === false);
            assert(A.isConnectedFrom({}) === false);
            assert(A.isConnectedFrom(1) === false);
            assert(A.isConnectedFrom("") === false);
            assert(A.isConnectedFrom(true) === false);
        });
    });
    describe("#isConnected", function (){
        it('should return a boolean value', function (){
            const A = new Relay();
            const B = new Relay();

            A.connectFrom(B);

            assert(typeof A.isConnectedFrom(B) === 'boolean');
        });
        it('should return true if the relay is connected to another relay', function (){
            const A = new Relay();
            const B = new Relay();

            A.connectTo(B);

            assert(A.isConnected(B) === true);
        });
        it('should return true if the relay is connected from another relay', function (){
            const A = new Relay();
            const B = new Relay();

            A.connectFrom(B);

            assert(A.isConnected(B) === true);
        });
        it('should return false if the relay is not connected from or to another relay', function (){
            const A = new Relay();
            const B = new Relay();

            assert(A.isConnected(B) === false);
        });
        it('should return false if the parameter is not a Relay', function (){
            const A = new Relay();

            assert(A.isConnected() === false);
            assert(A.isConnected([]) === false);
            assert(A.isConnected({}) === false);
            assert(A.isConnected(1) === false);
            assert(A.isConnected("") === false);
            assert(A.isConnected(true) === false);
        });
    });
    describe("#isConnectedBothways", function (){
        it('should return a boolean value', function (){
            const A = new Relay();
            const B = new Relay();

            A.connectFrom(B);

            assert(typeof A.isConnectedBothways(B) === 'boolean');
        });
        it('should return false if the parameter is not a Relay', function (){
            const A = new Relay();

            assert(A.isConnectedBothways() === false);
            assert(A.isConnectedBothways([]) === false);
            assert(A.isConnectedBothways({}) === false);
            assert(A.isConnectedBothways(1) === false);
            assert(A.isConnectedBothways("") === false);
            assert(A.isConnectedBothways(true) === false);
        });
    });
    describe("#disconnectTo", function (){
        it('should return the same Relay reference', function (){
            const A = new Relay();
            const B = new Relay();

            assert(A === A.connectTo(B).disconnectTo(B));
        });
        it('should disconnect succesfully to an output relay', function (){
            const A = new Relay();
            const B = new Relay();

            if(A.connectTo(B).isConnectedTo(B)){
                assert(A.disconnectTo(B).isConnectedTo(B) === false);
            } else {
                assert(false);
            }
        });
    });
    describe("#disconnectFrom", function (){
        it('should return the same Relay reference', function (){
            const A = new Relay();
            const B = new Relay();

            assert(A === A.connectFrom(B).disconnectFrom(B));
        });
        it('should disconnect succesfully to an output relay', function (){
            const A = new Relay();
            const B = new Relay();

            if(A.connectFrom(B).isConnectedFrom(B)){
                assert(A.disconnectFrom(B).isConnectedFrom(B) === false);
            } else {
                assert(false);
            }
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
        it('should be resolved if the processor is an async function or if the result is Promise-like', function (done){
            const A = new Relay(x => new Promise(y => setTimeout(y, 100, x)));
            A.pass(x => x === "Hello World" ? done() : done(false));
            A.receive("Hello World")
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