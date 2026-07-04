// 32チーム決勝トーナメントの構造。
// 32枚のリーフ（出場枠）を「ブラケット順」に並べ、完全二分木として扱う。
//   round 0 = ベスト32（16試合）, 1 = ベスト16, 2 = 準々決勝, 3 = 準決勝, 4 = 決勝
// 各リーフは groups の現順位から解決される。グループ1/2位は確定グループなら confirmed、
// それ以外（未確定グループの1/2位・全ての3位通過枠）は tentative（薄色表示）。

import { FINAL_GROUPS, GroupLetter, TeamRow, teamByCode } from "./groups";
import { Lang } from "@/i18n/config";

export interface SeedSlot {
  index: number; // 0..31 ブラケット順
  seedType: "1" | "2" | "third"; // 出場区分（1位 / 2位 / 3位通過）
  group: GroupLetter; // 出場元グループ（解決後）
  allowed?: GroupLetter[]; // 3位通過枠の許容グループ集合（例: C/E/F/H/I）
  team: TeamRow;
  confirmed: boolean;
}

// ベスト32のリーフ並び（ブラケット順 = 公式組み合わせ表に準拠、image-2.png 参照）。
// rank: グループ n 位 / third: 指定グループ集合のいずれかの3位通過枠。
type Leaf =
  | { kind: "rank"; pos: "1" | "2"; group: GroupLetter }
  | { kind: "third"; allowed: GroupLetter[] };

const rk = (pos: "1" | "2", group: GroupLetter): Leaf => ({ kind: "rank", pos, group });
const th = (...allowed: GroupLetter[]): Leaf => ({ kind: "third", allowed });

const LEAVES: Leaf[] = [
  // ===== 左半分 (leaves 0-15) =====
  rk("1", "E"), th("A", "B", "C", "D", "F"), // M0: E1 vs 3rd
  rk("1", "I"), th("C", "D", "F", "G", "H"), // M1: I1 vs 3rd
  rk("2", "A"), rk("2", "B"),                  // M2: A2 vs B2
  rk("1", "F"), rk("2", "C"),                  // M3: F1 vs C2
  rk("2", "K"), rk("2", "L"),                  // M4: K2 vs L2
  rk("1", "H"), rk("2", "J"),                  // M5: H1 vs J2
  rk("1", "D"), th("B", "E", "F", "I", "J"), // M6: D1 vs 3rd
  rk("1", "G"), th("A", "E", "H", "I", "J"), // M7: G1 vs 3rd
  // ===== 右半分 (leaves 16-31) =====
  rk("1", "C"), rk("2", "F"),                  // M8: C1 vs F2
  rk("2", "E"), rk("2", "I"),                  // M9: E2 vs I2
  rk("1", "A"), th("C", "E", "F", "H", "I"), // M10: A1 vs 3rd
  rk("1", "L"), th("E", "H", "I", "J", "K"), // M11: L1 vs 3rd
  rk("1", "J"), rk("2", "H"),                  // M12: J1 vs H2
  rk("2", "D"), rk("2", "G"),                  // M13: D2 vs G2
  rk("1", "B"), th("E", "F", "G", "I", "J"), // M14: B1 vs 3rd
  rk("1", "K"), th("D", "E", "I", "J", "L"), // M15: K1 vs 3rd
];

// 8つの3位通過枠に、上位8グループ（qualifying）を「各枠の許容集合」を満たすよう割当（二部マッチング）
function assignThirds(qualifying: GroupLetter[]): Record<number, GroupLetter> {
  const slots = LEAVES.map((l, i) =>
    l.kind === "third" ? { i, allowed: l.allowed } : null
  ).filter((s): s is { i: number; allowed: GroupLetter[] } => s !== null);

  // 選択肢の少ない枠から埋める（バックトラッキング）
  const order = [...slots].sort(
    (a, b) =>
      a.allowed.filter((g) => qualifying.includes(g)).length -
      b.allowed.filter((g) => qualifying.includes(g)).length
  );

  const result: Record<number, GroupLetter> = {};
  const used = new Set<GroupLetter>();
  const bt = (k: number): boolean => {
    if (k === order.length) return true;
    for (const g of qualifying) {
      if (!used.has(g) && order[k].allowed.includes(g)) {
        used.add(g);
        result[order[k].i] = g;
        if (bt(k + 1)) return true;
        used.delete(g);
        delete result[order[k].i];
      }
    }
    return false;
  };
  bt(0);
  return result;
}

