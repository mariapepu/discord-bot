import {Client, GatewayIntentBits} from 'discord.js';
import dotenv from 'dotenv';
import {AppDataSource} from './config/data-source.js';
import {handleCommand} from './commands/commandRegistry.js';
import {handleGameCommand, handleGameMessage} from './commands/gameRegistry.js';

dotenv.config();

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent
    ]
});

client.once('ready', async () => {
    console.log(`✅ Logged in as ${client.user?.tag}`);
    await AppDataSource.initialize();
});

client.on('messageCreate', async (message) => {
    if (message.author.bot) return;

    // primero comandos (!help, !profile…)
    if (handleCommand(message)) return;

    // luego comandos de juego (!play…)
    if (handleGameCommand(message)) return;

    // si no es comando, puede ser intento de juego (adivinanza)
    handleGameMessage(message);
});

client.login(process.env.TOKEN);
