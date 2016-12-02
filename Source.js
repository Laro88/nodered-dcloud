module.exports = function (RED) {
    function DCloudSource(cfg) {
        "use strict";
        RED.nodes.createNode(this, cfg);
        this.serverUrl = cfg.serverUrl;
        if (this.credentials && this.credentials.userToken)
            this.userToken = this.credentials.userToken;
        else
            this.userToken = "missinguserToken";

        this.deviceuuid = cfg.deviceuuid;
        this.name = cfg.name;
    }

    RED.nodes.registerType("DCloud-Source", DCloudSource, {
        credentials: {
            userToken: {type:"text"}
        }
    });
}