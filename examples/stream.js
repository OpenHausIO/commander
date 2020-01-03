const Commander = require("../index.js");
const COMMANDS = require("./commands.json");

// create new instance
const commander = new Commander(COMMANDS);


// fired when a command is received from device
commander.on("command", (cmd, params) => {
    console.log(cmd, params);
});


// RECEIVER: [device] -> [ws] -> [adapter] -> [commaner]
// TRANSMITTER: [commaner] -> [adapter] -> [ws] -> [device]
const receiver = commander.streams.receiver;
const transmitter = commander.streams.transmitter;


// this comes from the device
// fired from an adapter
receiver.write("PWR_ON");




//////////////////////////////////////////////////
// ADDITION TRANSMITTER EXAMPLE
//////////////////////////////////////////////////
setTimeout(() => {

    // transmitter is piped to an adapter
    transmitter.on("data", (payload) => {
        console.log("> Adapter input: %s", payload);
    });


    // submit takes a command id and parmeter object
    // the template is compiled and written to the transmitter stream
    commander.submit("5e0f55a56a5de5574cf144fb", {
        state: "ON" // OFF
    });

}, 1000);