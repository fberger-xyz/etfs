/** @type {import('next').NextConfig} */
const nextConfig = {
    images: { remotePatterns: [{ hostname: '*' }] },
    experimental: { serverComponentsExternalPackages: ['grammy'] },
}

export default nextConfig;
