///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////// Констансты
const Discord = require(`discord.js`);
const client = new Discord.Client();
let config = require('./botcfg.json');
let token = config.token;
let prefix = config.prefix;
const ownerID = `307749906066440193`;
const active = new Map();

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////// Префикс

client.on(`message`, message => {
    let args = message.content.slice(prefix.length).trim().split(` `);
    let cmd = args.shift().toLowerCase();

    if (message.author.bot) return;
    if (!message.content.startsWith(prefix)) return;

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////// Command Handler

    try {
        delete require.cache[require.resolve(`./commands/${cmd}.js`)];

        let ops = {
          ownerID: ownerID,
          active: active
        }

        let commandFile = require(`./commands/${cmd}.js`);
        commandFile.run(client, message, args, ops, Discord);
    } catch(e) {
        console.log(e.stack)
    }
});

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////// Запуск

client.on(`ready`, () =>
    console.log(`Готов!`)
);

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////// Логи

//////////////////////////////////////////////////////////// Удаление сообщения

client.on('messageDelete', async message => {
    if (!message.guild) return;
    const fetchedLogs = await message.guild.fetchAuditLogs({
        limit: 1,
        type: 'MESSAGE_DELETE',
  });

  const LChannel = client.channels.cache.get('756773612505268265')
    const deletionLog = fetchedLogs.entries.first();

    if (!deletionLog) return console.log(`Сообщение ${message.author.tag} было удалено, но в журнале ничего не найдено.`);

  const { executor, target } = deletionLog;
  
  const LDEmbed = new Discord.MessageEmbed()
    .setColor('#e92a16')
    .setTitle(`${executor.tag} удалил сообщение ${message.author.tag}`)
    .setAuthor('Logs', 'https://leonardo.osnova.io/cc983cd9-82f4-8757-5468-285468bc7bf5/-/resize/900/')
    .setDescription(message.content)
    .setTimestamp()

  const LDEmbed2 = new Discord.MessageEmbed()
    .setColor('#e92a16')
    .setTitle(`${executor.tag} удалил своё сообщение.`)
    .setAuthor('Logs', 'https://leonardo.osnova.io/cc983cd9-82f4-8757-5468-285468bc7bf5/-/resize/900/')
    .setDescription(message.content)
    .setTimestamp()

  const LDBEmbed = new Discord.MessageEmbed()
    .setColor('#e92a16')
    .setTitle(`${executor.tag} удалил сообщение бота.`)
    .setAuthor('Logs', 'https://leonardo.osnova.io/cc983cd9-82f4-8757-5468-285468bc7bf5/-/resize/900/')
    .setDescription(message.content)
    .setTimestamp()

    if(message.author.id === `737628077710114976`){
      LChannel.send(LDBEmbed);
    }
    else if(target.id === message.author.id) {
    console.log(`Сообщение ${message.author.tag} удалено ${executor.tag}. Сообщение: ${message.content}`);
    LChannel.send(LDEmbed);
    }	else {
    console.log(`Сообщение ${message.author.tag} удалено им же.`);
    LChannel.send(LDEmbed2);
    }
});

//////////////////////////////////////////////////////////// Изменение сообщения
client.on("messageUpdate", function(oldMessage, newMessage, message){
  if(oldMessage.content === newMessage.content){
      return;
  }

  const LCMEmbed = new Discord.MessageEmbed()
  .setColor('#e92a16')
  .setTitle(`${oldMessage.author.tag} удалил своё сообщение.`)
  .setAuthor('Logs', 'https://leonardo.osnova.io/cc983cd9-82f4-8757-5468-285468bc7bf5/-/resize/900/')
  .addField(`До`, oldMessage.content, true)
  .addField(`После`, newMessage.content, true)
  .setTimestamp()

  const LChannel = client.channels.cache.get('756773612505268265')

  LChannel.send(LCMEmbed);
});

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////// Токен
client.login(process.env.TOKEN);