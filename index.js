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

    // Using 'once' ensures the movement loop starts correctly after everything loads
    bot.once('spawn', () => {
        console.log('Gary is on the field and movin, lad!')

        const wander = () => {
            bot.clearControlStates() // Reset before picking a new move

            const actions = ['forward', 'left', 'right']
            const randomAction = actions[Math.floor(Math.random() * actions.length)]
            
            bot.setControlState(randomAction, true)
            if (Math.random() > 0.6) bot.setControlState('jump', true)

            // Move for 1.5 to 3.5 seconds
            setTimeout(() => {
                bot.clearControlStates()
                
                const yaw = Math.random() * Math.PI * 2
                const pitch = (Math.random() - 0.5) * (Math.PI / 2)
                bot.look(yaw, pitch)
                bot.swingArm('right')

                // Wait 3 to 8 seconds before next move
                setTimeout(wander, Math.random() * 5000 + 3000)
            }, Math.random() * 2000 + 1500)
        }

        // Kick off the loop
        wander()
    })

    bot.on('end', (reason) => {
        console.log(`Gary is down lad (${reason}), keep coverin us till he is awake.. restarting in 5s`)
        setTimeout(createBot, 5000) 
    })

    bot.on('error', (err) => {
        console.log('Aye Lad, there seems to be a problem on the deck, ERROR:', err.message)
        setTimeout(createBot, 5000)
    })
}

createBot()
