const Discord = require('discord.js');
const database = require('../database');
/**
 * @param {Discord.Message} message
 */
async function getUserData(message) {
      return database.sqlQuery(`SELECT * FROM xp WHERE user_id = ? AND server_id = ?`, [message.author.id, message.guild.id])
      .then(results => {
            if (results.length > 0){
                  const data = results[0]
                  return data
            }
      }).catch(error =>{
            console.log(error)
      })
}

module.exports = {
      getUserData
}