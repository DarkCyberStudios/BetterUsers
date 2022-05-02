/**
 * @name PrometheusUser
 * @author Bettlee
 * @authorId 725079599297331200
 * @source https://raw.githubusercontent.com/Bettlee/PrometheusUser/main/src/main/javascript/org/prometheus/plugin/PrometheusUser.plugin.js
 * @updateUrl https://raw.githubusercontent.com/Bettlee/PrometheusUser/main/src/main/javascript/org/prometheus/plugin/PrometheusUser.plugin.js
 * @version 1.9.2
 * @description Allows you to locally assign a banner or an avatar of your choosing
 */

 module.exports = (() => {
     
    const config = {
        "info": {
            "name": "PrometheusUser",
            "authors": [{
                "name": "Bettlee",
                "discord_id": "725079599297331200",
                "github_username": "Bettlee"
            }],
            "version": "1.9.2",
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

            const { DiscordModules, DOMTools, Settings, Toasts, Utilities } = Api;
            return class PrometheusUser extends Plugin {

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
                        new Settings.SettingGroup("Banner", {

                            collapsible: false,
                            shown: true
                        }).append(...[
                            new Settings.Switch("Clientside Banner", "Enable or disable a clientside banner", this.settings.clientsideBanner, value => this.settings.clientsideBanner = value),
                            new Settings.Textbox("URL", "The direct URL for the banner you will be using, supported types are, PNG, JPG, or GIF", this.settings.clientsideBannerURL, image => this.settings.clientsideBannerURL = image)
                        ]),
                        new Settings.SettingGroup("Avatar", {

                            collapsible: false,
                            shown: true
                        }).append(...[
                            new Settings.Switch("Clientside Avatar", "Enable or disable a clientside avatar", this.settings.clientsideAvatar, value => this.settings.clientsideAvatar = value),
                            new Settings.Textbox("URL", "The direct URL for the avatar you will be using, supported types are, PNG, JPG, or GIF", this.settings.clientsideAvatarURL, image => this.settings.clientsideAvatarURL = image)
                        ])
                    ]);
                };

                setBanner() {

                    Utilities.saveSettings(this.getName(), this.settings);
                    if (this.settings.clientsideBanner && this.settings.clientsideBannerURL) {

                        this.clientsideBanner = setInterval(() => {

                            DOMTools.queryAll('div[class *= "banner-"]').forEach(banner => {
                                if (banner.className.includes("profileBanner-")) {

                                    DOMTools.queryAll('div[class *= "topSection-"] span[class *= "username-"]').forEach(username => {
                                        if (username.innerText.toLocaleLowerCase() === DiscordModules.UserStore.getCurrentUser().username.toLocaleLowerCase()) {

                                            banner.style = `background-image: url("${this.settings.clientsideBannerURL}") !important; background-repeat: no repeat; background-position: 50%; background-size: cover; width: 600px; height: 240px;`;
                                        }
                                    });
                                }

                                if (banner.className.includes("popoutBanner-")) {

                                    DOMTools.queryAll('div[class *= "userPopout-"] span[class *= "username-"]').forEach(username => {
                                        if (username.innerText.toLocaleLowerCase() === DiscordModules.UserStore.getCurrentUser().username.toLocaleLowerCase()) {

                                            banner.style = `background-image: url("${this.settings.clientsideBannerURL}") !important; background-repeat: no repeat; background-position: 50%; background-size: cover; width: 300px; height: 120px;`;
                                        }
                                    });
                                }

                                if (banner.className.includes("settingsBanner-")) {

                                    DOMTools.queryAll('div[class *= "accountProfileCard-"] span[class *= "username-"]').forEach(username => {
                                        if (username.innerText.toLocaleLowerCase() === DiscordModules.UserStore.getCurrentUser().username.toLocaleLowerCase()) {

                                            banner.style = `background-image: url("${this.settings.clientsideBannerURL}") !important; background-repeat: no-repeat; background-position: 50%; background-size: cover;`;
                                        }
                                    });
                                }

                                if (banner.className.includes("bannerUploaderInnerSquare-")) {

                                    DOMTools.queryAll('div[class *= "profileBannerPreview-"] span[class *= "username-"]').forEach(username => {
                                        if (username.innerText.toLocaleLowerCase() === DiscordModules.UserStore.getCurrentUser().username.toLocaleLowerCase()) {

                                            banner.style = `background-image: url("${this.settings.clientsideBannerURL}") !important; background-repeat: no-repeat; background-position: 50%; background-size: cover;`;
                                        }
                                    });
                                }
                            });

                            DOMTools.queryAll('div[class *= "avatarWrapperNormal-"]').forEach(avatar => {
                                if (avatar.className.includes("avatarWrapper-")) {

                                    DOMTools.queryAll('div[class *= "userPopout-"] span[class *= "username-"]').forEach(username => {
                                        if (username.innerText.toLocaleLowerCase() === DiscordModules.UserStore.getCurrentUser().username.toLocaleLowerCase()) {

                                            avatar.style = "top: 76px;";
                                        }
                                    });
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

                            DOMTools.queryAll("img[src]").forEach(avatar => {
                                if (avatar.src.includes(`https://cdn.discordapp.com/avatars/${DiscordModules.UserStore.getCurrentUser().id}/`)) {

                                    avatar.src.split("=").filter(element => element).slice(-1).forEach(size => {

                                        avatar.src = this.settings.clientsideAvatarURL;
                                        if (this.settings.clientsideAvatarURL.substring(0, this.settings.clientsideAvatarURL.lastIndexOf(".gif"))) {
                                            
                                            const path = `${BdApi.Plugins.folder}/PROMETHEUSUSER`;
                                            require("fs").readdirSync(!require("fs").existsSync(path) ? require("fs").mkdirSync(path, { recursive: true }) : path).map((files, index) => {
                                                if (index === 0) {

                                                    const file = require("path").join(path, files).split("\\").filter(element => element).slice(-1);
                                                }
                                            });

                                            DOMTools.queryAll('div[class *= "banner-"]').forEach(banner => {
                                                if ((banner.className.includes("profileBanner-") && (size === "160")) || (banner.className.includes("popoutBanner-") && (size === "100")) || (banner.className.includes("settingsBanner-") && (size === "100"))) {
                                                    
                                                    avatar.src = this.settings.clientsideAvatarURL;
                                                }
                                            });
                                        } else {

                                            require("fs").mkdirSync(`${BdApi.Plugins.folder}/PROMETHEUSUSER`, { recursive: true });
                                        }
                                    });
                                }
                            });

                            DOMTools.queryAll("div[style]").forEach(avatar => {
                                if (avatar.style.backgroundImage.includes(`https://cdn.discordapp.com/avatars/${DiscordModules.UserStore.getCurrentUser().id}/`)) {

                                    avatar.style.backgroundImage.split("=").filter(element => element).slice(-1).forEach(size => {

                                        avatar.style = `background-image: url("${this.settings.clientsideAvatarURL}");`;
                                        if (this.settings.clientsideAvatarURL.substring(0, this.settings.clientsideAvatarURL.lastIndexOf(".gif"))) {

                                            // avatar.style = `background-image: url("");`;
                                            DOMTools.queryAll('div[class *= "banner-"]').forEach(banner => {
                                                if ((banner.className.includes("imageUploaderInner-") && (size === '100")'))) {

                                                    avatar.style = `background-image: url("${this.settings.clientsideAvatarURL}");`;
                                                }
                                            });
                                        }
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
                    DOMTools.queryAll('div[class *= "banner-"]').forEach(banner => {
                        if (banner.className.includes("profileBanner-")) {

                            DOMTools.queryAll('div[class *= "topSection-"] span[class *= "username-"]').forEach(username => {
                                if (username.innerText.toLocaleLowerCase() === DiscordModules.UserStore.getCurrentUser().username.toLocaleLowerCase()) {

                                    banner.style = `background-image: none !important; background-repeat: none; background-position: none; background-size: none; width: none; height: none;`;
                                }
                            });
                        }

                        if (banner.className.includes("popoutBanner-")) {

                            DOMTools.queryAll('div[class *= "userPopout-"] span[class *= "username-"]').forEach(username => {
                                if (username.innerText.toLocaleLowerCase() === DiscordModules.UserStore.getCurrentUser().username.toLocaleLowerCase()) {

                                    banner.style = `background-image: none !important; background-repeat: none; background-position: none; background-size: none; width: none; height: none;`;
                                }
                            });
                        }

                        if (banner.className.includes("settingsBanner-")) {

                            DOMTools.queryAll('div[class *= "accountProfileCard-"] span[class *= "username-"]').forEach(username => {
                                if (username.innerText.toLocaleLowerCase() === DiscordModules.UserStore.getCurrentUser().username.toLocaleLowerCase()) {

                                    banner.style = `background-image: none !important; background-repeat: none; background-position: none; background-size: none;`;
                                }
                            });
                        }

                        if (banner.className.includes("bannerUploaderInnerSquare-")) {

                            DOMTools.queryAll('div[class *= "profileBannerPreview-"] span[class *= "username-"]').forEach(username => {
                                if (username.innerText.toLocaleLowerCase() === DiscordModules.UserStore.getCurrentUser().username.toLocaleLowerCase()) {

                                    banner.style = `background-image: none !important; background-repeat: none; background-position: none; background-size: none;`;
                                }
                            });
                        }
                    });

                    DOMTools.queryAll('div[class *= "avatarWrapperNormal-"]').forEach(avatar => {
                        if (avatar.className.includes("avatarWrapper-")) {

                            DOMTools.queryAll('div[class *= "userPopout-"] span[class *= "username-"]').forEach(username => {
                                if (username.innerText.toLocaleLowerCase() === DiscordModules.UserStore.getCurrentUser().username.toLocaleLowerCase()) {

                                    avatar.style = "top: none;";
                                }
                            });
                        }
                    });
                };

                removeAvatar() {

                    clearInterval(this.clientsideAvatar);
                    DOMTools.queryAll("img[src]").forEach(avatar => {
                        if (avatar.src.includes(this.settings.clientsideAvatarURL) || avatar.src.includes(`https://cdn.discordapp.com/avatars/${DiscordModules.UserStore.getCurrentUser().id}/`)) {

                            avatar.src.split("=").filter(element => element).slice(-1).forEach(size => {
                                
                                avatar.src = `https://cdn.discordapp.com/avatars/${DiscordModules.UserStore.getCurrentUser().id}/${DiscordModules.UserStore.getCurrentUser().avatar}.webp?size${size.match(/\=(d+)/)}`;
                            });
                        }
                    });

                    DOMTools.queryAll("div[style]").forEach(avatar => {
                        if (avatar.style.backgroundImage.includes(this.settings.clientsideAvatarURL) || avatar.style.backgroundImage.includes(`https://cdn.discordapp.com/avatars/${DiscordModules.UserStore.getCurrentUser().id}/`)) {

                            avatar.style.backgroundImage.split("=").filter(element => element).slice(-1).forEach(size => {
                            
                                avatar.style = `background-image: url("https://cdn.discordapp.com/avatars/${DiscordModules.UserStore.getCurrentUser().id}/${DiscordModules.UserStore.getCurrentUser().avatar}.webp?size${size.match(/\=(d+)/)}");`;
                            });
                        }
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
