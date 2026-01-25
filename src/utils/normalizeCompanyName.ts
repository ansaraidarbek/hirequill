export function normalizeCompanyName(input: string): string {
    return input
        .trim()
        .toLowerCase()
        .replace(/&/g, "and")
        .replace(/[^\p{L}\p{N}]+/gu, " ") // keep letters/numbers, replace rest with space
        .replace(
            /\b(inc|inc\.|llc|ltd|ltd\.|gmbh|ag|sa|srl|plc|bv|oy|pte|co|company|corp|corporation|limited)\b/gi,
            "",
        )
        .replace(/\s+/g, " ")
        .replace(/\s/g, "-")
        .trim();
}
