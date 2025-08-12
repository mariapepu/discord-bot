import {Message, TextChannel} from 'discord.js';
import { getProfile, updateProfile, addItemToInventory } from '../../services/profileService.js';
import type { BotCommand } from '../../types/BotCommand';
import { logger } from '../../utils/logger.js';
import { items } from '../../entities/Item.js';

export const buy: BotCommand = {
    command: '!buy',

    helpInfo: {
        title: '💳 !buy',
        description: 'Buy an item from the shop by ID.',
        usage: '!buy [itemId]',
        example: '!buy shield',
        category: 2
    },

    async handleCommand(message: Message) {
        const args = message.content.split(' ').slice(1);
        if (args.length === 0) {
            return message.reply("❌ You must specify the item ID. Use `!shop` to view items.");
        }

        const itemId = args[0].toLowerCase();
        const item = items.find(it => it.id === itemId);
        if (!item) {
            return message.reply("❌ Item not found. Use `!shop` to view available items.");
        }

        const profile = await getProfile(String(message.author.id));
        if (!profile) {
            return message.reply("❌ You don't have a profile yet. Try playing a game first!");
        }

        if (profile.monedas < item.price) {
            return message.reply(`❌ You don’t have enough coins to buy ${item.name}.`);
        }

        profile.monedas -= item.price;

        if (itemId === 'pc-perso') {
            // 🖌️ Pedir color personalizado
            await message.reply("🎨 Please enter your desired color in HEX format (e.g., `#FFB5C0` or `FFB5C0`). You have 30 seconds.");

            const filter = (m: Message) => m.author.id === message.author.id;
            try {
                const collected = await (message.channel as TextChannel).awaitMessages({
                    filter,
                    max: 1,
                    time: 30000,
                    errors: ['time']
                });

                const colorInput = collected.first()?.content.replace('#', '').trim() || '';
                const isValidHex = /^[0-9A-Fa-f]{6}$/.test(colorInput);

                if (!isValidHex) {
                    return message.reply("❌ Invalid HEX color. Purchase canceled.");
                }

                await updateProfile(profile.userId, { monedas: profile.monedas, color: Number('0x'+ colorInput.toUpperCase()) });
                logger.info(`El usuario ${profile.username} compró ${item.name} y estableció el color personalizado a #${colorInput.toUpperCase()}`);
                return message.reply(`✅ You bought **${item.name}** and set your profile color to **#${colorInput.toUpperCase()}**!`);

            } catch {
                return message.reply("⌛ Time's up! Purchase canceled.");
            }
        }

        if (item.color !== undefined) {
            await updateProfile(profile.userId, { monedas: profile.monedas, color: item.color });
            logger.info(`El usuario ${profile.username} compró ${item.name} y cambió el color de perfil a ${item.color || 'personalizado'}`);
        } else {
            await addItemToInventory(profile.userId, itemId);
            await updateProfile(profile.userId, { monedas: profile.monedas });
            logger.info(`El usuario ${profile.username} compró ${item.name}`);
        }

        logger.info(`${profile.username} compró ${item.name} por ${item.price} coins.`);
        return message.reply(`✅ You bought **${item.name}** for **${item.price} coins**!`);
    }
};
