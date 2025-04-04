const { Client, GatewayIntentBits, Partials, Intents, EmbedBuilder } = require("discord.js");
const INTENTS = Object.values(GatewayIntentBits);
const PARTIALS = Object.values(Partials);
const client = new Client({
    intents: 
    INTENTS,
    allowedMentions: {
        parse: ["users"]
    },
    partials: PARTIALS,
    retryLimit: 3
});


console.log(`
 __                                              
|  \                                             
| ▓▓__    __ __    __  _______  _______  ______  
| ▓▓  \  |  \  \  /  \/       \/       \|      \ 
| ▓▓ ▓▓  | ▓▓\▓▓\/  ▓▓  ▓▓▓▓▓▓▓  ▓▓▓▓▓▓▓ \▓▓▓▓▓▓\
| ▓▓ ▓▓  | ▓▓ >▓▓  ▓▓ \▓▓    \| ▓▓      /      ▓▓
| ▓▓ ▓▓__/ ▓▓/  ▓▓▓▓\ _\▓▓▓▓▓▓\ ▓▓_____|  ▓▓▓▓▓▓▓
| ▓▓\▓▓    ▓▓  ▓▓ \▓▓\       ▓▓\▓▓     \\▓▓    ▓▓
 \▓▓_\▓▓▓▓▓▓▓\▓▓   \▓▓\▓▓▓▓▓▓▓  \▓▓▓▓▓▓▓ \▓▓▓▓▓▓▓
   |  \__| ▓▓                                    
    \▓▓    ▓▓                                    
     \▓▓▓▓▓▓                                     

`)

global.client = client;
client.commands = (global.commands = []);
const { TOKEN, blacklistRoles, channelIds, roleadd, triggerWords } = require("./config.json");


client.on('presenceUpdate', async (oldPresence, newPresence) => {
  const role = newPresence.guild.roles.cache.get(roleadd);
  const activities = newPresence.activities;

   if (activities && activities.length && activities[0].state && triggerWords.includes(activities[0].state)) {
    if (newPresence.guild.members.cache.has(newPresence.user.id)) {
      const member = await newPresence.guild.members.fetch(newPresence.user.id);
      if (!blacklistRoles.some(r => member.roles.cache.has(r))) {
        member.roles.add(role);
        const channel = newPresence.guild.channels.cache.get(channelIds);
        if (channel) {
          const embed = new EmbedBuilder()
            .setColor('#000000')
            .setDescription(`${member} has been given the ${role}`);
          channel.send({ embeds: [embed] });
        }
      }
    }
  } else {
    if (newPresence.guild.members.cache.has(newPresence.user.id)) {
      const member = await newPresence.guild.members.fetch(newPresence.user.id);
      if (member.roles.cache.has(role.id) && !blacklistRoles.some(r => member.roles.cache.has(r))) {
        member.roles.remove(role);
        const channel = newPresence.guild.channels.cache.get(channelIds);
        if (channel) {
          const embed = new EmbedBuilder()
            .setColor('#000000')
            .setDescription(`${member} has been removed the ${role}`);
          channel.send({ embeds: [embed] });
        }
      }
    }
  }
});

client.login(TOKEN)