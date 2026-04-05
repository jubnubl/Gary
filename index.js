const mineflayer = require('mineflayer')

function createBot() {
    const bot = mineflayer.createBot({
        host: '19Saints.aternos.me', 
        port: 16201,           
        username: 'Gary',   
        version: '1.21.1'
    })

    bot.on('resource_pack', () => bot.acceptResourcePack())

    bot.on('login', () => {
        console.log('A SCOTTISH-MAN HAS ARRIVED - Your Son, Gary')
    })

    bot.on('spawn', () => {
        console.log('Gary is on the field and movin, lad!')
        
        // Aterbot's trick: Use a looping interval for random actions
        const loop = setInterval(() => {
            if (!bot.entity) return clearInterval(loop)

            const actions = ['forward', 'back', 'left', 'right', 'jump']
            const randomAction = actions[Math.floor(Math.random() * actions.length)]
            
            // Aterbot logic: 50% chance to sprint to break the Spigot freeze
            const isSprinting = Math.random() < 0.5
            
            bot.setControlState('sprint', isSprinting)
            bot.setControlState(randomAction, true)
            bot.swingArm('right')

            // Move for a very short burst (1 second) then reset
            setTimeout(() => {
                bot.setControlState(randomAction, false)
                bot.setControlState('sprint', false)
            }, 1000)

        }, 5000) // Triggers every 5 seconds
    })

    // Aterbot's robust reconnection logic
    const restart = (reason) => {
        console.log(`Gary is down lad (${reason}).. restarting in 15s`)
        bot.quit()
        bot.removeAllListeners()
        setTimeout(createBot, 15000) 
    }

    bot.on('kicked', (reason) => restart(reason))
    bot.on('error', (err) => restart(err.message))
    bot.on('end', () => restart('Connection Ended'))
}

createBot()
