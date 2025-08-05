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
}

module.exports = nextConfig
