const moment = require('moment');
module.exports = {
    name: '911call',
    description: 'Pings the bot.',
    aliases: ['call911', '911', '999call', 'call999', '999'],
    async execute(client, message, args, Hyperz, config, con){

        if(message.channel.type != "dm") return message.channel.send('Please run this command in the DMs with the bot.').then(msg => {
            msg.delete({ timeout: 12000 })
        }).catch(e => {if(config.main_config.debugmode) return console.log(e);});

        const filter = m => m.author.id === message.author.id;

        const starter = new Hyperz.MessageEmbed()
        .setColor(config["main_config"].colorhex)
        .setDescription(`Hello! Before we begin let me tell you a couple things!\n\n1. You are about to ring the in-game emergency services\n2. This does not contact any real life emergency services\n3. Do you understand if you enter any invalid information your call will be ignored!\n4. You may have to wait a few moments for our in-game personnel to arrive.\n\nPlease send in chat **Yes** Or **No** if you agree to these terms.`)
        .setTimestamp()
        .setFooter(`${config.main_config.copyright}`)

        const prompt1 = new Hyperz.MessageEmbed()
        .setColor(config["main_config"].colorhex)
        .setDescription(`What is your emergency?`)
        .setTimestamp()
        .setFooter(`${config.main_config.copyright}`)

        const prompt2 = new Hyperz.MessageEmbed()
        .setColor(config["main_config"].colorhex)
        .setDescription(`What is your location?`)
        .setTimestamp()
        .setFooter(`${config.main_config.copyright}`)

        const prompt3 = new Hyperz.MessageEmbed()
        .setColor(config["main_config"].colorhex)
        .setDescription(`What is your in-game name?`)
        .setTimestamp()
        .setFooter(`${config.main_config.copyright}`)

        const prompt4 = new Hyperz.MessageEmbed()
        .setColor(config["main_config"].colorhex)
        .setDescription(`Do you have anything else we should know?`)
        .setTimestamp()
        .setFooter(`${config.main_config.copyright}`)

        const lastprompt = new Hyperz.MessageEmbed()
        .setColor(config["main_config"].colorhex)
        .setDescription(`Please be patient, we have alerted our emergency services of your emergency and they're on their way. **Sit tight and you should see us shortly!**`)
        .setTimestamp()
        .setFooter(`${config.main_config.copyright}`)

    try {
        var content1;
        var content2;
        var content3;
        var content4;
        message.channel.send(starter).then(() => {
            message.channel.awaitMessages(filter, { max: 1, time: 100000, errors: ['time'] })
            .then(collected => {
                let newcol = collected.first().content.toLowerCase()
                if(newcol === "yes") {

                    try {

                        message.channel.send(prompt1).then(() => {
                            message.channel.awaitMessages(filter, { max: 1, time: 100000, errors: ['time'] })
                            .then(collected => {
                                content1 = collected.first().content

                                try {

                                    message.channel.send(prompt2).then(() => {
                                        message.channel.awaitMessages(filter, { max: 1, time: 100000, errors: ['time'] })
                                        .then(collected => {
                                            content2 = collected.first().content
            
                                            try {

                                                message.channel.send(prompt3).then(() => {
                                                    message.channel.awaitMessages(filter, { max: 1, time: 100000, errors: ['time'] })
                                                    .then(collected => {
                                                        content3 = collected.first().content
                        
                                                        try {

                                                            message.channel.send(prompt4).then(() => {
                                                                message.channel.awaitMessages(filter, { max: 1, time: 100000, errors: ['time'] })
                                                                .then(collected => {
                                                                    content4 = collected.first().content
                                    
                                                                    try {
                                                                    message.channel.send(lastprompt)
                                                                        config.logging.log911CallsChannels.forEach(async chan => {
                                                                            const thechannel = client.channels.cache.get(chan)
                                                                            if(!thechannel) {
                                                                                console.log("One of the channels entered in the config.json file is not properly configured. Please make sure you use Channel ID's. Not Names.")
                                                                            } else {
                                                                                const logembed = new Hyperz.MessageEmbed()
                                                                                .setColor(`${config.main_config.colorhex}`)
                                                                                .setAuthor(`Emergency Services Call`, client.user.displayAvatarURL())
                                                                                .setDescription(`**Calling User:** ${message.author.tag || "someone"}\n\n**Q:** \`What is your emergency?\`\n**A:** ${content1}\n\n**Q:** \`What is your location?\`\n**A:** ${content2}\n\n**Q:** \`What is your in-game name?\`\n**A:** ${content3}\n\n**Q:** \`Anything else we should know?\`\n**A:** ${content4}\n`)
                                                                                .setFooter(`✅ React below if you are responding to this call.`)
                                                                                thechannel.send(logembed).then(async log => {
                                                                                    await log.react(`✅`);
                                                                                }).catch(e => {if(config["main_config"].debugmode) return console.log(e);})
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

                            });
                        });

                    } catch(e) {
                        if(config.main_config.debugmode) return console.log(e);
                    }

                } else if(newcol === "no") {
                    message.channel.send(`You are required to accept our terms to continue your call. We are hanging up now...`).catch(e => {if(config.main_config.debugmode) return console.log(e);});
                } else {
                    message.channel.send(`That is an invalid response. We are hanging up now...`).catch(e => {if(config.main_config.debugmode) return console.log(e);});
                }
            })
        })
    } catch(e) {
        if(config.main_config.debugmode) return console.log(e);
    }

    },
}