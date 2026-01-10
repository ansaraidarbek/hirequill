"use client";

import { SignOutButton } from "@clerk/nextjs";
import { SignedIn, SignedOut } from "@/services/clerk/components/SignInStatus";

interface AuthButtonProps {
    onLoginClick: () => void;
    className?: string;
    onMobileClick?: () => void;
}

const AuthButton = ({
    onLoginClick,
    className = "",
    onMobileClick,
}: AuthButtonProps) => {
    const baseButtonClass =
        "px-6 py-2.5 text-sm font-semibold text-primary-foreground bg-destructive rounded-md hover:shadow-lg hover:scale-105 transition-all duration-200 font-cta";

    const handleClick = () => {
        if (onMobileClick) {
            onMobileClick();
        }
    };

    return (
        <>
            <SignedOut>
                <button
                    onClick={() => {
                        handleClick();
                        onLoginClick();
                    }}
                    className={`${baseButtonClass} ${className}`}
                >
                    Login
                </button>
            </SignedOut>
            <SignedIn>
                <SignOutButton>
                    <button
                        onClick={handleClick}
                        className={`${baseButtonClass} ${className}`}
                    >
                        Logout
                    </button>
                </SignOutButton>
            </SignedIn>
        </>
    );
};

export default AuthButton;
