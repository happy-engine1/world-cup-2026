// 対応言語の定義（日本語 / 英語 / 中国語 / 韓国語）
export type Lang = "ja" | "en" | "zh" | "ko";

export const LANGS: { code: Lang; label: string }[] = [
  { code: "ja", label: "日本語" },
  { code: "en", label: "English" },
  { code: "zh", label: "中文" },
  { code: "ko", label: "한국어" },
];

export const DEFAULT_LANG: Lang = "zh";
export const STORAGE_KEY = "wc2026-lang";
