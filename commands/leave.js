exports.run = (client, message, args, ops) => {
    
    if(!message.member.voice.channel) return message.channel.send(`Вы должны быть в голосовом канале.`);

    if(!message.guild.me.voice.channel) return message.channel.send(`Бот не находится в голосовом канале.`);

    if(message.guild.me.voice.channelID !== message.member.voice.channelID) return message.channel.send(`Вы должны находиться в одном канале с ботом.`);

    message.guild.me.voice.channel.leave();
}