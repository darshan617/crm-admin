/** @type {import('next').NextConfig} */
const nextConfig = {
  // reactCompiler: true,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "stagingsuperadmin.tizzygroup.com",
        pathname: "/storage/**",
      },
    ],
  },
  reactStrictMode: true,
};

export default nextConfig;