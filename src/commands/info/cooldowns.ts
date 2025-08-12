import {EmbedBuilder, Message} from 'discord.js';
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
        let profile = await getProfile(String(userId));
        if (!profile) {
            return message.reply("❌ You don't have a profile yet. Try playing a game first!");
        }

        // 🧹 Limpiar cooldowns expirados
        profile = await cleanExpiredCooldowns(profile);

        const now = Date.now();
        const cooldowns = profile.cooldowns || {};
        let fields;
        if (Object.keys(cooldowns).length === 0) {
            fields = [{
                name: "✅ You have no active cooldowns.",
                value: "",
                inline: false
            }]
        } else {
            fields = Object.entries(cooldowns).map(([action, expiresAt]) => ({
                name: action,
                value: `⏳ ${msToTime(Math.max(0, expiresAt - now))}`,
                inline: false
            }));
        }

        // 🖌️ Crear el embed
        const embed = new EmbedBuilder()
            .setColor(0xFFB5C0)
            .setTitle('⏱️ Your Active Cooldowns')
            .setDescription('Here are the commands currently on cooldown:')
            .addFields(fields);

        await message.reply({embeds: [embed]});
    }
};
