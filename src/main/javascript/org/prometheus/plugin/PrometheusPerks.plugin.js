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
            return config.info.authors.map(name => name.name);
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

            const { Patcher, Settings, Toasts, PluginUtilities, DOMTools } = Api;
            return class PrometheusPerks extends Plugin {

                defaults = {
                    "clientsideBanner": false,
                    "clientsideBannerURL": "",
                    "clientsideAvatar": false,
                    "clientsideAvatarURL": ""
                };

                settings = PluginUtilities.loadSettings(this.getName(), this.defaults);

                status = 0;

                getSettingsPanel() {
                    return Settings.SettingPanel.build(() => this.onStart(), ...[
                        new Settings.SettingGroup("Banner").append(...[
                            new Settings.Switch("Clientside Banner", "Enable or disable a clientside banner", this.settings.clientsideBanner, value => this.settings.clientsideBanner = value),
                            new Settings.Textbox("URL", "The direct URL for the banner you will be using, supported types are, PNG, JPG, or GIF", this.settings.clientsideBannerURL, image => {
                                try {

                                    new URL(image);
                                } catch {
                                    return Toasts.error("This is an invalid URL!");
                                }
                                this.settings.clientsideBannerURL = image;
                            }, {

                                placeholder: this.getUserBanner(ZeresPluginLibrary.DiscordModules.UserStore.getCurrentUser().id),
                                disabled: !this.settings.clientsideBanner
                            })
                        ]),
                        new Settings.SettingGroup("Avatar").append(...[
                            new Settings.Switch("Clientside Avatar", "Enable or disable a clientside avatar", value => this.settings.clientsideAvatar = value),
                            new Settings.Textbox("URL", "The direct URL for the avatar you will be using, supported types are, PNG, JPG, or GIF", this.settings.clientsideAvatarURL, image => {
                                try {

                                    new URL(image);
                                } catch {
                                    return Toasts.error("This is an invalid URL");
                                }
                                this.settings.clientsideAvatarURL = image;
                            }, {

                                placeholder: this.getUserAvatar(ZeresPluginLibrary.DiscordModules.UserStore.getCurrentUser().id),
                                disabled: !this.settings.clientsideAvatar
                            })
                        ])
                    ]);
                }

                getUserBanner(id, change = true) {

                    let user = ZeresPluginLibrary.DiscordModules.UserStore.getUser(id);
                    if (!user) {
                        return "";
                    }
                    let data = change && user.id;
                    if (data) {
                        if (data.removeIcon) {
                            return "";
                        } else if (data.url) {
                            return data.url;
                        }
                    }
                    return ZeresPluginLibrary.DiscordModules.AvatarDefaults.getUserBannerURL(user);
                }

                getUserAvatar(id, change = true) {
                 
                    let user = ZeresPluginLibrary.DiscordModules.UserStore.getUser(id);
                    if (!user) {
                        return "";
                    }
                    let data = change && user.id;
                    if (data) {
                        if (data.removeIcon) {
                            return "";
                        } else if (data.url) {
                            return data.url;
                        }
                    }
                    return ZeresPluginLibrary.DiscordModules.AvatarDefaults.getUserAvatarURL(user);
                }

                setBanner() {

                    PluginUtilities.saveSettings(this.getName(), this.settings);
                    if (this.settings.clientsideBanner && this.settings.clientsideBannerURL) {
                        
                        this.clientsideBanner = setInterval(() => {

                            DOMTools.queryAll(`[data-user-id = "${ZeresPluginLibrary.DiscordModules.UserStore.getCurrentUser().id}"] div [class *= "profileBanner-"]`).forEach(banner => {

                                banner.style = `background-image: url("${this.settings.clientsideBannerURL}") !important; background-repeat: no repeat; background-position: 50%; background-size: cover; width: 600px; height: 240px;`;
                            });

                            DOMTools.queryAll(`[data-user-id = "${ZeresPluginLibrary.DiscordModules.UserStore.getCurrentUser().id}"] div [class *= "popoutBanner-"]`).forEach(banner => {

                                banner.style = `background-image: url("${this.settings.clientsideBannerURL}") !important; background-repeat: no repeat; background-position: 50%; background-size: cover; width: 300px; height: 120px;`;
                            });

                            DOMTools.queryAll(`[class *= "settingsBanner-"]`).forEach(banner => {

                                banner.style = `background-image: url("${this.settings.clientsideBannerURL}") !important; background-repeat: no-repeat; background-position: 50%; background-size: cover;`;
                            });

                            DOMTools.queryAll(`.avatarUploaderInner-yEhTv5.bannerUploaderInnerSquare-2c2J8_.banner-3D8GgT`).forEach(banner => {

                                banner.style = `background-image: url("${this.settings.clientsideBannerURL}") !important; background-repeat: no-repeat; background-position: 50%; background-size: cover;`;
                            });

                            DOMTools.queryAll(`[data-user-id = "${ZeresPluginLibrary.DiscordModules.UserStore.getCurrentUser().id}"] .avatarWrapperNormal-ahVUaC`).forEach(avatar => {

                                avatar.style = `top: 76px;`;
                            });
                        }, 1000);
                    }
                    if (!this.settings.clientsideBanner) {

                        this.removeBanner();
                    }
                }

                setAvatar() {

                    PluginUtilities.saveSettings(this.getName(), this.settings);
                    if (this.settings.clientsideAvatar && this.settings.clientsideAvatarURL) {

                        this.clientsideAvatar = setInterval(() => {

                            ["160", "100", "56", "40", "32", "20", "10"].forEach(sizes => DOMTools.queryAll(`[src = "https://cdn.discordapp.com/avatars/${ZeresPluginLibrary.DiscordModules.UserStore.getCurrentUser().id}/${ZeresPluginLibrary.DiscordModules.UserStore.getCurrentUser().avatar}.webp?size=${sizes}"]`).forEach(avatar => {

                                avatar.src = this.settings.clientsideAvatarURL;
                            }));

                            DOMTools.queryAll(`.avatarContainer-28iYmV.avatar-3tNQiO.avatarSmall-1PJoGO`).forEach(avatar => {

                                avatar.style = `background-image: url("${this.settings.clientsideAvatarURL}");`;
                            });

                            DOMTools.queryAll(`.avatarUploaderInner-3UNxY3.avatarUploaderInner-mAGe3e`).forEach(avatar => {

                                avatar.style = `background-image: url("${this.settings.clientsideAvatarURL}");`;
                            });
                        }, 1000);
                    }
                    if (this.settings.clientsideAvatar) {

                        this.removeAvatar();
                    }
                }

                removeBanner() {

                    clearInterval(this.clientsideBanner);
                    DOMTools.queryAll(`[data-user-id = "${ZeresPluginLibrary.DiscordModules.UserStore.getCurrentUser().id}"] div [class *= "profileBanner-"]`).forEach(banner => {

                        banner.style = `background-image: none !important; background-repeat: none; background-position: none; background-size: none; width: none; height: none;`;
                    });

                    DOMTools.queryAll(`[data-user-id = "${ZeresPluginLibrary.DiscordModules.UserStore.getCurrentUser().id}"] div [class *= "popoutBanner-"]`).forEach(banner => {

                        banner.style = `background-image: none !important; background-repeat: none; background-position: none; background-size: none; width: none; height: none;`;
                    });

                    DOMTools.queryAll(`[class *= "settingsBanner-"]`).forEach(banner => {

                        banner.style = `background-image: none !important; background-repeat: none; background-position: none; background-size: none;`;
                    });

                    DOMTools.queryAll(`.avatarUploaderInner-yEhTv5.bannerUploaderInnerSquare-2c2J8_.banner-3D8GgT`).forEach(banner => {

                        banner.style = `background-image: none !important; background-repeat: none; background-position: none; background-size: none;`;
                    });

                    DOMTools.queryAll(`[data-user-id = "${ZeresPluginLibrary.DiscordModules.UserStore.getCurrentUser().id}"] .avatarWrapperNormal-ahVUaC`).forEach(avatar => {

                        avatar.style = `top: none;`;
                    });
                }

                removeAvatar() {

                    clearInterval(this.clientsideAvatar);
                    ["160", "100", "56", "40", "32", "20", "10"].forEach(sizes => DOMTools.queryAll(`[src = "${this.settings.clientsideAvatarURL}"]`).forEach(avatar => {

                        avatar.src = `https://cdn.discordapp.com/avatars/${ZeresPluginLibrary.DiscordModules.UserStore.getCurrentUser().id}/${ZeresPluginLibrary.DiscordModules.UserStore.getCurrentUser().avatar}.webp?size=${sizes}`;
                    }));

                    ["32"].forEach(sizes => DOMTools.queryAll(`.avatarContainer-28iYmV.avatar-3tNQiO.avatarSmall-1PJoGO`).forEach(avatar => {

                        avatar.style = `background-image: url("https://cdn.discordapp.com/avatars/${ZeresPluginLibrary.DiscordModules.UserStore.getCurrentUser().id}/${ZeresPluginLibrary.DiscordModules.UserStore.getCurrentUser().avatar}.webp?size=${sizes}");`;
                    }));

                    ["100"].forEach(sizes => DOMTools.queryAll(`.avatarUploaderInner-3UNxY3.avatarUploaderInner-mAGe3e`).forEach(avatar => {

                        avatar.style = `background-image: url("https://cdn.discordapp.com/avatars/${ZeresPluginLibrary.DiscordModules.UserStore.getCurrentUser().id}/${ZeresPluginLibrary.DiscordModules.UserStore.getCurrentUser().avatar}.webp?size=${sizes}");`;
                    }));
                }

                onStart() {

                    ZeresPluginLibrary.DiscordModules.UserStore.getCurrentUser().premiumType = 2;

                    this.setBanner();
                    this.setAvatar();
                }

                onStop() {

                    ZeresPluginLibrary.DiscordModules.UserStore.getCurrentUser().premiumType = 0;

                    this.removeBanner();
                    this.removeAvatar();

                    Patcher.unpatchAll();
                }
            };
        };
        return plugin(Plugin, Api);
    })(global.ZeresPluginLibrary.buildPlugin(config));
 })();
 