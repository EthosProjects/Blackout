const { Plugin } = require('powercord/entities');
let loadOveride = false;
module.exports = class Blackout extends Plugin {
    async startPlugin() {
        this.keyupBound = this.keyup.bind(this);
        if (!loadOveride) document.body.addEventListener('keyup', this.keyupBound);
    }
    pluginWillUnload() {
        if (!loadOveride) document.body.removeEventListener('keyup', this.keyupBound);
    }
    async keyup(event) {
        if (event.key != 'F4' || loadOveride) return;
        loadOveride = true;
        if (powercord?.api?.settings?.ready === true) await powercord.shutdown();
        else await powercord.startup();
        loadOveride = false;
    }
};
