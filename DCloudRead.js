module.exports = function (RED) {
    var dc = require('./DCloudCalls.js');

    function DCloudRead(cfg) {
        "use strict";
        RED.nodes.createNode(this, cfg);
        var node = this;
        node.config = cfg;

        // node-specific code goes here
        var util = require('util');
        var async = require('async');
        var request = require('request');

        this.source = RED.nodes.getNode(node.config.source);
        testSource(this.source);

        //Handle input
        this.on('input', function (msg) {
            this.log('input:' + util.inspect(msg));
            readLatest();
        });

        this.on('close', function () {
            this.log('DCloud close');
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
            })
        }

        function testSource(source) {
            if (source) {
                node.status({ fill: "yellow", shape: "ring", text: "testing source" });
                dc.status(node.source, function (err, res) {
                    if (err) {
                        console.log(err);
                        node.status({ fill: "red", shape: "ring", text: "err" });
                    }
                    else {
                        node.status({ fill: "green", shape: "ring", text: "ok" });
                    }
                });
            }
            else {
                node.status({ fill: "red", shape: "ring", text: "source missing" });
            }
        }
    }
    
    RED.nodes.registerType("DCloudRead", DCloudRead);
}