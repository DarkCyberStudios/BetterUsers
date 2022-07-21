/**
 * @name BetterUsers
 * @author Bettlee
 * @authorId 725079599297331200
 * @source https://raw.githubusercontent.com/Bettlee/BetterUsers/main/src/main/javascript/me/bettlee/plugin/BetterUsers.plugin.js
 * @updateUrl https://raw.githubusercontent.com/Bettlee/BetterUsers/main/src/main/javascript/me/bettlee/plugin/BetterUsers.plugin.js
 * @version 2.1.5
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
            "version": "2.1.5",
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
                    "banner": {
                        "clientsideBanner": false,
                        "clientsideBannerURL": ""
                    },
                    "avatar": {
                        "clientsideAvatar": false,
                        "clientsideAvatarURL": "",
                        "clientsideStaticAvatar": false,
                        "clientsideStaticAvatarURL": ""
                    }
                };

                settings = Utilities.loadSettings(this.getName(), this.defaults);

                clientsideBanner;
                clientsideAvatar;

                getSettingsPanel() {
                    return Settings.SettingPanel.build(() => this.onStart(), ...[
                        new Settings.SettingGroup("Clientside Banner", { collapsible: false, shown: true }).append(...[
                            new Settings.Switch("Clientside Banner", "Enable or disable a clientside banner", this.settings.banner.clientsideBanner, value => this.settings.banner.clientsideBanner = value),
                            new Settings.Textbox("URL", "The direct URL for the banner you will be using, supported types are, PNG, JPG, or GIF", this.settings.banner.clientsideBannerURL, image => this.settings.banner.clientsideBannerURL = image)
                        ]),
                        new Settings.SettingGroup("Clientside Avatar", { collapsible: false, shown: true }).append(...[
                            new Settings.Switch("Clientside Avatar", "Enable or disable a clientside avatar", this.settings.avatar.clientsideAvatar, value => this.settings.avatar.clientsideAvatar = value),
                            new Settings.Textbox("URL", "The direct URL for the avatar you will be using, supported types are, PNG, JPG, or GIF", this.settings.avatar.clientsideAvatarURL, image => this.settings.avatar.clientsideAvatarURL = image),
                            new Settings.Switch("Clientside Static Avatar", "Enable or disable a clientside static avatar", this.settings.avatar.clientsideStaticAvatar, value => this.settings.avatar.clientsideStaticAvatar = value),
                            new Settings.Textbox("URL", "The direct URL for the avatar you will be using, supported types are, PNG or JPG", this.settings.avatar.clientsideStaticAvatarURL, image => this.settings.avatar.clientsideStaticAvatarURL = image)
                        ])
                    ]);
                };

                setBanner() {

                    Utilities.saveSettings(this.getName(), this.settings);
                    if (this.settings.banner.clientsideBanner && this.settings.banner.clientsideBannerURL) {

                        this.clientsideBanner = setInterval(() => {

                            DOMTools.queryAll(`[class *= "${WebpackModules.getAllByProps("profileBanner")[0].profileBanner}"]`).forEach(profileBanner => {
                                if (Object.is(DOMTools.text(DOMTools.query(`[class *= "${WebpackModules.getAllByProps("username")[0].username}"]`)), DiscordModules.UserStore.getCurrentUser().username)) {

                                    Object.assign(profileBanner.style, { backgroundImage: `url(${this.settings.banner.clientsideBannerURL})`, backgroundRepeat: "no-repeat", backgroundPosition: "50%", backgroundSize: "cover", width: "600px", height: "240px" });
                                }
                            });

                            DOMTools.queryAll(`[class *= "${WebpackModules.getAllByProps("popoutBanner")[0].popoutBanner}"]`).forEach(popoutBanner => {
                                if (Object.is(DOMTools.text(DOMTools.query(`[class *= "${WebpackModules.getAllByProps("username")[0].username}"]`)), DiscordModules.UserStore.getCurrentUser().username)) {

                                    Object.assign(popoutBanner.style, { backgroundImage: `url(${this.settings.banner.clientsideBannerURL})`, backgroundRepeat: "no-repeat", backgroundPosition: "50%", backgroundSize: "cover", width: "300px", height: "120px" });
                                }
                            });

                            DOMTools.queryAll(`[class *= "${WebpackModules.getAllByProps("settingsBanner")[0].settingsBanner}"]`).forEach(settingsBanner => {
                                if (Object.is(DOMTools.text(DOMTools.query(`[class *= "${WebpackModules.getAllByProps("username")[0].username}"]`)), DiscordModules.UserStore.getCurrentUser().username)) {

                                    Object.assign(settingsBanner.style, { backgroundImage: `url(${this.settings.banner.clientsideBannerURL})`, backgroundRepeat: "no-repeat", backgroundPosition: "50%", backgroundSize: "cover" });
                                }
                            });

                            DOMTools.queryAll(`[class *= "${WebpackModules.getAllByProps("bannerUploaderInnerSquare")[0].bannerUploaderInnerSquare}"]`).forEach(bannerUploaderInnerSquare => {
                                if (Object.is(DOMTools.text(DOMTools.query(`[class *= "${WebpackModules.getAllByProps("username")[0].username}"]`)), DiscordModules.UserStore.getCurrentUser().username)) {

                                    Object.assign(bannerUploaderInnerSquare.style, { backgroundImage: `url(${this.settings.banner.clientsideBannerURL})`, backgroundRepeat: "no-repeat", backgroundPosition: "50%", backgroundSize: "cover" });
                                }
                            });

                            DOMTools.queryAll(`[class *= "${WebpackModules.getAllByProps("avatarWrapperNormal")[1].avatarWrapperNormal}"]`).forEach(avatarWrapperNormal => {
                                if (Object.is(DOMTools.text(DOMTools.query(`[class *= "${WebpackModules.getAllByProps("username")[0].username}"]`)), DiscordModules.UserStore.getCurrentUser().username)) {

                                    Object.assign(avatarWrapperNormal.style, { top: "76px" });
                                }
                            });
                        }, 500);
                    }
                    if (!this.settings.banner.clientsideBanner) {

                        this.removeBanner();
                    }
                };

                setAvatar() {

                    Utilities.saveSettings(this.getName(), this.settings);
                    if ((this.settings.avatar.clientsideAvatar && this.settings.avatar.clientsideAvatarURL) && (this.settings.avatar.clientsideStaticAvatar && this.settings.avatar.clientsideStaticAvatarURL)) {

                        this.clientsideAvatar = setInterval(() => {

                            DOMTools.queryAll(`[src *= "https://cdn.discordapp.com/avatars/${DiscordModules.UserStore.getCurrentUser().id}/"]`).forEach(avatar => {

                                this.settings.avatar.clientsideAvatarURL.includes(".gif") && (this.settings.avatar.clientsideStaticAvatarURL.includes(".png") || this.settings.avatar.clientsideStaticAvatarURL.includes(".jpg")) ? (() => {

                                    Object.assign(avatar, { src: this.settings.avatar.clientsideStaticAvatarURL });
                                    DOMTools.queryAll(`[class *= "${WebpackModules.getAllByProps("banner")[0].banner}"]`).forEach(banner => {
                                        if (DOMTools.hasClass(banner, WebpackModules.getAllByProps("profileBanner")[0].profileBanner) || DOMTools.hasClass(banner, WebpackModules.getAllByProps("popoutBanner")[0].popoutBanner) || DOMTools.hasClass(banner, WebpackModules.getAllByProps("settingsBanner")[0].settingsBanner)) {

                                            Object.assign(avatar, { src: this.settings.avatar.clientsideAvatarURL });
                                        }
                                    });
                                })() : Object.assign(avatar, { src: this.settings.avatar.clientsideAvatarURL });
                            });

                            DOMTools.queryAll(`[style *= "https://cdn.discordapp.com/avatars/${DiscordModules.UserStore.getCurrentUser().id}/"]`).forEach(avatar => {

                                this.settings.avatar.clientsideAvatarURL.includes(".gif") && (this.settings.avatar.clientsideStaticAvatarURL.includes(".png") || this.settings.clientsideStaticAvatarURL.includes(".jpg")) ? (() => {

                                    Object.assign(avatar.style, { backgroundImage: `url("${this.settings.avatar.clientsideStaticAvatarURL}")` });
                                    DOMTools.queryAll(`[class *= "${WebpackModules.getAllByProps("banner")[4].banner}"]`).forEach(banner => {
                                        if (DOMTools.hasClass(banner, WebpackModules.getAllByProps("imageUploaderInner")[0].imageUploaderInner)) {

                                            Object.assign(avatar.style, { backgroundImage: `url("${this.settings.avatar.clientsideAvatarURL}")` });
                                        }
                                    });
                                })() : Object.assign(avatar.style, { backgroundImage: `url("${this.settings.avatar.clientsideAvatarURL}")` });
                            });
                        }, 500);
                    }
                    if (!this.settings.avatar.clientsideAvatar) {

                        this.removeAvatar();
                    }
                };

                removeBanner() {

                    clearInterval(this.clientsideBanner);
                    DOMTools.queryAll(`[class *= "${WebpackModules.getAllByProps("profileBanner")[0].profileBanner}"]`).forEach(profileBanner => {
                        if (Object.is(DOMTools.text(DOMTools.query(`[class *= "${WebpackModules.getAllByProps("username")[0].username}"]`)), DiscordModules.UserStore.getCurrentUser().username)) {

                            Object.assign(profileBanner.style, { backgroundImage: `none`, backgroundRepeat: "none", backgroundPosition: "none", backgroundSize: "none", width: "none", height: "none" });
                        }
                    });

                    DOMTools.queryAll(`[class *= "${WebpackModules.getAllByProps("popoutBanner")[0].popoutBanner}"]`).forEach(popoutBanner => {
                        if (Object.is(DOMTools.text(DOMTools.query(`[class *= "${WebpackModules.getAllByProps("username")[0].username}"]`)), DiscordModules.UserStore.getCurrentUser().username)) {

                            Object.assign(popoutBanner.style, { backgroundImage: `none`, backgroundRepeat: "none", backgroundPosition: "none", backgroundSize: "none", width: "none", height: "none" });
                        }
                    });

                    DOMTools.queryAll(`[class *= "${WebpackModules.getAllByProps("settingsBanner")[0].settingsBanner}"]`).forEach(settingsBanner => {
                        if (Object.is(DOMTools.text(DOMTools.query(`[class *= "${WebpackModules.getAllByProps("username")[0].username}"]`)), DiscordModules.UserStore.getCurrentUser().username)) {

                            Object.assign(settingsBanner.style, { backgroundImage: `none`, backgroundRepeat: "none", backgroundPosition: "none", backgroundSize: "none" });
                        }
                    });

                    DOMTools.queryAll(`[class *= "${WebpackModules.getAllByProps("bannerUploaderInnerSquare")[0].bannerUploaderInnerSquare}"]`).forEach(bannerUploaderInnerSquare => {
                        if (Object.is(DOMTools.text(DOMTools.query(`[class *= "${WebpackModules.getAllByProps("username")[0].username}"]`)), DiscordModules.UserStore.getCurrentUser().username)) {

                            Object.assign(bannerUploaderInnerSquare.style, { backgroundImage: `none`, backgroundRepeat: "none", backgroundPosition: "none", backgroundSize: "none" });
                        }
                    });

                    DOMTools.queryAll(`[class *= "${WebpackModules.getAllByProps("avatarWrapperNormal")[0].avatarWrapperNormal}"]`).forEach(avatarWrapperNormal => {
                        if (Object.is(DOMTools.text(DOMTools.query(`[class *= "${WebpackModules.getAllByProps("username")[0].username}"]`)), DiscordModules.UserStore.getCurrentUser().username)) {

                            Object.assign(avatarWrapperNormal.style, { top: "none" });
                        }
                    });
                };

                removeAvatar() {

                    clearInterval(this.clientsideAvatar);
                    DOMTools.queryAll(`[src *= "${this.settings.avatar.clientsideAvatarURL}"], [src = "${this.settings.avatar.clientsideStaticAvatarURL}"]`).forEach(avatar => {

                        Object.assign(avatar, { src: `https://cdn.discordapp.com/avatars/${DiscordModules.UserStore.getCurrentUser().id}/${DiscordModules.UserStore.getCurrentUser().avatar}.webp?size=${avatar.src.split("=").filter(element => element).slice(-1)}` });
                    });

                    DOMTools.queryAll(`[style *= "${this.settings.avatar.clientsideAvatarUR}"], [src = "${this.settings.avatar.clientsideStaticAvatarURL}"]`).forEach(avatar => {

                        Object.assign(avatar.style, { backgroundImage: `url("https://cdn.discordapp.com/avatars/${DiscordModules.UserStore.getCurrentUser().id}/${DiscordModules.UserStore.getCurrentUser().avatar}.webp?size=${avatar.style.backgroundImage.split("=").filter(element => element).slice(-1)}")` });
                    });
                };

                onStart() {

                    DiscordModules.UserStore.getCurrentUser().premiumType = 2;

                    this.setBanner();
                    this.setAvatar();
                };

                onStop() {

                    DiscordModules.UserStore.getCurrentUser().premiumType = 0;

                    this.removeBanner();
                    this.removeAvatar();
                };
            };
        };
        return plugin(Plugin, Api);
    })(global.ZeresPluginLibrary.buildPlugin(config));
 })();
