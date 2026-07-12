/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    return [
      {
        source: '/api/spring/:path*',
        destination: 'http://localhost:8080/api/:path*',
      },
      {
        source: '/study/architecture-notes',
        destination: '/study/architecture-notes.html',
      },
    ]
  },
}

module.exports = nextConfig
