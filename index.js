const { Plugin } = require('powercord/entities');
const Settings = require('./components/settings.jsx');
const { FluxDispatcher: Dispatcher, getModule } = require('powercord/webpack');
let loadOveride = false;
module.exports = class Blackout extends Plugin {
    async startPlugin() {
        powercord.api.settings.registerSettings(this.entityID, {
            category: this.entityID,
            label: 'Blackout',
            render: Settings,
        });
        this.handlers = {
            listeners: [['keyup', this.keyup.bind(this)]],
            subscriptions: [
                ['STREAM_START', this.streamStart.bind(this)],
                ['STREAM_STOP', this.streamStop.bind(this)],
            ],
        };
        this.addHandlers();
    }
    pluginWillUnload() {
        if (!loadOveride) this.removeHandlers();
        powercord.api.settings.unregisterSettings(this.entityID);
    }
    async startup() {
        this.removeHandlers();
        await powercord.startup();
    }
    async keyup(event) {
        if (event.key == this.settings.get('refreshKeybind', 'F4')) location.reload();
        if (event.key != this.settings.get('blackoutKeybind', 'F5') || loadOveride) return;
        this.settings.set('startupOnStreamEnd', false);
        loadOveride = true;
        if (powercord?.api?.settings?.ready === true) await powercord.shutdown();
        else await this.startup();
        loadOveride = false;
    }
    async streamStart() {
        if (!this.settings.get('blackoutOnStream', false)) return;
        if (powercord?.api?.settings?.ready === true) this.settings.set('startupOnStreamEnd', true);
        loadOveride = true;
        await powercord.shutdown();
        loadOveride = false;
    }
    async streamStop() {
        if (!this.settings.get('blackoutOnStream', false) || !this.settings.get('startupOnStreamEnd', false)) return;
        loadOveride = true;
        await this.startup();
        loadOveride = false;
    }
    async addHandlers() {
        for (let i = 0; i < this.handlers.listeners.length; i++)
            document.body.addEventListener(this.handlers.listeners[i][0], this.handlers.listeners[i][1]);
        for (let i = 0; i < this.handlers.subscriptions.length; i++)
            Dispatcher.subscribe(this.handlers.subscriptions[i][0], this.handlers.subscriptions[i][1]);
    }
    async removeHandlers() {
        for (let i = 0; i < this.handlers.listeners.length; i++)
            document.body.removeEventListener(this.handlers.listeners[i][0], this.handlers.listeners[i][1]);
        for (let i = 0; i < this.handlers.subscriptions.length; i++)
            Dispatcher.unsubscribe(this.handlers.subscriptions[i][0], this.handlers.subscriptions[i][1]);
    }
};
