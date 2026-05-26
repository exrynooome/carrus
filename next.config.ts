import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    cacheComponents: false,
    images: {
        remotePatterns: [
            {
                protocol: "https",
                hostname: "platform.cstatic-images.com",
            },
        ],
    },
};

export default nextConfig;
