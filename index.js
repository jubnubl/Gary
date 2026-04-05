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

    bot.once('spawn', async () => {
        await bot.waitForChunksToLoad()
        console.log('Gary is on the field and movin, lad!')
        
        // Force an initial jump to break any "stuck-in-block" detection
        bot.setControlState('jump', true)
        setTimeout(() => bot.setControlState('jump', false), 500)

        startWalking(bot)
    })

    const restart = (reason) => {
        console.log(`Gary is down lad (${reason}).. restarting in 5s`)
        bot.quit()
        bot.removeAllListeners()
        setTimeout(createBot, 5000)
    }

    bot.on('kicked', (reason) => restart(`Kicked: ${reason}`))
    bot.on('error', (err) => restart(`Error: ${err.message}`))
    bot.on('end', () => restart('Lost connection'))
}

function startWalking(bot) {
    const move = () => {
        if (!bot.entity) return

        // 1. Pick a random direction (Yaw)
        const yaw = Math.random() * Math.PI * 2
        bot.look(yaw, 0, true)

        // 2. RAW PHYSICS INJECTION: This bypasses standard "forward" states
        // We set the velocity directly so Spigot can't ignore the movement
        const interval = setInterval(() => {
            if (!bot.entity) return clearInterval(interval)
            
            // Calculate velocity based on Gary's current look direction
            const speed = 0.15 
            bot.entity.velocity.x = -Math.sin(yaw) * speed
            bot.entity.velocity.z = -Math.cos(yaw) * speed
            
            bot.swingArm('right')
        }, 50) // Update every 50ms (1 Minecraft tick)

        // 3. Walk for 3 seconds, then clear velocity and wait
        setTimeout(() => {
            clearInterval(interval)
            if (bot.entity) {
                bot.entity.velocity.x = 0
                bot.entity.velocity.z = 0
            }
            setTimeout(move, Math.random() * 5000 + 2000)
        }, 3000)
    }
    move()
}

createBot()
