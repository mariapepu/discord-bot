import type {Message} from 'discord.js';

export interface HelpInfo {
    title: string;
    description: string;
    usage: string;
    example: string;
    category?: number; // 0-info, 1-games, 2-actions
}

export interface BotCommand {
    command: string | string[];
    helpInfo?: HelpInfo;
    handleCommand: (message: Message, allCommands?: BotCommand[]) => void;
    handleMessage?: (message: Message) => void;
}
