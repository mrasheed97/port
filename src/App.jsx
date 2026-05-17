import { useState, useEffect, useCallback, useRef } from "react";

/* ─── STYLES ─────────────────────────────────────────────────────────────── */
const G = `
@import url('https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=Geist+Mono:wght@300;400;500&display=swap');
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
:root{
  --ink:#0d0d12;--ink2:#1a1a24;--ink3:#24242f;--ink4:#2e2e3a;
  --line:rgba(255,255,255,0.06);--line2:rgba(255,255,255,0.11);
  --text:#e8e8f0;--sub:#7a7a96;--sub2:#a8a8c0;
  --g:#b6f06e;--r:#f06e6e;--b:#6eb8f0;--gold:#f0c46e;
  --mag:#ff6ec7;--cyan:#6ef0f0;--pur:#b06ef0;
  --serif:'Instrument Serif',serif;--mono:'Geist Mono',monospace;--rad:10px;
}
body{background:var(--ink);color:var(--text);font-family:var(--mono);font-size:13px;line-height:1.5;-webkit-font-smoothing:antialiased}
button{font-family:var(--mono);cursor:pointer;border:none;background:none;color:inherit}
input{font-family:var(--mono);outline:none}
.app{display:grid;grid-template-rows:52px 1fr;height:100vh;overflow:hidden}
/* NAV */
.nav{display:flex;align-items:center;justify-content:space-between;padding:0 20px;border-bottom:1px solid var(--line);background:var(--ink);z-index:50}
.nav-logo{font-family:var(--serif);font-size:22px;font-style:italic;letter-spacing:-0.5px}
.nav-tabs{display:flex;gap:2px}
.nav-tab{padding:6px 14px;border-radius:6px;font-size:11px;letter-spacing:0.06em;text-transform:uppercase;color:var(--sub);transition:all .15s}
.nav-tab:hover{color:var(--text)}
.nav-tab.on{background:var(--ink3);color:var(--text);border:1px solid var(--line2)}
.nav-right{display:flex;align-items:center;gap:10px}
.api-badge{font-size:10px;color:var(--sub);border:1px solid var(--line2);border-radius:5px;padding:3px 8px;letter-spacing:0.04em}
.api-badge.live{color:var(--g);border-color:rgba(182,240,110,0.25)}
/* LAYOUT */
.body{display:grid;grid-template-columns:220px 1fr;overflow:hidden;height:100%}
.body.full{grid-template-columns:1fr}
.sidebar{border-right:1px solid var(--line);display:flex;flex-direction:column;overflow:hidden}
.sidebar-top{padding:16px 12px 8px;border-bottom:1px solid var(--line)}
.add-row{display:flex;gap:6px}
.add-input{flex:1;background:var(--ink2);border:1px solid var(--line2);border-radius:var(--rad);padding:7px 10px;font-size:12px;color:var(--text);text-transform:uppercase}
.add-input:focus{border-color:var(--g)}
.add-input::placeholder{color:var(--sub);text-transform:none;font-size:11px}
.add-btn{width:30px;background:var(--g);color:var(--ink);border-radius:var(--rad);font-size:16px;font-weight:500}
.ticker-list{flex:1;overflow-y:auto;padding:8px}
.ticker-list::-webkit-scrollbar{width:3px}
.ticker-list::-webkit-scrollbar-thumb{background:var(--line2);border-radius:2px}
.ticker-row{display:flex;align-items:center;justify-content:space-between;padding:8px 10px;border-radius:8px;cursor:pointer;transition:background .1s;gap:6px}
.ticker-row:hover{background:var(--ink2)}
.ticker-row.on{background:var(--ink3);border:1px solid var(--line2)}
.t-left{display:flex;align-items:center;gap:8px}
.t-icon{width:28px;height:28px;border-radius:6px;background:var(--ink3);border:1px solid var(--line2);display:flex;align-items:center;justify-content:center;font-size:8px;font-weight:500;color:var(--sub2);flex-shrink:0}
.t-sym{font-size:12px;font-weight:500}
.t-price{font-size:11px;color:var(--sub)}
.t-chg{font-size:10px;padding:1px 5px;border-radius:4px}
.t-chg.pos{background:rgba(182,240,110,0.12);color:var(--g)}
.t-chg.neg{background:rgba(240,110,110,0.12);color:var(--r)}
.rm-btn{font-size:14px;color:var(--sub);opacity:0;transition:opacity .15s}
.ticker-row:hover .rm-btn{opacity:1}
.rm-btn:hover{color:var(--r)}
.main{overflow-y:auto;display:flex;flex-direction:column}
.main::-webkit-scrollbar{width:4px}
.main::-webkit-scrollbar-thumb{background:var(--line2);border-radius:2px}
.empty{flex:1;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:10px;color:var(--sub)}
.empty-title{font-family:var(--serif);font-size:28px;font-style:italic;color:var(--sub2)}
/* SHARED */
.spin{width:24px;height:24px;border:2px solid var(--line2);border-top-color:var(--g);border-radius:50%;animation:spin .7s linear infinite}
@keyframes spin{to{transform:rotate(360deg)}}
.cursor{display:inline-block;width:7px;height:13px;background:var(--g);margin-left:1px;animation:blink 1s step-end infinite;vertical-align:text-bottom}
@keyframes blink{50%{opacity:0}}
.sec-title{font-size:9px;text-transform:uppercase;letter-spacing:0.1em;color:var(--sub);margin-bottom:12px;display:flex;align-items:center;gap:8px}
.sec-title::after{content:'';flex:1;height:1px;background:var(--line)}
/* SETUP */
.setup-overlay{position:fixed;inset:0;background:rgba(10,10,15,0.9);backdrop-filter:blur(8px);z-index:200;display:flex;align-items:center;justify-content:center}
.setup-modal{background:var(--ink2);border:1px solid var(--line2);border-radius:16px;padding:28px;width:420px;max-width:90vw}
.setup-title{font-family:var(--serif);font-size:24px;font-style:italic;margin-bottom:6px}
.setup-sub{font-size:11px;color:var(--sub);line-height:1.6;margin-bottom:20px}
.setup-field{margin-bottom:14px}
.setup-label{font-size:10px;text-transform:uppercase;letter-spacing:0.07em;color:var(--sub);margin-bottom:6px;display:block}
.setup-input{width:100%;background:var(--ink3);border:1px solid var(--line2);border-radius:8px;padding:9px 12px;font-size:12px;color:var(--text);transition:border-color .15s}
.setup-input:focus{border-color:var(--g)}
.setup-row{display:flex;gap:8px;margin-top:20px}
.setup-btn{flex:1;padding:9px;border-radius:8px;font-size:12px;transition:all .15s}
.setup-btn.pri{background:var(--g);color:var(--ink)}
.setup-btn.pri:hover{opacity:.85}
.setup-btn.sec{border:1px solid var(--line2);color:var(--sub2)}
.setup-btn.sec:hover{color:var(--text)}
.setup-link{font-size:10px;color:var(--b);text-align:center;margin-top:12px;cursor:pointer}
.setup-note{font-size:10px;color:var(--sub);background:var(--ink3);border-radius:6px;padding:8px 10px;margin-top:12px;line-height:1.6}
/* ── RESEARCH PAGE ── */
.rp{padding:0 0 48px}
/* snapshot bar */
.snap{display:grid;grid-template-columns:auto 1fr auto;align-items:center;gap:24px;padding:20px 28px;border-bottom:1px solid var(--line)}
.snap-left{}
.snap-sym{font-family:var(--serif);font-size:48px;font-style:italic;letter-spacing:-2px;line-height:1}
.snap-name{font-size:11px;color:var(--sub);margin-top:2px}
.snap-mid{display:flex;flex-direction:column;gap:10px}
.snap-price-row{display:flex;align-items:baseline;gap:12px}
.snap-price{font-family:var(--serif);font-size:36px;letter-spacing:-1px;line-height:1}
.snap-chg{font-size:13px;padding:3px 10px;border-radius:6px}
.snap-chg.pos{background:rgba(182,240,110,0.12);color:var(--g)}
.snap-chg.neg{background:rgba(240,110,110,0.12);color:var(--r)}
.snap-range-wrap{display:flex;align-items:center;gap:8px}
.snap-range-label{font-size:9px;color:var(--sub);white-space:nowrap}
.snap-range-track{flex:1;height:4px;background:var(--ink3);border-radius:2px;position:relative;min-width:120px}
.snap-range-fill{position:absolute;left:0;top:0;height:100%;border-radius:2px;background:linear-gradient(90deg,var(--r),var(--gold),var(--g))}
.snap-range-dot{position:absolute;top:50%;transform:translate(-50%,-50%);width:10px;height:10px;border-radius:50%;background:var(--text);border:2px solid var(--ink);box-shadow:0 0 6px rgba(255,255,255,0.3)}
.snap-right{display:flex;flex-direction:column;align-items:flex-end;gap:8px}
.signal-badge{font-size:11px;font-weight:500;padding:5px 14px;border-radius:20px;letter-spacing:0.05em}
.signal-badge.bull{background:rgba(182,240,110,0.15);color:var(--g);border:1px solid rgba(182,240,110,0.3)}
.signal-badge.bear{background:rgba(240,110,110,0.15);color:var(--r);border:1px solid rgba(240,110,110,0.3)}
.signal-badge.neut{background:rgba(168,168,192,0.12);color:var(--sub2);border:1px solid var(--line2)}
.snap-meta{display:flex;gap:16px}
.snap-meta-item{display:flex;flex-direction:column;align-items:flex-end;gap:2px}
.snap-meta-label{font-size:9px;color:var(--sub);text-transform:uppercase;letter-spacing:0.07em}
.snap-meta-val{font-size:12px;color:var(--text)}
/* grid layout for sections */
.rp-grid{display:grid;grid-template-columns:1fr 1fr;gap:16px;padding:20px 28px 0}
.rp-full{padding:20px 28px 0}
.rp-card{background:var(--ink2);border:1px solid var(--line);border-radius:12px;padding:18px}
/* tech dashboard */
.tech-grid{display:grid;grid-template-columns:1fr 1fr 1fr;gap:12px;margin-bottom:16px}
.tech-item{background:var(--ink3);border-radius:8px;padding:12px}
.tech-label{font-size:9px;text-transform:uppercase;letter-spacing:0.08em;color:var(--sub);margin-bottom:6px}
.tech-val{font-size:16px;font-weight:500;font-family:var(--serif);font-style:italic}
.tech-sub{font-size:10px;color:var(--sub);margin-top:2px}
/* RSI gauge */
.rsi-wrap{display:flex;flex-direction:column;align-items:center;gap:4px;padding:8px 0}
.rsi-num{font-family:var(--serif);font-size:32px;font-style:italic;margin-top:4px}
.rsi-label{font-size:9px;text-transform:uppercase;letter-spacing:0.08em;color:var(--sub)}
/* MA deviation bars */
.ma-row{display:flex;align-items:center;gap:8px;margin-bottom:8px}
.ma-name{font-size:10px;color:var(--sub);width:32px}
.ma-track{flex:1;height:6px;background:var(--ink3);border-radius:3px;overflow:hidden}
.ma-fill{height:100%;border-radius:3px;transition:width .4s ease}
.ma-pct{font-size:10px;color:var(--sub2);width:42px;text-align:right}
/* momentum score */
.mscore-wrap{display:flex;flex-direction:column;align-items:center;justify-content:center;height:100%}
.mscore-num{font-family:var(--serif);font-size:56px;font-style:italic;line-height:1}
.mscore-label{font-size:9px;text-transform:uppercase;letter-spacing:0.1em;color:var(--sub);margin-top:4px}
.mscore-sub{font-size:10px;color:var(--sub2);margin-top:4px;text-align:center}
/* support/resistance */
.sr-row{display:flex;align-items:center;justify-content:space-between;padding:6px 0;border-bottom:1px solid var(--line)}
.sr-row:last-child{border-bottom:none}
.sr-type{font-size:9px;text-transform:uppercase;letter-spacing:0.07em;padding:2px 7px;border-radius:4px}
.sr-type.res{background:rgba(240,110,110,0.12);color:var(--r)}
.sr-type.sup{background:rgba(182,240,110,0.12);color:var(--g)}
.sr-price{font-size:13px;font-weight:500;font-family:var(--serif);font-style:italic}
.sr-note{font-size:10px;color:var(--sub)}
/* radar / scorecard */
.radar-wrap{display:flex;flex-direction:column;align-items:center;gap:12px}
.score-axes{display:flex;flex-direction:column;gap:8px;width:100%}
.axis-row{display:flex;align-items:center;gap:8px}
.axis-name{font-size:10px;color:var(--sub2);width:140px;flex-shrink:0}
.axis-track{flex:1;height:5px;background:var(--ink3);border-radius:3px;overflow:hidden}
.axis-fill{height:100%;border-radius:3px;transition:width .5s ease}
.axis-score{font-size:10px;color:var(--sub2);width:20px;text-align:right}
/* bull/base/bear table */
.scenario-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:10px;margin-top:16px}
.scenario-card{border-radius:10px;padding:14px}
.scenario-card.bull{background:rgba(182,240,110,0.06);border:1px solid rgba(182,240,110,0.15)}
.scenario-card.base{background:rgba(168,168,192,0.05);border:1px solid var(--line2)}
.scenario-card.bear{background:rgba(240,110,110,0.06);border:1px solid rgba(240,110,110,0.15)}
.scenario-label{font-size:9px;text-transform:uppercase;letter-spacing:0.08em;margin-bottom:8px}
.scenario-card.bull .scenario-label{color:var(--g)}
.scenario-card.base .scenario-label{color:var(--sub2)}
.scenario-card.bear .scenario-label{color:var(--r)}
.scenario-target{font-family:var(--serif);font-size:26px;font-style:italic;margin-bottom:6px}
.scenario-card.bull .scenario-target{color:var(--g)}
.scenario-card.bear .scenario-target{color:var(--r)}
.scenario-assumption{font-size:10px;color:var(--sub2);line-height:1.5}
/* AI narrative */
.narrative-wrap{background:var(--ink2);border:1px solid var(--line);border-radius:12px;padding:20px;margin:0 28px;margin-top:20px}
.narrative-text{font-size:12px;line-height:1.9;color:var(--sub2);white-space:pre-wrap;word-break:break-word}
/* verdict box */
.verdict-wrap{display:grid;grid-template-columns:1fr 1fr 1fr;gap:10px;margin-top:16px}
.verdict-cell{background:var(--ink3);border-radius:8px;padding:12px}
.verdict-label{font-size:9px;text-transform:uppercase;letter-spacing:0.08em;color:var(--sub);margin-bottom:6px}
.verdict-val{font-size:15px;font-weight:500;font-family:var(--serif);font-style:italic}
/* catalyst calendar */
.cal-item{display:flex;gap:12px;align-items:flex-start;padding:10px 0;border-bottom:1px solid var(--line)}
.cal-item:last-child{border-bottom:none}
.cal-date{font-size:10px;color:var(--sub);width:72px;flex-shrink:0;padding-top:2px}
.cal-dot{width:8px;height:8px;border-radius:50%;flex-shrink:0;margin-top:4px}
.cal-dot.bull{background:var(--g)}
.cal-dot.bear{background:var(--r)}
.cal-dot.neut{background:var(--sub)}
.cal-body{flex:1}
.cal-title{font-size:12px;color:var(--text);margin-bottom:2px}
.cal-tag{font-size:9px;text-transform:uppercase;letter-spacing:0.06em;padding:1px 6px;border-radius:4px;display:inline-block}
.cal-tag.bull{background:rgba(182,240,110,0.12);color:var(--g)}
.cal-tag.bear{background:rgba(240,110,110,0.12);color:var(--r)}
.cal-tag.neut{background:rgba(168,168,192,0.1);color:var(--sub2)}
/* news */
.news-item{background:var(--ink2);border-radius:8px;padding:12px 14px;border:1px solid var(--line);margin-bottom:6px}
.news-head{display:flex;align-items:flex-start;justify-content:space-between;gap:10px;margin-bottom:4px}
.news-hl{font-size:12px;color:var(--text);line-height:1.5;flex:1}
.news-sent{font-size:9px;text-transform:uppercase;letter-spacing:0.06em;padding:2px 7px;border-radius:4px;flex-shrink:0;margin-top:2px}
.news-sent.neu{background:rgba(120,120,150,0.12);color:var(--sub2)}
.news-meta{font-size:10px;color:var(--sub)}
/* 401k */
.k-panel{padding:24px 28px}
.k-title{font-family:var(--serif);font-size:32px;font-style:italic;margin-bottom:4px}
.k-sub{font-size:11px;color:var(--sub);margin-bottom:24px}
.k-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:10px;margin-bottom:24px}
.k-card{background:var(--ink2);border:1px solid var(--line);border-radius:var(--rad);padding:16px}
.k-card-label{font-size:9px;text-transform:uppercase;letter-spacing:0.08em;color:var(--sub);margin-bottom:8px}
.k-card-val{font-family:var(--serif);font-size:26px;font-style:italic}
.k-card-val.g{color:var(--g)}
.k-card-sub{font-size:10px;color:var(--sub);margin-top:3px}
.k-alloc{background:var(--ink2);border:1px solid var(--line);border-radius:var(--rad);padding:18px;margin-bottom:16px}
.k-alloc-title{font-size:10px;text-transform:uppercase;letter-spacing:0.07em;color:var(--sub);margin-bottom:14px}
.k-alloc-row{display:flex;align-items:center;gap:10px;margin-bottom:10px}
.k-alloc-name{font-size:12px;width:180px;flex-shrink:0;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.k-alloc-bar{flex:1;height:5px;background:var(--ink3);border-radius:3px;overflow:hidden}
.k-alloc-fill{height:100%;border-radius:3px}
.k-alloc-pct{font-size:11px;color:var(--sub2);width:36px;text-align:right}
.k-alloc-val{font-size:11px;color:var(--sub);width:70px;text-align:right}
.k-connect{background:var(--ink2);border:1px dashed var(--line2);border-radius:var(--rad);padding:20px;text-align:center}
.k-connect-title{font-family:var(--serif);font-size:18px;font-style:italic;margin-bottom:6px;color:var(--sub2)}
.k-connect-body{font-size:11px;color:var(--sub);line-height:1.7;max-width:380px;margin:0 auto 14px}
.k-connect-steps{text-align:left;max-width:340px;margin:0 auto 14px;display:flex;flex-direction:column;gap:6px}
.k-step{display:flex;gap:8px;font-size:11px;color:var(--sub2);align-items:flex-start}
.k-step-num{width:18px;height:18px;border-radius:50%;background:var(--ink3);border:1px solid var(--line2);display:flex;align-items:center;justify-content:center;font-size:9px;color:var(--sub);flex-shrink:0;margin-top:1px}
.k-edit-btn{font-size:11px;color:var(--sub2);border:1px solid var(--line2);border-radius:7px;padding:5px 12px;transition:all .15s}
.k-edit-btn:hover{border-color:var(--g);color:var(--g)}
/* GEX */
.gex-wrap{display:flex;flex-direction:column;height:100%;overflow:hidden;position:relative}
.gex-topbar{display:flex;align-items:center;gap:8px;padding:10px 16px;border-bottom:1px solid var(--line);flex-shrink:0;flex-wrap:wrap}
.gex-ticker-btn{padding:4px 11px;border-radius:6px;font-size:11px;letter-spacing:0.05em;border:1px solid var(--line2);color:var(--sub2);transition:all .15s}
.gex-ticker-btn:hover{color:var(--text)}
.gex-ticker-btn.on{background:var(--ink3);color:var(--text);border-color:var(--line2)}
.gex-spacer{flex:1}
.gex-status{display:flex;align-items:center;gap:5px;font-size:10px;color:var(--sub)}
.gex-dot{width:6px;height:6px;border-radius:50%;background:var(--sub);flex-shrink:0}
.gex-dot.live{background:var(--g);box-shadow:0 0 5px var(--g);animation:gpulse 2s ease-in-out infinite}
.gex-dot.loading{background:var(--gold);animation:gpulse 0.8s ease-in-out infinite}
@keyframes gpulse{0%,100%{opacity:1}50%{opacity:.35}}
.gex-btn{font-size:10px;color:var(--sub);border:1px solid var(--line2);border-radius:5px;padding:3px 8px;transition:all .15s}
.gex-btn:hover{color:var(--text)}
.demo-badge{font-size:9px;padding:2px 7px;border-radius:4px;background:rgba(240,196,110,0.12);color:var(--gold);border:1px solid rgba(240,196,110,0.2);letter-spacing:0.06em;text-transform:uppercase}
.key-levels{display:grid;grid-template-columns:repeat(5,1fr);gap:1px;background:var(--line);border-bottom:1px solid var(--line);flex-shrink:0}
.kl-cell{background:var(--ink2);padding:10px 14px}
.kl-label{font-size:9px;text-transform:uppercase;letter-spacing:0.08em;color:var(--sub);margin-bottom:4px}
.kl-val{font-size:15px;font-weight:500;letter-spacing:-0.3px}
.kl-val.call{color:var(--mag)}.kl-val.flip{color:var(--b)}.kl-val.dom{color:var(--gold)}.kl-val.put{color:var(--cyan)}
.regime-badge{display:inline-flex;align-items:center;gap:4px;font-size:10px;padding:2px 8px;border-radius:4px;margin-top:4px}
.regime-badge.pos{background:rgba(182,240,110,0.12);color:var(--g);border:1px solid rgba(182,240,110,0.2)}
.regime-badge.neg{background:rgba(240,110,110,0.12);color:var(--r);border:1px solid rgba(240,110,110,0.2)}
.gex-body{display:grid;grid-template-columns:1fr 240px;flex:1;overflow:hidden;min-height:0}
.ladder-wrap{overflow-y:auto;border-right:1px solid var(--line)}
.ladder-wrap::-webkit-scrollbar{width:3px}
.ladder-wrap::-webkit-scrollbar-thumb{background:var(--line2);border-radius:2px}
.ladder-header{display:grid;position:sticky;top:0;background:var(--ink);z-index:10;border-bottom:1px solid var(--line2)}
.ladder-row{display:grid;align-items:center;padding:0 12px;border-bottom:1px solid var(--line);min-height:30px}
.ladder-row:hover{background:var(--ink2)}
.ladder-row.spot-row{background:rgba(110,184,240,0.06);border-color:rgba(110,184,240,0.25)}
.ladder-row.dom-row{background:rgba(240,196,110,0.05)}
.lh-cell{padding:7px 6px;font-size:9px;text-transform:uppercase;letter-spacing:0.07em;color:var(--sub)}
.lc-strike{font-size:11px;font-weight:500;padding:0 6px;white-space:nowrap}
.lc-gex{padding:0 6px;position:relative;display:flex;align-items:center;gap:5px;height:100%}
.gex-bar{height:14px;border-radius:2px;min-width:2px;flex-shrink:0}
.lc-gex-val{font-size:9px;color:var(--sub2);white-space:nowrap}
.cum-wrap{display:flex;flex-direction:column;padding:12px;overflow:hidden}
.cum-title{font-size:9px;text-transform:uppercase;letter-spacing:0.08em;color:var(--sub);margin-bottom:10px;flex-shrink:0}
.cum-chart{flex:1;overflow-y:auto;min-height:0}
.cum-chart::-webkit-scrollbar{width:2px}
.cum-chart::-webkit-scrollbar-thumb{background:var(--line2)}
.cum-row{display:flex;align-items:center;gap:5px;padding:1px 0}
.cum-strike{font-size:9px;color:var(--sub);width:40px;text-align:right;flex-shrink:0}
.cum-bar-wrap{flex:1;height:10px;background:var(--ink3);border-radius:2px;overflow:hidden}
.cum-bar-pos{height:100%;background:var(--mag);opacity:.65;border-radius:2px}
.cum-bar-neg{height:100%;background:var(--cyan);opacity:.65;border-radius:2px}
.cum-val{font-size:9px;width:32px;flex-shrink:0}
.cum-divider{border-top:1px dashed rgba(110,184,240,0.3);margin:3px 0}
.gex-settings-panel{position:absolute;top:42px;right:0;width:300px;background:var(--ink2);border:1px solid var(--line2);border-radius:12px;padding:18px;z-index:100;box-shadow:0 8px 32px rgba(0,0,0,0.5)}
.gex-settings-title{font-size:12px;font-weight:500;margin-bottom:14px;display:flex;align-items:center;justify-content:space-between}
.toggle-row{display:flex;align-items:center;justify-content:space-between;margin-bottom:14px}
.toggle-label{font-size:11px;color:var(--sub2)}
.toggle{width:36px;height:20px;border-radius:10px;background:var(--ink3);border:1px solid var(--line2);position:relative;cursor:pointer;transition:background .2s}
.toggle.on{background:var(--g)}
.toggle-knob{width:14px;height:14px;border-radius:50%;background:var(--ink);position:absolute;top:2px;left:2px;transition:left .2s}
.toggle.on .toggle-knob{left:18px}
`;

