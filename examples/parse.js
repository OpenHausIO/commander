const Commander = require("../index.js");
const COMMANDS = require("./commands.json");

// create new instance
const commander = new Commander(COMMANDS);

commander.parse("PWR_ON", (cmd, params) => {
    console.log(cmd, params)
});