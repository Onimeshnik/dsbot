const Discord = require(`discord.js`);

exports.run = async(client, message, args, ops) => {
    
    let fethed = ops.active.get(message.guild.id);

    if(!fethed) return message.channel.send(`На данный момент очередь пуста.`);

    let queue = fethed.queue;
    let nowPlaying = queue[0];

    let q = ``;
    for(var i = 1; i < queue.length; i++) {
        q += `\n${i}. **${queue[i].songTitle}**\nДобавил: ${queue[i].requester}`;
    }
    let resp = [
        {name: `Сейчас играет: `, value: nowPlaying.songTitle},
        {name: `Добавил: `, value: nowPlaying.requester},
        {name: `Следующее`, value: q},
    ];
    let resp2 = [
        {name: `Сейчас играет: `, value: nowPlaying.songTitle},
        {name: `Добавил: `, value: nowPlaying.requester},
    ];
    
    //Putting it all together
    if(i>=2){
        message.channel.send({embed: {
            title: 'Очередь',
            fields: resp,
    }})}
    else{
        message.channel.send({embed: {
            title: 'Очередь',
            fields: resp2,
    }})};
}