/* ─── CONSTANTS ──────────────────────────────────────────────────────────── */
const DEFAULT_TICKERS = ["NVDA","RKLB","MU","META","FCEL"];
const GEX_TICKERS    = ["SPY","QQQ","SPX","IWM","NVDA","AAPL","TSLA"];
const ALLOC_COLORS   = ["#b6f06e","#6eb8f0","#f0c46e","#c06ef0","#f06e6e","#6ef0c4"];
const REFRESH_MS     = 3*60*1000;
const K401_DEFAULT   = {
  total:125000,contributions:8400,ytdReturn:11.2,vested:125000,
  positions:[
    {name:"Vanguard S&P 500 Index",pct:55,val:68750},
    {name:"Vanguard Total Bond",pct:15,val:18750},
    {name:"SDBA Brokerage Sleeve",pct:20.2,val:25200},
    {name:"Target Date 2050",pct:9.8,val:12300},
  ],
};

/* ─── HELPERS ────────────────────────────────────────────────────────────── */
const fmt  = (n,pre="",suf="") => n==null?"—":`${pre}${Number(n).toLocaleString("en-US",{maximumFractionDigits:2})}${suf}`;
const fmtM = n => { if(n==null)return"—"; const a=Math.abs(n); if(a>=1e12)return`$${(n/1e12).toFixed(2)}T`; if(a>=1e9)return`$${(n/1e9).toFixed(2)}B`; if(a>=1e6)return`$${(n/1e6).toFixed(2)}M`; return`$${n.toLocaleString()}`; };
const fmtG = n => { if(!n&&n!==0)return""; const a=Math.abs(n); if(a>=1e9)return`${(n/1e9).toFixed(1)}B`; if(a>=1e6)return`${(n/1e6).toFixed(0)}M`; if(a>=1e3)return`${(n/1e3).toFixed(0)}K`; return n.toFixed(0); };
const sign = n => n>0?"+":"";
const todayStr  = () => new Date().toISOString().slice(0,10);
const inDaysStr = d => { const t=new Date(); t.setDate(t.getDate()+d); return t.toISOString().slice(0,10); };

