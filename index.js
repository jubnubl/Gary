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
        console.log('Gary is on the field, waitin for the world to wake up...')
        
        // SPIGOT FIX: Wait for chunks to load before moving
        // If Gary moves into an empty chunk, Spigot will freeze him.
        await bot.waitForChunksToLoad()
        
        console.log('Gary is on the field and movin, lad!')

        // PHYSICS KICKSTART: Forces Spigot to acknowledge Gary is active
        bot.setControlState('jump', true)
        setTimeout(() => bot.setControlState('jump', false), 500)
        
        startWandering(bot)
    })

    const restart = (reason) => {
        console.log(`Gary is down lad (${reason}), keep coverin us till he is awake.. restarting in 5s`)
        bot.quit()
        bot.removeAllListeners()
        setTimeout(createBot, 5000)
    }

    bot.on('kicked', (reason) => restart(`Kicked: ${reason}`))
    bot.on('error', (err) => restart(`Aye Lad, error: ${err.message}`))
    bot.on('end', () => restart('Lost connection'))
}

function startWandering(bot) {
    const wander = () => {
        if (!bot.entity) return
        
        bot.clearControlStates()
        
        // Spigot needs to see the bot "look" before it "moves"
        const yaw = Math.random() * Math.PI * 2
        bot.look(yaw, 0, true) // The 'true' forces an immediate packet
        
        bot.setControlState('forward', true)
        bot.swingArm('right')

        setTimeout(() => {
            bot.clearControlStates()
            // Random pause so he doesn't look like a machine
            setTimeout(wander, Math.random() * 3000 + 2000)
        }, 2000)
    }
    wander()
}

createBot()
