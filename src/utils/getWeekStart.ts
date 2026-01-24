export function getWeekStartUTC(date = new Date()): string {
    const d = new Date(date);
    const day = d.getUTCDay(); // 0 = Sun, 1 = Mon, ...
    const diff = (day === 0 ? -6 : 1) - day; // Monday = start
    d.setUTCDate(d.getUTCDate() + diff);
    d.setUTCHours(0, 0, 0, 0);
    return d.toISOString().slice(0, 10);
}
