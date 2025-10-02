/** @type {import('next').NextConfig} */
const nextConfig = {
  // Disable file system cache to avoid OneDrive symlink issues
  experimental: {
    // Remove deprecated turbo config
  },
  // Remove output standalone as it may cause issues
  // output: 'standalone',
};

module.exports = nextConfig;
