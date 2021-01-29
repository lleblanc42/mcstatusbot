const Discord = require("discord.js");
const mcping = require('mc-ping-updated');
const chalk = require('chalk');
const escape = require('markdown-escape');
const fs = require('fs');

const client = new Discord.Client();
const settings = require('./config.json');

var pingFrequency = (settings.pingInterval * 1000);

function getDate() {
    var date = new Date();

    return date.toLocaleTimeString();
}

function getServerStatus() {
    mcping(settings.ip, settings.port, function(err, res) {
        var cleanDate = getDate();

        if (!(typeof err === 'undefined' || err === null)) {
            var msg = settings.serverStatus.dnd.msg;
            var type = settings.serverStatus.dnd.type;

            client.user.setStatus('dnd');
            client.user.setActivity(msg, { type: type });

            console.log((chalk.yellow('\[' + cleanDate + '\]:') + chalk.white(' Ping: ' + 'Error getting server status')));
            console.error(err);
        } else {
            var msgPrefix = (typeof res.players.sample === 'undefined' ? settings.serverStatus.idle.msg.prefix : settings.serverStatus.online.msg.prefix);
            var msgSuffix = (typeof res.players.sample === 'undefined' ? settings.serverStatus.idle.msg.suffix : settings.serverStatus.online.msg.suffix);
            var type = (typeof res.players.sample === 'undefined' ? settings.serverStatus.idle.type : settings.serverStatus.online.type);
            var playerCount = res.players.online + ' / ' + res.players.max;

            if (typeof res.players.sample === 'undefined') {
                var enabled = settings.serverStatus.idle.enabled;

                if (enabled === 1) client.user.setStatus('idle');
            } else client.user.setStatus('online');

            client.user.setActivity(msgPrefix + playerCount + msgSuffix, { type: type }).then(presence => console.log(
                chalk.cyan('\[' + cleanDate + '\]:') + chalk.white(' Ping: ' + playerCount)
            )).catch(console.error);
        }
    })
}

//Command Handler
client.aliases = new Discord.Collection();

//Startup:
client.on("ready", () => {
    console.log("Ready!");

    getServerStatus();

    client.setInterval(getServerStatus, pingFrequency);
});

client.login(settings.token);

