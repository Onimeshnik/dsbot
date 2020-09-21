exports.run = async(client, message, args, ops) => {
    
    let fethed = ops.active.get(message.guild.id);

    if(!fethed) return message.channel.send(`На данный момент очередь пуста.`);

    let queue = fethed.queue;
    let nowPlaying = queue[0];

    let resp = `Сейчас играет: ${nowPlaying.songTitle} | Добавил: ${nowPlaying.requester}`;

    for(var i = 1; i < queue.lenght; i++) {
        resp += `${i}. ${queue[i].songTitle} | Добавил: ${queue[i].requester}`;
    }

    message.channel.send(resp);
}