/* ─── BLACK-SCHOLES ──────────────────────────────────────────────────────── */
function normPDF(x){ return Math.exp(-0.5*x*x)/Math.sqrt(2*Math.PI); }
function bsGamma(S,K,T,sigma){
  if(T<=0||sigma<=0||S<=0||K<=0)return 0;
  const d1=(Math.log(S/K)+(0.05+0.5*sigma*sigma)*T)/(sigma*Math.sqrt(T));
  return normPDF(d1)/(S*sigma*Math.sqrt(T));
}

/* ─── SPOT FETCH ─────────────────────────────────────────────────────────── */
async function fetchSpot(ticker){
  // Route through Netlify Function — no CORS issues, runs server-side
  try{
    const r=await fetch(`/.netlify/functions/spot?ticker=${encodeURIComponent(ticker)}`);
    if(r.ok){const d=await r.json();if(d.price&&d.price>0){console.log("[Port] spot via function:",d.price,d.source);return d.price;}}
  }catch(e){console.warn("[Port] spot function failed:",e.message);}
  return null;
}

/* ─── GEX DEMO DATA ──────────────────────────────────────────────────────── */
function generateDemoData(ticker,liveSpot){
  const fallbacks={SPY:580,QQQ:500,SPX:5800,IWM:210,NVDA:115,AAPL:200,TSLA:280};
  const vols={SPY:0.14,QQQ:0.18,SPX:0.14,IWM:0.20,NVDA:0.55,AAPL:0.28,TSLA:0.65};
  const spot=liveSpot||fallbacks[ticker]||400,vol=vols[ticker]||0.20;
  const step=ticker==="SPX"?25:5;
  const expiries=[todayStr(),inDaysStr(7),inDaysStr(14)];
  const lo=Math.round(spot*0.96/step)*step,hi=Math.round(spot*1.04/step)*step;
  const strikes=[];for(let k=lo;k<=hi;k+=step)strikes.push(k);
  const rows=strikes.map(K=>{
    let netGEX=0;const byExp={};
    expiries.forEach(exp=>{
      const dte=Math.max(0.5,(new Date(exp)-new Date())/86400000);
      const T=dte/365,gamma=bsGamma(spot,K,T,vol);
      const oiC=Math.floor(Math.random()*8000+200),oiP=Math.floor(Math.random()*8000+200);
      const net=gamma*oiC*100*spot*spot*0.01-(gamma*oiP*100*spot*spot*0.01);
      netGEX+=net;byExp[exp]=net;
    });
    return{strike:K,netGEX,byExp};
  });
  const totalGEX=rows.reduce((s,r)=>s+r.netGEX,0);
  const above=rows.filter(r=>r.strike>spot),below=rows.filter(r=>r.strike<spot);
  const callWall=above.slice().sort((a,b)=>b.netGEX-a.netGEX)[0]?.strike;
  const putWall=below.slice().sort((a,b)=>a.netGEX-b.netGEX)[0]?.strike;
  let flipStrike=null,minD=Infinity;
  for(let i=1;i<rows.length;i++){
    if((rows[i-1].netGEX<0&&rows[i].netGEX>=0)||(rows[i-1].netGEX>=0&&rows[i].netGEX<0)){
      const d=Math.abs(rows[i].strike-spot);if(d<minD){minD=d;flipStrike=rows[i].strike;}
    }
  }
  const dominant=rows.slice().sort((a,b)=>Math.abs(b.netGEX)-Math.abs(a.netGEX))[0]?.strike;
  return{spot,strikes:rows,expiries,callWall,putWall,flipStrike,dominant,totalGEX,isPositive:totalGEX>0};
}

