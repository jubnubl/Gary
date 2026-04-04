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

        // --- GARY'S WANDER LOGIC ---
        const wander = () => {
            // Pick a random movement direction
            const actions = ['forward', 'left', 'right']
            const randomAction = actions[Math.floor(Math.random() * actions.length)]
            
            // Start moving and randomly jump (40% chance)
            bot.setControlState(randomAction, true)
            if (Math.random() > 0.6) bot.setControlState('jump', true)

            // Move for 1.5 to 3.5 seconds
            const moveTime = Math.random() * 2000 + 1500
            
            setTimeout(() => {
                // Stop all movement
                bot.clearControlStates()
                
                // Look around randomly after stopping
                const yaw = Math.random() * Math.PI * 2
                const pitch = (Math.random() - 0.5) * (Math.PI / 2)
                bot.look(yaw, pitch)

                // Wait 3 to 8 seconds before the next move
                const waitTime = Math.random() * 5000 + 3000
                setTimeout(wander, waitTime)
            }, moveTime)
        }

        // Kick off the wandering loop
        wander()

        // Backup Anti-AFK: Swing arm every 30 seconds
        setInterval(() => {
            bot.swingArm('right')
        }, 30000)
    })

    // Handle Chat Commands (Optional: Type "stop" in game to make him sit still)
    bot.on('chat', (username, message) => {
        if (username === bot.username) return
        if (message === 'stop') {
            bot.clearControlStates()
            console.log('Gary is takin a breather.')
        }
    })

    // Auto-Reconnect Logic
    bot.on('end', (reason) => {
        console.log(`Gary is down lad (${reason}), restarting in 15s...`)
        setTimeout(createBot, 15000)
    })

    bot.on('error', (err) => {
        console.log('Aye Lad, there seems to be a problem on the deck, ERROR:', err)
    })
}

createBot()
