const fs = require('fs');
const config = require('../../config.json');

module.exports = async (client, Hyperz, config, con, guildMember) => {
    
        con.query(`SELECT * FROM users WHERE id='${guildMember.user.id}'`, async (err, row) => {
            if(err) throw err;
            if(!row[0]) {
                await con.query(`INSERT INTO users (id, startTime, endTime, activeDptName, characterName, district, clocked) VALUES ("${guildMember.user.id}", "00:00 00-00-0000", "00:00 00-00-0000", "Never Clocked", "Never Clocked", "Never Clocked", "false")`, async (err, row) => {
                    if(err) throw err;
                });
            }
        });

}