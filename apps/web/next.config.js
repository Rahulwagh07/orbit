/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ["@repo/protocol", "@repo/db", "@repo/redis", "@repo/ui"],
};

export default nextConfig;
