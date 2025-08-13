import {ActionRowBuilder, ButtonBuilder, ButtonStyle, ComponentType, Message, MessageFlags} from 'discord.js';
import type {BotCommand} from '../../types/BotCommand';
import {items} from '../../entities/Item.js'

const ITEMS_PER_PAGE = 5;

export const shop: BotCommand = {
    command: '!shop',

    helpInfo: {
        title: '🛒 !shop',
        description: 'View the shop pages and use !buy <itemId> to purchase.',
        usage: '!shop [page]',
        example: '!shop\n!buy shield',
        category: 2
    },

    async handleCommand(message: Message) {
        let page = 0;
        const totalPages = Math.ceil(items.length / ITEMS_PER_PAGE);

        const getEmbed = (pageIndex: number) => {
            const start = pageIndex * ITEMS_PER_PAGE;
            const pageItems = items.slice(start, start + ITEMS_PER_PAGE);

            return {
                color: 0xFFB5C0,
                title: '🛒 Shop - Page ' + (pageIndex + 1) + '/' + totalPages,
                description: 'Use `!buy <itemId>` to purchase an item.',
                fields: pageItems.map(item => ({
                    name: `${item.name} — ${item.price} 🪙`,
                    value: `ID: \`${item.id}\`\n${item.description}`,
                    inline: false
                })),
                footer: {
                    text: `Bot by mpepu`
                }
            };
        };

        const row = new ActionRowBuilder<ButtonBuilder>().addComponents(
            new ButtonBuilder().setCustomId('prev').setLabel('⬅️ Prev').setStyle(ButtonStyle.Secondary),
            new ButtonBuilder().setCustomId('next').setLabel('Next ➡️').setStyle(ButtonStyle.Secondary)
        );

        const shopMessage = await message.reply({embeds: [getEmbed(page)], components: [row]});

        const collector = shopMessage.createMessageComponentCollector({
            componentType: ComponentType.Button,
            time: 30000,
            filter: i => i.user.id === message.author.id
        });

        collector.on('collect', async i => {
            if (i.customId === 'prev') {
                page = (page - 1 + totalPages) % totalPages;
            } else if (i.customId === 'next') {
                page = (page + 1) % totalPages;
            }
            await i.update({embeds: [getEmbed(page)], components: [row]});
        });

        collector.on('end', () => {
            shopMessage.edit({components: []}).catch(() => {
            });
        });
    }
};
