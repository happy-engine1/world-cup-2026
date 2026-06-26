import { Lang } from "./config";

// UI 文字列の型。全言語で同じキーを持つ。
export interface UIStrings {
  appTitle: string;
  unofficial: string;
  subtitle: string;
  knockout: string;
  groupsAF: string;
  groupsGL: string;
  clickHint: string;
  selectedNote: string; // "{team}" を含むテンプレート
  clear: string;
  legend: string;
  groupWord: string;
  groupFinal: string;
  groupOngoing: string;
  detail: string;
  close: string;
  // 詳細テーブルのカラム見出し
  colRank: string;
  colFlag: string;
  colName: string;
  colPlayed: string;
  colWin: string;
  colDraw: string;
  colLoss: string;
  colGf: string;
  colGa: string;
  colGd: string;
  colTcs: string;
  colPts: string;
  colGroup: string;
  // 3位チーム順位
  thirdsTitle: string;
  thirdsNote: string;
  // 予測モード
  predictMode: string;
  resetReal: string;
  dragHint: string;
  // 試合時刻のタイムゾーン表記
  tzLabel: string;
  // ブラケット
  champion: string;
  finalBox: string;
  winnerVs: string;
  thirdPlace: string;
  winner: string;
  provisional: string;
  roundShort: [string, string, string, string, string]; // [_, R16, QF, SF, Final]
  // フッター
  footer1: string;
  footer2: string;
  footer3: string;
}