// 現在のグループ順序と「3位通過の上位8グループ（順序付き）」からブラケットのシードを構築。
// FIFA公式（大会規定 Annex C）準拠の3位枠割当。
// キー = 通過した3位グループをソートした文字列。値 = リーフindex → 割当グループ。
// 該当する組合せがあれば公式表どおりに配置し、無ければ下の assignThirds（有効な自動割当）にフォールバック。
const OFFICIAL_THIRD_ASSIGNMENT: Record<string, Record<number, GroupLetter>> = {
  // 2026本大会の最終確定組合せ {B,D,E,F,I,J,K,L}（J組3位アルジェリアが通過、G組3位イランは敗退）
  "B,D,E,F,I,J,K,L": { 1: "D", 3: "F", 13: "B", 15: "I", 21: "E", 23: "K", 29: "J", 31: "L" },
  // 参考: J組終了前の暫定組合せ {B,D,E,F,G,I,K,L}
  "B,D,E,F,G,I,K,L": { 1: "D", 3: "F", 13: "B", 15: "I", 21: "E", 23: "K", 29: "G", 31: "L" },
};

//   orderOf(g): 各グループの順位順 TeamRow[]（予測時はユーザー指定、既定は rankGroup）
//   qualifyingThirds: 3位ランキング上位8グループ
export function computeSeeds(
  orderOf: (g: GroupLetter) => TeamRow[],
  qualifyingThirds: GroupLetter[]
): SeedSlot[] {
  const key = [...qualifyingThirds].sort().join(",");
  const official = OFFICIAL_THIRD_ASSIGNMENT[key];
  const thirdAssign = official ?? assignThirds(qualifyingThirds);
  return LEAVES.map((leaf, i): SeedSlot => {
    if (leaf.kind === "third") {
      const g = thirdAssign[i] ?? leaf.allowed[0]; // フォールバック
      return {
        index: i,
        seedType: "third",
        group: g,
        allowed: leaf.allowed,
        team: orderOf(g)[2],
        // 公式割当が使え、かつ全グループ確定なら3位通過も確定（暫定バッジを外す）
        confirmed: official !== undefined && FINAL_GROUPS.has(g),
      };
    }
    const team = orderOf(leaf.group)[leaf.pos === "1" ? 0 : 1];
    return {
      index: i,
      seedType: leaf.pos,
      group: leaf.group,
      team,
      confirmed: FINAL_GROUPS.has(leaf.group),
    };
  });
}

// ===== ノックアウトの実際の勝敗結果 =====
export interface KOResult {
  winner: string; // 勝者チームコード
  score: string; // 90分/延長のスコア（「teamA-teamB」の並び）
  pens?: string; // PK戦スコア（あれば、「teamA-teamB」）
}

// キー = `${round}-${match}`（round0=ベスト32 … round4=決勝）。teamA/teamB は computeBracket の並び。
// 出典: FIFA公式 試合結果（2026-06 時点のスナップショット）。
export const KO_RESULTS: Record<string, KOResult> = {
  "0-0": { winner: "py", score: "1-1", pens: "3-4" }, // ドイツ(E1) 1-1 パラグアイ(D3) PK3-4
  "0-1": { winner: "fr", score: "3-0" }, // フランス(I1) 3-0 スウェーデン(F3)
  "0-2": { winner: "ca", score: "0-1" }, // 南アフリカ(A2) 0-1 カナダ(B2)
  "0-3": { winner: "ma", score: "1-1", pens: "2-3" }, // オランダ(F1) 1-1 モロッコ(C2) PK2-3
  "0-4": { winner: "pt", score: "2-1" }, // ポルトガル(K2) 2-1 クロアチア(L2)
  "0-5": { winner: "es", score: "3-0" }, // スペイン(H1) 3-0 オーストリア(J2)
  "0-6": { winner: "us", score: "2-0" }, // アメリカ(D1) 2-0 ボスニア(B3)
  "0-7": { winner: "be", score: "3-2" }, // ベルギー(G1) 3-2 セネガル(I3)
  "0-8": { winner: "br", score: "2-1" }, // ブラジル(C1) 2-1 日本(F2)
  "0-9": { winner: "no", score: "1-2" }, // コートジボワール(E2) 1-2 ノルウェー(I2)
  "0-10": { winner: "mx", score: "2-0" }, // メキシコ(A1) 2-0 エクアドル(E3)
  "0-11": { winner: "gb-eng", score: "2-1" }, // イングランド(L1) 2-1 コンゴ民主(K3)
  "0-12": { winner: "ar", score: "3-2" }, // アルゼンチン(J1) 3-2 カーボベルデ(H2)
  "0-13": { winner: "eg", score: "1-1", pens: "2-4" }, // オーストラリア(D2) 1-1 エジプト(G2) PK2-4
  "0-14": { winner: "ch", score: "2-0" }, // スイス(B1) 2-0 アルジェリア(J3)
  "0-15": { winner: "co", score: "1-0" }, // コロンビア(K1) 1-0 ガーナ(L3)
  // 3位決定戦（両準決勝の敗者）。キーは "tp"。例: "tp": { winner: "...", score: "x-y" }
};

