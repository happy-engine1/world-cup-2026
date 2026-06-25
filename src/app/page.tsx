"use client";

import { useMemo, useState } from "react";
import { GROUP_LETTERS, GroupLetter, teamByCode, teamName } from "@/data/groups";
import { getHighlight } from "@/data/bracket";
import { useI18n } from "@/i18n/I18nProvider";
import { LANGS } from "@/i18n/config";
import GroupTable from "@/components/GroupTable";
import Bracket from "@/components/Bracket";
import ThirdPlaceTable from "@/components/ThirdPlaceTable";

const LEFT_GROUPS = GROUP_LETTERS.slice(0, 6); // A–F
const RIGHT_GROUPS = GROUP_LETTERS.slice(6); // G–L

export default function Home() {
  const { lang, setLang, t } = useI18n();
  const [selected, setSelected] = useState<string | null>(null);
  const [expanded, setExpanded] = useState<Set<GroupLetter>>(new Set());

  const highlight = useMemo(() => getHighlight(selected), [selected]);

  const toggleGroup = (g: GroupLetter) =>
    setExpanded((prev) => {
      const next = new Set(prev);
      if (next.has(g)) next.delete(g);
      else next.add(g);
      return next;
    });

  const selectTeam = (code: string) =>
    setSelected((prev) => (prev === code ? null : code));

  const selectedTeam = selected ? teamByCode[selected] : null;

  return (
    <main className="relative z-10 mx-auto w-full max-w-[1900px] px-2 py-4 sm:px-4 sm:py-6">
      {/* ヘッダー: モバイルは縦積み中央寄せ / xl以上で「左=サブタイトル・中央=タイトル・右=言語」の1行 */}
      <header className="mb-6 grid grid-cols-1 items-center gap-3 xl:grid-cols-[1fr_auto_1fr] xl:gap-4">
        {/* サブタイトル */}
        <p className="justify-self-center whitespace-nowrap text-xs tracking-[0.3em] text-white/60 xl:justify-self-start">
          {t.subtitle}
        </p>

        {/* タイトル + 非公式バッジ（モバイルは横並び、xlで中央固定＆バッジ絶対配置） */}
        <div className="relative flex flex-wrap items-center justify-center gap-2 justify-self-center">
          <span className="static whitespace-nowrap rounded-full border border-white/20 bg-white/10 px-2 py-0.5 text-[10px] font-semibold text-white/70 xl:absolute xl:right-full xl:top-1/2 xl:mr-2 xl:-translate-y-1/2">
            {t.unofficial}
          </span>
          <h1 className="whitespace-nowrap bg-gradient-to-r from-amber-200 via-amber-400 to-amber-200 bg-clip-text text-3xl font-extrabold tracking-wider text-transparent md:text-4xl">
            {t.appTitle}
          </h1>
        </div>

        {/* 選択中メッセージ + 言語切替 */}
        <div className="flex flex-wrap items-center justify-center gap-3 justify-self-center text-[11px] text-white/55 xl:justify-end xl:justify-self-end">
          {selectedTeam ? (
            <span className="whitespace-nowrap rounded-full bg-amber-400/20 px-3 py-1 text-amber-200">
              {t.selectedNote.split("{team}")[0]}
              <b>{teamName(selectedTeam.code, lang)}</b>
              {t.selectedNote.split("{team}")[1]}
              <button
                onClick={() => setSelected(null)}
                className="ml-2 rounded bg-white/10 px-2 py-0.5 text-white/70 hover:bg-white/20"
              >
                {t.clear}
              </button>
            </span>
          ) : (
            <span className="hidden whitespace-nowrap xl:inline">{t.clickHint}</span>
          )}

          {/* 言語切替 */}
          <div className="inline-flex shrink-0 overflow-hidden rounded-full border border-white/15 bg-white/5 text-[11px]">
            {LANGS.map((l) => (
              <button
                key={l.code}
                onClick={() => setLang(l.code)}
                className={`px-3 py-1 transition-colors ${
                  lang === l.code
                    ? "bg-amber-400/30 font-semibold text-amber-100"
                    : "text-white/60 hover:bg-white/10"
                }`}
              >
                {l.label}
              </button>
            ))}
          </div>
        </div>
      </header>

      {/* 3カラム: 左(A–F) / 中央トーナメント / 右(G–L) */}
      <div className="grid grid-cols-1 gap-4 xl:grid-cols-[280px_1fr_280px]">
        {/* 左サイド: グループ A–F（モバイルでは2番目） */}
        <section className="order-2 space-y-3 xl:order-none">
          <h2 className="text-center text-xs font-semibold tracking-widest text-white/50">
            {t.groupsAF}
          </h2>
          {LEFT_GROUPS.map((g) => (
            <GroupTable
              key={g}
              group={g}
              expanded={expanded.has(g)}
              onToggle={toggleGroup}
              selected={selected}
              opponents={highlight.opponents}
              onSelectTeam={selectTeam}
            />
          ))}
        </section>

        {/* 中央: 決勝トーナメント（モバイルでは最初） */}
        <section className="order-1 min-w-0 xl:order-none">
          <h2 className="mb-2 text-center text-xs font-semibold tracking-widest text-white/50">
            {t.knockout}
          </h2>
          <div className="overflow-x-auto rounded-xl border border-white/10 bg-black/20 p-3">
            <div className="h-[920px]">
              <Bracket highlight={highlight} onSelectTeam={selectTeam} />
            </div>
          </div>
          <p className="mt-2 text-center text-[10px] text-white/40">{t.legend}</p>

          {/* 幅が足りる場合: 3位チーム表をトーナメントの下に */}
          <div className="mt-4 hidden xl:block">
            <ThirdPlaceTable
              selected={selected}
              opponents={highlight.opponents}
              onSelectTeam={selectTeam}
            />
          </div>
        </section>

        {/* 右サイド: グループ G–L（モバイルでは3番目） */}
        <section className="order-3 space-y-3 xl:order-none">
          <h2 className="text-center text-xs font-semibold tracking-widest text-white/50">
            {t.groupsGL}
          </h2>
          {RIGHT_GROUPS.map((g) => (
            <GroupTable
              key={g}
              group={g}
              expanded={expanded.has(g)}
              onToggle={toggleGroup}
              selected={selected}
              opponents={highlight.opponents}
              onSelectTeam={selectTeam}
            />
          ))}
        </section>
      </div>

      {/* 幅が足りない場合: 3位チーム表を A–L の下（最後）に */}
      <div className="mt-4 xl:hidden">
        <ThirdPlaceTable
          selected={selected}
          opponents={highlight.opponents}
          onSelectTeam={selectTeam}
        />
      </div>

      {/* フッター: 非公式ディスクレーマー */}
      <footer className="mx-auto mt-8 max-w-3xl border-t border-white/10 pt-4 text-center text-[10px] leading-relaxed text-white/40">
        <p>{t.footer1}</p>
        <p className="mt-1">{t.footer2}</p>
        <p className="mt-1 text-white/30">{t.footer3}</p>
      </footer>
    </main>
  );
}
