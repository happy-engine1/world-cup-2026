// FIFA World Cup 2026 — 48カ国 / 12グループのチーム情報とグループ戦の想定成績（固定データ）。
// flag は flagcdn.com のコード（ISO 3166-1 alpha-2、英国構成国は gb-eng / gb-sct を使用）。

import type { Lang } from "@/i18n/config";

export type GroupLetter =
  | "A" | "B" | "C" | "D" | "E" | "F"
  | "G" | "H" | "I" | "J" | "K" | "L";

export interface TeamRow {
  code: string; // 一意なチームコード（flagcdn コードと同一）
  nameJa: string;
  flag: string; // flagcdn コード
  group: GroupLetter;
  played: number;
  win: number;
  draw: number;
  loss: number;
  gf: number; // 得点
  ga: number; // 失点
  tcs: number; // フェアプレーポイント（0 が最良、マイナスほど警告/退場が多い）
  pts: number; // 勝点
}

// グループ戦が全試合（3試合）終了し、順位が確定しているグループ。
// （2026-06-28 時点: 全12組が3試合消化済み＝グループステージ完了）
export const FINAL_GROUPS = new Set<GroupLetter>([
  "A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L",
]);

export const GROUP_LETTERS: GroupLetter[] = [
  "A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L",
];

type Stat = Omit<TeamRow, "group">;

const r = (
  code: string,
  nameJa: string,
  played: number,
  win: number,
  draw: number,
  loss: number,
  gf: number,
  ga: number,
  tcs: number
): Stat => ({
  code,
  nameJa,
  flag: code,
  played,
  win,
  draw,
  loss,
  gf,
  ga,
  tcs,
  pts: win * 3 + draw,
});

// 各グループ（順序は任意。表示時に rankGroup でソートする）
// 実データ出典: FIFA公式 順位表（2026-06 時点のスナップショット）。
// TCS（Team Conduct Score＝フェアプレーポイント）も FIFA公式の値を反映。
const RAW: Record<GroupLetter, Stat[]> = {
  // --- 全12組 確定（グループステージ完了）---
  A: [
    r("mx", "メキシコ", 3, 3, 0, 0, 6, 0, -6),
    r("za", "南アフリカ", 3, 1, 1, 1, 2, 3, -13),
    r("kr", "韓国", 3, 1, 0, 2, 2, 3, -4),
    r("cz", "チェコ", 3, 0, 1, 2, 2, 6, -1),
  ],
  B: [
    r("ch", "スイス", 3, 2, 1, 0, 7, 3, -3),
    r("ca", "カナダ", 3, 1, 1, 1, 8, 3, -5),
    r("ba", "ボスニア・ヘルツェゴビナ", 3, 1, 1, 1, 5, 6, -10),
    r("qa", "カタール", 3, 0, 1, 2, 2, 10, -12),
  ],
  C: [
    r("br", "ブラジル", 3, 2, 1, 0, 7, 1, -5),
    r("ma", "モロッコ", 3, 2, 1, 0, 6, 3, -1),
    r("gb-sct", "スコットランド", 3, 1, 0, 2, 1, 4, -5),
    r("ht", "ハイチ", 3, 0, 0, 3, 2, 8, -7),
  ],
  E: [
    r("de", "ドイツ", 3, 2, 0, 1, 10, 4, -1),
    r("ci", "コートジボワール", 3, 2, 0, 1, 4, 2, -4),
    r("ec", "エクアドル", 3, 1, 1, 1, 2, 2, -5),
    r("cw", "キュラソー", 3, 0, 1, 2, 1, 9, -7),
  ],
  F: [
    r("nl", "オランダ", 3, 2, 1, 0, 10, 4, -3),
    r("jp", "日本", 3, 1, 2, 0, 7, 3, -1),
    r("se", "スウェーデン", 3, 1, 1, 1, 7, 7, -5),
    r("tn", "チュニジア", 3, 0, 0, 3, 2, 12, -1),
  ],
  D: [
    r("us", "アメリカ", 3, 2, 0, 1, 8, 4, -5),
    r("au", "オーストラリア", 3, 1, 1, 1, 2, 2, -5),
    r("py", "パラグアイ", 3, 1, 1, 1, 2, 4, -12),
    r("tr", "トルコ", 3, 1, 0, 2, 3, 5, -3),
  ],
  I: [
    r("fr", "フランス", 3, 3, 0, 0, 10, 2, -1),
    r("no", "ノルウェー", 3, 2, 0, 1, 8, 7, -1),
    r("sn", "セネガル", 3, 1, 0, 2, 8, 6, -2),
    r("iq", "イラク", 3, 0, 0, 3, 1, 12, -8),
  ],
  H: [
    r("es", "スペイン", 3, 2, 1, 0, 5, 0, -2),
    r("cv", "カーボベルデ", 3, 0, 3, 0, 2, 2, -4),
    r("uy", "ウルグアイ", 3, 0, 2, 1, 3, 4, -9),
    r("sa", "サウジアラビア", 3, 0, 2, 1, 1, 5, -6),
  ],
  G: [
    r("eg", "エジプト", 3, 1, 2, 0, 5, 3, -6),
    r("be", "ベルギー", 3, 1, 2, 0, 6, 2, -7),
    r("ir", "イラン", 3, 0, 3, 0, 3, 3, -6),
    r("nz", "ニュージーランド", 3, 0, 1, 2, 4, 10, -4),
  ],
  L: [
    r("gb-eng", "イングランド", 3, 2, 1, 0, 6, 2, -2),
    r("hr", "クロアチア", 3, 2, 0, 1, 5, 5, -2),
    r("gh", "ガーナ", 3, 1, 1, 1, 2, 2, -3),
    r("pa", "パナマ", 3, 0, 0, 3, 0, 4, -5),
  ],
  K: [
    r("co", "コロンビア", 3, 2, 1, 0, 4, 1, -4),
    r("pt", "ポルトガル", 3, 1, 2, 0, 6, 1, -4),
    r("cd", "コンゴ民主共和国", 3, 1, 1, 1, 4, 3, -5),
    r("uz", "ウズベキスタン", 3, 0, 0, 3, 2, 11, -4),
  ],
  J: [
    r("ar", "アルゼンチン", 3, 3, 0, 0, 8, 1, -2),
    r("at", "オーストリア", 3, 1, 1, 1, 6, 6, -4),
    r("dz", "アルジェリア", 3, 1, 1, 1, 5, 7, -1),
    r("jo", "ヨルダン", 3, 0, 0, 3, 3, 8, -4),
  ],
};

