"use client";

import { useState } from "react";
import Header from "@/components/common/Header";
import Footer from "@/components/common/Footer";
import MainLandingInteractive from "@/app/components/MainLandingInteractive";
import SignIn from "@/components/common/SignIn";

export default function PageClient() {
    const [isSignInOpen, setIsSignInOpen] = useState(false);

    const handleLoginClick = () => {
        setIsSignInOpen(true);
    };

    return (
        <>
            <Header onLoginClick={handleLoginClick} />
            <MainLandingInteractive />
            <Footer />
            <SignIn isOpen={isSignInOpen} onClose={() => setIsSignInOpen(false)} />
        </>
    );
}
