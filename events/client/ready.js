const fs = require('fs');
const ms = require('ms');
const wait = require('util').promisify(setTimeout);
const axios = require('axios')
const chalk = require('chalk')
const { startupScreen } = require('../../util/boot.js');
let i = 0;

module.exports = (client, Hyperz, config, con) => {

    setInterval(function () {
        con.ping()
    }, ms(`25m`));

    process.on('unhandledRejection', err => {});
  
  let daPort = config["main_config"].port

        const express = require("express");
        const app = express()
        app.listen(daPort)

        client.users.cache.forEach(async u => {
            con.query(`SELECT * FROM users WHERE id='${u.id}'`, async (err, row) => {
                if(err) throw err;
                if(!row[0]) {
                    await con.query(`INSERT INTO users (id, startTime, endTime, activeDptName, characterName, district, clocked) VALUES ("${u.id}", "00:00 00-00-0000", "00:00 00-00-0000", "Never Clocked", "Never Clocked", "Never Clocked", "false")`, async (err, row) => {
                        if(err) throw err;
                    });
                }
            });
        });

        if (config.fiveminteg.enabled) {
            try {
                config.fiveminteg.servers.forEach(async e => {

                    setInterval(async function() {
                        let channel = await client.channels.cache.get(e.channelid);

                        let check = await axios({
                            method: 'get',
                            url: `http://${e.serverIPPort}/dynamic.json`,
                        }).catch(e => console.log(e));

                        if(check) {
                            if(check.data) {
                                channel.setName(`${e.name}: ${check.data.clients}/${check.data.sv_maxclients}`);
                            } else {
                                channel.setName(`${e.name}: 0`);
                            }
                        } else {
                            channel.setName(`${e.name}: 0`);
                        }
                    }, ms(`${config.fiveminteg.refreshrate}`))

                });
            } catch(e) {
                if (config["main_config"].debugmode) return console.log(e);
            }
        }

  startupScreen(client);
  changeStatus(client, config)

  async function changeStatus(client, config) {
    if (i >= config.presence_config.length) i = 0;
    await client.user.setPresence({
        activity: {
            name: config.presence_config[i].name,
            type: config.presence_config[i].type
        },
        status: config.presence_config[i].status
    });
    i++;
    setTimeout(() => {
        changeStatus(client, config);
    }, 10000)

};

}