/* ─── POLYGON GEX ────────────────────────────────────────────────────────── */
async function fetchPolygonGEX(ticker,apiKey){
  const sr=await fetch(`https://api.polygon.io/v2/last/trade/${ticker}?apiKey=${apiKey}`);
  if(!sr.ok)throw new Error("Spot fetch failed");
  const sj=await sr.json();const spot=sj.results?.p;if(!spot)throw new Error("No spot");
  const lo=(spot*0.96).toFixed(2),hi=(spot*1.04).toFixed(2);
  let url=`https://api.polygon.io/v3/snapshot/options/${ticker}?strike_price.gte=${lo}&strike_price.lte=${hi}&expiration_date.gte=${todayStr()}&expiration_date.lte=${inDaysStr(21)}&limit=250&apiKey=${apiKey}`;
  let contracts=[],pages=0;
  while(url&&pages<5){const r=await fetch(url);const j=await r.json();(j.results||[]).forEach(c=>contracts.push(c));url=j.next_url?j.next_url+"&apiKey="+apiKey:null;pages++;}
  const strikeMap={},expSet=new Set();
  contracts.forEach(c=>{
    const d=c.details||{},g=c.greeks?.gamma,oi=c.open_interest;
    if(!g||!oi||!d.strike_price||!d.expiration_date)return;
    const K=d.strike_price,exp=d.expiration_date;expSet.add(exp);
    const gex=g*oi*100*spot*spot*0.01,net=d.contract_type==="call"?gex:-gex;
    if(!strikeMap[K])strikeMap[K]={strike:K,netGEX:0,byExp:{}};
    strikeMap[K].netGEX+=net;strikeMap[K].byExp[exp]=(strikeMap[K].byExp[exp]||0)+net;
  });
  const rows=Object.values(strikeMap).sort((a,b)=>a.strike-b.strike);
  const expiries=Array.from(expSet).sort().slice(0,3);
  const totalGEX=rows.reduce((s,r)=>s+r.netGEX,0);
  const above=rows.filter(r=>r.strike>spot),below=rows.filter(r=>r.strike<spot);
  const callWall=above.slice().sort((a,b)=>b.netGEX-a.netGEX)[0]?.strike;
  const putWall=below.slice().sort((a,b)=>a.netGEX-b.netGEX)[0]?.strike;
  let flipStrike=null,minD=Infinity;
  for(let i=1;i<rows.length;i++){
    if((rows[i-1].netGEX<0&&rows[i].netGEX>=0)||(rows[i-1].netGEX>=0&&rows[i].netGEX<0)){
      const d=Math.abs(rows[i].strike-spot);if(d<minD){minD=d;flipStrike=rows[i].strike;}
    }
  }
  const dominant=rows.slice().sort((a,b)=>Math.abs(b.netGEX)-Math.abs(a.netGEX))[0]?.strike;
  return{spot,strikes:rows,expiries,callWall,putWall,flipStrike,dominant,totalGEX,isPositive:totalGEX>0};
}

/* ─── FINNHUB ────────────────────────────────────────────────────────────── */
async function fhFetch(path, params){
  // Route through Netlify Function server-side to avoid CORS blocks
  const query = new URLSearchParams({path, ...params}).toString();
  try{const r=await fetch(`/.netlify/functions/finnhub?${query}`);return r.ok?r.json():null;}catch{return null;}
}
const getQuote   = (t,k)=>fhFetch("/api/v1/quote",{symbol:t,token:k});
const getProfile = (t,k)=>fhFetch("/api/v1/stock/profile2",{symbol:t,token:k});
const getMetrics = (t,k)=>fhFetch("/api/v1/stock/metric",{symbol:t,metric:"all",token:k});
const getNews    = (t,k)=>{const td=todayStr(),pd=new Date(Date.now()-7*86400000).toISOString().slice(0,10);return fhFetch("/api/v1/company-news",{symbol:t,from:pd,to:td,token:k});}
const getRec     = (t,k)=>fhFetch("/api/v1/stock/recommendation",{symbol:t,token:k});

/* ─── AI STREAM ──────────────────────────────────────────────────────────── */
async function streamAI(prompt,onChunk,maxTokens=1800){
  // Netlify Functions don't support true streaming — we simulate it by
  // fetching the full response then revealing text word-by-word for the UX feel
  onChunk("Researching " + prompt.slice(0,40).split("\n")[0] + "…");
  const res=await fetch("/.netlify/functions/ai",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({model:"claude-sonnet-4-20250514",max_tokens:maxTokens,stream:false,tools:[{type:"web_search_20250305",name:"web_search"}],messages:[{role:"user",content:prompt}]})});
  const data=await res.json();
  const full=data.content?.filter(b=>b.type==="text").map(b=>b.text).join("")||"";
  // Simulate streaming word by word for the typewriter effect
  const words=full.split(" ");
  let built="";
  for(let i=0;i<words.length;i++){
    built+=( i===0?"": " ")+words[i];
    if(i%8===0)onChunk(built);
    await new Promise(r=>setTimeout(r,18));
  }
  onChunk(full);
  return full;
}

/* ─── JSON AI CALL ───────────────────────────────────────────────────────── */
async function callAIJSON(prompt){
  const res=await fetch("/.netlify/functions/ai",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({model:"claude-sonnet-4-20250514",max_tokens:1200,tools:[{type:"web_search_20250305",name:"web_search"}],messages:[{role:"user",content:prompt}]})});
  const data=await res.json();
  const text=data.content?.filter(b=>b.type==="text").map(b=>b.text).join("")||"";
  try{return JSON.parse(text.replace(/```json|```/g,"").trim());}catch{return null;}
}

