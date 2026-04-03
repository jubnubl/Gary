const mineflayer = require('mineflayer')

function createBot() {
    const bot = mineflayer.createBot({
        host: '19Saints.aternos.me', 
        port: 16201,           
        username: 'Gary',   
        version: '1.21.1' // Adjusted to standard 1.21.1 (check if you meant 1.21.1)
    })

    bot.on('login', () => {
        console.log('A SCOTTISH-MAN HAS ARRIVED - Your Son, Gary')
    })

    bot.on('spawn', () => {
        console.log('Gary is on the field and movin, lad!')

        // 1. HEAVY ANTI-AFK: Movement & Jumping (Every 40 seconds)
        // Aternos is strict; swinging arms isn't always enough.
        setInterval(() => {
            const actions = ['forward', 'back', 'left', 'right', 'jump']
            const randomAction = actions[Math.floor(Math.random() * actions.length)]
            
            bot.setControlState(randomAction, true)
            setTimeout(() => bot.setControlState(randomAction, false), 1000) 
            
            bot.swingArm('right')
        }, 40000)

        // 2. LOOK AROUND: Random head rotation (Every 50 seconds)
        setInterval(() => {
            const yaw = Math.random() * Math.PI * 2
            const pitch = (Math.random() - 0.5) * Math.PI
            bot.look(yaw, pitch)
        }, 50000)
    })

    // Auto-Reconnect: If kicked or server restarts
    bot.on('end', (reason) => {
        console.log(`Gary is down lad (${reason}), keep coverin us till he is awake.. restarting in 15s`)
        // Increased to 15s because Aternos servers take time to boot/reconnect
        setTimeout(createBot, 15000)
    })

    bot.on('error', (err) => {
        console.log('Aye Lad, there seems to be a problem on the deck, ERROR:', err)
    })
}

createBot()
