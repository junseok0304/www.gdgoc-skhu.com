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
  experimental: {
    esmExternals: 'loose', // ✅ ESM 패키지 허용
  },
  webpack: (config) => {
    config.resolve.fallback = { fs: false };
    return config;
  },
};

module.exports = nextConfig;

module.exports = withPlugins([[withTM], [withBundleAnalyzer]], nextConfig);
