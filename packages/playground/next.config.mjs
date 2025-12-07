/** @type {import('next').NextConfig} */
const nextConfig = {
  // Webpack config to ignore test runners pulled in by dependencies
  webpack: (config, { isServer }) => {
    // Prevent 'fs' and other node modules from being bundled on client
    if (!isServer) {
        config.resolve.fallback = {
            ...config.resolve.fallback,
            fs: false,
            path: false,
            child_process: false,
            worker_threads: false,
            net: false,
            tls: false,
        };
    }

    // Ignore 'tap' and 'tape'
    // We can use IgnorePlugin or just alias them to false if they are not critical
    // Since we are in Webpack (Next 14 defaults to Webpack), alias works well.
    config.resolve.alias = {
        ...config.resolve.alias,
        tap: false,
        tape: false,
    };

    return config;
  },
};

export default nextConfig;

// added by create cloudflare to enable calling `getCloudflareContext()` in `next dev`
// import { initOpenNextCloudflareForDev } from '@opennextjs/cloudflare';
// initOpenNextCloudflareForDev();
