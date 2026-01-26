"use client";

import { useState } from "react";
import Header from "@/components/common/Header";
import Footer from "@/components/common/Footer";
import MainLandingInteractive from "@/app/components/MainLandingInteractive";
import SignIn from "@/components/common/SignIn";
import { useSignInModal } from "@/hooks/useSignIn";
import { PreparedData } from "@/components/utils/prepareInformation";

export default function PageClient({
    initialData,
}: {
    initialData: PreparedData;
}) {
    const {
        isOpen: isSignInOpen,
        open: openSignIn,
        close: closeSignIn,
    } = useSignInModal();

    return (
        <div
            style={{
                display: "flex",
                flexDirection: "column",
                minHeight: "100vh",
                position: "relative",
            }}
        >
            <Header onLoginClick={openSignIn} />
            <main id="main-content" role="main">
                <MainLandingInteractive
                    onLoginClick={openSignIn}
                    totalGenerations={initialData.totalGenerations}
                    limitations={initialData.limitations}
                    cvInformation={initialData.cvInformation}
                    currentPlan={initialData.currentPlan}
                />
            </main>
            <Footer />
            <SignIn isOpen={isSignInOpen} onClose={closeSignIn} />
        </div>
    );
}
