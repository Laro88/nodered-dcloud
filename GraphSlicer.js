module.exports = function (RED) {

    var util = require('util');

    function DCloudGraphSlicer(cfg) {
        "use strict";
        RED.nodes.createNode(this, cfg);
        var node = this;
        node.config = cfg;

        //Handle input
        this.on('input', function (msg) {
            //this.log('input:' + util.inspect(msg)+ ' typeof:'  + typeof(msg));

            try {
                var data = msg.payload.data;
                //this.log('data identified:' + util.inspect(data));
                var g = {};

                var lnk_varid_name = {}; //create inverse lookup having varids (when looping through data)
                for (var ptr = 0; ptr < data.variablesRequested.length; ptr++) {
                    var v = data.variablesRequested[ptr];
                    g[v.name] = [];

                    for (var ptrV = 0; ptrV < v.varids.length; ptrV++) {
                        lnk_varid_name[v.varids[ptrV].varid] = v.name;
                    }
                }

                //console.log('lnk:' + util.inspect(lnk_varid_name));

                //loop through data
                for (var ptr = 0; ptr < data.data.length; ptr++) {
                    var d = data.data[ptr];

                    var ts = Date.parse(data.sessions[d.sessionid].tsB);
                    var val = d.val;
                    var name = lnk_varid_name[d.varid];
                    //console.log('name:' + name + ' val:' + val + ' varid:' + d.varid);
                    if (g.hasOwnProperty(name) == true) {
                        g[name].push([ts, val]);
                    }
                }

                //filter - future, remove overloading data :-)

                //build resulting graph arrays
                var msgResult = {};
                msgResult.topic = 'GraphSlicer';
                msgResult.payload = [];
                Object.keys(g).forEach(function (n) {
                    var p = {};
                    p.key = n;
                    p.values = g[n];
                    msgResult.payload.push(p);
                });
                //console.log('msgResult:' + util.inspect(msgResult));
                node.send(msgResult);
            }
            catch (err) {
                console.error(err);
            }
        });
        
    }
    
    RED.nodes.registerType("DCloud-GraphSlicer", DCloudGraphSlicer);
}