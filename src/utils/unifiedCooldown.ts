import {cooldowns as memoryCooldowns} from './memoryCooldown.js';
import * as profileService from '../services/profileService.js';

type CooldownType = 'memory' | 'database';

export async function isOnCooldown(
    userId: string,
    action: string,
    durationMs: number,
    type: CooldownType = 'memory'
): Promise<boolean> {
    if (type === 'memory') {
        const key = `${userId}_${action}`;
        const now = Date.now();
        const lastUsed = memoryCooldowns.get(key) ?? 0;
        return now - lastUsed < durationMs;
    }

    const profile = await profileService.getProfile(userId);
    if (!profile) return false;

    const expiresAt = await profileService.getCooldown(profile, action);
    return expiresAt > Date.now();
}

export async function getCooldownRemaining(
    userId: string,
    action: string,
    durationMs: number,
    type: CooldownType = 'memory'
): Promise<number> {
    if (type === 'memory') {
        const key = `${userId}_${action}`;
        const now = Date.now();
        const lastUsed = memoryCooldowns.get(key) ?? 0;
        return Math.max(0, durationMs - (now - lastUsed));
    }

    const profile = await profileService.getProfile(userId);
    if (!profile) return 0;

    const expiresAt = await profileService.getCooldown(profile, action);
    return Math.max(0, expiresAt - Date.now());
}

export async function setCooldown(
    userId: string,
    action: string,
    durationMs: number,
    type: CooldownType = 'memory'
): Promise<void> {
    const now = Date.now();

    if (type === 'memory') {
        const key = `${userId}_${action}`;
        memoryCooldowns.set(key, now);
        return;
    }

    const profile = await profileService.getProfile(userId);
    if (!profile) return;

    await profileService.setCooldown(profile, action, durationMs);
}
