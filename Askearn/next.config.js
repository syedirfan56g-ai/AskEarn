/** @type {import('next').NextConfig} */
const nextConfig = {
  // Remove output: 'export' for Netlify deployment
  // output: 'export',
  images: {
    unoptimized: true,
  },
  async rewrites() {
    // In production, API routes are handled by vercel.json
    // In development, proxy to local Express server
    if (process.env.NODE_ENV === 'development') {
      return [
        {
          source: '/api/:path*',
          destination: 'http://localhost:5000/api/:path*',
        },
      ]
    }
    return []
  },
}

module.exports = nextConfig