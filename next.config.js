/**
 * @type {import('next').NextConfig}
 */
const nextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'videomentor-images-users.s3.us-east-2.amazonaws.com',
        pathname: '**',
      },
    ],
  },
}

module.exports = nextConfig