// 3位決定戦ノードのキー
export const THIRD_PLACE_KEY = "tp";

// ノックアウト1試合分のノード（参加2チーム・結果・勝者）。round0 は seeds、以降は子試合の勝者。
export interface MatchNode {
  round: number;
  match: number;
  teamA: TeamRow | null; // 左/上 の参加チーム（未定なら null）
  teamB: TeamRow | null; // 右/下 の参加チーム（未定なら null）
  result: KOResult | null;
  winner: TeamRow | null;
}

// seeds と実結果から全ノックアウト試合のノードを構築。
// useResults=false（予測モード）では結果を無視し、参加・勝者とも未定扱い（従来のプレースホルダ表示）。
export function computeBracket(
  seeds: SeedSlot[],
  useResults: boolean
): Record<string, MatchNode> {
  const nodes: Record<string, MatchNode> = {};
  const make = (
    round: number,
    match: number,
    a: TeamRow | null,
    b: TeamRow | null
  ): MatchNode => {
    const result = useResults ? KO_RESULTS[`${round}-${match}`] ?? null : null;
    let winner: TeamRow | null = null;
    if (result) {
      winner =
        a?.code === result.winner
          ? a
          : b?.code === result.winner
          ? b
          : teamByCode[result.winner] ?? null;
    }
    return { round, match, teamA: a, teamB: b, result, winner };
  };
  // ベスト32（round0）: 参加は seeds
  for (let m = 0; m < 16; m++) {
    nodes[`0-${m}`] = make(0, m, seeds[m * 2].team, seeds[m * 2 + 1].team);
  }
  // 以降のラウンドは子試合（2m, 2m+1）の勝者が参加
  for (let round = 1; round <= 4; round++) {
    const count = 32 / Math.pow(2, round + 1);
    for (let m = 0; m < count; m++) {
      const a = nodes[`${round - 1}-${m * 2}`].winner;
      const b = nodes[`${round - 1}-${m * 2 + 1}`].winner;
      nodes[`${round}-${m}`] = make(round, m, a, b);
    }
  }
  // 3位決定戦: 両準決勝（round3）の敗者が対戦
  const loserOf = (n: MatchNode): TeamRow | null =>
    n.result ? (n.winner?.code === n.teamA?.code ? n.teamB : n.teamA) : null;
  const tpA = loserOf(nodes["3-0"]);
  const tpB = loserOf(nodes["3-1"]);
  const tpResult = useResults ? KO_RESULTS[THIRD_PLACE_KEY] ?? null : null;
  let tpWinner: TeamRow | null = null;
  if (tpResult) {
    tpWinner =
      tpA?.code === tpResult.winner
        ? tpA
        : tpB?.code === tpResult.winner
        ? tpB
        : teamByCode[tpResult.winner] ?? null;
  }
  nodes[THIRD_PLACE_KEY] = {
    round: 3,
    match: -1,
    teamA: tpA,
    teamB: tpB,
    result: tpResult,
    winner: tpWinner,
  };
  return nodes;
}

// 試合ノードのスコア表示文字列（"1-1 (PK 3-4)" / "0-1"）。結果が無ければ空。
export function scoreText(node: MatchNode, pensLabel: string): string {
  if (!node.result) return "";
  return node.result.pens
    ? `${node.result.score} (${pensLabel} ${node.result.pens})`
    : node.result.score;
}

export const ROUND_NAMES = ["ベスト32", "ベスト16", "準々決勝", "準決勝", "決勝"];
export const TOTAL_ROUNDS = 5; // 0..4

