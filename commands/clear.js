const Discord = require(`discord.js`);

exports.run = (client, message, args) => {
    if (!message.channel.permissionsFor(message.author).has("MANAGE_MESSAGES")) {
        message.channel.send("Сорян, ты не можешь использовать команды");
        console.log("Сорян, ты не можешь использовать команды");
        return;
    } else if (!message.channel.permissionsFor(client.user).has("MANAGE_MESSAGES")) {
        message.channel.send("У меня нет доступа для этого");
        console.log("У меня нет доступа для этого");
        return;
    }
  
    if (message.channel.type == 'text') {
        message.channel.messages.fetch()
        .then(messages => {
        message.channel.bulkDelete(messages);
        messagesDeleted = messages.array().length; // Кол-во удаленных сообщений
        const LChannel = client.channels.cache.get('756773612505268265')
  
        const LCEmbed = new Discord.MessageEmbed()
        .setColor('#e92a16')
        .setTitle(`${message.author.tag} запустил очистку <#${message.channel.id}>`)
        .setAuthor('BLogs', 'https://leonardo.osnova.io/cc983cd9-82f4-8757-5468-285468bc7bf5/-/resize/900/')
        .setDescription(`Удаление завершено, всего удалено: ${messagesDeleted}`)
        .setTimestamp()
  
            // Отправляет сообщение
        LChannel.send(LCEmbed)
            console.log('Удаление завершено, всего удалено: '+messagesDeleted);
        })
        .catch(err => {
            console.log('Ошибка');
            console.log(err);
        });
    }
}