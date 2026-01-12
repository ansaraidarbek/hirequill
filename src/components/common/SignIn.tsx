"use client";

import { useEffect } from "react";
import { SignIn as ClerkSignIn, SignedOut } from "@clerk/nextjs";
import Icon from "@/components/ui/AppIcon";

interface SignInProps {
    isOpen: boolean;
    onClose: () => void;
}

const SignIn = ({ isOpen, onClose }: SignInProps) => {
    // Prevent body scroll when modal is open
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "unset";
        }

        return () => {
            document.body.style.overflow = "unset";
        };
    }, [isOpen]);

    // Close on Escape key
    useEffect(() => {
        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === "Escape" && isOpen) {
                onClose();
            }
        };

        if (isOpen) {
            window.addEventListener("keydown", handleEscape);
        }

        return () => {
            window.removeEventListener("keydown", handleEscape);
        };
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    return (
        <>
            <SignedOut>
                <div
                    className="fixed inset-0 z-[9999] flex items-center justify-center"
                    onClick={onClose}
                >
                    {/* Blurred Backdrop */}
                    <div
                        className="absolute inset-0 bg-black/50 backdrop-blur-md transition-opacity"
                        aria-hidden="true"
                    />

                    {/* Dialog Container */}
                    <div
                        className="relative z-10 w-full max-w-md mx-4 max-h-[90vh] overflow-y-auto"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Close Button */}
                        <button
                            onClick={onClose}
                            className="absolute -top-12 right-0 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors backdrop-blur-sm z-20"
                            aria-label="Close sign in dialog"
                        >
                            <Icon
                                name="XMarkIcon"
                                size={24}
                                className="text-white"
                            />
                        </button>

                        {/* Clerk SignIn Component */}
                        <div className="bg-card rounded-lg shadow-2xl p-6">
                            <ClerkSignIn
                                routing="hash"
                                appearance={{
                                    elements: {
                                        rootBox: "mx-auto",
                                        card: "shadow-none bg-transparent",
                                    },
                                }}
                            />
                        </div>
                    </div>
                </div>
            </SignedOut>
        </>
    );
};

export default SignIn;
