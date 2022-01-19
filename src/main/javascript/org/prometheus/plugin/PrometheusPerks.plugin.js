/**
 * @name PrometheusPerks
 * @author NormalBettle437
 * @authorId 725079599297331200
 * @source https://raw.githubusercontent.com/NormalBettle437/PrometheusPerks/main/src/main/javascript/org/prometheus/plugin/PrometheusPerks.plugin.js
 * @updateUrl https://raw.githubusercontent.com/NormalBettle437/PrometheusPerks/main/src/main/javascript/org/prometheus/plugin/PrometheusPerks.plugin.js
 * @version 1.0.0
 * @description Allows you to locally assign a banner or an avatar of your choosing
 */

 module.exports = (() => {
    const config = {
        "info": {
            "name": "PrometheusPerks",
            "author": "NormalBettle437",
            "version": "1.0.0",
            "description": "Allows you to locally assign a banner or an avatar of your choosing"
        }
    };
    return !window.BDFDB_Global || (!window.BDFDB_Global.loaded && !window.BDFDB_Global.started) ? class {
    
        getName() {
            return config.info.name;
        }

        getAuthor() {
            return config.info.author;
        }

        getVersion() {
            return config.info.version;
        }

        getDescription() {
            return config.info.description;
        }

        load() {
            if (!window.BDFDB_Global || !Array.isArray(window.BDFDB_Global.pluginQueue)) {

                window.BDFDB_Global = Object.assign({}, window.BDFDB_Global, {

                    pluginQueue: []
                });
            }
            if (!window.BDFDB_Global.downloadModal) {

                window.BDFDB_Global.downloadModal = true;
                BdApi.showConfirmationModal("Library Missing", `The plugin library needed for ${config.info.name} is missing`, {

                    confirmText: "Download",
                    cancelText: "Cancel",

                    onCancel: () => {

                        delete window.BDFDB_Global.downloadModal;
                    },

                    onConfirm: () => {

                        delete window.BDFDB_Global.downloadModal;
                        require("request").get("https://mwittrien.github.io/BetterDiscordAddons/Library/0BDFDB.plugin.js", (error, request, body) => {
                            if (!error && body && request.statusCode == 200) {

                                require("fs").writeFile(require("path").join(BdApi.Plugins.folder, "0BDFDB.plugin.js"), body, () => BdApi.showToast("Finished downloading the BDFDB library plugin", {

                                    type: success
                                }));
                            } else {

                                BdApi.alert("Error", "Could not download the BDFDB plugin library");
                            }
                        });
                    }
                });
            }
            if (!window.BDFDB_Global.pluginQueue.includes(config.info.name)) {

                window.BDFDB_Global.pluginQueue.push(config.info.name);
            }
        }

        start() {

            this.load();
        }

        stop() {
        }
    } : (([Plugin, BDFDB]) => {
        return class PrometheusPerks extends Plugin {

            
        };
    })(window.BDFDB_Global.PluginUtils.buildPlugin(config));
 })();
 