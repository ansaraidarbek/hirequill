import Icon from "@/components/ui/AppIcon";

interface ContactInfoProps {
    email: string;
    responseTime: string;
}

export default function ContactInfo({ email, responseTime }: ContactInfoProps) {
    return (
        <div className="bg-muted rounded-lg p-6 border border-border">
            <div className="flex items-start space-x-4">
                <div className="flex-shrink-0">
                    <Icon
                        name="EnvelopeIcon"
                        size={24}
                        className="text-primary"
                    />
                </div>
                <div>
                    <h3 className="text-lg font-semibold text-foreground mb-2 font-headline">
                        Privacy Inquiries
                    </h3>
                    <p className="text-muted-foreground mb-3 font-body">
                        For questions about your data, privacy rights, or this
                        policy:
                    </p>
                    <a
                        href={`mailto:${email}`}
                        className="text-primary hover:text-primary/80 font-medium transition-colors font-body inline-flex items-center space-x-2"
                    >
                        <span>{email}</span>
                        <Icon name="ArrowTopRightOnSquareIcon" size={16} />
                    </a>
                    <p className="text-sm text-muted-foreground mt-2 font-body">
                        {responseTime}
                    </p>
                </div>
            </div>
        </div>
    );
}
