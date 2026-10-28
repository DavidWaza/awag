/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      // Temporary: sourcing product/brand imagery from Unsplash until the
      // real CDN is provisioned. Swap for the CDN host below at launch.
      { protocol: 'https', hostname: 'images.unsplash.com' },
      // { protocol: 'https', hostname: 'cdn.abujagentleman.com' },
    ],
  },
};

export default nextConfig;
