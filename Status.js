module.exports = function (RED) {
    var dc = require('./Calls.js');

    function Status(cfg) {
        "use strict";
        RED.nodes.createNode(this, cfg);
        var node = this;
        node.config = cfg;

        // node-specific code goes here
        var util = require('util');
        var async = require('async');
        var request = require('request');

        this.source = RED.nodes.getNode(node.config.source);
        testSource();

        var timerRef = 0;
        

        this.on('close', function () {
            clearTimeout(timerRef);
            this.log('Status close');
        });

        function testSource() {
            try {
                var msg = {};
                msg.topic = "statusErr";
                if (node.source) {
                    node.status({ fill: "yellow", shape: "ring", text: "testing source" });
                    dc.status(node.source, function (err, res) {
                        msg.payload = res;
                        if (err) {
                            console.log(err);
                            node.status({ fill: "red", shape: "ring", text: "err" });
                        }
                        else {
                            node.status({ fill: "green", shape: "ring", text: "ok" });
                            msg.topic = "statusOk";
                        }
                        txandrerun(msg);
                    });
                }
                else {
                    node.status({ fill: "red", shape: "ring", text: "source missing" });
                    msg.payload = "Source missing";
                    txandrerun(msg);
                }
                
            }
            catch (err) {
                console.error(err);
                timerRef = setTimeout(testSource, 30 * 1000);
            }
        }

        /**
         * Transmit the message and rearm the timer
         * @param msg
         */
        function txandrerun(msg) {
            node.send(msg);
            timerRef = setTimeout(testSource, 30 * 1000);
        }


    }
    
    RED.nodes.registerType("Status", Status);
}