exports.run = async (client, message, args, ops) => {
    let fetched = ops.active.get(message.guild.id)
    if (!fetched) return message.channel.send("Бот не в голосом канале!")
    if(message.guild.me.voice.channelID !== message.member.voice.channelID) return message.channel.send(`Вы должны находиться в одном канале с ботом.`);
    ops.active.set(message.guild.id, fetched);
    fetched.queue.shift()

    if (fetched.queue.length > 0) {
        async function play(client, ops, data) {


            const ytdl = require("ytdl-core")
            client.channels.cache.get(data.queue[0].announceChannel).send(`Пропущен трек ${data.queue[0].songTitle}, добавленный ${data.queue[0].requester}`)
            data.dispatcher = await data.connection.play(ytdl(data.queue[0].url, { filter: 'audioonly' }))
            data.dispatcher.guildID = data.guildID
            data.dispatcher.once('finish', function () {
                finish(client, ops, this)
            })
        }
        ops.active.set(fetched.dispatcher.guildID, fetched)
        play(client, ops, fetched)
    } else {
        ops.active.delete(fetched.dispatcher.guildID)
        let vc = client.guilds.cache.get(fetched.dispatcher.guildID).me.voiceChannel
        if (vc) vc.leave()
    }
}
