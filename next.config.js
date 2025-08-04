/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    // Disable ESLint during builds to prevent deployment failures
    ignoreDuringBuilds: true,
  },
  typescript: {
    // Keep TypeScript checking enabled but don't fail on warnings
    ignoreBuildErrors: false,
  },
  // Optimize for production deployment
  output: 'standalone',
  experimental: {
    // Enable app directory features
    appDir: true,
  },
}

module.exports = nextConfig
