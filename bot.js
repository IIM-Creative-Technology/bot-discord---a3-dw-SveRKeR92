const clientLoader = require('./src/clientLoader');
const commandLoader = require('./src/commandLoader');
const database = require('./database');
const Discord = require('discord.js');
const { levelingSystem } = require('./functions/levelingSystem');
const { bridgeMessage } = require('./functions/bridgeMessage');
const badwordsList = require("french-badwords-list");
const frenchBadwords = badwordsList.array;
require('colors');

const COMMAND_PREFIX = '!';

clientLoader.createClient(['GUILD_MESSAGES', 'GUILDS', 'GUILD_MEMBERS'])
  .then(async (client) => {
    await commandLoader.load(client);

    client.on('guildMemberAdd', async(member) => {
      const guild = member.guild;
      console.log(guild)
      const newcomerRole = await member.guild.roles.cache.find(r => r.name === "Newcomer");
      // const role2 = await guild.roles.fetch('940638472912380004')
      console.log(newcomerRole)
      // console.log(role2)
      await member.roles.add(newcomerRole);
      // OR
      // await member.roles.add('940638472912380004')
    });
    // end guildMemberAdd

    client.on('messageCreate', async (message) => {

      
      if (message.author.bot) return;
      console.log(frenchBadwords)
      if (!message.content.startsWith(COMMAND_PREFIX)){
        // Leveling (exo 4)
        levelingSystem(message)
        //Shared messages - Server bridge (Exo 5)
        bridgeMessage(client, message)

        if (frenchBadwords.some(w => `${message.content.toLowerCase()}`.includes(`${w}`))){
          message.member.send("Please stay polite when you chat with others")
        }
      }

      // !COMMAND
      // Ne pas tenir compte des messages envoyés par les bots, ou qui ne commencent pas par le préfix
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
      // END !COMMAND


    });
    // end messageCreate


  });
