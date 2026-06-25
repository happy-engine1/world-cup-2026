// 32チーム決勝トーナメントの構造。
// 32枚のリーフ（出場枠）を「ブラケット順」に並べ、完全二分木として扱う。
//   round 0 = ベスト32（16試合）, 1 = ベスト16, 2 = 準々決勝, 3 = 準決勝, 4 = 決勝
// 各リーフは groups の現順位から解決される。グループ1/2位は確定グループなら confirmed、
// それ以外（未確定グループの1/2位・全ての3位通過枠）は tentative（薄色表示）。

import { FINAL_GROUPS, GroupLetter, TeamRow } from "./groups";

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
//   orderOf(g): 各グループの順位順 TeamRow[]（予測時はユーザー指定、既定は rankGroup）
//   qualifyingThirds: 3位ランキング上位8グループ
export function computeSeeds(
  orderOf: (g: GroupLetter) => TeamRow[],
  qualifyingThirds: GroupLetter[]
): SeedSlot[] {
  const thirdAssign = assignThirds(qualifyingThirds);
  return LEAVES.map((leaf, i): SeedSlot => {
    if (leaf.kind === "third") {
      const g = thirdAssign[i] ?? leaf.allowed[0]; // フォールバック
      return {
        index: i,
        seedType: "third",
        group: g,
        allowed: leaf.allowed,
        team: orderOf(g)[2],
        confirmed: false,
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
