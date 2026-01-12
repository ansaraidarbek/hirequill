import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    productionBrowserSourceMaps: true,
    distDir: process.env.DIST_DIR || ".next",
    typescript: {
        ignoreBuildErrors: true,
    },
    eslint: {
        ignoreDuringBuilds: true,
    },
    images: {
        remotePatterns: [
            {
                protocol: "https",
                hostname: "images.unsplash.com",
            },
            {
                protocol: "https",
                hostname: "images.pexels.com",
            },
            {
                protocol: "https",
                hostname: "images.pixabay.com",
            },
        ],
    },
    webpack(config) {
        config.module.rules.push({
            test: /\.(jsx|tsx)$/,
            exclude: [/node_modules/],
            use: [
                {
                    loader: "@dhiwise/component-tagger/nextLoader",
                },
            ],
        });
        return config;
    },
    allowedDevOrigins: [
        "unsystematized-unreprehensible-julienne.ngrok-free.dev",
        "*.ngrok-free.dev",
        "*.ngrok-free.app",
    ],
};

export default nextConfig;
