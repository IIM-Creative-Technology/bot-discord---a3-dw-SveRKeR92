const Discord = require('discord.js');
const {getUserData} = require('../functions/getUserData');
/**
 * @param {Discord.Client} client
 * @param {Discord.Message} message
 * @param {Array<String>} arguments
 */
module.exports.run = async (client, message, arguments) => {

  const data = await getUserData(message)
  message.channel.send(`Your current level is ${data.level}, current xp : ${data.xp_count} / ${data.xp_level}`);
};
module.exports.name = 'level';