const moment = require('moment');
module.exports = {
    name: 'clockout',
    description: 'Pings the bot.',
    aliases: ['clock-out'],
    async execute(client, message, args, Hyperz, config, con){

        try {

            con.query(`SELECT * FROM users WHERE id='${message.author.id}' AND clocked='false'`, async (err, row) => {
                if(err) throw err;
                if(row[0]) return message.channel.send(`You are not currently clocked in.`).then(msg => {
                    msg.delete({ timeout: 12000 })
                    message.delete()
                }).catch(e => {});
            });

            let datetime = moment().format(config['main_config'].date_format);
                config.logging.logClockTimesChannels.forEach(async chan => {
                    const thechannel = client.channels.cache.get(chan)
                    if(!thechannel) {
                        console.log("One of the channels entered in the config.json file is not properly configured. Please make sure you use Channel ID's. Not Names.")
                    } else {
                        await con.query(`SELECT * FROM users WHERE id='${message.author.id}'`, async (err, row) => {
                            if(err) throw err;
                            const logembed = new Hyperz.MessageEmbed()
                            .setColor(`${config.main_config.colorhex}`)
                            .setAuthor(`User Clocked Out`, client.user.displayAvatarURL())
                            .setDescription(`**User Tag:** ${message.author.tag}\n**User ID:** ${message.author.id}\n\n**Start Time:** ${row[0].startTime}\n**End Time:** ${datetime}\n\n**Character Name:** ${row[0].characterName}\n**Department:** ${row[0].activeDptName}\n**District:** ${row[0].district}`)
                            .setFooter(`${config.main_config.copyright}`)
                            thechannel.send(logembed).catch(e => {if(config["main_config"].debugmode) return console.log(e);})

                            await con.query(`UPDATE users SET endTime="${datetime}", characterName="NONE", district="NONE", activeDptName="NONE", clocked="false" WHERE id='${message.author.id}'`, async (err, row) => {
                                if(err) throw err;
                            });
                            const conf = new Hyperz.MessageEmbed()
                            .setColor(`${config.main_config.colorhex}`)
                            .setDescription(`You have successfully been clocked out!`)
                            .setTimestamp()
                            .setFooter(`${config.main_config.copyright}`)

                            message.channel.send(conf).catch(e => {});
                        });

                    }
                });

       } catch(e) {
        if(config.main_config.debugmode) return console.log(e);
       }

    },
}