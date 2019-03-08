![Sleep Adder Diagram](diagram.png)

An example implementation of relays.

```js
const Relay = require('../../index.js');

/**
 * a function that returns a Promise that resolves at a given
 * amount of time. 
 */
const sleep = x => new Promise(y => setTimeout(y, x));

/**
 * Create an input that filters a number
 */
const InputA = new Relay(x => typeof x === 'number' && x);

/**
 * Create another input that filters a number but returns
 * it after 1000ms
 */
const InputB = new Relay(async x => {
    if(typeof x === 'number'){
        await sleep(1000);
        return x;
    }
    return 0;
});

/**
 * Create a relay that adds the inputs
 */
const Adder = new Relay((x, y) => x + y);

/**
 * Connect inputs to adder
 */
InputA.connectTo(Adder);
InputB.connectTo(Adder);

/**
 * pass a processor to adder that displays the sum.
 */
Adder.pass(x => console.log("The sum is ", x));

/**
 * Trigger inputs
 */
InputA.receive(127);
InputB.receive(128);
```

example output:

```bash
$ node examples/sleepyAdder
The sum is  255
```