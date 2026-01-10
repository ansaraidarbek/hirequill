interface LastUpdatedProps {
    date: string;
}

export default function LastUpdated({ date }: LastUpdatedProps) {
    return (
        <div className="bg-accent/10 border border-accent/20 rounded-lg p-4 mb-8">
            <p className="text-sm text-foreground font-body">
                <span className="font-semibold">Last Updated:</span> {date}
            </p>
        </div>
    );
}
