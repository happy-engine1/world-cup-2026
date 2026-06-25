import type { Metadata } from "next";
import "./globals.css";
import { I18nProvider } from "@/i18n/I18nProvider";

export const metadata: Metadata = {
  title: "ワールドカップ2026 対戦トーナメント表（非公式・ファンメイド）",
  description:
    "2026年 北中米サッカー大会の対戦トーナメント表とグループ順位をまとめたファン制作の非公式サイト。大会主催者とは関係ありません。",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ja">
      <body>
        <I18nProvider>{children}</I18nProvider>
      </body>
    </html>
  );
}
