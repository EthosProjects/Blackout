const { React } = require('powercord/webpack');
const { SwitchItem } = require('powercord/components/settings');
const KeybindRecorder = require('./KeybindRecorder.jsx');
module.exports = class Settings extends React.PureComponent {
    constructor(props) {
        super(props);
    }
    render() {
        const { getSetting, updateSetting, toggleSetting } = this.props;
        return (
            <div>
                <KeybindRecorder
                    value={getSetting('blackoutKeybind', 'F4')}
                    onChange={(event) => updateSetting('blackoutKeybind', event)}
                    onReset={() => updateSetting('blackoutKeybind', 'F4')}
                >
                    Toggle Blackout keybind
                </KeybindRecorder>
                <KeybindRecorder
                    value={getSetting('refreshKeybind', 'F5')}
                    onChange={(event) => updateSetting('refreshKeybind', event)}
                    onReset={() => updateSetting('refreshKeybind', 'F5')}
                >
                    Toggle refresh keybind
                </KeybindRecorder>
                <SwitchItem
                    value={getSetting('blackoutOnStream', true)}
                    onChange={() => toggleSetting('blackoutOnStream')}
                    note="Automatically blackout when you stream"
                >
                    Blackout when streaming
                </SwitchItem>
            </div>
        );
    }
};
