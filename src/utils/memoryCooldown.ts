export const cooldowns = new Map<string, number>();

/**
 * Verifica si un usuario está en cooldown para un comando.
 * @param userId - ID del usuario
 * @param command - Nombre del comando
 * @param seconds - Tiempo de cooldown en segundos
 * @returns true si está en cooldown, false si puede usar el comando
 */
export function isOnCooldown(userId: string, command: string, seconds: number): boolean {
    const key = `${userId}_${command}`;
    const now = Date.now();
    const lastUsed = cooldowns.get(key) ?? 0;

    if (now - lastUsed < seconds * 1000) {
        return true;
    }

    cooldowns.set(key, now);
    return false;
}
