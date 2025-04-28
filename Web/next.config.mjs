/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    // domains: ["localhost", "picsum.photos", "cytktlrbanxiswqurqth.supabase.co", "*"],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'cytktlrbanxiswqurqth.supabase.co',
        port: '',
        pathname: '/storage/v1/object/public/**',
      },
      {
        protocol: 'https',
        hostname: 'picsum.photos',
        port: '',
        pathname: '/**',
      },
    ],
  },
  reactStrictMode: false,
};

export default nextConfig;
