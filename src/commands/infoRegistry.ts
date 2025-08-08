import type {BotCommand} from '../types/BotCommand';
import {Message} from "discord.js";
import {help} from './info/help.js';
import {profile} from './info/profile.js';
import {cooldowns} from "./info/cooldowns.js";

export const infoCommands: BotCommand[] = [help, profile, cooldowns];

export function handleCommand(message: Message) {
    const command = infoCommands.find(cmd => {
        if (Array.isArray(cmd.command)) {
            return cmd.command.some(alias => message.content.startsWith(alias));
        }
        return message.content.startsWith(cmd.command);
    });

    if (command) {
        command.handleCommand(message, infoCommands); // o allCommands si lo pasas
        return true;
    }

    return false;
}