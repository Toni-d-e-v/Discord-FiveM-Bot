const fs = require('fs');
const config = require('../../config.json');

module.exports = async (client, Hyperz, config, con, guild) => {
    
        if(guild.id === config.servers.recruitment) {
            console.log(`I have joined the recruitment server!`)
            guildSetup(config, con, guild)
        } else if(guild.id === config.servers.training) {
            console.log(`I have joined the training server!`)
            guildSetup(config, con, guild)
        } else if(guild.id === config.servers.main) {
            console.log(`I have joined the main server!`)
            guildSetup(config, con, guild)
        } else {
            try {
                console.log(`I have been added to ${guild.name}.\nI have left ${guild.name} as they are not apart of the servers list.`)
                await guild.leave();
            } catch(e) {
                if(config.main_config.debugmode) return console.log(e);
            }
        }

}

async function guildSetup(config, con, guild) {

            guild.members.cache.forEach(async m => {
                await con.query(`SELECT * FROM users WHERE id='${m.id}'`, async (err, row) => {
                    if(err) throw err;
                    if(!row[0]) {
                        await con.query(`INSERT INTO users (id, startTime, endTime, activeDptName, characterName, district, clocked) VALUES ("${m.id}", "00:00 00-00-0000", "00:00 00-00-0000", "Never Clocked", "Never Clocked", "Never Clocked", "false")`, async (err, row) => {
                            if(err) throw err;
                        });
                    }
                });
            });

};
