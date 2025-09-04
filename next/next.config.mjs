/** @type {import('next').NextConfig} */
const isProd = process.env.GITHUB_PAGES === 'true'

const nextConfig = {
  experimental: { typedRoutes: true },
  reactStrictMode: true,
  output: 'export',
  images: { unoptimized: true },
  trailingSlash: true,
  basePath: isProd ? '/Portfolio' : '',
  assetPrefix: isProd ? '/Portfolio/' : ''
}

export default nextConfig

