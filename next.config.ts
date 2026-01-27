import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    productionBrowserSourceMaps: false, // Disable for better performance
    distDir: process.env.DIST_DIR || ".next",
    typescript: {
        ignoreBuildErrors: true,
    },
    eslint: {
        ignoreDuringBuilds: true,
    },
    // Performance optimizations
    compress: true,
    poweredByHeader: false, // Remove X-Powered-By header for security
    reactStrictMode: true,
    // Image optimization
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
        formats: ["image/avif", "image/webp"], // Modern image formats
        deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
        imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
        minimumCacheTTL: 60,
    },
    // Headers for SEO and security
    async headers() {
        return [
            {
                source: "/:path*",
                headers: [
                    {
                        key: "X-DNS-Prefetch-Control",
                        value: "on",
                    },
                    {
                        key: "X-Frame-Options",
                        value: "SAMEORIGIN",
                    },
                    {
                        key: "X-Content-Type-Options",
                        value: "nosniff",
                    },
                    {
                        key: "Referrer-Policy",
                        value: "origin-when-cross-origin",
                    },
                ],
            },
        ];
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