// 各試合の日時（image-2.png 準拠、`${round}-${match}` 形式）
export const MATCH_DATES: Record<string, string> = {
  // ベスト32
  "0-0": "6/30 5:30", "0-1": "7/1 6:00", "0-2": "6/29 4:00", "0-3": "6/30 10:00",
  "0-4": "7/3 8:00", "0-5": "7/3 4:00", "0-6": "7/2 9:00", "0-7": "7/2 9:00",
  "0-8": "6/30 2:00", "0-9": "7/1 2:00", "0-10": "7/1 6:00", "0-11": "7/2 6:00",
  "0-12": "7/4 9:00", "0-13": "7/4 3:00", "0-14": "7/3 12:00", "0-15": "7/4 6:00",
  // ベスト16
  "1-0": "7/5 6:00", "1-1": "7/5 2:00", "1-2": "7/7 4:00", "1-3": "7/7 9:00",
  "1-4": "7/6 5:00", "1-5": "7/6 9:00", "1-6": "7/8 1:00", "1-7": "7/8 5:00",
  // 準々決勝
  "2-0": "7/10 5:00", "2-1": "7/11 4:00", "2-2": "7/12 6:00", "2-3": "7/12 10:00",
  // 準決勝
  "3-0": "7/15", "3-1": "7/16 4:00",
  // 決勝
  "4-0": "7/20 4:00",
};

// 3位決定戦の日付
export const THIRD_PLACE_DATE = "7/19";

// MATCH_DATES は日本時間(JST=UTC+9)基準。言語ごとに時差で表示を切り替える。
//   日本=+9 / 韓国=+9(=JSTと同値) / 中国=+8(−1h) / 英語=米国東部 EDT=−4(JSTから−13h)
export const TZ_DELTA_FROM_JST: Record<Lang, number> = { ja: 0, ko: 0, zh: -1, en: -13 };

// "M/D H:MM"（JST基準）を delta 時間ずらして "M/D H:MM" で返す。日付のみ等はそのまま。
function shiftHM(s: string, delta: number): string {
  const m = s.match(/^(\d+)\/(\d+)(?:\s+(\d+):(\d+))?$/);
  if (!m || m[3] === undefined) return s;
  const dt = new Date(Date.UTC(2026, Number(m[1]) - 1, Number(m[2]), Number(m[3]), Number(m[4])));
  dt.setUTCHours(dt.getUTCHours() + delta);
  return `${dt.getUTCMonth() + 1}/${dt.getUTCDate()} ${dt.getUTCHours()}:${String(
    dt.getUTCMinutes()
  ).padStart(2, "0")}`;
}

// 指定試合(round-match)の日時を、その言語のタイムゾーンで返す
export function matchTime(key: string, lang: Lang): string {
  const base = MATCH_DATES[key];
  if (!base) return "";
  return shiftHM(base, TZ_DELTA_FROM_JST[lang]);
}

// 指定ラウンドの「試合数」
export function matchesInRound(round: number): number {
  return 32 / Math.pow(2, round + 1);
}

// ある試合(round, match)が含むリーフ index の範囲 [start, end)
export function leafRange(round: number, match: number): [number, number] {
  const size = Math.pow(2, round + 1);
  return [match * size, match * size + size];
}

export interface Highlight {
  selected: string | null; // 選択チームコード
  routeMatches: Set<string>; // `${round}-${match}` 形式
  opponents: Set<string>; // 対戦する可能性のあるチームコード
}

export const EMPTY_HIGHLIGHT: Highlight = {
  selected: null,
  routeMatches: new Set(),
  opponents: new Set(),
};

// 選択チームの「勝ち上がりルート」と「対戦しうる全チーム」を算出（現在の seeds に対して）
export function getHighlight(
  teamCode: string | null,
  seeds: SeedSlot[]
): Highlight {
  if (!teamCode) return EMPTY_HIGHLIGHT;
  const leaf = seeds.find((s) => s.team.code === teamCode);
  if (!leaf) return EMPTY_HIGHLIGHT;

  const i = leaf.index;
  const routeMatches = new Set<string>();
  const opponents = new Set<string>();

  for (let round = 0; round < TOTAL_ROUNDS; round++) {
    const size = Math.pow(2, round + 1);
    const match = Math.floor(i / size);
    routeMatches.add(`${round}-${match}`);

    // この試合ブロック内で、自分と反対側の半分が対戦相手候補
    const blockStart = match * size;
    const half = size / 2;
    const mySide = i - blockStart < half ? 0 : 1;
    const oppStart = mySide === 0 ? blockStart + half : blockStart;
    for (let j = oppStart; j < oppStart + half; j++) {
      if (seeds[j].team.code !== teamCode) opponents.add(seeds[j].team.code);
    }
  }

  return { selected: teamCode, routeMatches, opponents };
}
