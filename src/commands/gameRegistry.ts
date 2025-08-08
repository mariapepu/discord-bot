import type {Message} from "discord.js";
import {numberGuess} from "./games/numberGuess.js";
import type {BotCommand} from '../types/BotCommand';

export const gameCommands: BotCommand[] = [numberGuess];

export function handleGameCommand(message: Message) {
    const command = gameCommands.find(cmd => {
        if (Array.isArray(cmd.command)) {
            return cmd.command.some(alias => message.content.startsWith(alias));
        }
        return message.content.startsWith(cmd.command);
    });
    if (command) {
        command.handleCommand(message, gameCommands);
        return true;
    }
    return false;
}

export function handleGameMessage(message: Message) {
    gameCommands.forEach(game => game.handleMessage(message));
}
