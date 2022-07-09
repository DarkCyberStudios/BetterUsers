/**
 * @name BetterUsers
 * @author Bettlee
 * @authorId 725079599297331200
 * @source https://raw.githubusercontent.com/Bettlee/BetterUsers/main/src/main/javascript/me/bettlee/plugin/BetterUsers.plugin.js
 * @updateUrl https://raw.githubusercontent.com/Bettlee/BetterUsers/main/src/main/javascript/me/bettlee/plugin/BetterUsers.plugin.js
 * @version 2.0.3
 * @description Allows you to locally assign a banner or an avatar of your choosing
 */

 module.exports = (() => {
    const config = {
        "info": {
            "name": "BetterUsers",
            "authors": [{
                "name": "Bettlee",
                "discord_id": "725079599297331200",
                "github_username": "Bettlee"
            }],
            "version": "2.0.3",
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
        }

        stop() {
        }
    } : (([Plugin, Api]) => {
        const plugin = (Plugin, Api) => {

            const { DiscordModules, DOMTools, Settings, Utilities, WebpackModules } = Api;
            return class BetterUsers extends Plugin {

                defaults = {

                    "clientsideBanner": false,
                    "clientsideBannerURL": "",
                    "clientsideAvatar": false,
                    "clientsideAvatarURL": ""
                };

                settings = Utilities.loadSettings(this.getName(), this.defaults);

                clientsideBanner;
                clientsideAvatar;

                getSettingsPanel() {
                    return Settings.SettingPanel.build(() => this.onStart(), ...[
                        new Settings.SettingGroup("Clientside Banner", { collapsible: false, shown: true }).append(...[
                            new Settings.Switch("Clientside Banner", "Enable or disable a clientside banner", this.settings.clientsideBanner, value => this.settings.clientsideBanner = value),
                            new Settings.Textbox("URL", "The direct URL for the banner you will be using, supported types are, PNG, JPG, or GIF", this.settings.clientsideBannerURL, image => this.settings.clientsideBannerURL = image)
                        ]),
                        new Settings.SettingGroup("Clientside Avatar", { collapsible: false, shown: true }).append(...[
                            new Settings.Switch("Clientside Avatar", "Enable or disable a clientside avatar", this.settings.clientsideAvatar, value => this.settings.clientsideAvatar = value),
                            new Settings.Textbox("URL", "The direct URL for the avatar you will be using, supported types are, PNG, JPG, or GIF", this.settings.clientsideAvatarURL, image => this.settings.clientsideAvatarURL = image)
                        ])
                    ]);
                };

                setBanner() {

                    Utilities.saveSettings(this.getName(), this.settings);
                    if (this.settings.clientsideBanner && this.settings.clientsideBannerURL) {

                        this.clientsideBanner = setInterval(() => {

                            DOMTools.queryAll(`[class *= "${WebpackModules.getAllByProps("profileBanner")[0].profileBanner}"]`).forEach(profileBanner => {
                                if (Object.is(DOMTools.text(DOMTools.query(`[class *= "${WebpackModules.getAllByProps("username")[0].username }"]`)), DiscordModules.UserStore.getCurrentUser().username)) {

                                    profileBanner.style = `background-image: url("${this.settings.clientsideBannerURL}") !important; background-repeat: no repeat; background-position: 50%; background-size: cover; width: 600px; height: 240px;`;
                                }
                            });

                            DOMTools.queryAll(`[class *= "${WebpackModules.getAllByProps("popoutBanner")[0].popoutBanner}"]`).forEach(popoutBanner => {
                                if (Object.is(DOMTools.text(DOMTools.query(`[class *= "${WebpackModules.getAllByProps("username")[0].username}"]`)), DiscordModules.UserStore.getCurrentUser().username)) {

                                    popoutBanner.style = `background-image: url("${this.settings.clientsideBannerURL}") !important; background-repeat: no repeat; background-position: 50%; background-size: cover; width: 300px; height: 120px;`;
                                }
                            });

                            DOMTools.queryAll(`[class *= "${WebpackModules.getAllByProps("settingsBanner")[0].settingsBanner}"]`).forEach(settingsBanner => {
                                if (Object.is(DOMTools.text(DOMTools.query(`[class *= "${WebpackModules.getAllByProps("username")[0].username}"]`)), DiscordModules.UserStore.getCurrentUser().username)) {

                                    settingsBanner.style = `background-image: url("${this.settings.clientsideBannerURL}") !important; background-repeat: no-repeat; background-position: 50%; background-size: cover;`;
                                }
                            });

                            DOMTools.queryAll(`[class *= "${WebpackModules.getAllByProps("bannerUploaderInnerSquare")[0].bannerUploaderInnerSquare}"]`).forEach(bannerUploaderInnerSquare => {
                                if (Object.is(DOMTools.text(DOMTools.query(`[class *= "${WebpackModules.getAllByProps("username")[0].username}"]`)), DiscordModules.UserStore.getCurrentUser().username)) {

                                    bannerUploaderInnerSquare.style = `background-image: url("${this.settings.clientsideBannerURL}") !important; background-repeat: no-repeat; background-position: 50%; background-size: cover;`;
                                }
                            });

                            DOMTools.queryAll(`[class *= "${WebpackModules.getAllByProps("avatarWrapperNormal")[1].avatarWrapperNormal}"]`).forEach(avatarWrapperNormal => {
                                if (Object.is(DOMTools.text(DOMTools.query(`[class *= "${WebpackModules.getAllByProps("username")[0].username}"]`)), DiscordModules.UserStore.getCurrentUser().username)) {

                                    avatarWrapperNormal.style = "top: 76px;";
                                }
                            });
                        }, 1000);
                    }
                    if (!this.settings.clientsideBanner) {

                        this.removeBanner();
                    }
                };

                setAvatar() {

                    Utilities.saveSettings(this.getName(), this.settings);
                    if (this.settings.clientsideAvatar && this.settings.clientsideAvatarURL) {

                        this.clientsideAvatar = setInterval(() => {

                            DOMTools.queryAll(`[src *= "https://cdn.discordapp.com/avatars/${DiscordModules.UserStore.getCurrentUser().id}/"]`).forEach(avatar => {

                                avatar.src = this.settings.clientsideAvatarURL;
                                if (this.settings.clientsideAvatarURL.includes(".gif")) {

                                    avatar.src = "";
                                    DOMTools.queryAll(`[class *= "${WebpackModules.getAllByProps("profileBanner")[0].profileBanner}"], [class *= "${WebpackModules.getAllByProps("popoutBanner")[0].popoutBanner}"], [class *= "${WebpackModules.getAllByProps("settingsBanner")[0].settingsBanner}"]`).forEach(() => {

                                        avatar.src = this.settings.clientsideAvatarURL;
                                    });
                                }
                            });

                            DOMTools.queryAll(`[style *= "https://cdn.discordapp.com/avatars/${DiscordModules.UserStore.getCurrentUser().id}/"]`).forEach(avatar => {

                                avatar.style = `background-image: url("${this.settings.clientsideAvatarURL}");`;
                                if (this.settings.clientsideAvatarURL.includes(".gif")) {

                                    avatar.style = `background-image: url("")`;
                                    DOMTools.queryAll(`[class *= "${WebpackModules.getAllByProps("bannerUploaderInnerSquare")[0].bannerUploaderInnerSquare}"]`).forEach(() => {

                                        avatar.style = `background-image: url(${this.settings.clientsideAvatarURL})`;
                                    });
                                }
                            });
                        }, 1000);
                    }
                    if (!this.settings.clientsideAvatar) {

                        this.removeAvatar();
                    }
                };

                removeBanner() {

                    clearInterval(this.clientsideBanner);
                    DOMTools.queryAll(`[class *= "${WebpackModules.getAllByProps("profileBanner")[0].profileBanner}"]`).forEach(profileBanner => {
                        if (Object.is(DOMTools.text(DOMTools.query(`[class *= "${WebpackModules.getAllByProps("username")[0].username }"]`)), DiscordModules.UserStore.getCurrentUser().username)) {

                            profileBanner.style = `background-image: none !important; background-repeat: none; background-position: none; background-size: none; width: none; height: none;`;
                        }
                    });

                    DOMTools.queryAll(`[class *= "${WebpackModules.getAllByProps("popoutBanner")[0].popoutBanner}"]`).forEach(popoutBanner => {
                        if (Object.is(DOMTools.text(DOMTools.query(`[class *= "${WebpackModules.getAllByProps("username")[0].username }"]`)), DiscordModules.UserStore.getCurrentUser().username)) {

                            popoutBanner.style = `background-image: none !important; background-repeat: none; background-position: none; background-size: none; width: none; height: none;`;
                        }
                    });

                    DOMTools.queryAll(`[class *= "${WebpackModules.getAllByProps("settingsBanner")[0].settingsBanner}"]`).forEach(settingsBanner => {
                        if (Object.is(DOMTools.text(DOMTools.query(`[class *= "${WebpackModules.getAllByProps("username")[0].username }"]`)), DiscordModules.UserStore.getCurrentUser().username)) {

                            settingsBanner.style = `background-image: none !important; background-repeat: none; background-position: none; background-size: none;`;
                        }
                    });

                    DOMTools.queryAll(`[class *= "${WebpackModules.getAllByProps("bannerUploaderInnerSquare")[0].bannerUploaderInnerSquare}"]`).forEach(bannerUploaderInnerSquare => {
                        if (Object.is(DOMTools.text(DOMTools.query(`[class *= "${WebpackModules.getAllByProps("username")[0].username }"]`)), DiscordModules.UserStore.getCurrentUser().username)) {

                            bannerUploaderInnerSquare.style = `background-image: none !important; background-repeat: none; background-position: none; background-size: none;`;
                        }
                    });

                    DOMTools.queryAll(`[class *= "${WebpackModules.getAllByProps("avatarWrapperNormal")[1].avatarWrapperNormal}"]`).forEach(avatarWrapperNormal => {
                        if (Object.is(DOMTools.text(DOMTools.query(`[class *= "${WebpackModules.getAllByProps("username")[0].username }"]`)), DiscordModules.UserStore.getCurrentUser().username)) {

                            avatarWrapperNormal.style = "top: none;";
                        }
                    });
                };

                removeAvatar() {

                    clearInterval(this.clientsideAvatar);
                    DOMTools.queryAll(`[src *= "${this.settings.clientsideAvatarURL}"]`).forEach(avatar => {

                        avatar.src.split("=").filter(element => element).slice(-1).forEach(size => {

                            avatar.src = `https://cdn.discordapp.com/avatars/${DiscordModules.UserStore.getCurrentUser().id}/${DiscordModules.UserStore.getCurrentUser().avatar}.webp?size${size.match(/\=(d+)/)}`;
                        });
                    });

                    DOMTools.queryAll(`[style *= "${this.settings.clientsideAvatarUR}"]`).forEach(avatar => {

                        avatar.style.backgroundImage.split("=").filter(element => element).slice(-1).forEach(size => {

                            avatar.style = `background-image: url("https://cdn.discordapp.com/avatars/${DiscordModules.UserStore.getCurrentUser().id}/${DiscordModules.UserStore.getCurrentUser().avatar}.webp?size${size.match(/\=(d+)/)}");`;
                        });
                    });
                };

                onStart() {

                    DiscordModules.UserStore.getCurrentUser().premiumType = 2;

                    // DOMTools.addScript("gif.js", "https://unpkg.com/gif.js@0.2.0/dist/gif.js");
                    // DOMTools.addScript("gif.worker.js", "https://unpkg.com/gif.js@0.2.0/dist/gif.worker.js");

                    this.setBanner();
                    this.setAvatar();
                };

                onStop() {

                    DiscordModules.UserStore.getCurrentUser().premiumType = 0;

                    // DOMTools.removeScript("gif.js");
                    // DOMTools.removeScript("gif.worker.js");

                    this.removeBanner();
                    this.removeAvatar();
                };
            };
        };
        return plugin(Plugin, Api);
    })(global.ZeresPluginLibrary.buildPlugin(config));
 })();
