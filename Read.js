module.exports = function (RED) {
    var dc = require('./Calls.js');

    function Read(cfg) {
        "use strict";
        RED.nodes.createNode(this, cfg);
        var node = this;
        node.config = cfg;

        // node-specific code goes here
        var util = require('util');
        var async = require('async');
        var request = require('request');

        this.source = RED.nodes.getNode(node.config.source);

        //Handle input
        this.on('input', function (msg) {
            this.log('input:' + util.inspect(msg));
            readLatest();
        });

        this.on('close', function () {
            this.log('Read close');
        });

        function readLatest() {
            dc.read(node.source, node.config.from, node.config.variable, function (err, obj) {
                if (err) {
                    node.error(err);
                }
                else {
                    var msg = {};
                    msg.payload = { ok: true }
                    msg.topic = node.variable;
                    msg.payload.data = obj;
                    //console.log('sending msg:' + util.inspect(msg));
                    node.send(msg);
                }
            });
        }
    }
    
    RED.nodes.registerType("Read", Read);
}