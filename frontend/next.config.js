/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    return [
      {
        source: '/study/architecture-notes',
        destination: '/study/architecture-notes.html',
      },
      {
        source: '/game/limbus/simulator',
        destination: '/game/limbusCompany/fusion-simulator.html',
      },
      {
        source: '/game/limbus/ego-gifts',
        destination: '/game/limbusCompany/ego-gift-html/ego-universal-gifts.html',
      },
      {
        // ego-gifts 페이지가 이미지를 상대경로로 참조하므로 같은 깊이에서 매핑
        source: '/game/limbus/ego-gift-images/:path*',
        destination: '/game/limbusCompany/ego-gift-html/ego-gift-images/:path*',
      },
      {
        source: '/game/limbus/icons/:path*',
        destination: '/game/limbusCompany/ego-gift-html/icons/:path*',
      },
      {
        source: '/toolbox',
        destination: '/toolbox/toolbox.html',
      },
      {
        source: '/tools/:path*',
        destination: '/toolbox/tools/:path*',
      },
    ]
  },
}

module.exports = nextConfig
