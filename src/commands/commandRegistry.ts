import type {Message} from 'discord.js';
import type {BotCommand} from '../types/BotCommand.js';

import {infoCommands} from './infoRegistry.js';
import {gameCommands} from './gameRegistry.js';
import {actionCommands} from './actionRegistry.js';

export const commands: BotCommand[] = [...infoCommands, ...gameCommands, ...actionCommands];

export function handleCommand(message: Message) {
    const command = commands.find(cmd => {
        if (Array.isArray(cmd.command)) {
            return cmd.command.some(alias => message.content.startsWith(alias));
        }
        return message.content.startsWith(cmd.command);
    });

    if (command) {
        if (command.command === '!help') {
            command.handleCommand(message, commands); // le pasamos todos
        } else {
            command.handleCommand(message);
        }
        return true;
    }

    return false;
}