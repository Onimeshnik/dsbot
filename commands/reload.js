exports.run = (client, message, args, ops) => {
    if (message.author.id !== ops.ownerID) return message.channel.send(`Только создатель может использовать эту команду`);

    try {
        delete require.cache[require.resolve(`./${args}.js`)];
    } catch(e) {
        return message.channel.send(`Невозможно обновить: ${args[0]}`);
    }
    message.channel.send(`Успешно обновлено`);
}