import Mineflayer from 'mineflayer';
import { sleep, getRandom } from "./utils.ts";
import CONFIG from "./config.json" assert {type: 'json'};

let loop: NodeJS.Timeout;
let bot: Mineflayer.Bot;

const disconnect = (): void => {
    clearInterval(loop);
    bot?.quit?.();
};

const reconnect = async (): Promise<void> => {
    console.log(`Gary is down lad.. restarting in ${CONFIG.action.retryDelay / 1000}s`);
    disconnect();
    await sleep(CONFIG.action.retryDelay);
    createBot();
};

const createBot = (): void => {
    bot = Mineflayer.createBot({
        host: CONFIG.client.host,
        port: CONFIG.client.port,
        username: CONFIG.client.username,
        version: '1.21.1' // Match Gary's version
    });

    bot.on('resource_pack', () => bot.acceptResourcePack());

    bot.once('spawn', () => {
        console.log('Gary is on the field and movin, lad!');
        
        loop = setInterval(async () => {
            const action = getRandom(CONFIG.action.commands) as Mineflayer.ControlState;
            const isSprinting = Math.random() < 0.5;

            // Randomly look around (JadeMin's best feature)
            const yaw = (Math.random() * Math.PI) - (0.5 * Math.PI);
            const pitch = (Math.random() * Math.PI) - (0.5 * Math.PI);
            await bot.look(yaw, pitch, false);

            // Move
            bot.setControlState('sprint', isSprinting);
            bot.setControlState(action, true);
            bot.swingArm('right');

            await sleep(1000); // Move for 1 second
            bot.clearControlStates();
        }, CONFIG.action.holdDuration);
    });

    bot.once('login', () => console.log('A SCOTTISH-MAN HAS ARRIVED - Your Son, Gary'));
    bot.once('kicked', (reason) => reconnect());
    bot.once('error', (err) => reconnect());
    bot.once('end', () => reconnect());
};

createBot();
