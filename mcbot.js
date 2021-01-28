const Discord = require("discord.js");
const mcping = require('mc-ping-updated');
const chalk = require('chalk');
const escape = require('markdown-escape');
const fs = require('fs');

const client = new Discord.Client();
const settings = require('./config.json');

var hasIcon = 'n/a';
pingFrequency = (settings.pingInterval * 1000);
embedColor = ("0x" + settings.embedColor);

function getDate() {
    date = new Date();
    cleanDate = date.toLocaleTimeString();
}

function getServerStatus() {
    mcping(settings.ip, settings.port, function(err, res) {
        playerCount = res.players.online + ' / ' + res.players.max;

        getDate();

        if (!(typeof err === 'undefined' || err === null)) {
            client.user.setStatus('dnd');
            client.user.setActivity(settings.serverStatus.dnd.msg, { type: settings.serverStatus.dnd.type });

            console.log((chalk.yellow('\[' + cleanDate + '\]:') + chalk.white(' Ping: ' + 'Error getting server status')));
            console.error(err);
        } else if (typeof res.players.sample === 'undefined') {
            msgPrefix = settings.serverStatus.idle.msg.preffix;
            msgSuffix = settings.serverStatus.idle.msg.suffix;

            if (settings.serverStatus.idle.enabled === 1) client.user.setStatus('idle');

            client.user.setActivity((msgPrefix.length > 0 ? msgPrefix + ' ' : '') + playerCount + (msgSuffix.length > 0 ? ' ' + msgSuffix : ''), { settings.serverStatus.idle.type }).then(presence => console.log(
                chalk.cyan('\[' + cleanDate + '\]:') + chalk.white(' Ping: ' + playerCount)
            )).catch(console.error);
        } else {
            client.user.setStatus('online');

            client.user.setActivity(settings.serverStatus.online.msg + playerCount, { settings.serverStatus.dnd.type }).then(presence => console.log(
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

