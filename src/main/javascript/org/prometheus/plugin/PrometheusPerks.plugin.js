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

        var users = {};
        return class PrometheusPerks extends Plugin {

            getSettingsPanel(states = {}) {

                let panel;
                return panel = BDFDB.PluginUtils.createSettingsPanel(this, {

                    states: states,
                    children: () => {

                        let items = [];
                        items.push(BDFDB.ReactUtils.createElement(BDFDB.LibraryComponents.SettingsPanelList, {

                            title: "Change In:",
                            children: Object.keys(this.defaults.places).map(key => BDFDB.ReactUtils.createElement(BDFDB.LibraryComponents.SettingsSaveItem, {

                                type: "Switch",
                                plugin: this,
                                keys: ["places", key],
                                label: this.defaults.places[key].description,
                                value: this.settings.places[key]
                            }))
                        }));

                        items.push(BDFDB.ReactUtils.createElement(BDFDB.LibraryComponents.SettingsLabel, {

                            label: "Users:"
                        }));

                        items.push(BDFDB.ReactUtils.createElement(BDFDB.LibraryComponents.SettingsItem, {

                            type: "Button",
                            color: BDFDB.LibraryComponents.Button.Colors.RED,
                            label: BDFDB.ReactUtils.createElement(BDFDB.LibraryComponents.Flex, {

                                children: !Object.keys(users).length ? BDFDB.LanguageUtils.LanguageStrings.NONE : Object.keys(users).filter(BDFDB.LibraryModules.UserStore.getUser).map(id => BDFDB.ReactUtils.createElement(BDFDB.LibraryComponents.TooltipContainer, {

                                    text: this.getUserData(id).username,
                                    children: BDFDB.ReactUtils.createElement(BDFDB.LibraryComponents.AvatarComponents.default, {

                                        className: BDFDB.disCN.listavatar,
                                        src: this.getUserAvatar(id),
                                        size: BDFDB.LibraryComponents.AvatarComponents.Sizes.SIZE_32,

                                        onClick: () => this.getUserSettings(BDFDB.LibraryModules.UserStore.getUser(id))
                                    })
                                }))
                            }),

                            onClick: () => {
                                BDFDB.ModalUtils.confirm(this, this.labels.confirm_resetall, () => {

                                    BDFDB.DataUtils.remove(this, "users");
                                    BDFDB.PluginUtils.refreshSettingsPanel(this, panel, states);
                                
                                    this.getUserUpdates();
                                });
                            },
                            children: BDFDB.LanguageUtils.LanguageStrings.RESET
                        }));
                        return items;
                    }
                });
            }

            getUserData(id, change = true, keep = false, fallback) {

                let user = BDFDB.LibraryModules.UserStore.getUser(id);
                if (!user && BDFDB.ObjectUtils.is(fallback) || user && BDFDB.ObjectUtils.is(fallback) && user.username != fallback.username) {

                    user = fallback;
                }
                if (!user) {
                    return new BDFDB.DiscordObjects.User({});
                }
                let data = change && users[user.id];
                if (data) {

                    let object = {}, native = new BDFDB.DiscordObjects.User(user);
                    for (let key in native) {

                        object[key] = native[key];
                    }
                    object.tag = native.tag;
                    object.createdAt = native.createdAt;
                    object.username = !keep && data.name || native.username;
                    object.usernameNormalized = !keep && data.name && data.name.toLowerCase() || native.usernameNormalized;
                    if (data.removeIcon) {

                        object.avatar = null;
                        object.avatarURL = null;
                        object.getAvatarSource = () => null;
                        object.getAvatarURL = () => null;
                        object.guildMemberAvatars = {};
                    } else if (data.url) {

                        object.avatar = data.url;
                        object.avatarURL = data.url;
                        object.getAvatarSource = () => data.url;
                        object.getAvatarURL = () => data.url;
                        object.guildMemberAvatars = {};
                    }
                    if (data.removeBanner) {

                        object.banner = null;
                        object.bannerURL = null;
                        object.getBannerSource = () => null;
                        object.getBannerURL = () => null;
                    } else if (data.banner) {

                        object.banner = data.banner;
                        object.bannerURL = data.banner;
                        object.getBannerSource = () => data.banner;
                        object.getBannerURL = () => data.banner;
                    }
                    return object;
                }
                return new BDFDB.DiscordObjects.User(user);
            }

            getUserAvatar(id, change = true) {

                let user = BDFDB.LibraryModules.UserStore.getUser(id);
                if (!user) {
                    return "";
                }
                let data = change && users[user.id];
                if (data) {
                    if (data.removeIcon) {
                        return "";
                    } else if (data.url) {
                        return data.url;
                    }
                }
                return BDFDB.LibraryModules.IconUtils.getUserAvatarURL(user);
            }

            getUserSettings(user) {

                let data = users[user.id] || {};
                let latest = Object.assign({}, data);

                let member = BDFDB.LibraryModules.MemberStore.getMember(BDFDB.LibraryModules.LastGuildStore.getGuildId(), user.id) || {};

                let avatar, banner;
                BDFDB.ModalUtils.open(this, {

                    size: "LARGE",
                    header: this.labels.modal_header,
                    subheader: member.nick || user.username,
                    children: [
                        BDFDB.ReactUtils.createElement("div", {

                            className: BDFDB.disCN.marginbottom20,
                            children: [
                                BDFDB.ReactUtils.createElement(BDFDB.LibraryComponents.Flex, {

                                    className: BDFDB.disCN.marginbottom8,
                                    align: BDFDB.LibraryComponents.Flex.Align.CENTER,
                                    direction: BDFDB.LibraryComponents.Flex.Direction.HORIZONTAL,
                                    children: [
                                        BDFDB.ReactUtils.createElement(BDFDB.LibraryComponents.FormComponents.FormTitle, {

                                            className: BDFDB.disCN.marginreset,
                                            tag: BDFDB.LibraryComponents.FormComponents.FormTitle.Tags.H5,
                                            children: "Profile Avatar"
                                        }),
                                        BDFDB.ReactUtils.createElement(BDFDB.LibraryComponents.SettingsItem, {

                                            type: "Switch",
                                            margin: 0,
                                            grow: 0, 
                                            label: BDFDB.LanguageUtils.LanguageStrings.REMOVE,
                                            tag: BDFDB.LibraryComponents.FormComponents.FormTitle.Tags.H5,
                                            value: data.removeIcon,

                                            onChange: value => {

                                                latest.removeIcon = value;
                                                if (value) {

                                                    delete avatar.props.success;
                                                    delete avatar.props.errorMessage;

                                                    avatar.props.disabled = true;

                                                    BDFDB.ReactUtils.forceUpdate(avatar);
                                                } else {

                                                    avatar.props.disable = false;
                                                    this.getUserUrl(avatar.props.value, avatar).then(returned => latest.url = returned);
                                                }
                                            }
                                        })
                                    ]
                                }),
                                BDFDB.ReactUtils.createElement(BDFDB.LibraryComponents.TextInput, {

                                    success: !data.removeIcon && data.url,
                                    maxLength: 100000000000000000000n,
                                    value: data.url,
                                    placeholder: BDFDB.UserUtils.getAvatar(user.id),
                                    disable: data.removeIcon,
                                    
                                    ref: instance => {
                                        if (instance) {

                                            avatar = instance;
                                        }
                                    },

                                    onChange: (value, instance) => {
                                        
                                        this.getUserUrl(value, instance).then(returned => latest.url = returned);
                                    }
                                })
                            ]
                        }),
                        BDFDB.ReactUtils.createElement("div", {

                            className: BDFDB.disCN.marginbottom20,
                            children: [
                                BDFDB.ReactUtils.createElement(BDFDB.LibraryComponents.Flex, {

                                    className: BDFDB.disCN.marginbottom8,
                                    align: BDFDB.LibraryComponents.Flex.Align.CENTER,
                                    direction: BDFDB.LibraryComponents.Flex.Direction.HORIZONTAL,
                                    children: [
                                        BDFDB.ReactUtils.createElement(BDFDB.LibraryComponents.FormComponents.FormTitle, {

                                            className: BDFDB.disCN.marginreset,
                                            tag: BDFDB.LibraryComponents.FormComponents.FormTitle.Tags.H5,
                                            children: "Profile Banner"
                                        }),
                                        BDFDB.ReactUtils.createElement(BDFDB.LibraryComponents.SettingsItem, {

                                            type: "Switch",
                                            margin: 0,
                                            grow: 0,
                                            label: BDFDB.LanguageUtils.LanguageStrings.REMOVE,
                                            tag: BDFDB.LibraryComponents.FormComponents.FormTitle.Tags.H5,
                                            value: data.removeBanner,

                                            onChange: value => {

                                                latest.removeBanner = value;
                                                if (value) {

                                                    delete banner.props.success;
                                                    delete banner.props.errorMessage;

                                                    banner.props.disabled = true;

                                                    BDFDB.ReactUtils.forceUpdate(banner);
                                                } else {

                                                    banner.props.disabled = false;
                                                    this.getUserUrl(banner.props.value, banner).then(returned => latest.banner = returned);
                                                }
                                            }
                                        })
                                    ]
                                }),
                                BDFDB.ReactUtils.createElement(BDFDB.LibraryComponents.TextInput, {

                                    success: !data.removeBanner && data.banner,
                                    maxLength: 100000000000000000000n,
                                    value: data.banner,
                                    placeholder: BDFDB.UserUtils.getBanner(user.id),
                                    disabled: data.removeBanner,

                                    ref: instance => {
                                        if (instance) {

                                            banner = instance;
                                        }
                                    },

                                    onChange: (value, instance) => {
                                        
                                        this.getUserUrl(value, instance).then(returned => latest.banner = returned);
                                    }
                                })
                            ]
                        })
                    ],
                    buttons: [{

                        contents: "Save",
                        color: "BRAND",
                        close: true,

                        onClick: () => {

                            latest.url = !latest.removeIcon ? latest.url : "";
                            latest.banner = !latest.removeBanner ? latest.url : "";

                            let changed = false;
                            if (Object.keys(latest).every(key => latest[key] == null || latest[key] == false) && (changed = true)) {

                                BDFDB.DataUtils.remove(this, "users", user.id);
                            } else if (!BDFDB.equals(latest, data) && (changed = true)) {

                                BDFDB.DataUtils.save(latest, this, "users", user.id);
                            }
                            if (changed) {

                                this.getUserUpdates();
                            }
                        }
                    }]
                });
            }

            getUserUrl(url, instance) {
                return new Promise(callback => {

                    BDFDB.TimeUtils.clear(instance.checkTimeout);

                    url = url && url.trim();
                    if (!url || instance.props.disabled) {

                        delete instance.props.success;
                        delete instance.props.errorMessage;

                        callback("");

                        BDFDB.ReactUtils.forceUpdate(instance);
                    } else {

                        instance.checkTimeout = BDFDB.TimeUtils.timeout(() => {
                            BDFDB.LibraryRequires.request(url, response => {

                                delete instance.checkTimeout;
                                if (instance.props.disabled) {

                                    delete instance.props.success;
                                    delete instance.props.errorMessage;

                                    callback("");
                                } else if (response && response.headers["content-type"] && response.headers["content-type"].indexOf("image") != -1) {

                                    instance.props.success = true;

                                    delete instance.props.errorMessage;

                                    callback(url);
                                } else {

                                    delete instance.props.success;

                                    instance.props.errorMessage = this.labels.modal_invalidurl;

                                    callback("");
                                }
                                BDFDB.ReactUtils.forceUpdate(instance);
                            });
                        }, 1000);
                    }
                });
            }

            onUserContextMenu(event) {
                if (event.instance.props.user) {

                    let username = this.getUserData(event.instance.props.user.id).username;
                    if (username != event.instance.props.user.username && this.settings.places.menu) {

                        let [kickChildren, kickIndex] = BDFDB.ContextMenuUtils.findItem(event.returnvalue, {

                            id: "kick"
                        });
                        if (kickIndex > -1) {

                            kickChildren[kickIndex].props.label = BDFDB.LanguageUtils.LanguageStringsFormat("KICK_USER", username);
                        }
                        let [banChildren, banIndex] = BDFDB.ContextMenuUtils.findItem(event.returnvalue, {

                            id: "ban"
                        });
                        if (banIndex > -1) {

                            banChildren[banIndex].props.label = BDFDB.LanguageUtils.LanguageStringsFormat("BAN_USER", username);
                        }
                        let [muteChildren, muteIndex] = BDFDB.ContextMenuUtils.findItem(event.returnvalue, {

                            id: "mute-channel"
                        });
                        if (muteIndex > -1) {

                            muteChildren[muteIndex].props.label = BDFDB.LanguageUtils.LanguageStringsFormat("MUTE_CHANNEL", `@${username}`);
                        }
                        let [unmuteChildren, unmuteIndex] = BDFDB.ContextMenuUtils.findItem(event.returnvalue, {

                            id: "unmute-channel"
                        });
                        if (unmuteIndex > -1) {

                            unmuteChildren[unmuteIndex].props.label = BDFDB.LanguageUtils.LanguageStringsFormat("UNMUTE_CHANNEL", `@${username}`);
                        }
                    }
                    let [children, index] = BDFDB.ContextMenuUtils.findItem(event.returnvalue, {

                        id: "devmode-copy-id",
                        group: true
                    });
                    children.splice(index > -1 ? index : children.length, 0, BDFDB.ContextMenuUtils.createItem(BDFDB.LibraryComponents.MenuItems.MenuGroup, {
                        children: BDFDB.ContextMenuUtils.createItem(BDFDB.LibraryComponents.MenuItems.MenuItem, {

                            label: "User Settings",
                            id: BDFDB.ContextMenuUtils.createItemId(this.name, "settings-submenu"),
                            children: BDFDB.ContextMenuUtils.createItem(BDFDB.LibraryComponents.MenuItems.MenuGroup, {
                                children: [
                                    BDFDB.ContextMenuUtils.createItem(BDFDB.LibraryComponents.MenuItems.MenuItem, {

                                        label: "Change Settings",
                                        id: BDFDB.ContextMenuUtils.createItemId(this.name, "settings-change"),

                                        action: () => {

                                            this.getUserSettings(event.instance.props.user);
                                        }
                                    }),
                                    BDFDB.ContextMenuUtils.createItem(BDFDB.LibraryComponents.MenuItems.MenuItem, {

                                        label: "Reset Settings",
                                        id: BDFDB.ContextMenuUtils.createItemId(this.name, "settings-reset"),
                                        color: BDFDB.LibraryComponents.MenuItems.Colors.DANGER,
                                        disabled: !users[event.instance.props.user.id],

                                        action: events => {

                                            let remove = () => {

                                                BDFDB.DataUtils.remove(this, "users", event.instance.props.user.id);
                                                this.forceUpdateAll(true);
                                            };
                                            if (events.shiftKey) {

                                                remove();
                                            } else {

                                                BDFDB.ModalUtils.confirm(this, this.labels.confirm_reset, remove);
                                            }
                                        }
                                    })
                                ]
                            })
                        })
                    }));
                }
            }

            getUserUpdates() {

                users = BDFDB.DataUtils.load(this, "users");

                let channel = BDFDB.LibraryModules.ChannelStore.getChannel(BDFDB.LibraryModules.LastChannelStore.getChannelId());
                if (document.head.querySelector("title") && channel && channel.isDM()) {

                    let user = BDFDB.LibraryModules.UserStore.getUser(channel.recipients[0]);
                    if (user) {

                        BDFDB.DOMUtils.setText(document.head.querySelector("title"), "@" + this.getUserData(user.id, this.settings.places.title).username);
                    }
                }
                BDFDB.PatchUtils.forceAllUpdates(this);
			    BDFDB.MessageUtils.rerenderAll();
            }

            onSettingsClosed() {
                if (this.SettingsUpdated) {

                    delete this.SettingsUpdated;
                    this.getUserUpdates();
                }
            }

            onLoad() {

                this.defaults = {
                    places: {
                        menu: {

                            value: true,
                            description: "User Menu"
                        },
                        title: {

                            value: true,
                            description: "Discord App Title"
                        }
                    }
                };
            }

            onStart() {

                this.getUserUpdates();
            }

            onStop() {

                this.getUserUpdates();
            }
        };
    })(window.BDFDB_Global.PluginUtils.buildPlugin(config));
 })();
 