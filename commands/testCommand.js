const Discord = require('discord.js');

/**
 * @param {Discord.Client} client
 * @param {Discord.Message} message
 * @param {Array<String>} arguments
 */
module.exports.run = async (client, message, arguments) => {
  // const channel = message.channel;

  // await channel.send('Everything is working fine! :white_check_mark:');

  // if (arguments.length > 0) {
  //   await channel.send('The provided arguments were: ' + arguments.join(', '));
  // }

  const embed = new Discord.MessageEmbed();
  embed.setTitle('Bonjour')
  .setColor('DARK_AQUA')
  .setDescription('Au revoir')

  message.channel.send({
    embeds: [embed]
  })

};

module.exports.name = 'test';
