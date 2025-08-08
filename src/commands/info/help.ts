import type {Message} from 'discord.js';
import type {BotCommand} from '../../types/BotCommand';

export const help: BotCommand = {
    command: '!help',

    async handleCommand(message: Message, allCommands: BotCommand[] = []) {
        const args = message.content.trim().split(/\s+/);

        if (args.length === 1) {
            const embed = {
                color: 0xFFB5C0,
                title: 'ℹ️ Help Menu',
                description: [
                    'Here are the available commands.',
                    'For more info, type `!help [command]`',
                    '',
                    '────────────────────────────────────'
                ].join('\n'),
                fields: [
                    {
                        name: 'General 👤',
                        value: allCommands
                            .filter(cmd => cmd.command !== '!help' && cmd.helpInfo?.category?.valueOf() == 0)
                            .map(cmd => cmd.command)
                            .join('\n') || 'None',
                        inline: true,
                    },
                    {
                        name: 'Games 🎮',
                        value: allCommands
                            .filter(cmd => cmd.helpInfo?.category?.valueOf() == 1)
                            .map(cmd => cmd.command)
                            .join('\n') || 'None',
                        inline: true,
                    },
                    {
                        name: 'Actions ⭐',
                        value: allCommands
                            .filter(cmd => cmd.helpInfo?.category?.valueOf() == 2)
                            .map(cmd => cmd.command)
                            .join('\n') || '',
                        inline: true,
                    },
                    {
                        name: '\u200B',
                        value: '\u200B',
                        inline: false,
                    },
                ],
                footer: {
                    text: 'Bot by mpepu',
                    icon_url: 'https://imgproxy.attic.sh/insecure/f:png/plain/https://attic.sh/u8q6mllr55mo61m5iahse7t92k72',
                },
            };

            return await message.reply({embeds: [embed]});
        }

        const query = args[1].toLowerCase();
        const command = allCommands.find(cmd => {
            if (Array.isArray(cmd.command)) {
                return cmd.command.some(alias => alias.toLowerCase() === `!${query}`);
            }
            return cmd.command.toLowerCase() === `!${query}`;
        });

        if (!command || !command.helpInfo) {
            return await message.reply(`❌ Command \`!${query}\` not found.`);
        }

        const {title, description, usage, example} = command.helpInfo;

        const detailEmbed = {
            color: 0xFFB5C0,
            title: `📖 Help:  ${title}`,
            description: [
                description,
                '',
                '────────────────────────────────────'
            ].join('\n'),
            fields: [
                {name: '📄 Description', value: description, inline: false},
                {name: '\n', value: '\n', inline: false},
                {name: '⚙️ Usage', value: `\`${usage}\``, inline: false},
                {name: '\n', value: '\n', inline: false},
                {name: '💡 Example', value: `\`${example}\``, inline: false},
                {name: '\u200B', value: '\u200B', inline: false},
            ],
            footer: {
                text: 'Bot by mpepu',
                icon_url: 'https://imgproxy.attic.sh/insecure/f:png/plain/https://attic.sh/u8q6mllr55mo61m5iahse7t92k72',
            },
        };

        await message.reply({embeds: [detailEmbed]});
    },
};
