const Commander = require("../index.js");
const COMMANDS = require("./commands.json");

// create new instance
const commander = new Commander(COMMANDS);

const data = commander.compile("PWR_{state}", {
    state: "ON"
});

console.log(data);