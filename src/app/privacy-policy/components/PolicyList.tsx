interface PolicyListProps {
    items: string[];
    ordered?: boolean;
}

export default function PolicyList({
    items,
    ordered = false,
}: PolicyListProps) {
    const ListTag = ordered ? "ol" : "ul";
    const listClass = ordered
        ? "list-decimal list-inside space-y-2 ml-4"
        : "list-disc list-inside space-y-2 ml-4";

    return (
        <ListTag className={listClass}>
            {items.map((item, index) => (
                <li key={index} className="text-muted-foreground font-body">
                    {item}
                </li>
            ))}
        </ListTag>
    );
}
