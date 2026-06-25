import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // 静的エクスポート（out/ にHTML/CSS/JSを出力）。nginx 等で配信可能。
  output: "export",
  // 国旗は flagcdn を <img> で直接参照するため、画像最適化は不要。
  images: { unoptimized: true },
};

export default nextConfig;
