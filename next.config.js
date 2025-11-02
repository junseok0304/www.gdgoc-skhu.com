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

const nextConfig = {
  reactStrictMode: true,
  compiler: {
    emotion: true, // ✅ Emotion SSR
  },
  webpack: (config, { dev }) => {
    // ⛔️ 개발 환경에서는 압축 비활성화
    if (!dev) {
      config.plugins.push(new CompressionPlugin());
    }
    return config;
  },
};

module.exports = withPlugins([[withTM], [withBundleAnalyzer]], nextConfig);
