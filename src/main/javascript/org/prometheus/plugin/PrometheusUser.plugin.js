/**
 * @name PrometheusUser
 * @author NormalBettle437
 * @authorId 725079599297331200
 * @source https://raw.githubusercontent.com/NormalBettle437/PrometheusUser/main/src/main/javascript/org/prometheus/plugin/PrometheusUser.plugin.js
 * @updateUrl https://raw.githubusercontent.com/NormalBettle437/PrometheusUser/main/src/main/javascript/org/prometheus/plugin/PrometheusUser.plugin.js
 * @version 1.0.0
 * @description Allows you to locally assign a banner or an avatar of your choosing
 */

 module.exports = (() => {
     
    const config = {
        "info": {
            "name": "PrometheusUser",
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
        }

        stop() {
        }
    } : (([Plugin, Api]) => {

        const plugin = (Plugin, Api) => {

            const { 
                
                Patcher, Settings, Toasts, PluginUtilities, DOMTools, DiscordModules 
            } = Api;
            return class PrometheusUser extends Plugin {

                defaults = {

                    "clientsideBanner": true,
                    "clientsideBannerURL": "",
                    "clientsideAvatar": true,
                    "clientsideAvatarURL": ""
                };

                settings = PluginUtilities.loadSettings(this.getName(), this.defaults);

                clientsideBanner;
                clientsideAvatar;

                getSettingsPanel() {
                    return Settings.SettingPanel.build(() => this.onStart(), ...[
                        new Settings.SettingGroup("Banner").append(...[
                            new Settings.Switch("Clientside Banner", "Enable or disable a clientside banner", this.settings.clientsideBanner, value => this.settings.clientsideBanner = value),
                            new Settings.Textbox("URL", "The direct URL for the banner you will be using, supported types are, PNG, JPG, or GIF", this.settings.clientsideBannerURL, image => {
                                try {

                                    new URL(image);
                                } catch {
                                    return Toasts.error("Invalid URL!");
                                }
                                this.settings.clientsideBannerURL = image;
                            })
                        ]),
                        new Settings.SettingGroup("Avatar").append(...[
                            new Settings.Switch("Clientside Avatar", "Enable or disable a clientside avatar", this.settings.clientsideAvatar, value => this.settings.clientsideAvatar = value),
                            new Settings.Textbox("URL", "The direct URL for the banner you will be using, supported types are, PNG, JPG, or GIF", this.settings.clientsideAvatarURL, image => {
                                try {

                                    new URL(image);
                                } catch {
                                    return Toasts.error("Invalid URL!");
                                }
                                this.settings.clientsideAvatarURL = image;
                            })
                        ])
                    ]);
                }

                setBanner() {

                    PluginUtilities.saveSettings(this.getName(), this.settings);
                    if (this.settings.clientsideBanner && this.settings.clientsideBannerURL) {

                        this.clientsideBanner = setInterval(() => {

                            let isElement = (array, element) => array.includes(element);
                            DOMTools.queryAll('div[class *= "banner-"]').forEach(banner => {
                                DOMTools.queryAll('span[class *= "username-"]').forEach(username => {
                                    if (isElement(banner.classList.value, 'profileBanner-') && isElement(username.innerText, DiscordModules.UserStore.getCurrentUser().username)) {

                                        banner.style = `background-image: url("${this.settings.clientsideBannerURL}") !important; background-repeat: no repeat; background-position: 50%; background-size: cover; width: 600px; height: 240px;`;
                                    } else if (isElement(banner.classList.value, 'popoutBanner-') && isElement(username.innerText, DiscordModules.UserStore.getCurrentUser().username)) {

                                        banner.style = `background-image: url("${this.settings.clientsideBannerURL}") !important; background-repeat: no repeat; background-position: 50%; background-size: cover; width: 300px; height: 120px;`;
                                    } else if (isElement(banner.classList.value, 'settingsBanner-') && isElement(username.innerText, DiscordModules.UserStore.getCurrentUser().username)) {

                                        banner.style = `background-image: url("${this.settings.clientsideBannerURL}") !important; background-repeat: no-repeat; background-position: 50%; background-size: cover;`;
                                    } else if (isElement(banner.classList.value, 'bannerUploaderInnerSquare-') && isElement(username.innerText, DiscordModules.UserStore.getCurrentUser().username)) {

                                        banner.style = `background-image: url("${this.settings.clientsideBannerURL}") !important; background-repeat: no-repeat; background-position: 50%; background-size: cover;`;
                                    }
                                });
                            });

                            DOMTools.queryAll('div[class *= "avatarWrapperNormal-"]').forEach(avatar => {
                                DOMTools.queryAll('span[class *= "username-"]').forEach(username => {
                                    if (isElement(username.innerText, DiscordModules.UserStore.getCurrentUser().username)) {

                                        avatar.style = `top: 76px;`;
                                    }
                                });
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

                            let isElement = (array, element) => array.includes(element);
                            DOMTools.queryAll('img[src]').forEach(avatar => {
                                if (isElement(avatar.src, `https://cdn.discordapp.com/avatars/${DiscordModules.UserStore.getCurrentUser().id}/`)) {

                                    let getElement = (string, character) => string.split(character).filter(element => element).slice(-1);
                                    getElement(avatar.src, '=').forEach(() => {

                                        avatar.src = this.settings.clientsideAvatarURL;
                                    });
                                }
                            });

                            DOMTools.queryAll('div[style]').forEach(avatar => {
                                if (isElement(avatar.style.backgroundImage, `https://cdn.discordapp.com/avatars/${ZeresPluginLibrary.DiscordModules.UserStore.getCurrentUser().id}/`)) {

                                    avatar.style = `background-image: url("${this.settings.clientsideAvatarURL}");`;
                                }
                            });
                        }, 1000);
                    }
                    if (!this.settings.clientsideAvatar) {

                        this.removeAvatar();
                    }
                }

                removeBanner() {

                    clearInterval(this.settings.clientsideBanner);

                    let isElement = (array, element) => array.includes(element);
                    DOMTools.queryAll('div[class *= "banner-"]').forEach(banner => {
                        DOMTools.queryAll('span[class *= "username-"]').forEach(username => {
                            if (isElement(banner.classList.value, 'profileBanner-') && isElement(username.innerText, DiscordModules.UserStore.getCurrentUser().username)) {

                                banner.style = `background-image: none !important; background-repeat: none; background-position: none; background-size: none; width: none; height: none;`;
                            } else if (isElement(banner.classList.value, 'popoutBanner-') && isElement(username.innerText, DiscordModules.UserStore.getCurrentUser().username)) {

                                banner.style = `background-image: none !important; background-repeat: none; background-position: none; background-size: none; width: none; height: none;`;
                            } else if (isElement(banner.classList.value, 'settingsBanner-') && isElement(username.innerText, DiscordModules.UserStore.getCurrentUser().username)) {

                                banner.style = `background-image: none !important; background-repeat: none; background-position: none; background-size: none;`;
                            } else if (isElement(banner.classList.value, 'bannerUploaderInnerSquare-') && isElement(username.innerText, DiscordModules.UserStore.getCurrentUser().username)) {

                                banner.style = `background-image: none !important; background-repeat: none; background-position: none; background-size: none;`;
                            }
                        });
                    });

                    DOMTools.queryAll('div[class *= "avatarWrapperNormal-"]').forEach(avatar => {
                        DOMTools.queryAll('span[class *= "username-"]').forEach(username => {
                            if (isElement(username.innerText, DiscordModules.UserStore.getCurrentUser().username)) {

                                avatar.style = `top: none;`;
                            }
                        });
                    });
                }

                removeAvatar() {

                    clearInterval(this.settings.clientsideAvatar);

                    let isElement = (array, element) => array.includes(element);
                    DOMTools.queryAll('img[src]').forEach(avatar => {
                        if (isElement(avatar.src, this.settings.clientsideAvatarURL)) {

                            let getElement = (string, character) => string.split(character).filter(element => element).slice(-1);
                            getElement(avatar.src, '=').forEach(sizes => {

                                avatar.src = `https://cdn.discordapp.com/avatars/${DiscordModules.UserStore.getCurrentUser().id}/${DiscordModules.UserStore.getCurrentUser().avatar}.webp?size=${sizes}`;
                            });
                        }
                    });

                    DOMTools.queryAll('div[style]').forEach(avatar => {
                        if (isElement(avatar.style.backgroundImage, `https://cdn.discordapp.com/avatars/${DiscordModules.UserStore.getCurrentUser().id}/`)) {

                            let getElement = (string, character) => string.split(character).filter(element => element).slice(-1);
                            getElement(avatar.style.backgroundImage, '=').forEach(sizes => {

                                let finalize = (string, character) => string.split(character).filter(element => element);
                                avatar.style = `background-image: url("https://cdn.discordapp.com/avatars/${DiscordModules.UserStore.getCurrentUser().id}/${DiscordModules.UserStore.getCurrentUser().avatar}.webp?size=${finalize(sizes, '")')}");`;
                            });
                        }
                    });
                }

                onStart() {

                    DiscordModules.UserStore.getCurrentUser().premiumType = 2;

                    this.setBanner();
                    this.setAvatar();
                }

                onStop() {

                    DiscordModules.UserStore.getCurrentUser().premiumType = 0;

                    this.removeBanner();
                    this.removeAvatar();

                    Patcher.unpatchAll();
                }
            };
        };
        return plugin(Plugin, Api);
    })(global.ZeresPluginLibrary.buildPlugin(config));
 })();
 