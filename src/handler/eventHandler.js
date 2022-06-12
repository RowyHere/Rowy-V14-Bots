module.exports = function (client) {
    
    const requestEvent = (event) => require(`../events/${event}`)
    client.on('messageCreate', (messageCreate) => requestEvent('messageCreate')(messageCreate, client));
    client.on('guildMemberAdd', (guildMemberAdd) => requestEvent('guildMemberAdd')(guildMemberAdd, client));
    
    }