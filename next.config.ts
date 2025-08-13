import type { NextConfig } from "next";

const nextConfig: NextConfig = {

};

module.exports = {
    headers: async () => [
        {
            source: '/(.*).(mp4|webm)',
            headers: [
                {
                    key: 'Cache-Control',
                    value: 'public, max-age=31536000, immutable'
                }
            ],
        },
    ],
}

export default nextConfig;
