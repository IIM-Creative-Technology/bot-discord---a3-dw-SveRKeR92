const clientLoader = require('./src/clientLoader');
const commandLoader = require('./src/commandLoader');
const database = require('./database');
require('colors');

const COMMAND_PREFIX = '!';

clientLoader.createClient(['GUILD_MESSAGES', 'GUILDS', 'GUILD_MEMBERS'])
  .then(async (client) => {
    await commandLoader.load(client);

    client.on('messageCreate', async (message) => {

      // Ne pas tenir compte des messages envoyés par les bots, ou qui ne commencent pas par le préfix
      if (message.author.bot) return;

      // check if user is in xp table:
      database.sqlQuery('SELECT * FROM xp WHERE user_id = ?', message.author.id)
      .then(results => {
          if (results.length > 0) {
              //user is in db
              const data = results[0]
              database.sqlQuery(`UPDATE xp SET xp_count = ${data.xp_count + 1} WHERE user_id = ?`, message.author.id)
              .then(() => {
                message.channel.send(`+1 xp, ${data.xp_count + 1} / ${data.xp_level} to level up. Current level: ${data.level}`)
                if(data.xp_count + 1 >= data.xp_level){
                  database.sqlQuery(`UPDATE xp SET xp_count = 0, level=${data.level + 1}, xp_level=${data.xp_level+2} WHERE user_id = ?`, message.author.id)
                  .then(() => {
                    message.channel.send(`Congratulations, you are now level ${data.level + 1}`)
                  }) .catch(error => {
                    message.channel.send('error occured at leveling up')
                    console.log(error)
                  })
                }
              }).catch(error =>{
                message.channel.send('error occured at giving XP')
                console.log(error)
              })

          } else {
              // user is not in db
              message.channel.send("author not in database")
              database.sqlQuery("INSERT INTO xp (user_id, xp_count, xp_level, level) VALUES (?, 0, 4, 1)", message.author.id)
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

      if (message.author.bot || !message.content.startsWith(COMMAND_PREFIX)) return;
      // On découpe le message pour récupérer tous les mots
      const words = message.content.split(' ');
      const commandName = words[0].slice(1); // Le premier mot du message, auquel on retire le préfix
      const arguments = words.slice(1); // Tous les mots suivants sauf le premier

      if (client.commands.has(commandName)) {
        // La commande existe, on la lance
        client.commands.get(commandName).run(client, message, arguments);
      } else {
        // La commande n'existe pas, on prévient l'utilisateur
        await message.delete();
        await message.channel.send(`The ${commandName} does not exist.`);
      }
    });
    // end messageCreate

    client.on('guildMemberAdd', async(member) => {
      const guild = member.guild;
      console.log(guild)
      const role = await guild.roles.fetch('940638472912380004')
      console.log(role)
      await member.roles.add(role);
      // OR
      // await member.roles.add('940638472912380004')
    });
    // end guildMemberAdd
  });
