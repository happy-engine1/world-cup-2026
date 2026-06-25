"use client";

import { Reorder, useDragControls } from "framer-motion";
import { teamName, gd, GroupLetter, RankedThird, TeamRow } from "@/data/groups";
import { useI18n } from "@/i18n/I18nProvider";
import { Lang } from "@/i18n/config";
import Flag from "./Flag";

const QUALIFY = 8; // 上位8チームがベスト32へ進出

// ヘッダーと行で共有する列テンプレート（ハンドル/順位/組/旗/国名/試合〜勝点）
const GRID =
  "grid grid-cols-[1.1rem_1.8rem_1.8rem_2rem_minmax(70px,1fr)_repeat(9,1.7rem)] items-center";

interface ThirdPlaceTableProps {
  thirds: RankedThird[];
  onReorder: (groups: GroupLetter[]) => void;
  selected: string | null;
  opponents: Set<string>;
  onSelectTeam: (code: string) => void;
}

function ThirdRow({
  group,
  team,
  idx,
  selected,
  opponents,
  lang,
  onSelectTeam,
}: {
  group: GroupLetter;
  team: TeamRow;
  idx: number;
  selected: string | null;
  opponents: Set<string>;
  lang: Lang;
  onSelectTeam: (code: string) => void;
}) {
  const controls = useDragControls();
  const rank = idx + 1;
  const qualified = rank <= QUALIFY;
  const isSel = selected === team.code;
  const isOpp = opponents.has(team.code) && !isSel;
  const g = gd(team);

  return (
    <Reorder.Item
      as="div"
      value={group}
      dragListener={false}
      dragControls={controls}
      onClick={() => onSelectTeam(team.code)}
      className={`relative cursor-pointer border-t border-white/5 bg-white/[0.01] text-[11px] transition-colors ${GRID} ${
        rank === QUALIFY ? "border-b-2 border-b-amber-400/50" : ""
      } ${
        isSel
          ? "bg-amber-400/20"
          : isOpp
          ? "bg-cyan-400/10"
          : qualified
          ? "bg-emerald-500/[0.06] hover:bg-white/[0.07]"
          : "opacity-55 hover:bg-white/[0.05]"
      }`}
    >
      <span
        className={`absolute left-0 top-0 h-full w-1 ${
          qualified ? "bg-emerald-400/70" : "bg-slate-600/40"
        }`}
      />
      <span
        onPointerDown={(e) => controls.start(e)}
        onClick={(e) => e.stopPropagation()}
        className="cursor-grab touch-none select-none text-center text-white/30 active:cursor-grabbing"
        aria-label="drag"
      >
        ⠿
      </span>
      <span className="py-1.5 text-center text-white/60">{rank}</span>
      <span className="text-center font-semibold text-amber-300/80">{group}</span>
      <span className="flex justify-center">
        <Flag code={team.flag} alt={teamName(team.code, lang)} size={20} />
      </span>
      <span
        className={`truncate pl-1 ${isSel ? "font-bold text-amber-100" : "text-white/90"}`}
      >
        {teamName(team.code, lang)}
      </span>
      <span className="text-center text-white/60">{team.played}</span>
      <span className="text-center text-white/75">{team.win}</span>
      <span className="text-center text-white/75">{team.draw}</span>
      <span className="text-center text-white/75">{team.loss}</span>
      <span className="text-center text-white/75">{team.gf}</span>
      <span className="text-center text-white/75">{team.ga}</span>
      <span className="text-center text-white/75">{g > 0 ? `+${g}` : g}</span>
      <span className="text-center text-white/45">{team.tcs}</span>
      <span className="text-center text-sm font-bold text-amber-300">{team.pts}</span>
    </Reorder.Item>
  );
}

export default function ThirdPlaceTable({
  thirds,
  onReorder,
  selected,
  opponents,
  onSelectTeam,
}: ThirdPlaceTableProps) {
  const { lang, t } = useI18n();
  const groups = thirds.map((x) => x.group);
  const byGroup: Record<string, TeamRow> = Object.fromEntries(
    thirds.map((x) => [x.group, x.team])
  );

  return (
    <div className="overflow-hidden rounded-lg border border-white/10 bg-white/[0.04] backdrop-blur-sm">
      <div className="flex items-center justify-between gap-2 px-3 py-2">
        <span className="text-sm font-bold tracking-wider text-amber-300">
          {t.thirdsTitle}
        </span>
        <span className="rounded bg-emerald-500/15 px-1.5 py-0.5 text-[10px] font-medium text-emerald-300">
          {t.thirdsNote}
        </span>
      </div>

      <div className="overflow-x-auto">
        <div className="min-w-[480px]">
          {/* ヘッダー */}
          <div
            className={`${GRID} text-[9px] uppercase tracking-wide text-white/45`}
          >
            <span />
            <span className="py-1 text-center">{t.colRank}</span>
            <span className="text-center">{t.colGroup}</span>
            <span className="text-center">{t.colFlag}</span>
            <span className="pl-1">{t.colName}</span>
            <span className="text-center">{t.colPlayed}</span>
            <span className="text-center">{t.colWin}</span>
            <span className="text-center">{t.colDraw}</span>
            <span className="text-center">{t.colLoss}</span>
            <span className="text-center">{t.colGf}</span>
            <span className="text-center">{t.colGa}</span>
            <span className="text-center">{t.colGd}</span>
            <span className="text-center">{t.colTcs}</span>
            <span className="text-center font-semibold text-amber-200">{t.colPts}</span>
          </div>

          {/* 並べ替え可能な本体 */}
          <Reorder.Group
            as="div"
            axis="y"
            values={groups}
            onReorder={(g) => onReorder(g as GroupLetter[])}
          >
            {groups.map((group, idx) => (
              <ThirdRow
                key={group}
                group={group}
                team={byGroup[group]}
                idx={idx}
                selected={selected}
                opponents={opponents}
                lang={lang}
                onSelectTeam={onSelectTeam}
              />
            ))}
          </Reorder.Group>
        </div>
      </div>
    </div>
  );
}
