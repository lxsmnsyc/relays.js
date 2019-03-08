# relays.js

A library for controlling asynchronous flow of execution

## What are Relays

Relays are a representation of an asynchronous callback which can receive inputs when a relay accepts inputs, process those inputs and return an output. You can imagine it as a hybrid of an observer and an observable, except that Relays won't start executing the callback if the inputs received does not match the required number of connected inputs.

For example,

```js
let AndGate = new Relay((a, b) => a && b);
let AndGateInputA = new Relay(x => typeof x === "boolean" && x);
let AndGateInputB = new Relay(x => typeof x === "boolean" && x);

AndGateInputA.connectTo(AndGate);
AndGateInputB.connectTo(AndGate);

AndGate.pass(x => console.log("The result is " + x));

AndGateInputA.receive(true);
AndGateInputB.receive(true);
```

The code represents a simple implementation of AND gate through the use of Relays. ```AndGateInputA``` and ```AndGateInputB``` are what we call "input Relays", they are connected to an arbitrary amount of Relays (in this case, we only have one output relay, the ```AndGate```), and whenever they receive an input, they are going to process it with their callbacks (```x => typeof x === "boolean" && x```) after which they are going to emit it to their output relay. Input relays can receive, process and pass the information at an arbitrary time.

The output Relay, on the other hand, waits for its input Relays to pass information to it until such time it can process the information and pass it to its output Relay. Output Relays don't know when will the inputs arrive, until such time, the inputs already received will be pending (which means, Output Relays can receive the inputs, but they cannot process it until the necessary amount of inputs are met), so both codes below do the same thing.

```js
AndGate.receive(true, true);
```

```js
AndGateInputA.receive(true);
AndGateInputB.receive(true);
```

The sequence of inputs depends on the arrival time. Relays don't know which inputs came from which input Relays, what it only knows is what are the input values.

Once all input Relays have been executed, and passed the resulting information to their output Relays, the output Relay will then start processing the received inputs.
In our example, once both AndGateInputs have received an input, their respective callbacks are then executed to process the inputs, in which they will pass their result to the AndGate. The AndGate will then receive the two inputs, process it and pass it to an anonymous Relay, ```x => console.log("The result is " + x)```.

As a summary, think of Relays as an individual representation of a Promise.all except that it is reusable and can wait for itself to resolve (Relays can connect to itself). For AI enthusiasts, think of Relays like a Perceptron model except that there is no backpropagation and no calibration.

## Examples

* [AND Gate](https://github.com/LXSMNSYC/relays.js/tree/master/examples/andGate)
* [Byte Multiplexer](https://github.com/LXSMNSYC/relays.js/tree/master/examples/byteMultiplexer)
* [Sleepy Adder](https://github.com/LXSMNSYC/relays.js/tree/master/examples/sleepyAdder)

## License

MIT License

Copyright (c) 2019 Alexis Munsayac

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.