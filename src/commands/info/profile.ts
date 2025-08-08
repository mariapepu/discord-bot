import {Message} from 'discord.js';
import {getProfile} from '../../services/profileService.js';
import type {BotCommand} from "../../types/BotCommand";

export const profile: BotCommand = {
    command: '!profile',

    helpInfo: {
        title: '👤 !profile',
        description: 'Shows your profile and coin balance.',
        usage: '!profile',
        example: '!profile',
        category: 0
    },

    async handleCommand(message: Message) {
        const profile = await getProfile(message.author.id);
        if (!profile) {
            message.reply("❌ You don't have a profile yet. Try playing a game first!");
            return;
        }

        message.reply(
            `🧑‍💼 Profile of ${profile.username}:
      🪙 Coins: ${profile.monedas}
      🏆 Wins: ${profile.victorias}
      💥 Losses: ${profile.derrotas}`
        );
    }
};
