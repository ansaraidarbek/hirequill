export function getMonthStartUTC(date = new Date()) {
    date = new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), 1));
    return date.toISOString().slice(0, 10);
}