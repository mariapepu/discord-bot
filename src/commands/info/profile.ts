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
        const profile = await getProfile(String(message.author.id));
        const thumbnail = message.author.avatarURL();
        if (!profile) {
            message.reply("❌ You don't have a profile yet. Try playing a game first!");
            return;
        }

        const embed = {
            color: profile.color,
            title: `:bust_in_silhouette: ${profile.username}'s Profile`,
            thumbnail: {
                url: thumbnail
            },
            fields: [
                { name: '\n', value: `:coin: Coins: ${profile.monedas}`, inline: true }
            ]
        };

        await message.reply({embeds: [embed]});
    }
};
