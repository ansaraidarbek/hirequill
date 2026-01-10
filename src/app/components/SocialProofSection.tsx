"use client";

import { useState, useEffect } from "react";
import Icon from "@/components/ui/AppIcon";

interface Testimonial {
    id: number;
    name: string;
    role: string;
    content: string;
    rating: number;
    metric: string;
}

interface Stat {
    id: number;
    value: string;
    label: string;
    icon: string;
}

const SocialProofSection = () => {
    const [isHydrated, setIsHydrated] = useState(false);
    const [currentTestimonial, setCurrentTestimonial] = useState(0);

    useEffect(() => {
        setIsHydrated(true);
    }, []);

    const testimonials: Testimonial[] = [
        {
            id: 1,
            name: "Sarah M.",
            role: "Marketing Manager",
            content:
                "I applied to 47 jobs in two weeks without burning out. The AI understood my experience perfectly and tailored each letter to the role. Got 12 interviews and accepted an offer within a month.",
            rating: 5,
            metric: "47 applications in 2 weeks",
        },
        {
            id: 2,
            name: "James K.",
            role: "Software Engineer",
            content:
                "As someone who hates writing cover letters, this is a game-changer. The quality is better than what I'd write myself, and it takes literally 10 seconds. Worth every penny.",
            rating: 5,
            metric: "10 seconds per letter",
        },
        {
            id: 3,
            name: "Maria L.",
            role: "Product Designer",
            content:
                "I was skeptical about AI-generated letters, but these are genuinely good. They sound natural, highlight the right experience, and I've had a 40% response rate from applications.",
            rating: 5,
            metric: "40% response rate",
        },
        {
            id: 4,
            name: "David R.",
            role: "Sales Executive",
            content:
                "The relief of not having to write another cover letter is incredible. I can focus my energy on interview prep instead of repetitive writing. Finished my job search in 3 weeks.",
            rating: 5,
            metric: "Job offer in 3 weeks",
        },
    ];

    const stats: Stat[] = [
        {
            id: 1,
            value: "147K+",
            label: "Cover Letters Generated",
            icon: "DocumentTextIcon",
        },
        {
            id: 2,
            value: "< 10s",
            label: "Average Generation Time",
            icon: "ClockIcon",
        },
        {
            id: 3,
            value: "35%",
            label: "Higher Response Rate",
            icon: "ChartBarIcon",
        },
        {
            id: 4,
            value: "4.9/5",
            label: "User Satisfaction",
            icon: "StarIcon",
        },
    ];

    useEffect(() => {
        if (!isHydrated) return;

        const interval = setInterval(() => {
            setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
        }, 6000);

        return () => clearInterval(interval);
    }, [isHydrated, testimonials.length]);

    return (
        <section className="py-20 bg-background" id="testimonials">
            <div className="container mx-auto px-4 lg:px-8">
                <div className="text-center mb-16">
                    <div className="inline-flex items-center space-x-2 px-4 py-2 bg-accent/10 rounded-full border border-accent/20 mb-6">
                        <Icon
                            name="UserGroupIcon"
                            size={16}
                            className="text-accent"
                            variant="solid"
                        />
                        <span className="text-sm font-medium text-accent font-body">
                            Trusted by Job Seekers
                        </span>
                    </div>
                    <h2 className="text-3xl lg:text-5xl font-bold text-foreground mb-4 font-headline">
                        Stop Writing Cover Letters. Start Getting Interviews.
                    </h2>
                    <p className="text-lg text-muted-foreground max-w-2xl mx-auto font-body">
                        Join thousands who've transformed their job search from
                        overwhelming to manageable
                    </p>
                </div>

                <div className="grid lg:grid-cols-4 gap-6 mb-16">
                    {stats.map((stat) => (
                        <div
                            key={stat.id}
                            className="bg-card rounded-xl p-6 shadow-lg border border-border text-center hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
                        >
                            <div className="w-12 h-12 bg-gradient-to-br from-primary to-secondary rounded-lg flex items-center justify-center mx-auto mb-4">
                                <Icon
                                    name={stat.icon as any}
                                    size={24}
                                    className="text-white"
                                    variant="solid"
                                />
                            </div>
                            <div className="text-3xl font-bold text-foreground mb-2 font-headline">
                                {stat.value}
                            </div>
                            <div className="text-sm text-muted-foreground font-body">
                                {stat.label}
                            </div>
                        </div>
                    ))}
                </div>

                <div className="max-w-4xl mx-auto">
                    <div className="bg-card rounded-2xl shadow-2xl border border-border p-8 lg:p-12 relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-primary/10 to-secondary/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>

                        <div className="relative">
                            {isHydrated && (
                                <>
                                    <div className="flex items-center justify-center mb-6">
                                        {[
                                            ...Array(
                                                testimonials[currentTestimonial]
                                                    .rating
                                            ),
                                        ].map((_, i) => (
                                            <Icon
                                                key={i}
                                                name="StarIcon"
                                                size={24}
                                                className="text-warning"
                                                variant="solid"
                                            />
                                        ))}
                                    </div>

                                    <blockquote className="text-lg lg:text-xl text-foreground text-center mb-8 font-body leading-relaxed">
                                        "
                                        {
                                            testimonials[currentTestimonial]
                                                .content
                                        }
                                        "
                                    </blockquote>

                                    <div className="text-center mb-6">
                                        <div className="font-semibold text-foreground font-headline">
                                            {
                                                testimonials[currentTestimonial]
                                                    .name
                                            }
                                        </div>
                                        <div className="text-sm text-muted-foreground font-body">
                                            {
                                                testimonials[currentTestimonial]
                                                    .role
                                            }
                                        </div>
                                    </div>

                                    <div className="flex items-center justify-center space-x-2">
                                        <Icon
                                            name="ChartBarIcon"
                                            size={16}
                                            className="text-accent"
                                        />
                                        <span className="text-sm font-medium text-accent font-body">
                                            {
                                                testimonials[currentTestimonial]
                                                    .metric
                                            }
                                        </span>
                                    </div>

                                    <div className="flex items-center justify-center space-x-2 mt-8">
                                        {testimonials.map((_, index) => (
                                            <button
                                                key={index}
                                                onClick={() =>
                                                    setCurrentTestimonial(index)
                                                }
                                                className={`w-2 h-2 rounded-full transition-all duration-300 ${
                                                    index === currentTestimonial
                                                        ? "bg-primary w-8"
                                                        : "bg-border"
                                                }`}
                                                aria-label={`View testimonial ${
                                                    index + 1
                                                }`}
                                            />
                                        ))}
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                </div>

                <div className="mt-16 text-center">
                    <div className="inline-flex items-center space-x-3 px-6 py-4 bg-muted rounded-full">
                        <Icon
                            name="ShieldCheckIcon"
                            size={24}
                            className="text-accent"
                            variant="solid"
                        />
                        <span className="text-sm font-medium text-foreground font-body">
                            Your data is encrypted • GDPR compliant • You own
                            every letter
                        </span>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default SocialProofSection;
