
/** @type {import('next').NextConfig} */
const nextConfig = {
    // Enable standalone output for optimized builds
    output: 'standalone',

    // Disable ESLint checking during builds
    eslint: {
        ignoreDuringBuilds: true,
    },

    // Disable TypeScript error checking during builds
    typescript: {
        ignoreBuildErrors: true,
    },

    // Image configuration
    images: {
        // Optional: Configure domains if you're loading images from external sources
        // domains: ['example.com'],

        // Optional: Increase image size limit if needed
        // minimumCacheTTL: 60,
    },

    // Optional: Add any other Next.js configurations you need here

    // Optional: Configure rewrites/redirects if needed
    // async rewrites() {
    //   return [];
    // },
}

module.exports = nextConfig
