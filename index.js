// https://gist.github.com/smeijer/6580740a0ff468960a5257108af1384e
// https://gist.github.com/shannonmoeller/b4f6fbab2ffec56213e7
// https://regexr.com/4riep

const { EventEmitter } = require("events");
const util = require("util");


/**
 * Constructur
 * @param {array} commands 
 */
function Commander(commands) {

    this.commands = commands || [];
    EventEmitter.call(this);

    this.streams = require("./streams.js")(this);

}

// inherit EventEmitter
util.inherits(Commander, EventEmitter);


/**
 * Compile a template string
 * @param {string} template
 * @param {object} data
 */
Commander.prototype.compile = function compile(template, data) {
    return template.replace(/{.+?}/g, (match) => {
        const path = match.substr(1, match.length - 2).trim();
        return data[path] || `{${path}}`;
    });
};


/**
 * Parse a command and returns the command object
 * @param {object} data
 * @param {function} cb
 */
Commander.prototype.parse = function parse(data, cb) {

    // https://stackoverflow.com/questions/59570984/regex-pattern-simple-string-template-object-mapping

    let cmd_obj = {};

    // filter all possible commands
    // POWER_TOGGLE or POWER_{state} can be missmatched
    // so we try to filter this with a string comparison
    const list = this.commands.filter((cmd) => {
        const regex = cmd.template.replace(/{.+?}/g, "(.*)");
        return new RegExp(regex, "g").test(data);
    });


    // compare command template
    // with command string
    if (list.length > 1) {
        cmd_obj = list.find((cmd) => {
            return cmd.template === data;
        });
    } else {
        cmd_obj = list[0];
    }


    const names = cmd_obj.template.match(/[^\{\}]+(?=\})/g);
    const regex = cmd_obj.template.replace(/{.+?}/g, "(.*)");
    const values = data.match(new RegExp(regex)).slice(1);


    if (names.length !== values.length) {
        return console.log("missmatch");
    }


    // polyfill for Object.fromEntries
    // https://github.com/feross/fromentries
    const params = ((iterable) => {
        return [...iterable].reduce((obj, [key, val]) => {
            obj[key] = val;
            return obj;
        }, {});
    })(names.map((s, i) => {
        return [s, values[i]]
    }));


    process.nextTick(() => {
        cb(cmd_obj, params);
    });

};


/**
 * Compile and write payload to transmitter stream
 * @param {string} id
 * @param {object} params
 */
Commander.prototype.submit = function submit(id, params) {

    const cmd = this.commands.find((e) => {
        return e._id === id;
    });

    const payload = this.compile(cmd.template, params);
    this.streams.transmitter.write(payload);

    return payload;

};


module.exports = Commander;