export const UI: Record<Lang, UIStrings> = {
  ja: {
    appTitle: "ワールドカップ 2026",
    unofficial: "非公式・ファンメイド",
    subtitle: "ワールドカップ ・ 対戦トーナメント表",
    knockout: "決勝トーナメント",
    groupsAF: "グループ A – F",
    groupsGL: "グループ G – L",
    clickHint: "国（国旗/名前）をクリックすると、対戦ルートと対戦候補がハイライトされます",
    selectedNote: "選択中: {team} の勝ち上がりルートと対戦候補を表示中",
    clear: "解除",
    legend: "濃色=確定 / 薄色(イタリック)=未確定枠（現在の順位上位国を仮表示）",
    groupWord: "グループ",
    groupFinal: "確定",
    groupOngoing: "途中",
    detail: "詳細",
    close: "閉じる",
    colRank: "順位",
    colFlag: "旗",
    colName: "国名",
    colPlayed: "試合",
    colWin: "勝",
    colDraw: "分",
    colLoss: "敗",
    colGf: "得点",
    colGa: "失点",
    colGd: "得失",
    colTcs: "TCS",
    colPts: "勝点",
    colGroup: "組",
    thirdsTitle: "3位チーム順位",
    thirdsNote: "上位8チームがベスト32進出",
    predictMode: "予測モード（実データではありません）",
    resetReal: "実データに戻す",
    dragHint: "ドラッグで順位を予測できます",
    tzLabel: "日本時間 (JST)",
    champion: "優勝",
    finalBox: "決勝",
    winnerVs: "勝者 vs 勝者",
    thirdPlace: "3位決定戦あり",
    winner: "勝者",
    provisional: "暫定",
    roundShort: ["", "ベスト16", "準々決勝", "準決勝", "決勝"],
    footer1:
      "当サイトはサッカーファンが個人的に作成した非公式のトーナメント表です。FIFAおよび大会主催者・各国サッカー協会・関連団体とは一切関係がなく、これらに承認・提携・後援されたものではありません。",
    footer2:
      "チーム名・国名・国旗・大会名は内容を説明する目的で表示しています。掲載しているグループ順位・対戦結果は想定／参考データであり、正確性・最新性を保証するものではありません。",
    footer3: "成績データ出典: 一般公開情報（2026年6月時点のスナップショット） ・ 国旗画像: flagcdn.com",
  },
  en: {
    appTitle: "World Cup 2026",
    unofficial: "Unofficial · Fan-made",
    subtitle: "Canada · Mexico · USA World Cup · Bracket",
    knockout: "Knockout Stage",
    groupsAF: "Groups A – F",
    groupsGL: "Groups G – L",
    clickHint: "Click a team (flag/name) to highlight its route and possible opponents",
    selectedNote: "Selected: showing {team}'s route and possible opponents",
    clear: "Clear",
    legend: "Solid = confirmed / Faint (italic) = provisional (current standings shown)",
    groupWord: "Group",
    groupFinal: "Final",
    groupOngoing: "Live",
    detail: "Details",
    close: "Close",
    colRank: "Rank",
    colFlag: "Flag",
    colName: "Team",
    colPlayed: "MP",
    colWin: "W",
    colDraw: "D",
    colLoss: "L",
    colGf: "GF",
    colGa: "GA",
    colGd: "GD",
    colTcs: "TCS",
    colPts: "Pts",
    colGroup: "Grp",
    thirdsTitle: "Third-placed teams",
    thirdsNote: "Top 8 advance to the Round of 32",
    predictMode: "Prediction mode (not actual data)",
    resetReal: "Reset to actual",
    dragHint: "Drag to predict the standings",
    tzLabel: "US Eastern (ET)",
    champion: "CHAMPION",
    finalBox: "Final",
    winnerVs: "Winner vs Winner",
    thirdPlace: "incl. 3rd-place match",
    winner: "Winner",
    provisional: "Prov.",
    roundShort: ["", "Round of 16", "Quarter-finals", "Semi-finals", "Final"],
    footer1:
      "This is an unofficial bracket created by a football fan for personal use. It is not affiliated with, endorsed by, or associated with FIFA, the tournament organizers, national football associations, or any related body.",
    footer2:
      "Team, country, flag and tournament names are shown for descriptive purposes only. The group standings and results shown here are hypothetical/reference data and are not guaranteed to be accurate or up to date.",
    footer3: "Standings source: public information (snapshot as of June 2026) · Flag images: flagcdn.com",
  },
  zh: {
    appTitle: "世界杯 2026",
    unofficial: "非官方 · 球迷制作",
    subtitle: "美加墨世界杯 · 对阵图",
    knockout: "淘汰赛",
    groupsAF: "小组 A – F",
    groupsGL: "小组 G – L",
    clickHint: "点击国家（国旗/名称）可高亮其晋级路线与潜在对手",
    selectedNote: "已选择: 显示 {team} 的晋级路线与潜在对手",
    clear: "清除",
    legend: "深色=已确定 / 浅色(斜体)=待定名额（按当前排名暂列）",
    groupWord: "小组",
    groupFinal: "已定",
    groupOngoing: "进行中",
    detail: "详情",
    close: "收起",
    colRank: "排名",
    colFlag: "国旗",
    colName: "国家",
    colPlayed: "场",
    colWin: "胜",
    colDraw: "平",
    colLoss: "负",
    colGf: "进",
    colGa: "失",
    colGd: "净",
    colTcs: "TCS",
    colPts: "积分",
    colGroup: "组",
    thirdsTitle: "各组第3名排名",
    thirdsNote: "前8名晋级32强",
    predictMode: "预测模式（非真实数据）",
    resetReal: "重置为真实数据",
    dragHint: "拖动可预测排名",
    tzLabel: "中国时间 (CST)",
    champion: "冠军",
    finalBox: "决赛",
    winnerVs: "胜者 vs 胜者",
    thirdPlace: "含季军赛",
    winner: "胜者",
    provisional: "暂定",
    roundShort: ["", "16强", "八强", "四强", "决赛"],
    footer1:
      "本网站是球迷个人制作的非官方对阵图，与FIFA及大会主办方、各国足球协会及相关机构均无任何关系，未获其认可、合作或赞助。",
    footer2:
      "队名、国家、国旗及赛事名称仅用于内容说明。所列小组排名与比赛结果为假设／参考数据，不保证准确性与时效性。",
    footer3: "成绩数据来源: 公开信息（2026年6月快照） · 国旗图片: flagcdn.com",
  },
  ko: {
    appTitle: "월드컵 2026",
    unofficial: "비공식 · 팬 제작",
    subtitle: "북중미 월드컵 · 대진표",
    knockout: "토너먼트",
    groupsAF: "조 A – F",
    groupsGL: "조 G – L",
    clickHint: "국가(국기/이름)를 클릭하면 진출 경로와 상대 후보가 강조됩니다",
    selectedNote: "선택됨: {team}의 진출 경로와 상대 후보 표시 중",
    clear: "해제",
    legend: "진한색=확정 / 옅은색(이탤릭)=미정(현재 순위 기준 임시 표시)",
    groupWord: "조",
    groupFinal: "확정",
    groupOngoing: "진행중",
    detail: "상세",
    close: "닫기",
    colRank: "순위",
    colFlag: "국기",
    colName: "국가",
    colPlayed: "경기",
    colWin: "승",
    colDraw: "무",
    colLoss: "패",
    colGf: "득점",
    colGa: "실점",
    colGd: "득실",
    colTcs: "TCS",
    colPts: "승점",
    colGroup: "조",
    thirdsTitle: "3위 팀 순위",
    thirdsNote: "상위 8개 팀이 32강 진출",
    predictMode: "예측 모드 (실제 데이터 아님)",
    resetReal: "실제 데이터로 초기화",
    dragHint: "드래그하여 순위를 예측할 수 있습니다",
    tzLabel: "한국 시간 (KST)",
    champion: "우승",
    finalBox: "결승",
    winnerVs: "승자 vs 승자",
    thirdPlace: "3·4위전 포함",
    winner: "승자",
    provisional: "잠정",
    roundShort: ["", "16강", "8강", "4강", "결승"],
    footer1:
      "본 사이트는 축구 팬이 개인적으로 제작한 비공식 대진표입니다. FIFA 및 대회 주최측·각국 축구협회·관련 단체와 일절 관계가 없으며 이들의 승인·제휴·후원을 받지 않았습니다.",
    footer2:
      "팀명·국가·국기·대회명은 내용 설명 목적으로 표시합니다. 게재된 조 순위·경기 결과는 가상／참고 데이터이며 정확성·최신성을 보장하지 않습니다.",
    footer3: "성적 데이터 출처: 공개 정보(2026년 6월 시점 스냅샷) · 국기 이미지: flagcdn.com",
  },
};

// ブラケットの出場枠ラベル（ツールチップ用）を言語別に生成
export function seedLabel(lang: Lang, type: "1" | "2" | "third", g: string): string {
  switch (lang) {
    case "ja":
      return type === "third" ? `3位 (${g}組)` : `${g}組 ${type}位`;
    case "en":
      return type === "third" ? `3rd (Group ${g})` : `Group ${g} #${type}`;
    case "zh":
      return type === "third" ? `第3名 (${g}组)` : `${g}组 第${type}名`;
    case "ko":
      return type === "third" ? `3위 (${g}조)` : `${g}조 ${type}위`;
  }
}
