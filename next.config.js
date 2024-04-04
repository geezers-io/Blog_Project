/** @type {import('next').NextConfig} */

const nextConfig = {
  reactStrictMode: true, //application 내에서 문제가 일어날 수 있는 부분에 대한 경고를 알려주는 기능
  swcMinify: true, //Terser handling
};

module.exports = nextConfig;
