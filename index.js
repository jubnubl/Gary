const mineflayer = require('mineflayer')

function createBot() {
    const bot = mineflayer.createBot({
        host: '19Saints.aternos.me', 
        port: 16201,           
        username: 'Gary',   
        version: '1.21.1',
        hideErrors: false // Shows more detail if something breaks
    })

    // FIX: Automatically accept resource packs (common kick reason on 1.21+)
    bot.on('resource_pack', () => {
        bot.acceptResourcePack()
    })

    bot.on('login', () => {
        console.log('A SCOTTISH-MAN HAS ARRIVED - Your Son, Gary')
    })

    // See exactly WHY Gary is getting kicked
    bot.on('kicked', (reason) => {
        console.log('Gary was kicked! Reason:', reason)
    })

    bot.once('spawn', () => {
        console.log('Gary is on the field and movin, lad!')

        const wander = () => {
            if (!bot.entity) return // Stop if bot isn't spawned
            
            bot.clearControlStates() 

            const actions = ['forward', 'left', 'right']
            const randomAction = actions[Math.floor(Math.random() * actions.length)]
            
            bot.setControlState(randomAction, true)
            if (Math.random() > 0.6) bot.setControlState('jump', true)

            setTimeout(() => {
                bot.clearControlStates()
                
                const yaw = Math.random() * Math.PI * 2
                const pitch = (Math.random() - 0.5) * (Math.PI / 2)
                bot.look(yaw, pitch)
                bot.swingArm('right')

                setTimeout(wander, Math.random() * 5000 + 3000)
            }, Math.random() * 2000 + 1500)
        }
        wander()
    })

    // Clean restart logic to avoid double-spawning
    const restart = (reason) => {
        console.log(`Gary is down (${reason}). Restarting in 15s...`)
        bot.removeAllListeners() 
        setTimeout(createBot, 15000)
    }

    bot.on('end', () => restart('Connection Ended'))
    bot.on('error', (err) => restart(`Error: ${err.message}`))
}

createBot()
