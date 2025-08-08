import {AppDataSource} from '../config/data-source.js';
import {UserProfile} from '../entities/UserProfile.js';
import {logger} from "../utils/logger.js";

const repo = AppDataSource.getRepository(UserProfile);

export async function getProfile(userId: string): Promise<UserProfile | null> {
    return await repo.findOneBy({userId});
}

export async function createProfile(userId: string, username: string): Promise<UserProfile> {
    const existing = await getProfile(userId);
    if (existing) throw new Error('Profile already exists');

    const profile = repo.create({userId, username});
    return await repo.save(profile);
}

export async function updateProfile(userId: string, updates: Partial<UserProfile>): Promise<UserProfile> {
    const profile = await getProfile(userId);
    if (!profile) throw new Error('Profile not found');

    Object.assign(profile, updates);
    return await repo.save(profile);
}

export async function ensureProfile(userId: string, username: string): Promise<UserProfile> {
    let profile = await getProfile(userId);

    if (!profile) {
        profile = await createProfile(userId, username);
    } else if (profile.username !== username) {
        profile = await updateProfile(userId, {username});
    }

    return profile;
}

export async function getCooldown(profile: UserProfile, action: string): Promise<number> {
    const expiresAt = profile.cooldowns?.[action] ?? 0;

    if (expiresAt <= Date.now()) {
        if (profile.cooldowns && action in profile.cooldowns) {
            logger.info(`Cooldown expirado para ${profile.username}, acción: ${action}. Borrando...`);
            delete profile.cooldowns[action];
            await repo.save(profile);
            logger.info(`Cooldown expirado borrado con éxito.`);
        }

        return 0;
    }

    return expiresAt;
}

export async function setCooldown(profile: UserProfile, action: string, durationMs: number): Promise<void> {
    const now = Date.now();
    const updatedCooldowns = {
        ...(profile.cooldowns || {}),
        [action]: now + durationMs,
    };

    await updateProfile(profile.userId, {cooldowns: updatedCooldowns});
}

export async function cleanExpiredCooldowns(profile: UserProfile): Promise<UserProfile> {
    const now = Date.now();
    let updated = false;

    if (!profile.cooldowns) return profile;

    for (const [action, expiresAt] of Object.entries(profile.cooldowns)) {
        if (expiresAt <= now) {
            delete profile.cooldowns[action];
            updated = true;
        }
    }

    if (updated) {
        await repo.save(profile); // guarda cambios
        logger.info(`Cooldowns expirados limpiados para ${profile.username}`);
    }

    return profile;
}

export async function addItemToInventory(userId: string, itemName: string) {
    const profile = await getProfile(userId);
    if (!profile.inventory) profile.inventory = {};
    profile.inventory[itemName] = (profile.inventory[itemName] || 0) + 1;
    return updateProfile(userId, {inventory: profile.inventory});
}