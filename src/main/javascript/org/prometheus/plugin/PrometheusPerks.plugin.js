/**
 * @name PrometheusPerks
 * @author NormalBettle437
 * @source https://raw.githubusercontent.com/NormalBettle437/PrometheusPerks/main/src/main/javascript/org/prometheus/banner/PrometheusPerks.plugin.js
 * @updateUrl https://raw.githubusercontent.com/NormalBettle437/PrometheusPerks/main/src/main/javascript/org/prometheus/banner/PrometheusPerks.plugin.js
 * @version 1.0.3
 * @description Allows you to locally assign a banner or an avatar of your choosing
 */

module.exports = (() => {

    const configuration = {
        "info": {
            "name": "PrometheusPerks",
            "authors": [{
                "name": "lemons",
                "discord_id": "407348579376693260",
                "github_username": "respecting"
            },
            {
                "name": "Shimoro",
                "discord_id": "427406422733619200",
                "github_username": "Shimoro-Rune"
            },
            {
                "name": "NormalBettle437",
                "discord_id": "725079599297331200",
                "github_username": "NormalBettle437"
            }],
            "source": "https://raw.githubusercontent.com/NormalBettle437/PrometheusPerks/main/src/main/javascript/org/prometheus/banner/PrometheusPerks.plugin.js",
            "updateUrl": "https://raw.githubusercontent.com/NormalBettle437/PrometheusPerks/main/src/main/javascript/org/prometheus/banner/PrometheusPerks.plugin.js",
            "version": "1.0.3",
            "description": "Allows you to locally assign a banner or an avatar of your choosing"
        },
        "main": "PrometheusPerks.plugin.js"
    };
    return !global.ZeresPluginLibrary ? class {

        constructor() {

            this.configuration = configuration;
        }

        getName() {
            return configuration.info.name;
        }

        getAuthor() {
            return configuration.info.authors.map(v => v.name).join(", ");
        }

        getSource() {
            return configuration.info.source;
        }

        getUpdateUrl() {
            return configuration.info.updateUrl;
        }

        getVersion() {
            return configuration.info.version;
        }

        getDescription() {
            return configuration.info.description;
        }

        load() {

            BdApi.showConfirmationModal("Library Missing", `The library needed for ${configuration.info.name} is missing`, {

                confirmText: "Download Now",
                cancelText: "Cancel",
                onConfirm: () => {
                    require("request").get("https://rauenzi.github.io/BDPluginLibrary/release/0PluginLibrary.plugin.js", async (error, response, body) => {
                        if (error) {
                            return require("electron").shell.openExternal("https://betterdiscord.net/ghdl?url=https://raw.githubusercontent.com/rauenzi/BDPluginLibrary/master/release/0PluginLibrary.plugin.js");
                        }
                        await new Promise(r => require("fs").writeFile(require("path").join(BdApi.Plugins.folder, "0PluginLibrary.plugin.js"), body, r));
                    });
                }
            });
        }

        start() {
        }

        stop() {
        }
    } : (([Plugin, Api]) => {

        const plugin = (Plugin, Api) => {

            const { Patcher, DiscordAPI, Settings, Toasts, PluginUtilities } = Api;
            return class PrometheusPerks extends Plugin {

                defaults = { 
                    "clientsideAvatar": false,
                    "clientsideBanner": false, 
                    "avatarUrl": "", 
                    "bannerUrl": ""
                };

                settings = PluginUtilities.loadSettings(this.getName(), this.defaults);
                
                status = 0;
                clientside;

                getSettingsPanel() {
                    return Settings.SettingPanel.build(_ => this.update(), ...[
                        new Settings.SettingGroup("Avatar").append(...[
                            new Settings.Switch("Clientside Avatar", "Enabled or disable a clientside avatar", this.settings.clientsideAvatar, value => this.settings.clientsideAvatar = value),
                            new Settings.Textbox("URL", "The direct URL for the avatar you will be using, supported types are, PNG, JPG, or GIF", this.settings.avatarUrl, image => {
                                try {

                                    new URL(image);
                                } catch {
                                    return Toasts.error('This is an invalid URL!');
                                }
                                this.settings.avatarUrl = image;
                            })
                        ]),
                        new Settings.SettingGroup("Banner").append(...[
                            new Settings.Switch("Clientside Banner", "Enable or disable a clientside banner", this.settings.clientsideBanner, value => this.settings.clientsideBanner = value),
                            new Settings.Textbox("URL", "The direct URL for the banner you will be using, supported types are, PNG, JPG, or GIF", this.settings.bannerUrl, image => {
                                try {

                                    new URL(image);
                                } catch {
                                    return Toasts.error('This is an invalid URL!');
                                }
                                this.settings.bannerUrl = image;
                            })
                        ])
                    ]);
                }

                update() {

                    PluginUtilities.saveSettings(this.getName(), this.settings);
                    if (this.settings.clientsideAvatar && this.settings.avatarUrl) {

                        this.clientsideAvatar = setInterval(() => {

                            document.querySelectorAll(`[src = "https://cdn.discordapp.com/avatars/${DiscordAPI.currentUser.discordObject.id}/${DiscordAPI.currentUser.discordObject.avatar}.webp?size=128"]`).forEach(avatar => {

                                avatar.src = this.settings.avatarUrl;
                            });
                        }, 100);
                    }
                    if (!this.settings.clientsideAvatar) {

                        this.removeAvatar();
                    }
                    if (this.settings.clientsideBanner && this.settings.bannerUrl) {

                        this.clientsideBanner = setInterval(() => {

                            document.querySelectorAll(`[data-user-id = "${DiscordAPI.currentUser.discordObject.id}"] div [class *= "popoutBanner-"]`).forEach(banner => {

                                banner.style = `background-image: url("${this.settings.bannerUrl}") !important; background-repeat: no repeat; background-position: 50%; background-size: cover; width: 300px; height: 120px;`;
                            });

                            document.querySelectorAll(`[data-user-id = "${DiscordAPI.currentUser.discordObject.id}"] div [class *= "profileBanner-"]`).forEach(banner => {

                                banner.style = `background-image: url("${this.settings.bannerUrl}") !important; background-repeat: no repeat; background-position: 50%; background-size: cover; width: 600px; height: 240px;`;
                            });

                            document.querySelectorAll(`div [class *= "settingsBanner-"]`).forEach(banner => {

                                banner.style = `background-image: url("${this.settings.bannerUrl}") !important; background-repeat: no-repeat; background-position: 50%; background-size: cover;`;
                            });

                            document.querySelectorAll(`div [class *= "bannerUploaderInnerSquare-"][class *= "banner-"]`).forEach(banner => {

                                banner.style = `background-image: url("${this.settings.bannerUrl}") !important; background-repeat: no-repeat; background-position: 50%; background-size: cover;`;
                            });

                            document.querySelectorAll(`[data-user-id = "${DiscordAPI.currentUser.discordObject.id}"] .avatarWrapperNormal-26WQIb`).forEach(avatar => {

                                avatar.style = `top: 76px;`;
                            });
                        }, 100);
                    }
                    if (!this.settings.clientsideBanner) {

                        this.removeBanner();
                    }
                }

                removeAvatar() {

                    clearInterval(this.clientsideAvatar);
                }

                removeBanner() {

                    clearInterval(this.clientsideBanner);
                    document.querySelectorAll(`[data-user-id = "${DiscordAPI.currentUser.discordObject.id}"] div [class *= "popoutBanner-"]`).forEach(banner => {
                        
                        banner.style = `background-image: none !important; background-repeat: none; background-position: none; background-size: none; width: none; height: none;`;
                    });

					document.querySelectorAll(`[data-user-id = "${DiscordAPI.currentUser.discordObject.id}"] div [class *= "profileBanner-"]`).forEach(banner => {
                        banner.style = `background-image: none !important; background-repeat: none; background-position: none; background-size: none; width: none; height: none;`;
                    });

					document.querySelectorAll(`[class *= "settingsBanner-"]`).forEach(banner => {
                        
                        banner.style = `background-image: none !important; background-repeat: none; background-position: none; background-size: none;`;
                    });

                    document.querySelectorAll(`[class *= "banner-"]`).forEach(banner => {

                        banner.style = `background-image: none; background-size: none; width: none; height: none;`;
                    });

					document.querySelectorAll(`[data-user-id="${DiscordAPI.currentUser.discordObject.id}"] .avatarWrapperNormal-26WQIb`).forEach(avatar => {
                        
                        avatar.style = `top: none;`;
                    })
                }

                onStart() {
                    
                    this.status = DiscordAPI.currentUser.discordObject.premiumType
                        
                    this.update();
                    DiscordAPI.currentUser.discordObject.premiumType = 2;
                }

                onStop() {
                    
                    DiscordAPI.currentUser.discordObject.premiumType = this.status

                    this.removeAvatar()
                    this.removeBanner();

                    Patcher.unpatchAll();
                }
            };
        };
        return plugin(Plugin, Api);
    })(global.ZeresPluginLibrary.buildPlugin(configuration));
})();
