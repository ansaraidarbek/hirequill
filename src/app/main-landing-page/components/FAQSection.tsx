"use client";

import { useState } from "react";
import Icon from "@/components/ui/AppIcon";

interface FAQ {
    id: number;
    question: string;
    answer: string;
}

const FAQSection = () => {
    const [openFAQ, setOpenFAQ] = useState<number | null>(0);

    const faqs: FAQ[] = [
        {
            id: 1,
            question: "How does the AI generate cover letters?",
            answer: "Our AI analyzes your CV and the job description to identify key skills, experiences, and requirements. It then crafts a personalized cover letter that highlights your most relevant qualifications while matching the company's tone and culture. The process takes less than 10 seconds and produces professional, human-quality writing.",
        },
        {
            id: 2,
            question: "Can I edit the generated cover letters?",
            answer: "Absolutely! While our AI generates high-quality letters, you have full control to edit, customize, and refine any part of the content. You can adjust the tone, add specific details, or modify sections to better match your voice. Every letter is yours to personalize as needed.",
        },
        {
            id: 3,
            question: "How many cover letters can I generate?",
            answer: "Free users get 3 cover letters per month to test the service. Monthly plan subscribers get unlimited generations with no restrictions. Most users apply to 30-60 jobs per month, and our unlimited plan supports high-volume job searching without limits.",
        },
        {
            id: 4,
            question: "Is my data secure and private?",
            answer: "Yes, your data security is our top priority. All uploads are encrypted using industry-standard SSL/TLS protocols. We never share your CV or personal information with third parties. You maintain full ownership of all generated content, and you can delete your data at any time. We're fully GDPR compliant.",
        },
        {
            id: 5,
            question: "What file formats do you support?",
            answer: "We accept CV uploads in PDF, DOC, and DOCX formats up to 5MB. Generated cover letters can be downloaded as PDF or copied directly to your clipboard for easy pasting into application forms. We also support plain text export for ATS-friendly submissions.",
        },
        {
            id: 6,
            question: "How long does it take to generate a cover letter?",
            answer: "Most cover letters are generated in under 10 seconds. The exact time depends on the length of your CV and job description, but our average generation time is 8 seconds. Monthly subscribers get priority processing for even faster results during peak times.",
        },
        {
            id: 8,
            question: "Do the cover letters pass ATS systems?",
            answer: "Yes, our AI generates ATS-friendly cover letters that use standard formatting and relevant keywords from the job description. The letters are designed to pass automated screening systems while still being engaging and personalized for human reviewers.",
        },
    ];

    const toggleFAQ = (id: number) => {
        setOpenFAQ(openFAQ === id ? null : id);
    };

    return (
        <section
            id="faq"
            className="py-20 lg:py-32 bg-gradient-to-br from-background via-secondary/5 to-background"
        >
            <div className="container mx-auto px-4 lg:px-8">
                <div className="text-center mb-16">
                    <div className="inline-flex items-center space-x-2 px-4 py-2 bg-trust/10 rounded-full border border-trust/20 mb-6">
                        <Icon
                            name="QuestionMarkCircleIcon"
                            size={16}
                            className="text-trust"
                            variant="solid"
                        />
                        <span className="text-sm font-medium text-trust font-body">
                            Got Questions?
                        </span>
                    </div>
                    <h2 className="text-3xl lg:text-5xl font-bold text-foreground mb-4 font-headline">
                        Frequently Asked Questions
                    </h2>
                    <p className="text-lg text-muted-foreground max-w-2xl mx-auto font-body">
                        Everything you need to know about CoverCraft AI
                    </p>
                </div>

                <div className="max-w-3xl mx-auto space-y-4">
                    {faqs.map((faq) => (
                        <div
                            key={faq.id}
                            className="bg-card rounded-xl shadow-md border border-border overflow-hidden transition-all duration-300 hover:shadow-lg"
                        >
                            <button
                                onClick={() => toggleFAQ(faq.id)}
                                className="w-full px-6 py-5 flex items-center justify-between text-left hover:bg-muted/50 transition-colors"
                            >
                                <span className="text-lg font-semibold text-foreground pr-4 font-headline">
                                    {faq.question}
                                </span>
                                <Icon
                                    name="ChevronDownIcon"
                                    size={24}
                                    className={`text-muted-foreground flex-shrink-0 transition-transform duration-300 ${
                                        openFAQ === faq.id ? "rotate-180" : ""
                                    }`}
                                />
                            </button>

                            <div
                                className={`overflow-hidden transition-all duration-300 ${
                                    openFAQ === faq.id ? "max-h-96" : "max-h-0"
                                }`}
                            >
                                <div className="px-6 pb-5 pt-2">
                                    <p className="text-muted-foreground leading-relaxed font-body">
                                        {faq.answer}
                                    </p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="mt-16 text-center">
                    <p className="text-muted-foreground mb-6 font-body">
                        Still have questions?
                    </p>
                    <button className="px-8 py-4 bg-card text-foreground border-2 border-border rounded-lg font-semibold hover:border-primary transition-all duration-200 font-cta inline-flex items-center space-x-2">
                        <Icon name="ChatBubbleLeftRightIcon" size={20} />
                        <span>Contact Support</span>
                    </button>
                </div>
            </div>
        </section>
    );
};

export default FAQSection;
