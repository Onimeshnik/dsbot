exports.run = (client, message, args, ops) => {

    let fetched = ops.active.get(message.guild.id);

    if(!fetched) return message.channel.send(`На данный момент музыка не играет.`);

    if(message.guild.me.voice.channelID !== message.member.voice.channelID) return message.channel.send(`Вы должны находиться в одном канале с ботом.`);

    if(!fetched.dispatcher.paused) return message.channel.send(`Музыка не стоит на паузе!`);

    fetched.dispatcher.resume();

    message.channel.send(`Снято с паузы.`);
}