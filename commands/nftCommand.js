const Discord = require('discord.js');
const axios = require('axios');

/**
 * @param {Discord.Client} client
 * @param {Discord.Message} message
 * @param {Array<String>} arguments
 */
module.exports.run = async (client, message, arguments) => {
      const embed = new Discord.MessageEmbed();
      await message.channel.send('life is daijobou');
      await axios.get('https://api.x.immutable.com/v1/collections/0x4bfc33623ad76c05ea14096740e61413cd6900c1')
      .then(function (response) {
            console.log(response.data)
            console.log(response.data.name)
            embed
            .setTitle(response.data.name)
            .setDescription(response.data.description)
            .setImage(response.data.icon_url)
            .setColor('LUMINOUS_VIVID_PINK')
      });

      message.channel.send({
            embeds: [embed]
      })
}

module.exports.name = 'nft';
