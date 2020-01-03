const stream = require("stream");


module.exports = function (commander) {


    const transmitter = module.exports.transmitter = new stream.PassThrough();
    const writable = module.exports.receiver = new stream.Writable();


    writable._write = (chunk, encoding, cb) => {
        commander.parse(chunk.toString(), (cmd, params) => {

            commander.emit("command", cmd, params);

        });
    };

    return {
        transmitter: transmitter,
        receiver: writable
    };

};