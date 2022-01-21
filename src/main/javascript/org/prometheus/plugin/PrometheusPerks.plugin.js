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
            "authors": [{
                "name": "NormalBettle437",
                "discord_id": "725079599297331200",
                "github_username": "NormalBettle437"
            }],
            "version": "1.0.0",
            "description": "Allows you to locally assign a banner or an avatar of your choosing"
        }
    };
    return !global.ZeresPluginLibrary ? class {
    
        constructor() {

            this.config = config;
        }

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
            BdApi.showConfirmationModal("Library Missing", `The library needed for ${config.info.name} is missing`, {

                confirmText: "Download",
                cancelText: "Cancel",

                onConfirm: () => {
                    require("request").get("https://rauenzi.github.io/BDPluginLibrary/release/0PluginLibrary.plugin.js", async (error, body) => {
                        if (error) {
                            return require("electron").shell.openExternal("https://betterdiscord.net/ghdl?url=https://raw.githubusercontent.com/rauenzi/BDPluginLibrary/master/release/0PluginLibrary.plugin.js");
                        }
                        await new Promise(response => require("fs").writeFile(require("path").join(BdApi.Plugins.folder, "0PluginLibrary.plugin.js"), body, response));
                    })
                }
            });
        }

        start() {

            this.load();
        }

        stop() {
        }
    } : (([Plugin, Api]) => {
        const plugin = (Plugin, Api) => {

            const { Patcher, Settings, Toasts, PluginUtilities } = Api;
            return class PrometheusPerks extends Plugin {

                defaults = {
                    "clientsideBanner": false,
                    "bannerURL": ""
                };

                settings = PluginUtilities.loadSettings(this.getName(), this.defaults);

                status = 0;

                getSettingsPanel() {
                    return Settings.SettingPanel.build(() => this.onStart(), ...[
                        new Settings.SettingGroup("Avatar").append(...[
                            new Settings.Switch("Clientside Banner", "Enable or disable a clientside banner", this.settings.clientsideBanner, value => this.settings.clientsideBanner = value),
                            new Settings.Textbox("URL", "The direct URl for the banner you will be using, supported types are, PNG, JPG, or GIF", this.settings.bannerURL, image => {
                                try {

                                    new URL(image);
                                } catch {
                                    return Toasts.error("This is an invalid URL!");
                                }
                                this.settings.bannerURL = image;
                            })
                        ])
                    ]);
                }

                setBanner() {

                    PluginUtilities.saveSettings(this.getName(), this.settings);
                    if (this.settings.clientsideBanner && this.settings.bannerURL) {
                        this.clientsideBanner = setInterval(() => {

                            document.querySelectorAll(`[data-user-id = "${ZeresPluginLibrary.DiscordModules.UserStore.getCurrentUser().id}"] div [class *= "profileBanner-"]`).forEach(banner => {

                                banner.style = `background-image: url("${this.settings.bannerURL}") !important; background-repeat: no repeat; background-position: 50%; background-size: cover; width: 600px; height: 240px;`;
                            });

                            document.querySelectorAll(`[data-user-id = "${ZeresPluginLibrary.DiscordModules.UserStore.getCurrentUser().id}"] div [class *= "popoutBanner-"]`).forEach(banner => {

                                banner.style = `background-image: url("${this.settings.bannerURL}") !important; background-repeat: no repeat; background-position: 50%; background-size: cover; width: 300px; height: 120px;`;
                            });

                            document.querySelectorAll(`[class *= "settingsBanner-"]`).forEach(banner => {

                                banner.style = `background-image: url("${this.settings.bannerURL}") !important; background-repeat: no-repeat; background-position: 50%; background-size: cover;`;
                            });

                            document.querySelectorAll(`.avatarUploaderInner-yEhTv5.bannerUploaderInnerSquare-2c2J8_.banner-3D8GgT`).forEach(banner => {

                                banner.style = `background-image: url("${this.settings.bannerURL}") !important; background-repeat: no-repeat; background-position: 50%; background-size: cover;`;
                            });

                            document.querySelectorAll(`[data-user-id = "${ZeresPluginLibrary.DiscordModules.UserStore.getCurrentUser().id}"] .avatarWrapperNormal-ahVUaC`).forEach(avatar => {

                                avatar.style = `top: 76px;`;
                            });
                        }, 1000);
                    }
                    if (!this.settings.clientsideBanner) {

                        this.removeBanner();
                    }
                }

                removeBanner() {

                    clearInterval(this.clientsideBanner);
                    document.querySelectorAll(`[data-user-id = "${ZeresPluginLibrary.DiscordModules.UserStore.getCurrentUser().id}"] div [class *= "profileBanner-"]`).forEach(banner => {

                        banner.style = `background-image: none !important; background-repeat: none; background-position: none; background-size: none; width: none; height: none;`;
                    });

                    document.querySelectorAll(`[data-user-id = "${ZeresPluginLibrary.DiscordModules.UserStore.getCurrentUser().id}"] div [class *= "popoutBanner-"]`).forEach(banner => {

                        banner.style = `background-image: none !important; background-repeat: none; background-position: none; background-size: none; width: none; height: none;`;
                    });

                    document.querySelectorAll(`[class *= "settingsBanner-"]`).forEach(banner => {

                        banner.style = `background-image: none !important; background-repeat: none; background-position: none; background-size: none;`;
                    });

                    document.querySelectorAll(`.avatarUploaderInner-yEhTv5.bannerUploaderInnerSquare-2c2J8_.banner-3D8GgT`).forEach(banner => {

                        banner.style = `background-image: none !important; background-repeat: none; background-position: none; background-size: none;`;
                    });

                    document.querySelectorAll(`[data-user-id = "${ZeresPluginLibrary.DiscordModules.UserStore.getCurrentUser().id}"] .avatarWrapperNormal-ahVUaC`).forEach(avatar => {

                        avatar.style = `top: none;`;
                    });
                }

                onStart() {

                    this.status = ZeresPluginLibrary.DiscordModules.UserStore.getCurrentUser().premiumType = 2;

                    this.setBanner();
                }

                onStop() {

                    ZeresPluginLibrary.DiscordModules.UserStore.getCurrentUser().premiumType = this.status;

                    this.removeBanner();

                    Patcher.unpatchAll();
                }
            };
        };
        return plugin(Plugin, Api);
    })(global.ZeresPluginLibrary.buildPlugin(config));
 })();
 