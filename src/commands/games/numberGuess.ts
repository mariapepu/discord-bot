import {Message} from 'discord.js';
import {ensureProfile, updateProfile} from '../../services/profileService.js';
import {isOnCooldown} from '../../utils/memoryCooldown.js';
import type {BotCommand} from "../../types/BotCommand";

const activeGames = new Map<string, {
    number: number;
    userId: string;
    timeout: NodeJS.Timeout;
}>();

const VALID_NUMS = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]

const TIME_LIMIT_MS = 30000; // 30 segundos

export const numberGuess: BotCommand = {
    command: '!numguess',

    helpInfo: {
        title: '🎯 !numguess',
        description: 'Guess a number between 1 and 10. Earn coins if correct!',
        usage: '!numguess',
        example: '!numguess',
        category: 1,
    },

    async handleCommand(message: Message) {
        const userId = <string>message.author.id;

        if (activeGames.has(userId)) {
            await message.reply(`⚠️ You already have a started game. Say the number u FAAAAILURE`);
            return;
        }

        if (isOnCooldown(userId, this.command, 5)) {
            await message.reply('🕒 Espera unos segundos antes de volver a jugar.');
            return;
        }

        const number = Math.floor(Math.random() * 10) + 1;
        const timeout = setTimeout(() => {
            activeGames.delete(userId);
            message.reply('⌛ Time is up! You r SO FCKIN SLOW u moron.');
        }, TIME_LIMIT_MS);

        activeGames.set(userId, {number, userId, timeout});
        await message.reply('🎲 Guess the number (from 1 to 10)');
    },

    async handleMessage(message: Message) {
        const userId = String(message.author.id);

        const data = activeGames.get(userId);
        if (!data || data.userId !== userId) return;

        const guess = parseInt(message.content);
        if (!VALID_NUMS.includes(guess)) {
            await message.reply(`🤦 ARE U STOOOPID? or were you fed with dad’s milk? I've said 1 to 10 🖕`);
            return;
        }

        const {number, timeout} = data;

        clearTimeout(timeout);
        activeGames.delete(userId); // un intento, borra juego

        const profile = await ensureProfile(userId, message.author.username);

        if (guess === number) {
            await updateProfile(userId, {
                monedas: profile.monedas + 10,
                victorias: profile.victorias + 1,
            });

            message.reply(`🎉 YOU WON! Now u have 10 more coins! UwU \n 🪙🪙🪙🪙🪙🪙🪙🪙🪙🪙`);
        } else {
            await updateProfile(userId, {
                derrotas: profile.derrotas + 1,
            });

            message.reply(`❌ YOU FAILED. It was ${number}. LOOOOSER`);
        }
    }
};
