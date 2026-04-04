const mineflayer = require('mineflayer')

function createBot() {
    const bot = mineflayer.createBot({
        host: '19Saints.aternos.me', 
        port: 16201,           
        username: 'Gary',   
        version: '1.21.1' 
    })

    bot.on('login', () => {
        console.log('A SCOTTISH-MAN HAS ARRIVED - Your Son, Gary')
    })

    bot.on('spawn', () => {
        console.log('Gary is on the field and movin, lad!')

        const wander = () => {
            const actions = ['forward', 'left', 'right']
            const randomAction = actions[Math.floor(Math.random() * actions.length)]
            
            bot.setControlState(randomAction, true)
            if (Math.random() > 0.6) bot.setControlState('jump', true)

            const moveTime = Math.random() * 2000 + 1500
            
            setTimeout(() => {
                bot.clearControlStates()
                const yaw = Math.random() * Math.PI * 2
                const pitch = (Math.random() - 0.5) * (Math.PI / 2)
                bot.look(yaw, pitch)

                const waitTime = Math.random() * 5000 + 3000
                setTimeout(wander, waitTime)
            }, moveTime)
        }

        wander()

        setInterval(() => {
            bot.swingArm('right')
        }, 30000)
    })

    // --- FASTER AUTO-RECONNECT (5 Seconds) ---
    bot.on('end', (reason) => {
        console.log(`Gary is down (${reason}). Reconnecting in 5s...`)
        setTimeout(createBot, 5000) 
    })

    // CRITICAL: Restart on error so he doesn't get "stuck" offline
    bot.on('error', (err) => {
        console.log('Aye Lad, engine trouble:', err.message)
        // If he fails to connect at all, this ensures he tries again in 5s
        setTimeout(createBot, 5000)
    })
}

createBot()
