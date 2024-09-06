/** @type {import('next').NextConfig} */


module.exports = {
  env: {
    EMAIL_USER: process.env.EMAIL_USER,
    EMAIL_PASS: process.env.EMAIL_PASS,
  },
  i18n: {
    locales: ["en", "vi"], // Danh sách các ngôn ngữ hỗ trợ
    defaultLocale: "en", // Ngôn ngữ mặc định
  },
  reactStrictMode: true,
};
