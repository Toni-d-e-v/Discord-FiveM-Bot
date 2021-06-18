const moment = require('moment');
module.exports = {
    name: 'clockin',
    description: 'Pings the bot.',
    aliases: ['clock-in'],
    async execute(client, message, args, Hyperz, config, con){

        con.query(`SELECT * FROM users WHERE id='${message.author.id}' AND clocked='true'`, async (err, row) => {
            if(err) throw err;
            if(row[0]) return message.channel.send(`You are already clocked in.`).then(msg => {
                msg.delete({ timeout: 12000 })
                message.delete()
            }).catch(e => {});
        });

        const filter = m => m.author.id === message.author.id;

        const starter = new Hyperz.MessageEmbed()
        .setColor(config["main_config"].colorhex)
        .setDescription(`What is your in-game character name?`)
        .setTimestamp()
        .setFooter(`${config.main_config.copyright}`)

        const prompt1 = new Hyperz.MessageEmbed()
        .setColor(config["main_config"].colorhex)
        .setDescription(`What department are you clocking into?`)
        .setTimestamp()
        .setFooter(`${config.main_config.copyright}`)

        const prompt2 = new Hyperz.MessageEmbed()
        .setColor(config["main_config"].colorhex)
        .setDescription(`What district will you be in?`)
        .setTimestamp()
        .setFooter(`${config.main_config.copyright}`)

        const lastprompt = new Hyperz.MessageEmbed()
        .setColor(config["main_config"].colorhex)
        .setDescription(`You're all set! You have been successfully clocked in!`)
        .setTimestamp()
        .setFooter(`${config.main_config.copyright}`)

    try {
        var content1;
        var content2;
        var content3;
        message.channel.send(starter).then(() => {
                            message.channel.awaitMessages(filter, { max: 1, time: 100000, errors: ['time'] })
                            .then(collected => {
                                content1 = collected.first().content

                                try {

                                    message.channel.send(prompt1).then(() => {
                                        message.channel.awaitMessages(filter, { max: 1, time: 100000, errors: ['time'] })
                                        .then(collected => {
                                            content2 = collected.first().content
            
                                            try {

                                                message.channel.send(prompt2).then(() => {
                                                    message.channel.awaitMessages(filter, { max: 1, time: 100000, errors: ['time'] })
                                                    .then(collected => {
                                                        content3 = collected.first().content
    
                                                                    try {
                                                                    let datetime = moment().format(config['main_config'].date_format);
                                                                    message.channel.send(lastprompt)
                                                                        config.logging.logClockTimesChannels.forEach(async chan => {
                                                                            const thechannel = client.channels.cache.get(chan)
                                                                            if(!thechannel) {
                                                                                console.log("One of the channels entered in the config.json file is not properly configured. Please make sure you use Channel ID's. Not Names.")
                                                                            } else {
                                                                                const logembed = new Hyperz.MessageEmbed()
                                                                                .setColor(`${config.main_config.colorhex}`)
                                                                                .setAuthor(`User Clocked In`, client.user.displayAvatarURL())
                                                                                .setDescription(`**User Tag:** ${message.author.tag}\n**User ID:** ${message.author.id}\n**Date / Time:** ${datetime}\n\n**Character Name:** ${content1}\n**Department:** ${content2}\n**District:** ${content3}`)
                                                                                .setFooter(`${config.main_config.copyright}`)
                                                                                thechannel.send(logembed).catch(e => {if(config["main_config"].debugmode) return console.log(e);})

                                                                                await con.query(`UPDATE users SET startTime="${datetime}", activeDptName="${content2}", characterName="${content1}", district="${content3}", clocked="true" WHERE id='${message.author.id}'`, async (err, row) => {
                                                                                    if(err) throw err;
                                                                                });

                                                                            }
                                                                        });
                                                                    } catch(e) {
                                                                        if(config.main_config.debugmode) return console.log(e);
                                                                    }
                                                    });
                                                });
                        
                                            } catch(e) {
                                                if(config.main_config.debugmode) return console.log(e);
                                            }
            
                                        });
                                    });
            
                                } catch(e) {
                                    if(config.main_config.debugmode) return console.log(e);
                                }

                            });
                        });

                    } catch(e) {
                        if(config.main_config.debugmode) return console.log(e);
                    }

    },
}