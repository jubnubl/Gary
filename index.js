const mineflayer = require('mineflayer')

function createBot() {
    const bot = mineflayer.createBot({
        host: 'Bottleofjews.aternos.me', // e.g., 'play.hypixel.net'
        port: 57341,           // default port
        username: 'Gary',   // your bot's name
        version: '1.21.11'       // match your server version
    })

    bot.on('login', () => {
        console.log('A SCOTTISH-MAN HAS ARRIVED - Your Son, Gary')
    })

    // Anti-AFK: Swings arm every 60 seconds so it's not kicked
    setInterval(() => {
        bot.swingArm('right')
    }, 60000)

    // Auto-Reconnect: If kicked or server restarts, wait 5s and try again
    bot.on('end', () => {
        console.log('Gary is down lad, keep coverin us till he is awake.. restarting')
        setTimeout(createBot, 5000)
    })

    bot.on('error', (err) => console.log('Aye Lad, there seems to be a problem on the deck, ERROR', err))
}

createBot()
