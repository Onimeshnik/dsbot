exports.run = async (client, message, args, ops) => {
    let fetched = ops.active.get(message.guild.id);

    if (!fetched) return message.channel.send(`В очереди ничего нет!`);

    if(message.member.voice.channel !== message.guild.me.voice.channel) return message.channel.send(`Вы должны находиться в одном канале с ботом.`);

    let userCount = message.member.voice.channel.members.size;

    let required = Math.ceil(userCount/2);

    if (!fetched.queue[0].voteSkips) fetched.queue[0].voteSkips = [];

    if (fetched.queue[0].voteSkips.includes(message.member.id)) return message.channel.send(`Вы уже проголосовали!`);

    fetched.queue[0].voteSkips.push(message.member.id);

    ops.active.set(message.guild.id, fetched);

    if (fetched.queue[0].voteSkips.lenght >= required) {
        message.channel.send(`Пропущено`);

        return fetched.dispatcher.emit(`finish`);
    }

    message.channel.send(`Успешно пропущено! ${fetched.queue[0].voteSkips.lenght}/${required} необходимо.`);
}