"use client";

import {
  SeedSlot,
  Highlight,
  matchTime,
  THIRD_PLACE_DATE,
} from "@/data/bracket";
import { teamName } from "@/data/groups";
import { useI18n } from "@/i18n/I18nProvider";
import { seedLabel } from "@/i18n/ui";
import Flag from "./Flag";

interface BracketProps {
  seeds: SeedSlot[];
  highlight: Highlight;
  onSelectTeam: (code: string) => void;
}

type Side = "left" | "right";

// 全カラム共通の上部ヘッダー帯（高さを揃えて各カラムの縦位置を一致させる）
function ColHeader({ label }: { label?: string }) {
  return (
    <div className="mb-1 flex h-6 shrink-0 items-center justify-center">
      {label && (
        <span className="whitespace-nowrap rounded-full border border-white/15 bg-white/5 px-2 py-0.5 text-[10px] font-semibold tracking-wider text-amber-200/80">
          {label}
        </span>
      )}
    </div>
  );
}

// 縦に等分配置するスロット（同じ高さ分割で隣のカラムと中心が揃う）
function Slot({ children }: { children: React.ReactNode }) {
  return <div className="flex flex-1 items-center">{children}</div>;
}

// 1チームの枠（ベスト32の出場枠）。確定=濃色、未確定=薄色(イタリック)。
function SeedLine({
  slot,
  highlight,
  onSelectTeam,
  side,
}: {
  slot: SeedSlot;
  highlight: Highlight;
  onSelectTeam: (code: string) => void;
  side: Side;
}) {
  const { lang, t } = useI18n();
  const isSel = highlight.selected === slot.team.code;
  const isOpp = highlight.opponents.has(slot.team.code) && !isSel;
  const dim = highlight.selected && !isSel && !isOpp;

  // 出場元ラベル（例: C1 / F2 / C/E/F/H/I3）
  const source =
    slot.seedType === "third"
      ? `${(slot.allowed ?? [slot.group]).join("/")}3`
      : `${slot.group}${slot.seedType}`;

  return (
    <button
      onClick={() => onSelectTeam(slot.team.code)}
      title={seedLabel(lang, slot.seedType, slot.group)}
      className={`flex w-full flex-col gap-0.5 px-1.5 py-1 transition-all ${
        isSel
          ? "bg-amber-400/30 ring-1 ring-amber-300"
          : isOpp
          ? "bg-cyan-400/20"
          : "hover:bg-white/10"
      } ${dim ? "opacity-40" : ""}`}
    >
      <span
        className={`w-full truncate text-[8px] leading-none text-amber-200/55 ${
          side === "right" ? "text-right" : "text-left"
        }`}
      >
        {source}
      </span>
      <span
        className={`flex w-full items-center gap-1.5 ${
          side === "right" ? "flex-row-reverse text-right" : "text-left"
        }`}
      >
        <Flag
          code={slot.team.flag}
          alt={teamName(slot.team.code, lang)}
          size={16}
          className={slot.confirmed ? "" : "opacity-70 saturate-50"}
        />
        <span
          className={`flex-1 truncate text-[10px] ${
            slot.confirmed ? "text-white/90" : "italic text-white/45"
          } ${isSel ? "font-bold text-amber-100" : ""}`}
        >
          {teamName(slot.team.code, lang)}
        </span>
        {!slot.confirmed && (
          <span className="shrink-0 rounded-sm bg-sky-500/20 px-1 text-[8px] not-italic leading-tight text-sky-300">
            {t.provisional}
          </span>
        )}
      </span>
    </button>
  );
}

