import {ActionRowBuilder, ButtonBuilder, ButtonStyle, ComponentType, Message, MessageFlags} from 'discord.js';
import {addItemToInventory, ensureProfile, updateProfile} from '../../services/profileService.js';
import type {BotCommand} from '../../types/BotCommand';
import {logger} from "../../utils/logger.js";

const items = [
    {id: 'shield', name: '🛡️ Shield', price: 50, description: 'Blocks one robbery.'},
    {id: 'mask', name: '🎭 Mask', price: 30, description: 'Reduces chance of being caught by police.'}
];

export const shop: BotCommand = {
    command: '!shop',

    helpInfo: {
        title: '🛒 !shop',
        description: 'Buy items to defend yourself or improve actions.',
        usage: '!shop',
        example: '!shop',
        category: 2
    },

    async handleCommand(message: Message) {
        const profile = await ensureProfile(message.author.id, message.author.username);

        const buttons = new ActionRowBuilder<ButtonBuilder>().addComponents(
            items.map(item =>
                new ButtonBuilder()
                    .setCustomId(`buy_${item.id}`)
                    .setLabel(`${item.name} (${item.price} 🪙)`)
                    .setStyle(ButtonStyle.Primary)
            )
        );

        const msg = await message.reply({
            content: `🛍️ Welcome to the shop, ${profile.username}! Select an item to buy:`,
            components: [buttons]
        });

        const collector = msg.createMessageComponentCollector({
            componentType: ComponentType.Button,
            time: 15000,
            filter: i => i.user.id === message.author.id
        });

        collector.on('collect', async i => {
            const itemId = i.customId.replace('buy_', '');
            const item = items.find(it => it.id === itemId);
            if (!item) return;

            if (profile.monedas < item.price) {
                await i.reply({content: `❌ You don’t have enough coins!`, flags: MessageFlags.Ephemeral});
                return;
            }

            profile.monedas -= item.price;
            await addItemToInventory(profile.userId, itemId);
            await updateProfile(profile.userId, {monedas: profile.monedas});
            logger.info(`El usuario ${profile.username} compró un/a ${item.name}`)
            await i.reply({content: `✅ You bought a ${item.name}!`, flags: MessageFlags.Ephemeral});
        });

        collector.on('end', () => {
            msg.edit({components: []}).catch(() => {
            });
        });
    }
};
