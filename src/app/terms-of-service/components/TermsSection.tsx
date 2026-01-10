interface TermsSectionProps {
    id: string;
    title: string;
    content: string;
}

const TermsSection = ({ id, title, content }: TermsSectionProps) => {
    const formatContent = (text: string) => {
        return text.split("\n").map((paragraph, index) => {
            if (paragraph.trim() === "") return null;

            const isBold =
                paragraph.startsWith("**") && paragraph.endsWith("**");
            const isListItem = paragraph.trim().startsWith("•");

            if (isBold) {
                const cleanText = paragraph.replace(/\*\*/g, "");
                return (
                    <h4
                        key={index}
                        className="text-base font-semibold text-foreground mt-4 mb-2 font-headline"
                    >
                        {cleanText}
                    </h4>
                );
            }

            if (isListItem) {
                return (
                    <li
                        key={index}
                        className="text-sm text-muted-foreground ml-4 font-body"
                    >
                        {paragraph.trim().substring(1).trim()}
                    </li>
                );
            }

            return (
                <p
                    key={index}
                    className="text-sm text-muted-foreground leading-relaxed font-body"
                >
                    {paragraph}
                </p>
            );
        });
    };

    return (
        <section id={id} className="scroll-mt-24">
            <h2 className="text-2xl font-bold text-foreground mb-4 font-headline">
                {title}
            </h2>
            <div className="space-y-3">{formatContent(content)}</div>
        </section>
    );
};

export default TermsSection;
