/** @type {import('next').NextConfig} */
const nextConfig = {
  // 검증 빌드는 dev 서버와 다른 폴더에 쓴다. 같은 .next 를 쓰면 빌드가 dev 를 500 으로 만들고
  // dev 가 빌드를 깨뜨린다. verify.sh 가 NEXT_DIST_DIR=.next-verify 로 부른다. Vercel 은 기본값
  distDir: process.env.NEXT_DIST_DIR || '.next',
  async rewrites() {
    return [
      {
        source: '/study/:slug',
        destination: '/study/:slug.html',
      },
      {
        source: '/docrules/hwp-excel-rules',
        destination: '/docrules/hwp-excel-rules.html',
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
        source: '/tools/:path*',
        destination: '/toolbox/tools/:path*',
      },
    ]
  },
}

module.exports = nextConfig
