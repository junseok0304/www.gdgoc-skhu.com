// 📄 next.config.js

const withPlugins = require('next-compose-plugins');
const withTM = require('next-transpile-modules')([
  'three',
  '@react-three/fiber',
  '@react-three/drei',
]);
const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
});
const CompressionPlugin = require('compression-webpack-plugin');

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  compiler: {
    emotion: true, // ✅ Emotion SSR
  },
  experimental: {
    esmExternals: 'loose', // ✅ ESM 패키지(three 등) 허용
  },
  webpack: (config, { dev }) => {
    // ⛔️ 개발 환경에서는 압축 비활성화
    if (!dev) {
      config.plugins.push(new CompressionPlugin());
    }

    // ✅ Node 전용 fs 모듈이 three 내부에서 호출되는 문제 방지
    config.resolve.fallback = { fs: false };

    return config;
  },
};

module.exports = withPlugins([[withTM], [withBundleAnalyzer]], nextConfig);