// ベスト32（実チームが入る試合）のカラム
function R32Column({
  seeds,
  matches,
  highlight,
  onSelectTeam,
  side,
  label,
}: {
  seeds: SeedSlot[];
  matches: number[];
  highlight: Highlight;
  onSelectTeam: (code: string) => void;
  side: Side;
  label: string;
}) {
  const { lang } = useI18n();
  return (
    <div className="flex h-full w-40 flex-col">
      <ColHeader label={label} />
      <div className="flex flex-1 flex-col">
        {matches.map((m) => {
          const onRoute = highlight.routeMatches.has(`0-${m}`);
          return (
            <Slot key={m}>
              <div
                className={`w-full overflow-hidden rounded-md border bg-white/[0.05] backdrop-blur-sm ${
                  onRoute
                    ? "border-amber-300 shadow-[0_0_10px_rgba(245,197,66,0.5)]"
                    : "border-white/10"
                }`}
              >
                <div className="border-b border-white/10 bg-black/25 px-1 text-center text-[8px] tracking-wide text-white/45">
                  {matchTime(`0-${m}`, lang)}
                </div>
                <SeedLine slot={seeds[m * 2]} highlight={highlight} onSelectTeam={onSelectTeam} side={side} />
                <div className="border-t border-white/10" />
                <SeedLine slot={seeds[m * 2 + 1]} highlight={highlight} onSelectTeam={onSelectTeam} side={side} />
              </div>
            </Slot>
          );
        })}
      </div>
    </div>
  );
}

// 内部ラウンド（勝者未定）のプレースホルダ・カラム
function RoundColumn({
  round,
  matches,
  highlight,
  label,
}: {
  round: number;
  matches: number[];
  highlight: Highlight;
  label: string;
}) {
  const { t, lang } = useI18n();
  return (
    <div className="flex h-full w-20 flex-col">
      <ColHeader label={label} />
      <div className="flex flex-1 flex-col">
        {matches.map((m) => {
          const onRoute = highlight.routeMatches.has(`${round}-${m}`);
          return (
            <Slot key={m}>
              <div
                className={`w-full rounded border bg-white/[0.04] px-1 py-2 text-center ${
                  onRoute
                    ? "border-amber-300 shadow-[0_0_10px_rgba(245,197,66,0.45)]"
                    : "border-white/10"
                }`}
              >
                <div className="text-[9px] italic text-white/30">{t.winner}</div>
                <div className="text-[8px] leading-tight text-white/40">
                  {matchTime(`${round}-${m}`, lang)}
                </div>
              </div>
            </Slot>
          );
        })}
      </div>
    </div>
  );
}

