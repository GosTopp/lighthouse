/** @type {import('next').NextConfig} */
module.exports = {
  eslint: {
    // 忽略 ESLint 错误以允许构建继续
    ignoreDuringBuilds: true
  },
  devIndicators: {
    position: "bottom-right",
  },
};
