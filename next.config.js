/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    // 忽略 ESLint 错误以允许构建继续
    ignoreDuringBuilds: true
  },
  devIndicators: {
    position: "bottom-right",
  },
  // 添加重定向规则
  async redirects() {
    return [
      {
        source: '/',
        destination: '/dashboard',
        permanent: true,
      },
    ];
  },
};

module.exports = nextConfig;
