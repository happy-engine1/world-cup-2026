"use client";

import { rankedThirds, teamName, gd } from "@/data/groups";
import { useI18n } from "@/i18n/I18nProvider";
import Flag from "./Flag";

const QUALIFY = 8; // 上位8チームがベスト32へ進出

interface ThirdPlaceTableProps {
  selected: string | null;
  opponents: Set<string>;
  onSelectTeam: (code: string) => void;
}

export default function ThirdPlaceTable({
  selected,
  opponents,
  onSelectTeam,
}: ThirdPlaceTableProps) {
  const { lang, t } = useI18n();
  const rows = rankedThirds();

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
        <table className="w-full min-w-[460px] border-collapse text-[11px]">
          <thead>
            <tr className="text-[9px] uppercase tracking-wide text-white/45">
              <th className="px-1 py-1 text-center font-medium">{t.colRank}</th>
              <th className="px-1 py-1 text-center font-medium">{t.colGroup}</th>
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
            {rows.map(({ group, team }, idx) => {
              const rank = idx + 1;
              const qualified = rank <= QUALIFY;
              const isSel = selected === team.code;
              const isOpp = opponents.has(team.code) && !isSel;
              const g = gd(team);
              return (
                <tr
                  key={team.code}
                  onClick={() => onSelectTeam(team.code)}
                  className={`cursor-pointer border-t border-white/5 transition-colors ${
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
                  <td className="relative px-1 py-1.5 text-center text-white/60">
                    <span
                      className={`absolute left-0 top-0 h-full w-1 ${
                        qualified ? "bg-emerald-400/70" : "bg-slate-600/40"
                      }`}
                    />
                    {rank}
                  </td>
                  <td className="px-1 py-1.5 text-center font-semibold text-amber-300/80">
                    {group}
                  </td>
                  <td className="px-1 py-1.5 text-center">
                    <Flag code={team.flag} alt={teamName(team.code, lang)} size={20} />
                  </td>
                  <td
                    className={`px-1 py-1.5 whitespace-nowrap ${
                      isSel ? "font-bold text-amber-100" : "text-white/90"
                    }`}
                  >
                    {teamName(team.code, lang)}
                  </td>
                  <td className="px-1 py-1.5 text-center text-white/60">{team.played}</td>
                  <td className="px-1 py-1.5 text-center text-white/75">{team.win}</td>
                  <td className="px-1 py-1.5 text-center text-white/75">{team.draw}</td>
                  <td className="px-1 py-1.5 text-center text-white/75">{team.loss}</td>
                  <td className="px-1 py-1.5 text-center text-white/75">{team.gf}</td>
                  <td className="px-1 py-1.5 text-center text-white/75">{team.ga}</td>
                  <td className="px-1 py-1.5 text-center text-white/75">
                    {g > 0 ? `+${g}` : g}
                  </td>
                  <td className="px-1 py-1.5 text-center text-white/45">{team.tcs}</td>
                  <td className="px-1 py-1.5 text-center text-sm font-bold text-amber-300">
                    {team.pts}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
