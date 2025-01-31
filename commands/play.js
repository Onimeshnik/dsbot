const Discord = require(`discord.js`);
const ytdl = require(`ytdl-core`);

exports.run = async (client, message, args, ops) => {
    if (!message.member.voice.channel) return message.channel.send(`Вы должны быть в голосовом канале.`);

    if(!args[0]) return message.channel.send(`Укажите ссылку на трек.`);

    let validate = await ytdl.validateURL(args[0]);

    if (!validate) {
        let commandFile = require(`./search.js`);
        return commandFile.run(client, message, args, ops);
    }

    let info = await ytdl.getInfo(args[0]);

    let data = ops.active.get(message.guild.id) || {};

    if(!data.connection) data.connection = await message.member.voice.channel.join();
    if(!data.queue) data.queue = [];
    data.guildID = message.guild.id;

    data.queue.push({
        songTitle: info.videoDetails.title,
        requester: message.author.tag,
        url: args[0],
        announceChannel: message.channel.id,
        image: info.thumbnail_url,
    });

    const AQEmbed = new Discord.MessageEmbed()
        .setColor('#e92a16')
        .setTitle(`Добавлено в очередь: ${info.videoDetails.title} | Добавил: ${message.author.id}`)
        .setAuthor('BLogs', 'https://leonardo.osnova.io/cc983cd9-82f4-8757-5468-285468bc7bf5/-/resize/900/')
        .setTimestamp()

    if (!data.dispatcher) play(client, ops, data);
    else {
        message.channel.send(AQEmbed);
    }

    ops.active.set(message.guild.id, data);
}

async function play(client, ops, data){

    const NPEmbed = new Discord.MessageEmbed()
    .setColor('#e92a16')
    .setTitle(`Сейчас играет: ${data.queue[0].songTitle} | Добавил: ${data.queue[0].requester}`)
    .setAuthor('BLogs', 'https://leonardo.osnova.io/cc983cd9-82f4-8757-5468-285468bc7bf5/-/resize/900/')
    .setImage(data.queue[0].image)
    .setTimestamp()

    client.channels.cache.get(data.queue[0].announceChannel).send(NPEmbed);
        
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

        let vc = client.guilds.cache.get(dispatcher.guildID).me.voice.channel;
        if (vc) vc.leave();
    }
}
