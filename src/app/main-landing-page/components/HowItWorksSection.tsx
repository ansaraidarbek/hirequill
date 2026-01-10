import Icon from "@/components/ui/AppIcon";

interface Step {
    id: number;
    title: string;
    description: string;
    icon: string;
}

const HowItWorksSection = () => {
    const steps: Step[] = [
        {
            id: 1,
            title: "Upload Your CV",
            description:
                "Drag and drop your resume or paste your LinkedIn profile. Our AI analyzes your experience, skills, and achievements in seconds.",
            icon: "DocumentArrowUpIcon",
        },
        {
            id: 2,
            title: "Paste Job Description",
            description:
                "Copy the job posting URL or paste the description. Our AI identifies key requirements and company culture signals.",
            icon: "ClipboardDocumentCheckIcon",
        },
        {
            id: 3,
            title: "AI Generates Letter",
            description:
                "Our advanced AI crafts a personalized cover letter that highlights your relevant experience and matches the job requirements perfectly.",
            icon: "SparklesIcon",
        },
        {
            id: 4,
            title: "Review & Download",
            description:
                "Get your professional cover letter in 10 seconds. Edit if needed, then download as PDF or copy to clipboard.",
            icon: "ArrowDownTrayIcon",
        },
    ];

    return (
        <section id="how-it-works" className="py-20 bg-background">
            <div className="container mx-auto px-4 lg:px-8">
                <div className="text-center mb-16">
                    <div className="inline-flex items-center space-x-2 px-4 py-2 bg-secondary/10 rounded-full border border-secondary/20 mb-6">
                        <Icon
                            name="LightBulbIcon"
                            size={16}
                            className="text-secondary"
                            variant="solid"
                        />
                        <span className="text-sm font-medium text-secondary font-body">
                            Simple Process
                        </span>
                    </div>
                    <h2 className="text-3xl lg:text-5xl font-bold text-foreground mb-4 font-headline">
                        How It Works
                    </h2>
                    <p className="text-lg text-muted-foreground max-w-2xl mx-auto font-body">
                        From upload to download in less than 10 seconds. No
                        writing, no stress, no burnout.
                    </p>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {steps.map((step, index) => (
                        <div key={step.id} className="relative">
                            {index < steps.length - 1 && (
                                <div className="hidden lg:block absolute top-12 left-full w-full h-0.5 bg-gradient-to-r from-primary/50 to-transparent -translate-x-1/2 z-0"></div>
                            )}

                            <div className="relative bg-card rounded-2xl p-8 shadow-lg border border-border hover:shadow-xl transition-all duration-300 hover:-translate-y-1 h-full">
                                <div className="w-16 h-16 bg-gradient-to-br from-primary to-secondary rounded-xl flex items-center justify-center mb-6 shadow-lg">
                                    <Icon
                                        name={step.icon as any}
                                        size={32}
                                        className="text-white"
                                        variant="solid"
                                    />
                                </div>

                                <div className="absolute top-6 right-6 w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                                    <span className="text-sm font-bold text-primary font-headline">
                                        {step.id}
                                    </span>
                                </div>

                                <h3 className="text-xl font-semibold text-foreground mb-3 font-headline">
                                    {step.title}
                                </h3>
                                <p className="text-muted-foreground font-body leading-relaxed">
                                    {step.description}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default HowItWorksSection;
