﻿module.exports = function (RED) {
    function DCloudSource(cfg) {
        "use strict";
        RED.nodes.createNode(this, cfg);
        this.serverUrl = cfg.serverUrl;
        this.userToken = cfg.userToken;
        this.deviceuuid = cfg.deviceuuid;
        this.name = cfg.name;
    }

    RED.nodes.registerType("DCloud-Source", DCloudSource);
}