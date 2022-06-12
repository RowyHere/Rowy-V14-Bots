const Discord = require('discord.js');
const config = require('../../config.json');
let Server = require("../schema/serverData")

/**@param {Discord.Client} client
 * @param {Discord.guildMemberAdd} member
 */

module.exports = async (member, client) => {

    if (!member || member.bot) return

    let serverData = await Server.findOne({ guildId: member.guild.id })

    let findWelcome = client.channels.cache.get(serverData.welcomeChannel)
    let findTag = client.channels.cache.get(serverData.tagChannel)

    if (member.user.username.includes(serverData.mainTag)) {

        findTag.wsend({ content: `${member} adlı kullanıcı aramıza taglı bir şekilde katıldı. (\`\`${serverData.mainTag}\`\`)` })
        member.roles.add([...serverData.familyRoles])

    }

    member.roles.add([...serverData.unregisterRoles])

    findWelcome.wsend(`${member} ${member.guild.name} Sunucumuza hoşgeldin,
Seninle beraber sunucumuz ${member.guild.members.cache.size} üye sayısına ulaştı. :tada:
        
Hesabın <t:${Math.floor(member.user.createdTimestamp / 1000)}> tarihinde (<t:${Math.floor(member.user.createdTimestamp / 1000)}:R>) oluşturulmuş. (Güvenilir)

Kayıt işleminden sonra <#${serverData.welcomeChannel}> kanalına göz atmayı unutma.
Tagımıza ulaşmak için herhangi bir kanala \`\`.tag\`\` yazabilirsiniz.
\`\`\`
Kayıt olduktan sonra kuralları okuduğunuzu kabul edeceğiz ve içeride yapılacak cezalandırma işlemlerini bunu göz önünde bulundurarak yapacağız. ${member.guild.name}\`\`\``)

}