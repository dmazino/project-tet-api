const bluetooth = require('node-bluetooth'); 
var cron = require('node-cron');

// create bluetooth device instance
const device = new bluetooth.DeviceINQ();

const turnOnLEDs = function (connection) {
    connection.write(new Buffer('1', 'utf-8'), () => { console.log('Turning on LEDs') });
}

const turnOffLEDs = function (connection) {
    connection.write(new Buffer('0', 'utf-8'), () => { console.log('Turning off LEDs') });
}

const init = function(){
    device
    .on('finished', console.log.bind(console, 'finished'))
    .on('found', function found(address, name) {
        if (name === 'HC-05') {
            console.log('Found: ' + address + ' with name ' + name);
            device.findSerialPortChannel(address, function (channel) {
                console.log('Found RFCOMM channel for serial port on %s: ', name, channel);

                // make bluetooth connect to remote device
                bluetooth.connect(address, channel, function (err, connection) {
                    console.log('Connecting to Desklights...');
                    if (err) return console.error(err);

                    connection.on('data', (buffer) => {
                        console.log(buffer.toString());
                    });

                    console.log('##############################');
                    console.log('######### Connected! #########');
                    console.log('##############################');

                    // Morning Job (9:15am)
                    cron.schedule('15 9 * * *', () => turnOnLEDs(connection));

                    // Night Job (midnight)
                    cron.schedule('0 0 * * *', () => turnOffLEDs(connection));
                });

            });

        }
    }).scan();
}

    module.exports = {init, turnOnLEDs, turnOffLEDs}