/* ═══════════════════════════════════════════════════════════════════════════
   RSI GAUGE — SVG semicircle
═══════════════════════════════════════════════════════════════════════════ */
function RSIGauge({rsi}){
  if(rsi==null)return <div style={{textAlign:"center",color:"var(--sub)",fontSize:11,padding:"20px 0"}}>No RSI data</div>;
  const v=Math.min(Math.max(rsi,0),100);
  const angle=-180+v*1.8; // -180 to 0
  const r=52,cx=70,cy=70;
  const toXY=(deg,radius)=>{const rad=deg*Math.PI/180;return[cx+radius*Math.cos(rad),cy+radius*Math.sin(rad)];};
  const zones=[{from:-180,to:-108,color:"#6ef0f0"},{from:-108,to:-72,color:"#b6f06e"},{from:-72,to:-36,color:"#f0c46e"},{from:-36,to:0,color:"#f06e6e"}];
  const arcPath=(from,to,rad)=>{
    const[x1,y1]=toXY(from,rad);const[x2,y2]=toXY(to,rad);
    const large=Math.abs(to-from)>180?1:0;return`M${x1},${y1} A${rad},${rad} 0 ${large},1 ${x2},${y2}`;
  };
  const [nx,ny]=toXY(angle,r-8);
  const color=v<30?"#6ef0f0":v<50?"#b6f06e":v<70?"#f0c46e":"#f06e6e";
  const label=v<30?"Oversold":v<50?"Neutral-Low":v<70?"Neutral-High":"Overbought";
  return(
    <div className="rsi-wrap">
      <svg width="140" height="82" viewBox="0 0 140 82">
        {zones.map((z,i)=>(
          <path key={i} d={arcPath(z.from,z.to,r)} fill="none" stroke={z.color} strokeWidth="10" opacity="0.25"/>
        ))}
        <path d={arcPath(-180,angle,r)} fill="none" stroke={color} strokeWidth="10" opacity="0.9"/>
        <circle cx={nx} cy={ny} r="5" fill={color}/>
        <line x1={cx} y1={cy} x2={nx} y2={ny} stroke={color} strokeWidth="2" opacity="0.5"/>
        {[0,25,50,75,100].map(tick=>{
          const a=-180+tick*1.8;const[tx,ty]=toXY(a,r+12);
          return <text key={tick} x={tx} y={ty} fill="rgba(168,168,192,0.6)" fontSize="7" textAnchor="middle" dominantBaseline="middle">{tick}</text>;
        })}
      </svg>
      <div className="rsi-num" style={{color}}>{v.toFixed(1)}</div>
      <div className="rsi-label" style={{color}}>{label}</div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   RADAR SCORECARD — custom SVG hexagon
═══════════════════════════════════════════════════════════════════════════ */
function RadarChart({scores}){
  const axes=["Revenue Growth","Margin Quality","Balance Sheet","Earnings Traj.","Valuation","Analyst Conv."];
  const n=axes.length;const cx=110,cy=110,maxR=80;
  const pts=scores.map((s,i)=>{
    const angle=(i/n)*2*Math.PI-Math.PI/2;
    const r=(s/10)*maxR;
    return[cx+r*Math.cos(angle),cy+r*Math.sin(angle)];
  });
  const gridPts=(frac)=>axes.map((_,i)=>{
    const angle=(i/n)*2*Math.PI-Math.PI/2;
    return[cx+frac*maxR*Math.cos(angle),cy+frac*maxR*Math.sin(angle)];
  });
  const polyStr=pts=>`${pts.map(([x,y])=>`${x},${y}`).join(" ")}`;
  return(
    <svg width="220" height="220" viewBox="0 0 220 220">
      {[0.25,0.5,0.75,1].map(f=>(
        <polygon key={f} points={polyStr(gridPts(f))} fill="none" stroke="rgba(255,255,255,0.07)" strokeWidth="1"/>
      ))}
      {axes.map((_,i)=>{
        const angle=(i/n)*2*Math.PI-Math.PI/2;
        const[ex,ey]=[cx+maxR*Math.cos(angle),cy+maxR*Math.sin(angle)];
        return<line key={i} x1={cx} y1={cy} x2={ex} y2={ey} stroke="rgba(255,255,255,0.06)" strokeWidth="1"/>;
      })}
      <polygon points={polyStr(pts)} fill="rgba(182,240,110,0.12)" stroke="#b6f06e" strokeWidth="1.5"/>
      {pts.map(([x,y],i)=><circle key={i} cx={x} cy={y} r="3.5" fill="#b6f06e"/>)}
      {axes.map((label,i)=>{
        const angle=(i/n)*2*Math.PI-Math.PI/2;
        const[lx,ly]=[cx+(maxR+18)*Math.cos(angle),cy+(maxR+18)*Math.sin(angle)];
        return<text key={i} x={lx} y={ly} fill="rgba(168,168,192,0.7)" fontSize="8.5" textAnchor="middle" dominantBaseline="middle">{label}</text>;
      })}
    </svg>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   MACD BARS
═══════════════════════════════════════════════════════════════════════════ */
function MACDBars({histogram}){
  if(!histogram||histogram.length===0)return<div style={{color:"var(--sub)",fontSize:11,padding:"10px 0"}}>No MACD data</div>;
  const max=Math.max(...histogram.map(Math.abs),0.01);
  return(
    <svg width="100%" height="60" style={{display:"block"}}>
      {histogram.slice(-20).map((v,i,arr)=>{
        const barW=Math.floor(100/arr.length);
        const pct=Math.abs(v)/max*26;
        const pos=v>=0;
        const x=`${(i/arr.length)*100}%`;
        const barY=pos?30-pct:30;
        return(
          <g key={i}>
            <rect x={x} y={barY} width={`${barW*0.7}%`} height={pct||1} fill={pos?"var(--g)":"var(--r)"} opacity="0.75" rx="1"/>
          </g>
        );
      })}
      <line x1="0" y1="30" x2="100%" y2="30" stroke="rgba(255,255,255,0.08)" strokeWidth="1"/>
    </svg>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   RESEARCH PAGE — main stock analysis view
═══════════════════════════════════════════════════════════════════════════ */
function ResearchPage({sym,stockData,apiKey,aiCache,setAiCache}){
  const sd=stockData[sym];
  const q=sd?.quote,p=sd?.profile,m=sd?.metrics?.metric,news=sd?.news||[],rec=sd?.rec;

  // AI state
  const [narrative,setNarrative]=useState(aiCache[sym]?.narrative||"");
  const [techData,setTechData]  =useState(aiCache[sym]?.tech||null);
  const [catalysts,setCatalysts]=useState(aiCache[sym]?.catalysts||null);
  const [narLoading,setNarLoading]=useState(false);
  const [techLoading,setTechLoading]=useState(false);
  const [catLoading,setCatLoading]=useState(false);
  const loaded=useRef({});

  // derived
  const price   = q?.c;
  const chg     = q?.d;
  const chgPct  = q?.dp;
  const wkHigh  = m?.["52WeekHigh"];
  const wkLow   = m?.["52WeekLow"];
  const rangePct= (wkHigh&&wkLow&&price)?((price-wkLow)/(wkHigh-wkLow)*100):50;

  // signal badge from RSI + MA
  const rsiVal = techData?.rsi ?? null;
  const maScore= techData?.maScore ?? null; // 0-100
  const momentumScore= techData?.momentumScore ?? null;
  const signalStr= momentumScore==null?"—":momentumScore>=60?"Bullish":momentumScore<=40?"Bearish":"Neutral";
  const signalCls= momentumScore==null?"neut":momentumScore>=60?"bull":momentumScore<=40?"bear":"neut";

  // scores for radar
  const scores = techData?.scores ?? [5,5,5,5,5,5];
  const scenarios = techData?.scenarios ?? null;
  const srLevels  = techData?.srLevels  ?? [];
  const maDevs    = techData?.maDevs    ?? [];
  const macdHist  = techData?.macdHist  ?? [];
  const entryZone = techData?.entry ?? null;
  const stopLevel = techData?.stop ?? null;
  const target3m  = techData?.target3m ?? null;

  useEffect(()=>{
    if(!sym)return;
    // load tech data via JSON AI
    if(!loaded.current[`${sym}_tech`]&&!techData){
      loaded.current[`${sym}_tech`]=true;
      setTechLoading(true);
      const mp=m?`P/E:${m.peBasicExclExtraTTM?.toFixed(1)}, GrossMargin:${m.grossMarginTTM?.toFixed(1)}%, ROE:${m.roeTTM?.toFixed(1)}%, RevGrowth3Y:${m.revenueGrowth3Y?.toFixed(1)}%, Beta:${m.beta?.toFixed(2)}, 52wH:${wkHigh}, 52wL:${wkLow}`:"no fundamentals available";
      const rp=rec?`Buy:${rec.buy}, Hold:${rec.hold}, Sell:${rec.sell}, StrongBuy:${rec.strongBuy}`:"no rec data";
      callAIJSON(`You are a quantitative analyst. For stock ${sym} (current price: $${price?.toFixed(2)||"unknown"}), return ONLY valid JSON with these exact fields:
{
  "rsi": <number 0-100 estimated from recent price action>,
  "maScore": <number 0-100, 100=all MAs bullish>,
  "momentumScore": <number 0-100 overall momentum>,
  "maDevs": [{"name":"20d","pct":<deviation % from 20d SMA>},{"name":"50d","pct":<deviation %>},{"name":"200d","pct":<deviation %>}],
  "macdHist": [<array of 20 recent MACD histogram values, positive=bullish>],
  "srLevels": [{"type":"resistance","price":<num>,"note":"<string>"},{"type":"support","price":<num>,"note":"<string>"},{"type":"resistance","price":<num>,"note":"<string>"},{"type":"support","price":<num>,"note":"<string>"}],
  "scores": [<revenueGrowth 0-10>,<marginQuality 0-10>,<balanceSheet 0-10>,<earningsTraj 0-10>,<valuation 0-10>,<analystConviction 0-10>],
  "scenarios": {
    "bull":{"target":<price>,"assumption":"<1 sentence>"},
    "base":{"target":<price>,"assumption":"<1 sentence>"},
    "bear":{"target":<price>,"assumption":"<1 sentence>"}
  },
  "entry": "<price range string>",
  "stop": "<price string>",
  "target3m": "<price string>"
}
Fundamentals context: ${mp}. Analyst rec: ${rp}. Search for latest ${sym} technical analysis and price targets to inform your estimates. Return ONLY the JSON object, no markdown, no explanation.`)
        .then(d=>{
          if(d){setTechData(d);setAiCache(prev=>({...prev,[sym]:{...prev[sym],tech:d}}));}
          setTechLoading(false);
        });
    }
    // narrative
    if(!loaded.current[`${sym}_nar`]&&!narrative){
      loaded.current[`${sym}_nar`]=true;
      setNarLoading(true);
      streamAI(`You are a senior equity analyst writing an institutional research note on ${sym}. Write exactly 4 paragraphs separated by blank lines, no headers, no bullet points, no markdown:

Paragraph 1 — WHAT'S DRIVING IT: What is moving this stock right now? Search for the latest news, catalysts, and macro context. Be specific about dates and events.

Paragraph 2 — BULL CASE: The strongest bull case with 2-3 specific upcoming catalysts, dates if known, and what they could mean for the stock.

Paragraph 3 — BEAR CASE: The 3 biggest risks ranked by probability. Be direct and specific — name the actual risks, not generic disclaimers.

Paragraph 4 — VERDICT: A clear directional call. State whether you'd buy, hold, or avoid here. Give a specific suggested entry price zone, a stop-loss level, and a 3-month price target with reasoning. Sign off with the date of your analysis.

Current price: $${price?.toFixed(2)||"unknown"}. Write like a $50k/year Bloomberg terminal research note.`,
        t=>{setNarrative(t);},2000)
        .then(t=>{setNarLoading(false);setAiCache(prev=>({...prev,[sym]:{...prev[sym],narrative:t}}));});
    }
    // catalysts
    if(!loaded.current[`${sym}_cat`]&&!catalysts){
      loaded.current[`${sym}_cat`]=true;
      setCatLoading(true);
      callAIJSON(`Search for upcoming catalysts and events for ${sym} stock. Return ONLY valid JSON array (no markdown):
[{"date":"<YYYY-MM-DD or month>","title":"<event name>","tag":"bull|bear|neut","detail":"<one sentence>"}]
Include: earnings date, product launches, regulatory decisions, contract announcements, macro events. Maximum 6 items. Search for current information.`)
        .then(d=>{
          if(Array.isArray(d))setCatalysts(d);
          setAiCache(prev=>({...prev,[sym]:{...prev[sym],catalysts:d}}));
          setCatLoading(false);
        });
    }
  },[sym]);

  const priceFmt = price?`$${price.toLocaleString("en-US",{minimumFractionDigits:2,maximumFractionDigits:2})}`:"—";

  return(
    <div className="rp">
      {/* ── SNAPSHOT BAR ── */}
      <div className="snap">
        <div className="snap-left">
          <div className="snap-sym">{sym}</div>
          <div className="snap-name">{p?.name||sym} · {p?.exchange||"NASDAQ"} · {p?.finnhubIndustry||""}</div>
        </div>
        <div className="snap-mid">
          <div className="snap-price-row">
            <div className="snap-price" style={{color:chgPct==null?"var(--text)":chgPct>=0?"var(--g)":"var(--r)"}}>{priceFmt}</div>
            {chg!=null&&<span className={`snap-chg ${chgPct>=0?"pos":"neg"}`}>{sign(chg)}{fmt(chg,"$")} ({sign(chgPct)}{fmt(chgPct,"","%")})</span>}
          </div>
          {wkHigh&&wkLow&&(
            <div className="snap-range-wrap">
              <span className="snap-range-label">{fmt(wkLow,"$")}</span>
              <div className="snap-range-track" style={{flex:1}}>
                <div className="snap-range-fill" style={{width:"100%",opacity:0.3}}/>
                <div className="snap-range-dot" style={{left:`${rangePct}%`}}/>
              </div>
              <span className="snap-range-label">{fmt(wkHigh,"$")}</span>
              <span className="snap-range-label" style={{color:"var(--sub)"}}>52W Range</span>
            </div>
          )}
          <div style={{display:"flex",gap:16,flexWrap:"wrap"}}>
            {[
              {l:"Mkt Cap",v:fmtM(p?.marketCapitalization?p.marketCapitalization*1e6:null)},
              {l:"Vol",v:fmt(q?.v)},
              {l:"P/E",v:fmt(m?.peBasicExclExtraTTM)},
              {l:"Beta",v:fmt(m?.beta)},
              {l:"Gross Margin",v:fmt(m?.grossMarginTTM,""," %")},
            ].map((x,i)=>(
              <div key={i} style={{display:"flex",flexDirection:"column",gap:2}}>
                <span style={{fontSize:9,color:"var(--sub)",textTransform:"uppercase",letterSpacing:"0.07em"}}>{x.l}</span>
                <span style={{fontSize:12,color:"var(--text)"}}>{x.v}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="snap-right">
          <div className={`signal-badge ${signalCls}`}>
            {signalStr==="Bullish"?"▲ ":signalStr==="Bearish"?"▼ ":"— "}{signalStr}
          </div>
          {momentumScore!=null&&<div style={{fontSize:10,color:"var(--sub)"}}>Momentum: {momentumScore}/100</div>}
          <div style={{fontSize:10,color:"var(--sub)"}}>{new Date().toLocaleDateString("en-US",{month:"short",day:"numeric",year:"numeric"})}</div>
        </div>
      </div>

      {/* ── SECTION 1: TECHNICAL DASHBOARD ── */}
      <div className="rp-full" style={{paddingTop:24}}>
        <div className="sec-title">Technical Dashboard</div>
      </div>
      {techLoading&&!techData?(
        <div style={{display:"flex",alignItems:"center",justifyContent:"center",gap:12,padding:"32px 28px",color:"var(--sub)",fontSize:11}}>
          <div className="spin"/><span>Computing technical indicators…</span>
        </div>
      ):(
        <div className="rp-grid" style={{gridTemplateColumns:"200px 1fr 200px"}}>
          {/* RSI */}
          <div className="rp-card">
            <div className="sec-title" style={{fontSize:9,marginBottom:8}}>RSI (14)</div>
            <RSIGauge rsi={rsiVal}/>
          </div>
          {/* MACD + MA Deviations */}
          <div className="rp-card">
            <div className="sec-title" style={{fontSize:9,marginBottom:8}}>MACD Histogram</div>
            <MACDBars histogram={macdHist}/>
            <div style={{marginTop:16}}>
              <div className="sec-title" style={{fontSize:9,marginBottom:10}}>MA Deviation from Price</div>
              {maDevs.length===0&&<div style={{fontSize:11,color:"var(--sub)"}}>Loading…</div>}
              {maDevs.map((ma,i)=>{
                const pos=(ma.pct||0)>=0;
                const absP=Math.min(Math.abs(ma.pct||0),100);
                return(
                  <div key={i} className="ma-row">
                    <span className="ma-name">{ma.name}</span>
                    <div className="ma-track">
                      <div className="ma-fill" style={{width:`${absP}%`,background:pos?"var(--g)":"var(--r)"}}/>
                    </div>
                    <span className="ma-pct" style={{color:pos?"var(--g)":"var(--r)"}}>{sign(ma.pct||0)}{(ma.pct||0).toFixed(1)}%</span>
                  </div>
                );
              })}
            </div>
          </div>
          {/* Momentum score + S/R */}
          <div className="rp-card" style={{display:"flex",flexDirection:"column",gap:16}}>
            <div>
              <div className="sec-title" style={{fontSize:9,marginBottom:8}}>Momentum Score</div>
              <div className="mscore-wrap">
                <div className="mscore-num" style={{color:momentumScore==null?"var(--sub)":momentumScore>=60?"var(--g)":momentumScore<=40?"var(--r)":"var(--gold)"}}>{momentumScore??"-"}</div>
                <div className="mscore-label">out of 100</div>
                <div className="mscore-sub">{momentumScore==null?"—":momentumScore>=70?"Strong Bullish Momentum":momentumScore>=55?"Moderate Bullish":momentumScore<=30?"Strong Bearish":momentumScore<=45?"Moderate Bearish":"Neutral"}</div>
              </div>
            </div>
            <div>
              <div className="sec-title" style={{fontSize:9,marginBottom:8}}>Key Levels</div>
              {srLevels.length===0&&<div style={{fontSize:11,color:"var(--sub)"}}>Loading…</div>}
              {srLevels.map((sr,i)=>(
                <div key={i} className="sr-row">
                  <span className={`sr-type ${sr.type==="resistance"?"res":"sup"}`}>{sr.type==="resistance"?"R":"S"}</span>
                  <span className="sr-price">${(sr.price||0).toLocaleString()}</span>
                  <span className="sr-note">{sr.note}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ── SECTION 2: FUNDAMENTAL SCORECARD ── */}
      <div className="rp-full" style={{paddingTop:24}}>
        <div className="sec-title">Fundamental Scorecard</div>
      </div>
      <div className="rp-grid" style={{gridTemplateColumns:"240px 1fr"}}>
        <div className="rp-card" style={{display:"flex",alignItems:"center",justifyContent:"center"}}>
          <RadarChart scores={scores}/>
        </div>
        <div className="rp-card">
          <div style={{marginBottom:16}}>
            <div className="sec-title" style={{fontSize:9,marginBottom:10}}>Axis Scores</div>
            {["Revenue Growth","Margin Quality","Balance Sheet","Earnings Trajectory","Valuation vs Peers","Analyst Conviction"].map((ax,i)=>(
              <div key={i} className="axis-row">
                <span className="axis-name">{ax}</span>
                <div className="axis-track">
                  <div className="axis-fill" style={{width:`${(scores[i]||0)*10}%`,background:scores[i]>=7?"var(--g)":scores[i]>=4?"var(--gold)":"var(--r)"}}/>
                </div>
                <span className="axis-score">{scores[i]||0}</span>
              </div>
            ))}
          </div>
          {scenarios&&(
            <div className="scenario-grid">
              {[
                {k:"bull",label:"Bull Case",cls:"bull"},
                {k:"base",label:"Base Case",cls:"base"},
                {k:"bear",label:"Bear Case",cls:"bear"},
              ].map(s=>(
                <div key={s.k} className={`scenario-card ${s.cls}`}>
                  <div className="scenario-label">{s.label}</div>
                  <div className="scenario-target">${scenarios[s.k]?.target?.toLocaleString()||"—"}</div>
                  <div className="scenario-assumption">{scenarios[s.k]?.assumption||"—"}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* ── SECTION 3: ANALYST RECS ── */}
      {rec&&(
        <div className="rp-full" style={{paddingTop:16}}>
          <div className="rp-card">
            <div className="sec-title" style={{fontSize:9,marginBottom:12}}>Wall Street Analyst Consensus · {rec.period?.slice(0,7)}</div>
            <div style={{display:"grid",gridTemplateColumns:"repeat(5,1fr)",gap:8}}>
              {[{l:"Strong Buy",v:rec.strongBuy,c:"var(--g)"},{l:"Buy",v:rec.buy,c:"#8cf08c"},{l:"Hold",v:rec.hold,c:"var(--gold)"},{l:"Sell",v:rec.sell,c:"#f09a6e"},{l:"Strong Sell",v:rec.strongSell,c:"var(--r)"}].map((x,i)=>(
                <div key={i} style={{background:"var(--ink3)",borderRadius:8,padding:"10px 12px",textAlign:"center"}}>
                  <div style={{fontSize:9,textTransform:"uppercase",letterSpacing:"0.07em",color:"var(--sub)",marginBottom:6}}>{x.l}</div>
                  <div style={{fontFamily:"var(--serif)",fontSize:26,fontStyle:"italic",color:x.c}}>{x.v??0}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ── SECTION 4: AI NARRATIVE ── */}
      <div className="rp-full" style={{paddingTop:16}}>
        <div className="sec-title">Research Note</div>
      </div>
      <div className="narrative-wrap">
        {narLoading&&!narrative&&(
          <div style={{display:"flex",alignItems:"center",gap:12,color:"var(--sub)",fontSize:11}}>
            <div className="spin"/><span>Writing research note…</span>
          </div>
        )}
        {narrative&&(
          <div className="narrative-text">
            {narrative}
            {narLoading&&<span className="cursor"/>}
          </div>
        )}
      </div>

      {/* ── VERDICT BOX ── */}
      {(entryZone||stopLevel||target3m)&&(
        <div style={{padding:"16px 28px 0"}}>
          <div className="rp-card">
            <div className="sec-title" style={{fontSize:9,marginBottom:12}}>Trade Parameters</div>
            <div className="verdict-wrap">
              <div className="verdict-cell">
                <div className="verdict-label">Entry Zone</div>
                <div className="verdict-val" style={{color:"var(--b)"}}>{entryZone||"—"}</div>
              </div>
              <div className="verdict-cell">
                <div className="verdict-label">Stop Loss</div>
                <div className="verdict-val" style={{color:"var(--r)"}}>{stopLevel||"—"}</div>
              </div>
              <div className="verdict-cell">
                <div className="verdict-label">3-Month Target</div>
                <div className="verdict-val" style={{color:"var(--g)"}}>{target3m||"—"}</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── SECTION 5: CATALYST CALENDAR ── */}
      <div className="rp-full" style={{paddingTop:16}}>
        <div className="sec-title">Catalyst Calendar</div>
      </div>
      <div style={{padding:"0 28px"}}>
        <div className="rp-card">
          {catLoading&&!catalysts&&(
            <div style={{display:"flex",alignItems:"center",gap:12,color:"var(--sub)",fontSize:11}}>
              <div className="spin"/><span>Searching for upcoming catalysts…</span>
            </div>
          )}
          {catalysts&&catalysts.map((c,i)=>(
            <div key={i} className="cal-item">
              <div className="cal-date">{c.date}</div>
              <div className={`cal-dot ${c.tag||"neut"}`}/>
              <div className="cal-body">
                <div className="cal-title">{c.title}</div>
                <span className={`cal-tag ${c.tag||"neut"}`}>{c.tag==="bull"?"Bullish":c.tag==="bear"?"Bearish":"Neutral"}</span>
                {c.detail&&<div style={{fontSize:10,color:"var(--sub)",marginTop:4}}>{c.detail}</div>}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── SECTION 6: RECENT NEWS ── */}
      {news.length>0&&(
        <>
          <div className="rp-full" style={{paddingTop:16}}>
            <div className="sec-title">Recent News</div>
          </div>
          <div style={{padding:"0 28px"}}>
            {news.slice(0,6).map((n,i)=>(
              <div key={i} className="news-item" style={{cursor:"pointer"}} onClick={()=>n.url&&window.open(n.url,"_blank")}>
                <div className="news-head">
                  <div className="news-hl">{n.headline}</div>
                  <span className="news-sent neu">↗</span>
                </div>
                <div className="news-meta">{n.source} · {new Date(n.datetime*1000).toLocaleDateString()}</div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   GEX COMPONENTS
═══════════════════════════════════════════════════════════════════════════ */
function GexSettings({demoMode,setDemoMode,polyKey,setPolyKey,ticker,manualSpot,setManualSpot,onClose}){
  const [k,setK]=useState(polyKey);
  const [ms,setMs]=useState(manualSpot[ticker]||"");
  const save=()=>{
    setPolyKey(k);try{localStorage.setItem("polygon_api_key",k);}catch{}
    if(ms)setManualSpot(prev=>({...prev,[ticker]:ms}));
    else setManualSpot(prev=>{const n={...prev};delete n[ticker];return n;});
    onClose();
  };
  return(
    <div className="gex-settings-panel">
      <div className="gex-settings-title"><span>GEX Settings</span><button onClick={onClose} style={{color:"var(--sub)",fontSize:16}}>×</button></div>
      <div className="toggle-row">
        <span className="toggle-label">Demo mode (Black-Scholes sim)</span>
        <div className={`toggle ${demoMode?"on":""}`} onClick={()=>setDemoMode(p=>!p)}><div className="toggle-knob"/></div>
      </div>
      <div className="setup-field">
        <label className="setup-label">Manual spot override for {ticker}</label>
        <input className="setup-input" placeholder="e.g. 740.50" value={ms} onChange={e=>setMs(e.target.value)} type="number" step="0.01" style={{fontSize:11,padding:"7px 10px"}}/>
        <div style={{fontSize:10,color:"var(--sub)",marginTop:5}}>Leave blank to auto-fetch.</div>
      </div>
      <div className="setup-field">
        <label className="setup-label">Polygon.io API Key</label>
        <input className="setup-input" placeholder="Paste key…" value={k} onChange={e=>setK(e.target.value)} style={{fontSize:11,padding:"7px 10px"}}/>
      </div>
      <div className="setup-note" style={{marginBottom:10}}>Polygon Starter ($29/mo) required for live options data. Key stored as polygon_api_key in localStorage.</div>
      <div style={{display:"flex",gap:8}}>
        <button className="setup-btn pri" onClick={save} style={{flex:1,padding:"7px"}}>Save & Refresh</button>
        <button className="setup-btn sec" onClick={onClose} style={{flex:1,padding:"7px",border:"1px solid var(--line2)"}}>Cancel</button>
      </div>
    </div>
  );
}

function KeyLevels({data}){
  const fmtK=v=>v?`$${v.toLocaleString()}`:"—";
  if(!data)return(
    <div className="key-levels">
      {["Call Wall","Gamma Flip","Dominant 🧲","Put Wall","Regime"].map(l=>(
        <div className="kl-cell" key={l}><div className="kl-label">{l}</div><div className="kl-val" style={{color:"var(--sub)"}}>—</div></div>
      ))}
    </div>
  );
  const{callWall,flipStrike,dominant,putWall,isPositive}=data;
  return(
    <div className="key-levels">
      <div className="kl-cell"><div className="kl-label">Call Wall</div><div className="kl-val call">{fmtK(callWall)}</div></div>
      <div className="kl-cell"><div className="kl-label">Gamma Flip</div><div className="kl-val flip">{fmtK(flipStrike)}</div></div>
      <div className="kl-cell"><div className="kl-label">Dominant 🧲</div><div className="kl-val dom">{fmtK(dominant)}</div></div>
      <div className="kl-cell"><div className="kl-label">Put Wall</div><div className="kl-val put">{fmtK(putWall)}</div></div>
      <div className="kl-cell"><div className="kl-label">Regime</div><div className={`regime-badge ${isPositive?"pos":"neg"}`}>{isPositive?"▲ Positive GEX":"▼ Negative GEX"}</div></div>
    </div>
  );
}

function StrikeLadder({data}){
  if(!data)return(<div style={{display:"flex",alignItems:"center",justifyContent:"center",height:"100%",color:"var(--sub)",gap:10,flexDirection:"column"}}><div className="spin"/><div style={{fontSize:11}}>Computing strikes…</div></div>);
  const{strikes,expiries,spot,dominant}=data;
  const cols=expiries.slice(0,3);
  const allVals=strikes.flatMap(r=>cols.map(e=>Math.abs(r.byExp[e]||0)));
  const maxAbs=Math.max(...allVals,1);
  const colW=`70px repeat(${cols.length},1fr)`;
  const spotTol=spot*0.003;
  return(
    <div className="ladder-wrap">
      <div className="ladder-header" style={{gridTemplateColumns:colW}}>
        <div className="lh-cell">Strike</div>
        {cols.map(e=><div key={e} className="lh-cell">{e.slice(5)}</div>)}
      </div>
      {[...strikes].reverse().map(row=>{
        const isSpot=Math.abs(row.strike-spot)<=spotTol,isDom=row.strike===dominant;
        return(
          <div key={row.strike} className={`ladder-row${isSpot?" spot-row":""}${isDom?" dom-row":""}`} style={{gridTemplateColumns:colW}}>
            <div className="lc-strike" style={{color:isSpot?"var(--b)":isDom?"var(--gold)":"var(--text)"}}>
              {row.strike.toLocaleString()}
              {isSpot&&<span style={{fontSize:8,color:"var(--b)",marginLeft:3}}> ◀</span>}
              {isDom&&!isSpot&&<span style={{fontSize:10}}> 🧲</span>}
            </div>
            {cols.map(exp=>{
              const v=row.byExp[exp]||0,pct=Math.abs(v)/maxAbs*100,pos=v>=0;
              const color=isDom?"var(--gold)":pos?"var(--mag)":"var(--cyan)";
              return(
                <div key={exp} className="lc-gex">
                  {v!==0&&<div className="gex-bar" style={{width:`${Math.max(pct,1.5)}%`,background:color,opacity:0.75}}/>}
                  <span className="lc-gex-val" style={{color:pos?"var(--mag)":"var(--cyan)"}}>{fmtG(v)}</span>
                </div>
              );
            })}
          </div>
        );
      })}
    </div>
  );
}

function CumChart({data}){
  if(!data)return null;
  const{strikes,spot}=data;const spotTol=spot*0.003;
  let running=0;
  const cumArr=[...strikes].map(r=>{running+=r.netGEX;return{strike:r.strike,cum:running};}).reverse();
  const maxAbs=Math.max(...cumArr.map(r=>Math.abs(r.cum)),1);
  return(
    <div className="cum-wrap">
      <div className="cum-title">Cumulative GEX</div>
      <div className="cum-chart">
        {cumArr.map((r,i)=>{
          const isSpot=Math.abs(r.strike-spot)<=spotTol,pct=Math.abs(r.cum)/maxAbs*100,pos=r.cum>=0;
          return(
            <div key={r.strike}>
              {isSpot&&<div className="cum-divider"/>}
              <div className="cum-row">
                <div className="cum-strike" style={{color:isSpot?"var(--b)":"var(--sub)"}}>{r.strike}</div>
                <div className="cum-bar-wrap">
                  {pos?<div className="cum-bar-pos" style={{width:`${pct}%`}}/>:<div className="cum-bar-neg" style={{width:`${pct}%`}}/>}
                </div>
                <div className="cum-val" style={{color:pos?"var(--mag)":"var(--cyan)",fontSize:9}}>{fmtG(r.cum)}</div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function GexDashboard(){
  const [ticker,setTicker]    =useState("SPY");
  const [demoMode,setDemoMode]=useState(true);
  const [polyKey,setPolyKey]  =useState(()=>{try{return localStorage.getItem("polygon_api_key")||"";}catch{return "";}});
  const [gexData,setGexData]  =useState(null);
  const [loading,setLoading]  =useState(false);
  const [error,setError]      =useState(null);
  const [spotLabel,setSpotLabel]=useState(null);
  const [manualSpot,setManualSpot]=useState({});
  const [lastRefresh,setLastRefresh]=useState(null);
  const [showSettings,setShowSettings]=useState(false);
  const timerRef=useRef(null);

  const load=useCallback(async(t,demo,pk,manSpots)=>{
    setLoading(true);setError(null);
    try{
      if(!demo&&pk){
        const d=await fetchPolygonGEX(t,pk);
        setSpotLabel("$"+d.spot.toLocaleString("en-US",{minimumFractionDigits:2,maximumFractionDigits:2})+" (Polygon)");
        setGexData(d);
      } else {
        const manual=manSpots?.[t]?parseFloat(manSpots[t]):null;
        const liveSpot=manual||await fetchSpot(t);
        const d=generateDemoData(t,liveSpot);
        setSpotLabel(manual?"$"+manual.toLocaleString("en-US",{minimumFractionDigits:2,maximumFractionDigits:2})+" (manual)":liveSpot?"$"+liveSpot.toLocaleString("en-US",{minimumFractionDigits:2,maximumFractionDigits:2})+" (live)":"$"+d.spot.toLocaleString()+" (fallback)");
        setGexData(d);
      }
      setLastRefresh(new Date());
    }catch(e){
      setError(e.message);
      const ls=await fetchSpot(t).catch(()=>null);
      setGexData(generateDemoData(t,ls));
    }finally{setLoading(false);}
  },[]);

  useEffect(()=>{
    load(ticker,demoMode,polyKey,manualSpot);
    clearInterval(timerRef.current);
    timerRef.current=setInterval(()=>load(ticker,demoMode,polyKey,manualSpot),REFRESH_MS);
    return()=>clearInterval(timerRef.current);
  },[ticker,demoMode,polyKey,manualSpot]);

  const dotCls=loading?"loading":gexData?"live":"";
  const statusLabel=loading?"Computing…":lastRefresh?lastRefresh.toLocaleTimeString():"—";

  return(
    <div className="gex-wrap">
      <div className="gex-topbar">
        {GEX_TICKERS.map(t=><button key={t} className={`gex-ticker-btn ${ticker===t?"on":""}`} onClick={()=>setTicker(t)}>{t}</button>)}
        <div className="gex-spacer"/>
        {demoMode&&<span className="demo-badge">Demo</span>}
        {spotLabel&&<span style={{fontSize:11,color:"var(--text)",fontWeight:500,letterSpacing:"-0.3px"}}>{spotLabel}</span>}
        <div className="gex-status"><div className={`gex-dot ${dotCls}`}/><span>{statusLabel}</span></div>
        <button className="gex-btn" onClick={()=>load(ticker,demoMode,polyKey,manualSpot)}>↺</button>
        <button className="gex-btn" onClick={()=>setShowSettings(p=>!p)}>⚙ Settings</button>
      </div>
      {showSettings&&<GexSettings demoMode={demoMode} setDemoMode={setDemoMode} polyKey={polyKey} setPolyKey={setPolyKey} ticker={ticker} manualSpot={manualSpot} setManualSpot={setManualSpot} onClose={()=>setShowSettings(false)}/>}
      <KeyLevels data={gexData}/>
      {error&&<div style={{padding:"8px 16px",fontSize:11,color:"var(--r)",borderBottom:"1px solid var(--line)",flexShrink:0}}>⚠ {error} — showing demo data.</div>}
      <div className="gex-body">
        <StrikeLadder data={gexData}/>
        <CumChart data={gexData}/>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   SETUP MODAL
═══════════════════════════════════════════════════════════════════════════ */
function SetupModal({onSave,onSkip}){
  const [key,setKey]=useState("");
  return(
    <div className="setup-overlay">
      <div className="setup-modal">
        <div className="setup-title">Connect market data</div>
        <div className="setup-sub">Port uses Finnhub for real-time quotes. Free keys give 60 req/min — plenty for personal use.</div>
        <div className="setup-field">
          <label className="setup-label">Finnhub API Key</label>
          <input className="setup-input" placeholder="d1abc23def456…" value={key} onChange={e=>setKey(e.target.value)}/>
        </div>
        <div className="setup-note">Get a free key in 30s → finnhub.io → Sign Up → Dashboard</div>
        <div className="setup-row">
          <button className="setup-btn pri" onClick={()=>key.trim()&&onSave(key.trim())}>Connect</button>
          <button className="setup-btn sec" onClick={onSkip}>Use demo data</button>
        </div>
        <div className="setup-link" onClick={()=>window.open("https://finnhub.io","_blank")}>Open finnhub.io ↗</div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   ROOT APP
═══════════════════════════════════════════════════════════════════════════ */
export default function App(){
  const [view,setView]          =useState("watch");
  const [apiKey,setApiKey]      =useState(null);
  const [showSetup,setShowSetup]=useState(true);
  const [tickers,setTickers]    =useState(DEFAULT_TICKERS);
  const [selected,setSelected]  =useState("NVDA");
  const [quotes,setQuotes]      =useState({});
  const [stockData,setStockData]=useState({});
  const [aiCache,setAiCache]    =useState({});
  const [input,setInput]        =useState("");
  const [k401,setK401]          =useState(K401_DEFAULT);
  const [showK401Edit,setShowK401Edit]=useState(false);
  const pollingRef=useRef(null);

  const fetchStock=useCallback(async(sym,key)=>{
    const k=key||apiKey;if(!k)return;
    try{
      const [quote,profile,metrics,news,rec]=await Promise.all([getQuote(sym,k),getProfile(sym,k),getMetrics(sym,k),getNews(sym,k),getRec(sym,k)]);
      setStockData(prev=>({...prev,[sym]:{quote,profile,metrics,news:(news||[]).slice(0,8),rec:(rec||[])[0]}}));
      if(quote)setQuotes(prev=>({...prev,[sym]:quote}));
    }catch{}
  },[apiKey]);

  const fetchAll=useCallback(key=>{tickers.forEach(t=>fetchStock(t,key));},[tickers,fetchStock]);

  useEffect(()=>{
    if(!apiKey)return;
    fetchAll(apiKey);
    pollingRef.current=setInterval(()=>fetchAll(apiKey),30000);
    return()=>clearInterval(pollingRef.current);
  },[apiKey,fetchAll]);

  useEffect(()=>{if(apiKey&&selected)fetchStock(selected,apiKey);},[selected,apiKey]);

  const addTicker=()=>{
    const t=input.trim().toUpperCase().slice(0,6);
    if(!t||tickers.includes(t)){setInput("");return;}
    setTickers(prev=>[...prev,t]);setInput("");setSelected(t);
    if(apiKey)fetchStock(t,apiKey);
  };

  const isGex=view==="gex";
  const isLive=!!apiKey;

  return(
    <>
      <style>{G}</style>
      {showSetup&&<SetupModal onSave={k=>{setApiKey(k);setShowSetup(false);}} onSkip={()=>setShowSetup(false)}/>}
      <div className="app">
        <nav className="nav">
          <div className="nav-logo">Port</div>
          <div className="nav-tabs">
            {[["watch","Portfolio"],["gex","GEX Dashboard"],["k401","401k"]].map(([v,l])=>(
              <button key={v} className={`nav-tab ${view===v?"on":""}`} onClick={()=>setView(v)}>{l}</button>
            ))}
          </div>
          <div className="nav-right">
            <span className={`api-badge ${isLive?"live":""}`}>{isLive?"● LIVE":"○ DEMO"}</span>
            <button className="api-badge" style={{cursor:"pointer"}} onClick={()=>setShowSetup(true)}>Settings</button>
          </div>
        </nav>

        <div className={`body${isGex?" full":""}`}>
          {!isGex&&(
            <aside className="sidebar">
              <div className="sidebar-top">
                <div className="add-row">
                  <input className="add-input" placeholder="Search any ticker…" value={input}
                    onChange={e=>setInput(e.target.value)} onKeyDown={e=>e.key==="Enter"&&addTicker()} maxLength={6}/>
                  <button className="add-btn" onClick={addTicker}>+</button>
                </div>
              </div>
              <div className="ticker-list">
                {tickers.map(sym=>{
                  const qd=quotes[sym],chg=qd?qd.dp:null,pos=chg==null?null:chg>=0;
                  return(
                    <div key={sym} className={`ticker-row ${selected===sym&&view==="watch"?"on":""}`}
                      onClick={()=>{setView("watch");setSelected(sym);}}>
                      <div className="t-left">
                        <div className="t-icon">{sym.slice(0,4)}</div>
                        <div>
                          <div className="t-sym">{sym}</div>
                          <div className="t-price">{qd?fmt(qd.c,"$"):"—"}</div>
                        </div>
                      </div>
                      {chg!=null&&<span className={`t-chg ${pos?"pos":"neg"}`}>{sign(chg)}{Math.abs(chg).toFixed(2)}%</span>}
                      <button className="rm-btn" onClick={e=>{e.stopPropagation();setTickers(p=>p.filter(x=>x!==sym));if(selected===sym)setSelected(tickers.find(x=>x!==sym)||null);}}>×</button>
                    </div>
                  );
                })}
              </div>
            </aside>
          )}

          <main className="main">
            {view==="gex"&&<GexDashboard/>}

            {view==="watch"&&!selected&&(
              <div className="empty">
                <div className="empty-title">Select a stock</div>
                <div style={{fontSize:11,color:"var(--sub)"}}>Search any ticker above and hit Enter</div>
              </div>
            )}

            {view==="watch"&&selected&&(
              <ResearchPage
                sym={selected}
                stockData={stockData}
                apiKey={apiKey}
                aiCache={aiCache}
                setAiCache={setAiCache}
              />
            )}

            {view==="k401"&&(
              <div className="k-panel">
                <div className="k-title">401k Overview</div>
                <div className="k-sub">Empower · {new Date().toLocaleDateString("en-US",{month:"long",year:"numeric"})}</div>
                <div className="k-grid">
                  {[{label:"Total Balance",val:fmtM(k401.total),sub:"All accounts",cls:""},
                    {label:"Vested Balance",val:fmtM(k401.vested),sub:"Fully vested",cls:""},
                    {label:"YTD Return",val:`+${k401.ytdReturn}%`,sub:"This year",cls:"g"},
                    {label:"YTD Contributions",val:fmtM(k401.contributions),sub:"Employee + employer",cls:""}
                  ].map((x,i)=>(
                    <div className="k-card" key={i}>
                      <div className="k-card-label">{x.label}</div>
                      <div className={`k-card-val ${x.cls}`}>{x.val}</div>
                      <div className="k-card-sub">{x.sub}</div>
                    </div>
                  ))}
                </div>
                <div className="k-alloc">
                  <div className="k-alloc-title">Allocation</div>
                  {k401.positions.map((pos,i)=>(
                    <div className="k-alloc-row" key={i}>
                      <div className="k-alloc-name">{pos.name}</div>
                      <div className="k-alloc-bar"><div className="k-alloc-fill" style={{width:`${pos.pct}%`,background:ALLOC_COLORS[i%ALLOC_COLORS.length]}}/></div>
                      <div className="k-alloc-pct">{pos.pct}%</div>
                      <div className="k-alloc-val">{fmtM(pos.val)}</div>
                    </div>
                  ))}
                </div>
                <div className="k-connect">
                  <div className="k-connect-title">Connect live Empower data</div>
                  <div className="k-connect-body">Empower's developer API supports participant balance access. Here's how to get access as an individual:</div>
                  <div className="k-connect-steps">
                    {["Go to developer.empower-retirement.com and register","Request access to the Balance API (Participant Balance endpoint)","Empower emails you API key + OAuth credentials","Enter credentials here and Port will fetch your live balance automatically"].map((s,i)=>(
                      <div className="k-step" key={i}><div className="k-step-num">{i+1}</div><div>{s}</div></div>
                    ))}
                  </div>
                  <button className="k-edit-btn" onClick={()=>window.open("https://developer.empower-retirement.com","_blank")}>Open Empower Portal ↗</button>
                  <div style={{marginTop:12}}>
                    <button className="k-edit-btn" onClick={()=>setShowK401Edit(p=>!p)}>{showK401Edit?"Hide":"Edit manually"}</button>
                  </div>
                  {showK401Edit&&(
                    <div style={{marginTop:16,textAlign:"left"}}>
                      {[{label:"Total Balance ($)",key:"total"},{label:"YTD Return (%)",key:"ytdReturn"},{label:"YTD Contributions ($)",key:"contributions"}].map(f=>(
                        <div className="setup-field" key={f.key}>
                          <label className="setup-label">{f.label}</label>
                          <input className="setup-input" type="number" value={k401[f.key]} onChange={e=>setK401(prev=>({...prev,[f.key]:parseFloat(e.target.value)||0}))}/>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}
          </main>
        </div>
      </div>
    </>
  );
}
