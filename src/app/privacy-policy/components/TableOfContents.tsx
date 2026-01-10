"use client";

import { useState, useEffect } from "react";
import Icon from "@/components/ui/AppIcon";

interface TOCItem {
    id: string;
    title: string;
}

interface TableOfContentsProps {
    items: TOCItem[];
}

export default function TableOfContents({ items }: TableOfContentsProps) {
    const [isHydrated, setIsHydrated] = useState(false);
    const [activeSection, setActiveSection] = useState<string>("");
    const [isOpen, setIsOpen] = useState(false);

    useEffect(() => {
        setIsHydrated(true);
    }, []);

    useEffect(() => {
        if (!isHydrated) return;

        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        setActiveSection(entry.target.id);
                    }
                });
            },
            { rootMargin: "-100px 0px -80% 0px" }
        );

        items.forEach((item) => {
            const element = document.getElementById(item.id);
            if (element) observer.observe(element);
        });

        return () => observer.disconnect();
    }, [items, isHydrated]);

    const scrollToSection = (id: string) => {
        if (!isHydrated) return;

        const element = document.getElementById(id);
        if (element) {
            element.scrollIntoView({ behavior: "smooth", block: "start" });
            setIsOpen(false);
        }
    };

    if (!isHydrated) {
        return (
            <div className="lg:sticky lg:top-24 bg-card rounded-lg border border-border p-6">
                <h3 className="text-lg font-semibold text-foreground mb-4 font-headline">
                    Table of Contents
                </h3>
                <nav>
                    <ul className="space-y-2">
                        {items.map((item) => (
                            <li key={item.id}>
                                <span className="text-sm text-muted-foreground font-body block py-1">
                                    {item.title}
                                </span>
                            </li>
                        ))}
                    </ul>
                </nav>
            </div>
        );
    }

    return (
        <>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="lg:hidden fixed bottom-6 right-6 z-50 bg-primary text-primary-foreground rounded-full p-4 shadow-lg hover:shadow-xl transition-all duration-200"
                aria-label="Toggle table of contents"
            >
                <Icon
                    name={isOpen ? "XMarkIcon" : "ListBulletIcon"}
                    size={24}
                />
            </button>

            {isOpen && (
                <div
                    className="lg:hidden fixed inset-0 bg-black/50 z-40"
                    onClick={() => setIsOpen(false)}
                />
            )}

            <div
                className={`
        lg:sticky lg:top-24 bg-card rounded-lg border border-border p-6
        lg:block ${
            isOpen ? "fixed bottom-24 right-6 left-6 z-50 shadow-xl" : "hidden"
        }
      `}
            >
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-foreground font-headline">
                        Table of Contents
                    </h3>
                    {isOpen && (
                        <button
                            onClick={() => setIsOpen(false)}
                            className="lg:hidden text-muted-foreground hover:text-foreground"
                            aria-label="Close table of contents"
                        >
                            <Icon name="XMarkIcon" size={20} />
                        </button>
                    )}
                </div>
                <nav>
                    <ul className="space-y-2 max-h-[60vh] overflow-y-auto">
                        {items.map((item) => (
                            <li key={item.id}>
                                <button
                                    onClick={() => scrollToSection(item.id)}
                                    className={`
                    text-sm font-body block py-1 px-3 rounded transition-colors text-left w-full
                    ${
                        activeSection === item.id
                            ? "text-primary bg-primary/10 font-medium"
                            : "text-muted-foreground hover:text-foreground hover:bg-muted"
                    }
                  `}
                                >
                                    {item.title}
                                </button>
                            </li>
                        ))}
                    </ul>
                </nav>
            </div>
        </>
    );
}