// 2つの子試合を1つの親試合につなぐエルボー(⊐)状の接続線カラム
function ElbowColumn({
  parentRound,
  parents, // 各ペアが進む親試合の index 配列
  highlight,
  side,
}: {
  parentRound: number;
  parents: number[];
  highlight: Highlight;
  side: Side;
}) {
  return (
    <div className="flex h-full w-5 flex-col">
      <ColHeader />
      <div className="flex flex-1 flex-col">
        {parents.map((p) => {
          const on = highlight.routeMatches.has(`${parentRound}-${p}`);
          const c = on ? "border-amber-300" : "border-white/20";
          return (
            <div key={p} className="flex flex-1 items-center">
              <div className="flex h-1/2 w-full items-center">
                {side === "left" ? (
                  <>
                    {/* 子(左)→縦線 */}
                    <div className={`h-full w-1/2 border-y border-r ${c}`} />
                    {/* 縦線中央→親(右) */}
                    <div className={`w-1/2 border-t ${c}`} />
                  </>
                ) : (
                  <>
                    {/* 親(左)→縦線中央 */}
                    <div className={`w-1/2 border-t ${c}`} />
                    {/* 縦線→子(右) */}
                    <div className={`h-full w-1/2 border-y border-l ${c}`} />
                  </>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// 単一の子→親をまっすぐつなぐ接続線（準決勝→決勝）
function StraightColumn({ on }: { on: boolean }) {
  const c = on ? "border-amber-300" : "border-white/20";
  return (
    <div className="flex h-full w-5 flex-col">
      <ColHeader />
      <div className="flex flex-1 items-center">
        <div className={`w-full border-t ${c}`} />
      </div>
    </div>
  );
}

export default function Bracket({ seeds, highlight, onSelectTeam }: BracketProps) {
  const { t, lang } = useI18n();
  const finalOnRoute = highlight.routeMatches.has("4-0");
  const sfLeftOnRoute = highlight.routeMatches.has("3-0");
  const sfRightOnRoute = highlight.routeMatches.has("3-1");

  // ラウンド名（分数表記）: 1/16 → 1/8 → 1/4 → 1/2
  const R = ["1/16", "1/8", "1/4", "1/2"];

  return (
    <div className="mx-auto flex h-full w-max items-stretch">
      {/* ===== 左半分: R32 → R16 → QF → SF ===== */}
      <R32Column seeds={seeds} matches={[0, 1, 2, 3, 4, 5, 6, 7]} highlight={highlight} onSelectTeam={onSelectTeam} side="left" label={R[0]} />
      <ElbowColumn parentRound={1} parents={[0, 1, 2, 3]} highlight={highlight} side="left" />
      <RoundColumn round={1} matches={[0, 1, 2, 3]} highlight={highlight} label={R[1]} />
      <ElbowColumn parentRound={2} parents={[0, 1]} highlight={highlight} side="left" />
      <RoundColumn round={2} matches={[0, 1]} highlight={highlight} label={R[2]} />
      <ElbowColumn parentRound={3} parents={[0]} highlight={highlight} side="left" />
      <RoundColumn round={3} matches={[0]} highlight={highlight} label={R[3]} />
      <StraightColumn on={finalOnRoute && sfLeftOnRoute} />

      {/* ===== 中央: トロフィー + 決勝 ===== */}
      <div className="flex h-full flex-col px-1">
        <ColHeader label={t.finalBox} />
        <div className="flex flex-1 flex-col items-center justify-center">
          <div className="mb-3 text-center">
            <svg
              viewBox="0 0 24 24"
              className="mx-auto h-10 w-10 fill-amber-400 drop-shadow-[0_0_8px_rgba(245,197,66,0.7)]"
              aria-hidden
            >
              <path d="M18 2H6v2H3v3a4 4 0 0 0 4 4h.3A5 5 0 0 0 11 13.9V17H8v2h8v-2h-3v-3.1A5 5 0 0 0 16.7 11H17a4 4 0 0 0 4-4V4h-3V2ZM6 9a2 2 0 0 1-2-2V6h2v3Zm14-2a2 2 0 0 1-2 2V6h2v1ZM7 20h10v2H7v-2Z" />
            </svg>
            <div className="mt-1 text-xs font-bold tracking-widest text-amber-300">
              {t.champion}
            </div>
          </div>
          <div
            className={`w-28 rounded-md border bg-white/[0.06] p-2 text-center ${
              finalOnRoute
                ? "border-amber-300 shadow-[0_0_16px_rgba(245,197,66,0.6)]"
                : "border-amber-300/40"
            }`}
          >
            <div className="text-[10px] uppercase tracking-widest text-amber-200">{t.finalBox}</div>
            <div className="mt-0.5 text-[9px] italic text-white/40">{t.winnerVs}</div>
            <div className="mt-0.5 text-[9px] font-semibold text-amber-200/80">
              {matchTime("4-0", lang)}
            </div>
          </div>
          <div className="mt-3 text-[9px] text-white/35">
            {t.thirdPlace}（{THIRD_PLACE_DATE}）
          </div>
        </div>
      </div>

      {/* ===== 右半分: SF → QF → R16 → R32 ===== */}
      <StraightColumn on={finalOnRoute && sfRightOnRoute} />
      <RoundColumn round={3} matches={[1]} highlight={highlight} label={R[3]} />
      <ElbowColumn parentRound={3} parents={[1]} highlight={highlight} side="right" />
      <RoundColumn round={2} matches={[2, 3]} highlight={highlight} label={R[2]} />
      <ElbowColumn parentRound={2} parents={[2, 3]} highlight={highlight} side="right" />
      <RoundColumn round={1} matches={[4, 5, 6, 7]} highlight={highlight} label={R[1]} />
      <ElbowColumn parentRound={1} parents={[4, 5, 6, 7]} highlight={highlight} side="right" />
      <R32Column seeds={seeds} matches={[8, 9, 10, 11, 12, 13, 14, 15]} highlight={highlight} onSelectTeam={onSelectTeam} side="right" label={R[0]} />
    </div>
  );
}
