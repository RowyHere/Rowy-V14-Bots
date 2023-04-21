module.exports = {
    
    Register: {

        staffRoles: [""], // Register sorumlusu
        manRoles: [""], // Erkek üyelere verilecek roller
        womanRoles: [""], // Kadın üyelere verilecek rol

        unregRoles: [""], // Kayıtsızların rolü
        tagRoles: "" // Tag alınca verilcek rol

    },

    Moderation: {

        commanderRoles: [""], // Tüm komutlara erişimi olan rol && idsi girilen rolü lütfen güvenilir üyelere verin tüm komutlara erişimi vardır.
        muteRoles: [""], // Susturulma sorumlusu
        jailRoles: [""], // Cezalı sorumlusu
        banRoles: [""], // Ban sorumlusu

    },

    Silent: {

        ChatMute: "", // Yazılı susturulma rolünüz
        VoiceMute: "", // Sesli susturulma rolünüz
        Suspended: "", // Cezalı Rolü
        Suspicious: "" // Şüpheli Rolü

    },

    General: {

        boosterRoles: "", // Booster rolü

    },

    allPermissions: [], // Yetkili rolleri

}