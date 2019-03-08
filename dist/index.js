var Relay = (function () {
    'use strict';

    /**
     * @license
     * MIT License
     *
     * Copyright (c) 2019 Alexis Munsayac
     * Permission is hereby granted, free of charge, to any person obtaining a copy
     * of this software and associated documentation files (the 'Software'), to deal
     * in the Software without restriction, including without limitation the rights
     * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
     * copies of the Software, and to permit persons to whom the Software is
     * furnished to do so, subject to the following conditions:
     *
     * The above copyright notice and this permission notice shall be included in all
     * copies or substantial portions of the Software.
     *
     * THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
     * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
     * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
     * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
     * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
     * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
     * SOFTWARE.
     *
     *
     * @author Alexis Munsayac <alexis.munsayac@gmail.com>
     * @copyright Alexis Munsayac 2019
     */
    /**
     * @ignore
     */
    const isPromise = obj =>!!obj && (typeof obj === 'object' || typeof obj === 'function') && typeof obj.then === 'function';
    /**
     * @ignore
     */
    const identity = (...args) => args;

    /**
     * A callback processor which receives the input from input Relays, 
     * process the inputs, and passes the output to output Relays.
     * 
     * If the processor is an async function or a function returns a Promise-like
     * object, the result is passed on fulfillment of the object.
     * 
     * @callback ProcessorCallback
     * @param {...*} inputs
     * @returns {*}
     */
    /**
     * @class
     * @classdesc
     * Relays are a representation of an asynchronous callback which can receive inputs 
     * when a relay accepts inputs, process that inputs and return an output. 
     * You can imagine it as a hybrid of an observer and an observable, 
     * except that Relays won't start executing the callback if the inputs 
     * received does not match the required number of connected inputs.
     * @example
     * let AndGate = new Relay((a, b) => a && b);
     * let AndGateInputA = new Relay(x => typeof x === 'boolean' && x);
     * let AndGateInputB = new Relay(x => typeof x === 'boolean' && x);
     * 
     * AndGateInputA.connectTo(AndGate);
     * AndGateInputB.connectTo(AndGate);
     * 
     * AndGate.pass(x => console.log('The result is ' + x));
     * 
     * AndGateInputA.receive(true);
     * AndGateInputB.receive(true);
     */
    class Relay{
        /**
         * Creates a Relay object with the given processor.
         * @param {ProcessorCallback} processor 
         * @returns {Relay}
         */
        constructor(processor){
            if(typeof processor === 'function'){
                this._processor = processor;
            } else {
                this._processor = identity;
            }

            /**
             * The array of input Relays
             * @ignore
             */
            this._input = [];
            /**
             * The array of output Relays
             * @ignore
             */
            this._output = [];
            /**
             * The array of received inputs
             * @ignore
             */
            this._received = [];
        }
        /**
         * Connects the given relay to another relay that will serve as
         * an output relay.
         * @param {Relay} outputRelay
         * @returns {Relay} for chaining purposes, the given relay is returned. 
         */
        connectTo(outputRelay){
            /**
             * Relay check
             * @ignore
             */
            if(outputRelay instanceof Relay){
                /**
                 * Check if outputRelay is not yet in output array
                 * or check if the given relay is not an input relay
                 * for outputRelay.
                 * @ignore
                 */
                const input = outputRelay._input;
                const output = this._output;

                if(!output.includes(outputRelay)){
                    /**
                     * add inputRelay to output array
                     * @ignore
                     */
                    output.push(outputRelay);
                }

                if(!input.includes(this)){
                    /**
                     * add given relay to input array
                     * @ignore
                     */
                    input.push(this);
                }
            }
            /**
             * Return the reference for chaining
             * @ignore
             */
            return this;
        }
        /**
         * Connects the given relay to another relay that will serve as
         * an input relay.
         * @param {Relay} inputRelay
         * @returns {Relay} for chaining purposes, the given relay is returned. 
         */
        connectFrom(inputRelay){
            inputRelay.connectTo(this);
            return this;
        }
        /**
         * Disconnects the given relay from an output relay
         * @param {Relay} outputRelay 
         * @returns {Relay} for chaining purposes, the given relay is returned. 
         */
        disconnectTo(outputRelay){
            /**
             * Relay check
             * @ignore
             */
            if(outputRelay instanceof Relay){
                /**
                 * Check if outputRelay is in output array
                 * or check if the given relay is an input relay
                 * for outputRelay.
                 * @ignore
                 */
                const input = outputRelay._input;
                const output = this._output;

                if(output.includes(outputRelay)){
                    this._output = output.filter(x => x !== outputRelay);
                }

                if(!input.includes(this)){
                    outputRelay._input = input.filter(x => x !== this);
                }
            }
            /**
             * Return the reference for chaining
             * @ignore
             */
            return this;
        }
        /**
         * Disconnects the given relay from an output relay
         * @param {Relay} outputRelay 
         * @returns {Relay} for chaining purposes, the given relay is returned. 
         */
        disconnectFrom(inputRelay){
            inputRelay.disconnectTo(this);
            return this;
        }
        /**
         * Receive inputs and process them if the required amount of inputs are
         * met or save the inputs as a pending input
         * @param {...*} args 
         * @return {Relay} for chaining purposes, the given relay is returned. 
         */
        receive(...args){
            const processor = this._processor;
            /**
             * Get the amount of arguments
             * @ignore
             */
            const argSize = args.length;
            /**
             * Get the input and output
             * @ignore
             */
            const input = this._input;
            const output = this._output;
            /**
             *  Process the result to the output Relays 
             * @ignore
             */
            const processOutput = x => {
                /**
                 * Pass the result value to the output Relays
                 * @ignore
                 */
                for(const output of this._output){
                    output.receive(x);
                }
            };
            /**
             * Process the arguments
             * @ignore
             */
            const processArgs = preparedArgs => {
                /**
                 * call the processor
                 * @ignore
                 */
                let result;
                try{
                    result = processor.apply(null, preparedArgs);
                } catch {
                    return this;
                }
                /**
                 * Check if result is Promise-like
                 * @ignore
                 */
                if(isPromise(result)){
                    /**
                     * Attach a callback to the result
                     * @ignore
                     */
                    result.then(processOutput);
                } else {
                    processOutput(result);
                }
                return this;
            };
            /**
             * Get the required amount of inputs
             * @ignore
             */
            const inputSize = input.length;

            if(0 == inputSize){
                return processArgs(args);
            }
            /**
             * Check if the amount of arguments combined with 
             * the amount of received inputs is larger than 
             * the amount of inputs required.
             * @ignore
             */
            this._received = [...this._received, ...args];
            while(inputSize <= this._received.length){
                /**
                 * Get the received inputs
                 * @ignore
                 */
                const received = this._received;
                /**
                 * Create a new set of arguments for the
                 * necessary input size, if the argsSize +
                 * receivedSize exceeds the inputSize.
                 * 
                 * The remaining inputs will be used for the
                 * next processes.
                 * @ignore
                 */
                processArgs(received.slice(0, inputSize));
                this._received = received.slice(inputSize);
                
            }

            /**
             * Return the reference for chaining
             * @ignore
             */
            return this;
        }
        /**
         * Creates an anonymous output relay for the
         * given relay.
         * @param {ProcessorCallback} processor 
         * @returns {Relay} for chaining purposes, the given relay is returned.
         */
        pass(processor){
            return this.connectTo(new Relay(processor));
        }
    }

    return Relay;

}());
