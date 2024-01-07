/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  webpack: function (config, options) {
    if (!options.isServer) {
      config.resolve.fallback.fs = false;
    }
    config.experiments = { layers: true, asyncWebAssembly: true };
    return config;
  },
};

module.exports = nextConfig;