// group プロパティを付与した完全な行データ
export const GROUPS: Record<GroupLetter, TeamRow[]> = Object.fromEntries(
  (Object.keys(RAW) as GroupLetter[]).map((g) => [
    g,
    RAW[g].map((s) => ({ ...s, group: g })),
  ])
) as Record<GroupLetter, TeamRow[]>;

// 全チームをコードで引く
export const teamByCode: Record<string, TeamRow> = {};
for (const g of GROUP_LETTERS) {
  for (const t of GROUPS[g]) teamByCode[t.code] = t;
}

export function gd(t: TeamRow): number {
  return t.gf - t.ga;
}

// 順位ソート: 勝点 → 得失差 → 得点 → フェアプレー(TCS, 高いほど良) の順
export function rankGroup(g: GroupLetter): TeamRow[] {
  return [...GROUPS[g]].sort(
    (a, b) =>
      b.pts - a.pts ||
      gd(b) - gd(a) ||
      b.gf - a.gf ||
      b.tcs - a.tcs ||
      a.code.localeCompare(b.code)
  );
}

// 各国名の多言語表記（日本語は TeamRow.nameJa を使用）
export const TEAM_NAMES_INTL: Record<string, { en: string; zh: string; ko: string }> = {
  mx: { en: "Mexico", zh: "墨西哥", ko: "멕시코" },
  za: { en: "South Africa", zh: "南非", ko: "남아프리카공화국" },
  kr: { en: "South Korea", zh: "韩国", ko: "대한민국" },
  cz: { en: "Czechia", zh: "捷克", ko: "체코" },
  ca: { en: "Canada", zh: "加拿大", ko: "캐나다" },
  qa: { en: "Qatar", zh: "卡塔尔", ko: "카타르" },
  ch: { en: "Switzerland", zh: "瑞士", ko: "스위스" },
  ba: { en: "Bosnia & Herzegovina", zh: "波斯尼亚和黑塞哥维那", ko: "보스니아 헤르체고비나" },
  br: { en: "Brazil", zh: "巴西", ko: "브라질" },
  ma: { en: "Morocco", zh: "摩洛哥", ko: "모로코" },
  ht: { en: "Haiti", zh: "海地", ko: "아이티" },
  "gb-sct": { en: "Scotland", zh: "苏格兰", ko: "스코틀랜드" },
  us: { en: "United States", zh: "美国", ko: "미국" },
  py: { en: "Paraguay", zh: "巴拉圭", ko: "파라과이" },
  au: { en: "Australia", zh: "澳大利亚", ko: "호주" },
  tr: { en: "Türkiye", zh: "土耳其", ko: "튀르키예" },
  de: { en: "Germany", zh: "德国", ko: "독일" },
  cw: { en: "Curaçao", zh: "库拉索", ko: "쿠라사오" },
  ci: { en: "Côte d'Ivoire", zh: "科特迪瓦", ko: "코트디부아르" },
  ec: { en: "Ecuador", zh: "厄瓜多尔", ko: "에콰도르" },
  nl: { en: "Netherlands", zh: "荷兰", ko: "네덜란드" },
  jp: { en: "Japan", zh: "日本", ko: "일본" },
  tn: { en: "Tunisia", zh: "突尼斯", ko: "튀니지" },
  se: { en: "Sweden", zh: "瑞典", ko: "스웨덴" },
  be: { en: "Belgium", zh: "比利时", ko: "벨기에" },
  eg: { en: "Egypt", zh: "埃及", ko: "이집트" },
  ir: { en: "Iran", zh: "伊朗", ko: "이란" },
  nz: { en: "New Zealand", zh: "新西兰", ko: "뉴질랜드" },
  es: { en: "Spain", zh: "西班牙", ko: "스페인" },
  cv: { en: "Cape Verde", zh: "佛得角", ko: "카보베르데" },
  sa: { en: "Saudi Arabia", zh: "沙特阿拉伯", ko: "사우디아라비아" },
  uy: { en: "Uruguay", zh: "乌拉圭", ko: "우루과이" },
  fr: { en: "France", zh: "法国", ko: "프랑스" },
  iq: { en: "Iraq", zh: "伊拉克", ko: "이라크" },
  sn: { en: "Senegal", zh: "塞内加尔", ko: "세네갈" },
  no: { en: "Norway", zh: "挪威", ko: "노르웨이" },
  ar: { en: "Argentina", zh: "阿根廷", ko: "아르헨티나" },
  dz: { en: "Algeria", zh: "阿尔及利亚", ko: "알제리" },
  at: { en: "Austria", zh: "奥地利", ko: "오스트리아" },
  jo: { en: "Jordan", zh: "约旦", ko: "요르단" },
  cd: { en: "DR Congo", zh: "刚果民主共和国", ko: "콩고민주공화국" },
  pt: { en: "Portugal", zh: "葡萄牙", ko: "포르투갈" },
  uz: { en: "Uzbekistan", zh: "乌兹别克斯坦", ko: "우즈베키스탄" },
  co: { en: "Colombia", zh: "哥伦比亚", ko: "콜롬비아" },
  "gb-eng": { en: "England", zh: "英格兰", ko: "잉글랜드" },
  hr: { en: "Croatia", zh: "克罗地亚", ko: "크로아티아" },
  gh: { en: "Ghana", zh: "加纳", ko: "가나" },
  pa: { en: "Panama", zh: "巴拿马", ko: "파나마" },
};

