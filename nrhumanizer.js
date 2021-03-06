/*jshint devel: true, node: true, indent: 2*/
/**
* Copyright (c) 2015 Julian Knight (Totally Information)
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
* http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
**/

// Node for Node-Red that humalizes a timespan msg.payload.[] //TODO whould this be extended to work on Date objects as well and if so how?
// It is helpful when working with ui things that informs users of time since last operation etc.

// require moment.js (must be installed from package.js as a dependency)
var moment = require('moment-timezone');
var validator = require('validator');
var async = require('async');
var util = require('util');

// Module name must match this nodes html file
var moduleName = 'humanizer';

module.exports = function (RED) {
    'use strict';

    // The main node definition - most things happen in here
    function nodeGo(config) {
        // Create a RED node
        RED.nodes.createNode(this, config);

        // Store local copies of the node configuration (as defined in the .html)
        this.topic = config.topic;
        this.input = config.input || 'payload'; // where to take the input from

        // copy "this" object in case we need it in context of callbacks of other functions.
        var node = this;

        // respond to inputs....
        node.on('input', function (msg) {
            'use strict';

            console.log('input:' + this.input);
            if (this.input.indexOf(',') > -1) { //handle multiple commaseparated arguments
                var names = this.input.split(',');
                async.map(names, decorateInput.bind(null, msg), function (err) {
                    return node.send(msg);
                });
            }
            else {

                //handle single prop or numerical
                var v = msg.payload.hasOwnProperty(this.input) ? msg.payload[this.input] : '' + msg.payload;
                v = '' + v;
                if (!validator.isInt(v))
                    return node.warn('Invalid input for humanize call:' + this.input);

                var _humanized = moment.duration(v * 1000).humanize();
                if (typeof (msg.payload) == 'object') {
                    msg.payload['hum_' + this.input] = _humanized; //behave like multiple
                }
                else {
                    msg.payload = { 'humanized': _humanized };
                }

                node.send(msg);
            }
        });

        function decorateInput(obj, propertyName, callback) {
            console.log(propertyName + ' ' + util.inspect(obj));
            propertyName = propertyName.trim();
            if (obj.hasOwnProperty(propertyName) == true) {
                var v = msg.payload[propertyName];
                v = '' + v;
                if (!validator.isInt(v))
                    return node.warn('Invalid input for humanize call');

                var _humanized = moment.duration(v * 1000).humanize();
                if (typeof (obj) == 'object') {
                    msg.payload['hum_' + propertyName] = _humanized;
                }
                else {
                    node.error('msg.payload should be an object when decorating the output, got:' + typeof (obj));
                }

                callback();
            }
        }
    } // ---- end of nodeGo function ---- //

    // Register the node by name. This must be called before overriding any of the
    // Node functions.
    RED.nodes.registerType(moduleName, nodeGo);
};
