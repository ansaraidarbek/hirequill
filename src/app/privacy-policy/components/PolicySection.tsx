interface PolicySectionProps {
    title: string;
    children: React.ReactNode;
    id?: string;
}

export default function PolicySection({
    title,
    children,
    id,
}: PolicySectionProps) {
    return (
        <section id={id} className="mb-12 scroll-mt-24">
            <h2 className="text-2xl font-bold text-foreground mb-4 font-headline">
                {title}
            </h2>
            <div className="text-muted-foreground space-y-4 font-body leading-relaxed">
                {children}
            </div>
        </section>
    );
}
