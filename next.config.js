/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    domains: [
      "cdn-icons-png.flaticon.com",
      "avatars.githubusercontent.com",
      "cdn.discordapp.com",
      "media.discordapp.net",
      "www.moonlightspace.com",
      "localhost",
      "lh3.googleusercontent.com",
    ],
  },
  i18n: {
    locales: ["en"],
    defaultLocale: "en",
  },
};

module.exports = nextConfig;
