/**
 * Convierte milisegundos en un string legible como "4m 32s"
 */
export function msToTime(ms: number): string {
    const totalSeconds = Math.floor(ms / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;

    const parts = [];
    if (minutes > 0) parts.push(`${minutes}m`);
    if (seconds > 0 || minutes === 0) parts.push(`${seconds}s`);

    return parts.join(' ');
}
