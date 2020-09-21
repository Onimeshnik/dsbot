const search = require(`yt-search`);

exports.run = (client, message, args, ops) => {
    search(args.join(` `), function(err, res){
        if(err) return message.channel.send(`Что-то пошло не так.`);

        let videos = res.videos.slice(0, 10);

        let q = ``;
        for (var i in videos) {
            q += `[${parseInt(i)+1}]: ${videos[i].title} \n`
        }

        let resp = [
            {name: `Следующее`, value: q},
        ];

        message.channel.send({embed: {
            title: 'Выберете цифрой от 1 до 10.',
            fields: resp,
        }})

        const filter =  m => !isNaN(m.content) && m.content < videos.length+1 && m.content > 0;

        const collector = message.channel.createMessageCollector(filter);

        collector.videos = videos;

        collector.once(`collect`, function(m){
            let commandFile = require(`./play.js`);
            commandFile.run(client, message, [this.videos[parseInt(m.content)-1].url], ops);
        });
    });
}