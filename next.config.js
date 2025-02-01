/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',  // Static HTML エクスポートを有効化
  images: {
    unoptimized: true,  // 静的エクスポート用に画像最適化を無効化
  },
  trailingSlash: true,
  basePath: '',
  assetPrefix: '',
  distDir: 'out',
}

module.exports = nextConfig 