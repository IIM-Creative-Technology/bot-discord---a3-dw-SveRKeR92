const Discord = require('discord.js');
const database = require('../database');
/**
 * @param {Discord.Message} message
 */
async function levelingSystem(message) {
  // LEVELING SYSTEM (EXO 4)
  database.sqlQuery('SELECT * FROM xp WHERE user_id = ? AND server_id = ?', [message.author.id, message.guild.id])
    .then(results => {
      if (results.length > 0) {
        //user is in db
        const data = results[0]
        database.sqlQuery(`UPDATE xp SET xp_count = ${data.xp_count + 1} WHERE user_id = ? AND server_id = ?`, [message.author.id, message.guild.id])
          .then(() => {
            message.channel.send(`+1 xp, ${data.xp_count + 1} / ${data.xp_level} to level up.`)
            if (data.xp_count + 1 >= data.xp_level) {
              database.sqlQuery(`UPDATE xp SET xp_count = 0, level=${data.level + 1}, xp_level=${data.xp_level * data.xp_level} WHERE user_id = ?AND server_id = ?`, [message.author.id, message.guild.id])
                .then(() => {
                  message.channel.send(`Congratulations, you are now level ${data.level + 1}`)
                  if ((data.level + 1) === 2) {
                    const shyRole = message.member.guild.roles.cache.find(r => r.name === "Shy Guy");
                    const newcomerRole = message.member.guild.roles.cache.find(r => r.name === "Newcomer");
                    message.member.roles.add(shyRole);
                    message.channel.send("Shy Guy Role added")
                    if (message.member.roles.cache.some(r => r.name = "Newcomer")) {
                      message.member.roles.remove(newcomerRole)
                      message.channel.send("Newcomer Role removed")
                    }
                  }
                  if ((data.level + 1) === 5) {
                    const chatterRole = message.member.guild.roles.cache.find(r => r.name === "Chatter");
                    const shyRole = message.member.guild.roles.cache.find(r => r.name === "Shy Guy");
                    message.member.roles.add(chatterRole);
                    message.channel.send("Chatter Role added")
                    if (message.member.roles.cache.some(r => r.name = "Shy Guy")) {
                      message.member.roles.remove(shyRole)
                      message.channel.send("Shy Guy Role removed")
                    }
                  }
                  if ((data.level + 1) === 10) {
                    const socialRole = message.member.guild.roles.cache.find(r => r.name === "Social");
                    const chatterRole = message.member.guild.roles.cache.find(r => r.name === "Chatter");
                    message.member.roles.add(socialRole);
                    message.channel.send("Social Role added")
                    if (message.member.roles.cache.some(r => r.name = "Chatter")) {
                      message.member.roles.remove(chatterRole)
                      message.channel.send("Chatter Role removed")
                    }
                  }
                }).catch(error => {
                  message.channel.send('error occured at leveling up')
                  console.log(error)
                })
            }
          }).catch(error => {
            message.channel.send('error occured at giving XP')
            console.log(error)
          })

      } else {
        // user is not in db
        message.channel.send("author not in database")
        database.sqlQuery("INSERT INTO xp (user_id, xp_count, xp_level, level, server_id) VALUES (?, 0, 4, 1, ?)", [message.author.id, message.guild.id])
          .then(
            message.channel.send(`User ${message.author.username} added to database`)
          ).catch(error => {
            message.channel.send("error occured in INSERT query")
            console.log(error)
          })
      }
    })
    .catch(error => {
      message.channel.send("error occured in SELECT query")
      console.log(error)
    });
  // END LEVELING SYSTEM
}



module.exports = {
  levelingSystem
}