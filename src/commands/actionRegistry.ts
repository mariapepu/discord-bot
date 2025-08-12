import type {BotCommand} from '../types/BotCommand';
import {Message} from "discord.js";
import {steal} from './actions/steal.js';
import {buy} from "./actions/buy.js";

export const actionCommands: BotCommand[] = [steal, buy];

export function handleCommand(message: Message) {
    const command = actionCommands.find(cmd => {
        if (Array.isArray(cmd.command)) {
            return cmd.command.some(alias => message.content.startsWith(alias));
        }
        return message.content.startsWith(cmd.command);
    });

    if (command) {
        command.handleCommand(message, actionCommands); // o allCommands si lo pasas
        return true;
    }

    return false;
}
