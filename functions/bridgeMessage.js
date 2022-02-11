const Discord = require('discord.js');
const { getUserData } = require('./getUserData');


/**
 * @param {Discord.Client} client
 * @param {Discord.Message} message
 */
async function bridgeMessage(client, message) {
      client.guilds.cache.map(async (guild) => {
            const sharedChannel = guild.channels.cache.find(c => c.name === "shared")
            const embed = new Discord.MessageEmbed();
            const data = await getUserData(message);
            embed
                  .setTitle(`${message.author.username} from ${message.guild.name}`)
                  .setDescription(message.content + `\n\n user level : ${data.level}`)
                  .setColor(message.member.displayHexColor)

            sharedChannel.send({
                  embeds: [embed]
            })
      })
}

module.exports = {
      bridgeMessage
}