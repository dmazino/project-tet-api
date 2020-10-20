const bluetooth = require('node-bluetooth');
const cron = require('node-cron');
const websocket = require('../websocket');

// create bluetooth device instance
const device = new bluetooth.DeviceINQ();
let conn = null;
let isOn;

const turnOnLEDs = (connection) => {
    if (!connection) { connection = conn; }

    isOn = true;
    connection.write(new Buffer('1', 'utf-8'), () => { console.log('Turning on LEDs') });
    websocket.updateState(websocket.states.LIGHT_ON);
}

const getStatus = () => {
    return isOn;
}

const turnOffLEDs = (connection) => {
    if (!connection) { connection = conn; }

    isOn = false;
    connection.write(new Buffer('0', 'utf-8'), () => { console.log('Turning off LEDs') });
    websocket.updateState(websocket.states.LIGHT_OFF);
}

const init = function () {

    return new Promise((resolve, reject) => {
        device
            .on('finished', () => console.log('device found'))
            .on('found', function found(address, name) {
                if (name === 'HC-05') {
                    console.log('Found: ' + address + ' with name ' + name);
                    device.findSerialPortChannel(address, function (channel) {
                        console.log('Found RFCOMM channel for serial port on %s: ', name, channel);

                        // make bluetooth connect to remote device
                        bluetooth.connect(address, channel, function (err, connection) {
                            console.log('Connecting to Desklights...');
                            if (err) { reject(); return }

                            conn = connection;

                            console.log('\n##############################');
                            console.log('######### Connected! #########');
                            console.log('##############################');

                            // Morning Job (9:15am)
                            cron.schedule('15 9 * * *', () => turnOnLEDs(connection));

                            // Night Job (midnight)
                            cron.schedule('0 0 * * *', () => turnOffLEDs(connection));

                            resolve();
                        });

                    });

                }
            }).scan();
    });

}

module.exports = { init, turnOnLEDs, turnOffLEDs, getStatus }