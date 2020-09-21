const Discord = require(`discord.js`);
const ytdl = require(`ytdl-core`);

exports.run = async (client, message, args, ops) => {
    if (!message.member.voice.channel) return message.channel.send(`Вы должны быть в голосовом канале.`);

    if(!args[0]) return message.channel.send(`Укажите ссылку на трек.`);

    let validate = await ytdl.validateURL(args[0]);

    if (!validate) return message.channel.send(`Укажите действующую ссылку.`)

    let info = await ytdl.getInfo(args[0]);

    let data = ops.active.get(message.guild.id) || {};

    if(!data.connection) data.connection = await message.member.voice.channel.join();
    if(!data.queue) data.queue = [];
    data.guildID = message.guild.id;

    data.queue.push({
        songTitle: info.videoDetails.title,
        requester: message.author.tag,
        url: args[0],
        announceChannel: message.channel.id
    });

    if (!data.dispatcher) play(client, ops, data);
    else {
        message.channel.send(`Добавлено в очередь: ${info.videoDetails.title} | Добавил: ${message.author.id}`);
    }

    ops.active.set(message.guild.id, data);
}

async function play(client, ops, data){
    client.channels.cache.get(data.queue[0].announceChannel).send(`Сейчас играет: ${data.queue[0].songTitle} | Добавил: ${data.queue[0].requester}`);
        
    data.dispatcher = await data.connection.play(ytdl(data.queue[0].url, {filter: `audioonly`}));
    data.dispatcher.guildID = data.guildID;

    data.dispatcher.once(`finish`, function(){
        finish(client, ops, this);
    });
}

function finish(client, ops, dispatcher){
    let fetched = ops.active.get(dispatcher.guildID);

    fetched.queue.shift();

    if (fetched.queue.lenght > 0) {
        ops.active.set(dispatcher.guildID, fetched);
        play(client, ops, fetched);
    } else {
        ops.active.delete(dispatcher.guildID);

        let vc = client.guilds.get(dispatcher.guildID).me.voice.channel;
        if (vc) vc.leave();
    }
}