// 指定言語のチーム名を返す（未定義時は日本語名 → コードへフォールバック）
export function teamName(code: string, lang: Lang): string {
  if (lang === "ja") return teamByCode[code]?.nameJa ?? code;
  return TEAM_NAMES_INTL[code]?.[lang] ?? teamByCode[code]?.nameJa ?? code;
}

export interface RankedThird {
  group: GroupLetter;
  team: TeamRow;
}

// 各グループ3位を「3位同士の比較ルール」で並べる:
//   勝点 → 得失点差 → 総得点 → フェアプレー(TCS) → （最後は組記号で安定化）
// ※3位同士は別グループのため直接対決が無く、当該チーム間比較のステップは省かれる。
// orderOf: 各グループの並び順を返す関数（予測時はユーザー指定順、既定は rankGroup）。
export function rankThirdsBy(
  orderOf: (g: GroupLetter) => TeamRow[]
): RankedThird[] {
  return GROUP_LETTERS.map((g) => ({ group: g, team: orderOf(g)[2] })).sort(
    (a, b) =>
      b.team.pts - a.team.pts ||
      gd(b.team) - gd(a.team) ||
      b.team.gf - a.team.gf ||
      b.team.tcs - a.team.tcs ||
      a.group.localeCompare(b.group)
  );
}

// 既定（実データ順）の3位ランキング
export function rankedThirds(): RankedThird[] {
  return rankThirdsBy(rankGroup);
}
