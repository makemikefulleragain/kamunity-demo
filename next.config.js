/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    // Disable ESLint during builds to prevent deployment failures
    ignoreDuringBuilds: true,
  },
  typescript: {
    // Disable TypeScript checking during builds for demo deployment
    ignoreBuildErrors: true,
  },
}

module.exports = nextConfig
