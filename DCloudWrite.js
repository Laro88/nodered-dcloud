module.exports = function (RED) {
    var dc = require('./DCloudCalls.js');

    function DCloudWrite(cfg) {
        "use strict";
        RED.nodes.createNode(this, cfg);
        var node = this;
        node.config = cfg;

        // node-specific code goes here
        var util = require('util');

        this.source = RED.nodes.getNode(node.config.source);

        //Handle input
        this.on('input', function (msg) {
            this.log('input:' + util.inspect(msg));

            var obj = JSON.parse(msg.payload);
            var value = obj.value;
            node.log('value in write:' + value);
            dc.write(node.source, node.config, value, function (err, obj) {
                if (err) {
                    node.error(err);
                }
                //else {
                //    var msg = {};
                //    msg.payload = { ok: true }
                //    msg.topic = node.variable;
                //    msg.payload.data = obj;
                //    //console.log('sending msg:' + util.inspect(msg));
                //    node.send(msg);
                //}
            })
        });
    }

    RED.nodes.registerType("DCloudWrite", DCloudWrite);
}