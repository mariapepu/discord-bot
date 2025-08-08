import {Message} from 'discord.js';
import {getProfile, updateProfile} from '../../services/profileService.js';
import {getCooldownRemaining, isOnCooldown, setCooldown} from '../../utils/unifiedCooldown.js';
import {msToTime} from '../../utils/timeFormatter.js';
import {logger} from '../../utils/logger.js';
import type {BotCommand} from '../../types/BotCommand';

export const steal: BotCommand = {
    command: '!steal',

    helpInfo: {
        title: '💰 !steal',
        description: 'Allows you to steal money from other players',
        usage: '!steal @person',
        example: '!steal @user',
        category: 2
    },

    async handleCommand(message: Message) {
        const userId = message.author.id;
        const profile = await getProfile(userId);
        let stolen;

        if (!profile) {
            return message.reply("❌ You don't have a profile yet. Try playing a game first!");
        }

        const action = 'steal';
        const cooldownMs = 5 * 60 * 1000;

        if (await isOnCooldown(userId, action, cooldownMs, 'database')) {
            const remaining = await getCooldownRemaining(userId, action, cooldownMs, 'database');
            return message.reply(`⏳ You must wait ${msToTime(remaining)} before stealing again.`);
        }

        const mention = message.mentions.users.first();
        if (!mention || mention.id === userId) {
            return message.reply("👀 You must mention someone else to steal from.");
        }

        const targetProfile = await getProfile(mention.id);
        if (!targetProfile) {
            return message.reply("❌ That user doesn't have a profile yet.");
        }

        const roll = Math.random();

        if (roll < 0.05) {
            // 💎 Robo épico (5%)
            stolen = Math.min(targetProfile.monedas, Math.floor(Math.random() * 16) + 15);
            targetProfile.monedas -= stolen;
            profile.monedas += stolen;

            await Promise.all([
                updateProfile(profile.userId, {monedas: profile.monedas}),
                updateProfile(targetProfile.userId, {monedas: targetProfile.monedas}),
                setCooldown(userId, action, cooldownMs, 'database'),
            ]);

            logger.info(`${profile.username} performed a legendary heist and stole ${stolen} coins from ${mention.username}`);
            return message.reply(`💎 You performed a **legendary heist** and stole **${stolen} coins** from ${mention.username}! You're a mastermind!`);
        }

        if (roll < 0.29) {
            // 🕶️ Robo normal (24%)
            stolen = Math.min(targetProfile.monedas, Math.floor(Math.random() * 6) + 5);
            targetProfile.monedas -= stolen;
            profile.monedas += stolen;

            await Promise.all([
                updateProfile(profile.userId, {monedas: profile.monedas}),
                updateProfile(targetProfile.userId, {monedas: targetProfile.monedas}),
                setCooldown(userId, action, cooldownMs, 'database'),
            ]);

            logger.info(`${profile.username} stole ${stolen} coins from ${mention.username}`);
            return message.reply(`🕶️ You stole **${stolen} coins** from ${mention.username}! Smooth.`);
        }

        if (roll < 0.67) {
            // 💨 Fallo normal (38%)
            await setCooldown(userId, action, cooldownMs, 'database');
            logger.info(`${profile.username} tried to rob ${mention.username} but failed.`);
            return message.reply(`💨 You tried to rob ${mention.username}, but tripped on a banana peel and ran away with nothing.`);
        }

        if (roll < 0.95) {
            // 🚔 Te pilla la poli (28%)
            const fine = Math.floor(Math.random() * 6) + 5;
            profile.monedas = Math.max(0, profile.monedas - fine);

            await Promise.all([
                updateProfile(profile.userId, {monedas: profile.monedas}),
                setCooldown(userId, action, cooldownMs, 'database'),
            ]);

            logger.warn(`${profile.username} got caught by police trying to rob ${mention.username} and paid ${fine} coins.`);
            return message.reply(`🚔 The police caught you red-handed trying to rob ${mention.username}. You paid a **${fine} coin** fine and got away… barely.`);
        }

        // 💀 Evento chungo (5%)
        const heavyFine = Math.floor(Math.random() * 16) + 15;
        profile.monedas = Math.max(0, profile.monedas - heavyFine);

        await Promise.all([
            updateProfile(profile.userId, {monedas: profile.monedas}),
            setCooldown(userId, action, cooldownMs, 'database'),
        ]);

        logger.error(`${profile.username} was ambushed by fake cops and lost ${heavyFine} coins.`);
        return message.reply(`💀 You got ambushed by a fake cop. Lost **${heavyFine} coins** and woke up in a trash can.`);
    }
};
