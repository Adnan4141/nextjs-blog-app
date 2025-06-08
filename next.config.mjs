/** @type {import('next').NextConfig} */
const nextConfig = {
     images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com',
     
      },
      {
        protocol: 'https',
        hostname: 'randomuser.me',
     
      },
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
     
      },
      {
        protocol: 'https',
        hostname: 'img.freepik.com',
     
      },
    ],
  },
};

export default nextConfig;
