"use client";

import { Suspense } from "react";
import {
    SignedOut as ClerkSignedOut,
    SignedIn as ClerkSignedIn,
} from "@clerk/nextjs";

export const SignedOut = ({ children }: { children: React.ReactNode }) => {
    return (
        <Suspense>
            <ClerkSignedOut>
                {children}
            </ClerkSignedOut>
        </Suspense>
    );
};

export const SignedIn = ({ children }: { children: React.ReactNode }) => {
    return (
        <Suspense>
            <ClerkSignedIn>
                {children}
            </ClerkSignedIn>
        </Suspense>
    );
};
