"use client";

import { AnimatePresence, motion } from "framer-motion";
import { GroupLetter, FINAL_GROUPS, gd, rankGroup, teamName, TeamRow } from "@/data/groups";
import { useI18n } from "@/i18n/I18nProvider";
import Flag from "./Flag";

interface GroupTableProps {
  group: GroupLetter;
  expanded: boolean;
  onToggle: (g: GroupLetter) => void;
  selected: string | null;
  opponents: Set<string>;
  onSelectTeam: (code: string) => void;
}

// 順位による帯色: 1-2位=通過(金), 3位=3位通過候補(シアン), 4位=敗退
const rankBar = (rank: number) =>
  rank <= 2 ? "bg-amber-400" : rank === 3 ? "bg-cyan-400/70" : "bg-slate-600/40";

export default function GroupTable({
  group,
  expanded,
  onToggle,
  selected,
  opponents,
  onSelectTeam,
}: GroupTableProps) {
  const { lang, t } = useI18n();
  const rows = rankGroup(group);
  const isFinal = FINAL_GROUPS.has(group);

  const rowClass = (row: TeamRow) => {
    const isSel = selected === row.code;
    const isOpp = opponents.has(row.code) && !isSel;
    return isSel
      ? "bg-amber-400/20"
      : isOpp
      ? "bg-cyan-400/10"
      : "hover:bg-white/[0.05]";
  };

  return (
    <div className="rounded-lg border border-white/10 bg-white/[0.04] backdrop-blur-sm overflow-hidden">
      <button
        onClick={() => onToggle(group)}
        className="flex w-full items-center justify-between px-3 py-2 text-left transition-colors hover:bg-white/[0.06]"
      >
        <span className="flex items-center gap-2">
          <span className="text-sm font-bold tracking-wider text-amber-300">
            {t.groupWord} {group}
          </span>
          <span
            className={`rounded px-1.5 py-0.5 text-[10px] font-semibold ${
              isFinal
                ? "bg-emerald-500/20 text-emerald-300"
                : "bg-sky-500/20 text-sky-300"
            }`}
          >
            {isFinal ? t.groupFinal : t.groupOngoing}
          </span>
        </span>
        <span className="flex items-center gap-2 text-[10px] text-white/40">
          {expanded ? t.close : t.detail}
          <motion.span
            animate={{ rotate: expanded ? 180 : 0 }}
            transition={{ duration: 0.25 }}
          >
            ▼
          </motion.span>
        </span>
      </button>

      {/* 折りたたみ時の概要テーブル: 順位 / 国旗 / 国名 / 勝点 */}
      <table className="w-full border-collapse text-xs">
        <tbody>
          {rows.map((row, idx) => (
            <tr
              key={row.code}
              onClick={() => onSelectTeam(row.code)}
              className={`cursor-pointer border-t border-white/5 transition-colors ${rowClass(row)}`}
            >
              <td className="relative w-6 py-1.5 text-center text-white/60">
                <span className={`absolute left-0 top-0 h-full w-1 ${rankBar(idx + 1)}`} />
                {idx + 1}
              </td>
              <td className="w-7 py-1.5 pl-1">
                <Flag code={row.flag} alt={teamName(row.code, lang)} size={22} />
              </td>
              <td
                className={`py-1.5 pl-1 pr-2 whitespace-nowrap ${
                  selected === row.code ? "font-bold text-amber-100" : "text-white/90"
                }`}
              >
                {teamName(row.code, lang)}
              </td>
              <td className="px-2 py-1.5 text-right text-base font-bold text-amber-300">
                {row.pts}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* 展開時の詳細テーブル（アニメーション付きで開閉） */}
      <AnimatePresence initial={false}>
        {expanded && (
          <motion.div
            key="detail"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="overflow-hidden border-t border-white/10 bg-black/20"
          >
            <div className="overflow-x-auto">
              <table className="w-full min-w-[420px] border-collapse text-[11px]">
                <thead>
                  <tr className="text-[9px] uppercase tracking-wide text-white/45">
                    <th className="px-1 py-1 text-center font-medium">{t.colRank}</th>
                    <th className="px-1 py-1 text-center font-medium">{t.colFlag}</th>
                    <th className="px-1 py-1 text-left font-medium">{t.colName}</th>
                    <th className="px-1 py-1 text-center font-medium">{t.colPlayed}</th>
                    <th className="px-1 py-1 text-center font-medium">{t.colWin}</th>
                    <th className="px-1 py-1 text-center font-medium">{t.colDraw}</th>
                    <th className="px-1 py-1 text-center font-medium">{t.colLoss}</th>
                    <th className="px-1 py-1 text-center font-medium">{t.colGf}</th>
                    <th className="px-1 py-1 text-center font-medium">{t.colGa}</th>
                    <th className="px-1 py-1 text-center font-medium">{t.colGd}</th>
                    <th className="px-1 py-1 text-center font-medium">{t.colTcs}</th>
                    <th className="px-1 py-1 text-center font-semibold text-amber-200">
                      {t.colPts}
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {rows.map((row, idx) => (
                    <tr
                      key={row.code}
                      onClick={() => onSelectTeam(row.code)}
                      className={`cursor-pointer border-t border-white/5 transition-colors ${rowClass(row)}`}
                    >
                      <td className="relative px-1 py-1.5 text-center text-white/60">
                        <span className={`absolute left-0 top-0 h-full w-1 ${rankBar(idx + 1)}`} />
                        {idx + 1}
                      </td>
                      <td className="px-1 py-1.5 text-center">
                        <Flag code={row.flag} alt={teamName(row.code, lang)} size={20} />
                      </td>
                      <td className="px-1 py-1.5 whitespace-nowrap text-white/90">
                        {teamName(row.code, lang)}
                      </td>
                      <td className="px-1 py-1.5 text-center text-white/60">{row.played}</td>
                      <td className="px-1 py-1.5 text-center text-white/75">{row.win}</td>
                      <td className="px-1 py-1.5 text-center text-white/75">{row.draw}</td>
                      <td className="px-1 py-1.5 text-center text-white/75">{row.loss}</td>
                      <td className="px-1 py-1.5 text-center text-white/75">{row.gf}</td>
                      <td className="px-1 py-1.5 text-center text-white/75">{row.ga}</td>
                      <td className="px-1 py-1.5 text-center text-white/75">
                        {gd(row) > 0 ? `+${gd(row)}` : gd(row)}
                      </td>
                      <td className="px-1 py-1.5 text-center text-white/45">{row.tcs}</td>
                      <td className="px-1 py-1.5 text-center text-sm font-bold text-amber-300">
                        {row.pts}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
