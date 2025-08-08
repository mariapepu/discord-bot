import {Message} from 'discord.js';
import {cleanExpiredCooldowns, getProfile} from '../../services/profileService.js';
import type {BotCommand} from "../../types/BotCommand";
import {msToTime} from "../../utils/timeFormatter.js";

export const cooldowns: BotCommand = {
    command: ['!cooldowns', '!cd'],

    helpInfo: {
        title: '👤 !cooldowns',
        description: 'Shows your cooldowns for other commands.',
        usage: '!cooldowns or !cd',
        example: '!cooldowns \n!cd',
        category: 0
    },

    async handleCommand(message: Message) {
        const userId = message.author.id;
        let profile = await getProfile(userId);
        if (!profile) {
            return message.reply("❌ You don't have a profile yet. Try playing a game first!");
        }

        // Borra los cooldowns expirados
        profile = await cleanExpiredCooldowns(profile);

        const now = Date.now();
        const cooldowns = profile.cooldowns || {};

        if (Object.keys(cooldowns).length === 0) {
            return message.reply("✅ You have no active cooldowns.");
        }

        let output = '⏱️ Your active cooldowns:\n';
        for (const [action, expiresAt] of Object.entries(cooldowns)) {
            const remaining = Math.max(0, expiresAt - now);
            output += `   ⛔ **${action}**: ${msToTime(remaining)}\n`;
        }

        message.reply(output);
    }
};
