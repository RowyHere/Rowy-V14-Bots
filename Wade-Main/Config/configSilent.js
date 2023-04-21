/**
 * BURAYA DOKUNMAYIN HEPSI OTOMATIK OLARAK CALISIYOR
 * EKLEDIGINIZ BISEY KOMUTLARIN CALISMASINA ENGEL OLABILIR 
 * BUNUN BILINCINDE YEDEKLI BIR SEKILDE EKLEME YAPIN
 */

module.exports = {

    point: {
        cmute: 15,
        vmute: 15,
        jail: 30,
        ban: 50
    },

    cmute: [   
        {
            label: 'Kışkırtma , Troll , Hakaret , Dalga Geçmek',
            description: '5 Dakika',
            value: 'ktd-CMute',
            time: "5m"
        },
        {
            label: 'Ailevi Değerlere Küfür , ADK',
            description: '15 Dakika',
            value: 'fsc-CMute',
            time: "15m"
        },
        {
            label: 'Flood , Spam , Capslock , Ortam Bozma',
            description: '5 Dakika',
            value: 'kar-CMute',
            time: "5m"
        },
        {
            label: 'Metin kanallarını amacı dışında kullanmak',
            description: '10 Dakika',
            value: 'mka-CMute',
            time: "10m"
        },
        {
            label: 'Sunucu Kötüleme ve Yetkiliye Hakaret , Argo',
            description: '15 Dakika',
            value: 'sy-CMute',
            time: "15m"
        },
        {
            label: 'Din, Irk, Siyasi, Cinsiyetçilik davranışlar',
            description: '25 Dakika',
            value: 'dis-CMute',
            time: "25m"
        },
    ],

    vmute: [
        {
            label: 'Kışkırtma , Troll , Hakaret , Dalga Geçmek',
            description: '5 Dakika',
            value: 'ktd-VMute',
            time: "5m"
        },
        {
            label: 'Soundpad , Bass , Yüksek Sesli Müzik',
            description: '10 Dakika',
            value: 'soit-VMute',
            time: "10m"
        },
        {
            label: 'Ailevi Değerlere Küfür , ADK',
            description: '15 Dakika',
            value: 'kar-VMute',
            time: "15m"
        },
        {
            label: 'DM Taciz , Sesli Taciz , Kullanıcı Tehdit',
            description: '30 Dakika',
            value: 'mka-VMute',
            time: "30m"
        },
        {
            label: 'Sesli kanallarını amacı dışında kullanmak',
            description: '10 Dakika',
            value: 'sb-VMute',
            time: "10m"
        },
        {
            label: 'Sunucu Kötüleme ve Yetkiliye Hakaret , Argo',
            description: '15 Dakika',
            value: 'sy-VMute',
            time: "15m"
        },
        {
            label: 'Din, Irk, Siyasi, Cinsiyetçilik davranışlar',
            description: '25 Dakika',
            value: 'dis-VMute',
            time: "25m"
        },
    ],
    
    jail: [
        {
            label: 'Cinsellik, taciz ve ağır hakaret',
            description: '1 Dakika',
            value: 'cta-Jail',
            time: "1m"
        },
        {
            label: 'Sunucu kurallarına uyum sağlamamak',
            description: '3 Gün',
            value: 'skus-Jail',
            time: "3d"
        },
        {
            label: 'Sesli/Mesajlı/Ekran P. DM Taciz',
            description: '1 Gün',
            value: 'sme-Jail',
            time: "1d"
        },
        {
            label: 'Dini, Irki ve Siyasi değerlere Hakaret',
            description: '1 Ay',
            value: 'dis-Jail',
            time: "30d"
        },
        {
            label: 'Abartı rahatsız edici yaklaşımda bulunmak!',
            description: '2 Hafta',
            value: 'ard-Jail',
            time: "14d"
        },
        {
            label: 'Sunucu içerisi abartı trol / Kayıt trol yapmak!',
            description: '3 Gün',
            value: 'sia-Jail',
            time: "3d"
        },
        {
            label: 'Sunucu Kötüleme / Saygısız Davranış',
            description: '1 Ay',
            value: 'sksd-Jail',
            time: "30d"
        }
    ]

}