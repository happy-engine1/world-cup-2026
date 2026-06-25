import type { Metadata } from "next";
import "./globals.css";
import { I18nProvider } from "@/i18n/I18nProvider";

export const metadata: Metadata = {
  title: "世界杯2026 对阵图（非官方·球迷制作）",
  description:
    "非官方球迷制作网站，包含2026美加墨世界杯淘汰赛对阵图与各组排名。与赛事主办方无关。",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="zh">
      <body>
        <I18nProvider>{children}</I18nProvider>
      </body>
    </html>
  );
}
