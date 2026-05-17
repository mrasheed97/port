import { useState, useEffect, useCallback, useRef, useMemo } from "react";

/* ─── DESIGN SYSTEM ──────────────────────────────────────────────────────── */
const G = `
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600&family=Instrument+Serif:ital@0;1&family=JetBrains+Mono:wght@300;400;500&display=swap');
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
:root{
  /* Surface */
  --bg:#07090f;
  --s1:#0c0f1a;
  --s2:#111726;
  --s3:#161d2e;
  --s4:#1c2438;
  /* Borders */
  --b1:rgba(99,130,255,0.08);
  --b2:rgba(99,130,255,0.14);
  --b3:rgba(99,130,255,0.22);
  /* Text */
  --t1:#f0f2ff;
  --t2:#8b93b8;
  --t3:#545e82;
  /* Accents — blue-first palette */
  --blue:#4f8bff;
  --blue2:#7aa8ff;
  --blue-glow:rgba(79,139,255,0.18);
  --green:#3dd68c;
  --green-glow:rgba(61,214,140,0.15);
  --red:#f0566e;
  --red-glow:rgba(240,86,110,0.15);
  --gold:#f5c542;
  --gold-glow:rgba(245,197,66,0.15);
  --mag:#d966ff;
  --cyan:#22e5d4;
  --pur:#8866ff;
  /* Type */
  --sans:'Inter',sans-serif;
  --serif:'Instrument Serif',serif;
  --mono:'JetBrains Mono',monospace;
  --rad:12px;
  --rad-sm:8px;
  --rad-lg:16px;
}
html,body{height:100%;overflow:hidden}
body{background:var(--bg);color:var(--t1);font-family:var(--sans);font-size:13px;line-height:1.5;-webkit-font-smoothing:antialiased;text-rendering:optimizeLegibility}
button{font-family:var(--sans);cursor:pointer;border:none;background:none;color:inherit;transition:all .15s}
input,select{font-family:var(--mono);outline:none;background:none;border:none;color:var(--t1)}
a{color:inherit;text-decoration:none}
::-webkit-scrollbar{width:3px;height:3px}
::-webkit-scrollbar-thumb{background:var(--b2);border-radius:2px}
::-webkit-scrollbar-track{background:transparent}

/* APP SHELL */
.app{display:grid;grid-template-rows:56px 1fr;height:100vh;background:var(--bg)}

/* NAV */
.nav{
  display:flex;align-items:center;justify-content:space-between;
  padding:0 24px;
  border-bottom:1px solid var(--b1);
  background:rgba(7,9,15,0.9);
  backdrop-filter:blur(20px);
  -webkit-backdrop-filter:blur(20px);
  position:sticky;top:0;z-index:100;
}
.nav-brand{display:flex;align-items:center;gap:10px}
.nav-logo{font-family:var(--serif);font-size:22px;font-style:italic;letter-spacing:-0.5px;color:var(--t1)}
.nav-version{font-size:9px;font-family:var(--mono);color:var(--blue);background:var(--blue-glow);border:1px solid rgba(79,139,255,0.2);border-radius:4px;padding:2px 6px;letter-spacing:0.06em}
.nav-tabs{display:flex;gap:2px;background:var(--s2);border-radius:10px;padding:3px}
.nav-tab{padding:5px 16px;border-radius:8px;font-size:11px;font-weight:500;letter-spacing:0.04em;color:var(--t3);transition:all .2s}
.nav-tab:hover{color:var(--t2)}
.nav-tab.on{background:var(--s4);color:var(--t1);box-shadow:0 1px 3px rgba(0,0,0,0.4)}
.nav-right{display:flex;align-items:center;gap:8px}
.live-badge{display:flex;align-items:center;gap:5px;font-size:10px;font-family:var(--mono);color:var(--t3);background:var(--s2);border:1px solid var(--b1);border-radius:6px;padding:4px 10px}
.live-dot{width:5px;height:5px;border-radius:50%;background:var(--t3)}
.live-dot.on{background:var(--green);box-shadow:0 0 8px var(--green);animation:pulse 2s ease-in-out infinite}
@keyframes pulse{0%,100%{opacity:1}50%{opacity:.4}}
.nav-btn{font-size:11px;color:var(--t2);background:var(--s2);border:1px solid var(--b1);border-radius:7px;padding:5px 12px;font-weight:500}
.nav-btn:hover{border-color:var(--b3);color:var(--t1)}

/* LAYOUT */
.shell{display:grid;grid-template-columns:240px 1fr;height:calc(100vh - 56px);overflow:hidden}
.shell.wide{grid-template-columns:1fr}

/* SIDEBAR */
.sidebar{
  display:flex;flex-direction:column;
  border-right:1px solid var(--b1);
  background:var(--s1);
  overflow:hidden;
}
.sb-search{padding:12px;border-bottom:1px solid var(--b1)}
.sb-input-wrap{display:flex;gap:6px;align-items:center;background:var(--s2);border:1px solid var(--b1);border-radius:var(--rad-sm);padding:7px 10px;transition:border-color .15s}
.sb-input-wrap:focus-within{border-color:var(--blue)}
.sb-icon{font-size:12px;color:var(--t3)}
.sb-input{flex:1;font-family:var(--sans);font-size:12px;color:var(--t1);background:none;text-transform:uppercase}
.sb-input::placeholder{color:var(--t3);text-transform:none}
.sb-add{width:24px;height:24px;background:var(--blue);color:white;border-radius:6px;font-size:14px;display:flex;align-items:center;justify-content:center;flex-shrink:0;font-weight:600}
.sb-add:hover{opacity:.85}
.sb-label{font-size:9px;font-weight:600;letter-spacing:0.1em;color:var(--t3);text-transform:uppercase;padding:10px 12px 4px}
.ticker-list{flex:1;overflow-y:auto;padding:4px 8px 8px}
.tr{
  display:flex;align-items:center;justify-content:space-between;
  padding:8px 10px;border-radius:10px;cursor:pointer;
  transition:background .1s;gap:6px;
  border:1px solid transparent;
}
.tr:hover{background:var(--s2)}
.tr.on{background:var(--s3);border-color:var(--b2)}
.tr-l{display:flex;align-items:center;gap:8px}
.tr-avatar{
  width:30px;height:30px;border-radius:8px;
  background:linear-gradient(135deg,var(--s3),var(--s4));
  border:1px solid var(--b2);
  display:flex;align-items:center;justify-content:center;
  font-size:8px;font-weight:700;color:var(--blue2);
  font-family:var(--mono);flex-shrink:0;letter-spacing:0.04em;
}
.tr-sym{font-size:12px;font-weight:600;color:var(--t1);letter-spacing:0.02em}
.tr-price{font-size:10px;color:var(--t3);font-family:var(--mono);margin-top:1px}
.tr-chg{font-size:9px;font-weight:600;padding:2px 6px;border-radius:4px;font-family:var(--mono)}
.tr-chg.pos{background:var(--green-glow);color:var(--green)}
.tr-chg.neg{background:var(--red-glow);color:var(--red)}
.tr-rm{font-size:14px;color:var(--t3);opacity:0;transition:opacity .15s;padding:0 2px}
.tr:hover .tr-rm{opacity:1}
.tr-rm:hover{color:var(--red)}

/* MAIN */
.main{overflow-y:auto;display:flex;flex-direction:column;background:var(--bg)}

/* EMPTY STATE */
.empty-state{
  flex:1;display:flex;flex-direction:column;align-items:center;justify-content:center;
  gap:16px;padding:40px;
}
.empty-logo{font-family:var(--serif);font-size:64px;font-style:italic;color:var(--s4);letter-spacing:-2px}
.empty-sub{font-size:12px;color:var(--t3);text-align:center;max-width:240px;line-height:1.6}
.empty-hint{display:flex;gap:8px;flex-wrap:wrap;justify-content:center}
.empty-chip{font-size:10px;font-family:var(--mono);color:var(--blue);background:var(--blue-glow);border:1px solid rgba(79,139,255,0.15);border-radius:5px;padding:3px 8px;cursor:pointer;transition:all .15s}
.empty-chip:hover{background:rgba(79,139,255,0.25)}

/* SETUP MODAL */
.overlay{position:fixed;inset:0;background:rgba(7,9,15,0.9);backdrop-filter:blur(12px);z-index:300;display:flex;align-items:center;justify-content:center}
.modal{background:var(--s2);border:1px solid var(--b2);border-radius:20px;padding:32px;width:440px;max-width:90vw;box-shadow:0 24px 80px rgba(0,0,0,0.5)}
.modal-title{font-family:var(--serif);font-size:26px;font-style:italic;margin-bottom:6px;color:var(--t1)}
.modal-sub{font-size:12px;color:var(--t2);line-height:1.6;margin-bottom:24px}
.field{margin-bottom:16px}
.field-label{font-size:10px;font-weight:600;letter-spacing:0.08em;text-transform:uppercase;color:var(--t3);margin-bottom:8px;display:block}
.field-input{
  width:100%;background:var(--s3);border:1px solid var(--b2);
  border-radius:var(--rad-sm);padding:10px 14px;font-size:12px;color:var(--t1);
  font-family:var(--mono);transition:border-color .15s;
}
.field-input:focus{border-color:var(--blue);outline:none}
.field-note{font-size:10px;color:var(--t3);margin-top:6px;line-height:1.5}
.btn-row{display:flex;gap:8px;margin-top:24px}
.btn{flex:1;padding:10px;border-radius:var(--rad-sm);font-size:12px;font-weight:600;cursor:pointer;transition:all .15s}
.btn.pri{background:var(--blue);color:white;border:none}
.btn.pri:hover{opacity:.9}
.btn.sec{background:none;border:1px solid var(--b2);color:var(--t2)}
.btn.sec:hover{border-color:var(--b3);color:var(--t1)}
.modal-link{font-size:10px;color:var(--blue);text-align:center;margin-top:14px;cursor:pointer;opacity:.8}
.modal-link:hover{opacity:1}

/* ── RESEARCH PAGE ── */
.rp{min-height:100%}

/* HERO HEADER */
.hero{
  padding:24px 28px 20px;
  border-bottom:1px solid var(--b1);
  background:linear-gradient(180deg,var(--s1) 0%,var(--bg) 100%);
}
.hero-top{display:flex;align-items:flex-start;justify-content:space-between;gap:20px;margin-bottom:16px}
.hero-left{}
.hero-sym{
  font-family:var(--serif);font-size:52px;font-style:italic;
  letter-spacing:-2px;line-height:1;color:var(--t1);
}
.hero-name{font-size:11px;color:var(--t3);margin-top:4px;letter-spacing:0.02em}
.hero-right{display:flex;flex-direction:column;align-items:flex-end;gap:8px}
.hero-price{
  font-family:var(--serif);font-size:40px;letter-spacing:-1.5px;line-height:1;
}
.hero-chg{font-size:13px;font-weight:600;padding:4px 12px;border-radius:8px}
.hero-chg.pos{background:var(--green-glow);color:var(--green);border:1px solid rgba(61,214,140,0.2)}
.hero-chg.neg{background:var(--red-glow);color:var(--red);border:1px solid rgba(240,86,110,0.2)}
.hero-time{font-size:10px;color:var(--t3);font-family:var(--mono)}
.signal-pill{
  display:inline-flex;align-items:center;gap:6px;
  font-size:11px;font-weight:600;
  padding:5px 14px;border-radius:20px;
  letter-spacing:0.04em;
}
.signal-pill.bull{background:var(--green-glow);color:var(--green);border:1px solid rgba(61,214,140,0.25)}
.signal-pill.bear{background:var(--red-glow);color:var(--red);border:1px solid rgba(240,86,110,0.25)}
.signal-pill.neut{background:var(--s3);color:var(--t2);border:1px solid var(--b2)}

/* META STRIP */
.meta-strip{display:flex;gap:24px;flex-wrap:wrap}
.meta-item{display:flex;flex-direction:column;gap:2px}
.meta-label{font-size:9px;font-weight:600;letter-spacing:0.09em;text-transform:uppercase;color:var(--t3)}
.meta-val{font-size:13px;font-weight:500;color:var(--t1);font-family:var(--mono)}

/* RANGE BAR */
.range-wrap{display:flex;align-items:center;gap:10px;margin-top:8px}
.range-lo,.range-hi{font-size:10px;font-family:var(--mono);color:var(--t3);white-space:nowrap}
.range-track{flex:1;height:5px;background:var(--s3);border-radius:3px;position:relative;min-width:100px}
.range-gradient{position:absolute;inset:0;border-radius:3px;background:linear-gradient(90deg,var(--red),var(--gold),var(--green));opacity:.35}
.range-dot{
  position:absolute;top:50%;transform:translate(-50%,-50%);
  width:11px;height:11px;border-radius:50%;
  background:white;box-shadow:0 0 0 2px var(--blue), 0 2px 6px rgba(0,0,0,0.5);
}
.range-label{font-size:9px;color:var(--t3);white-space:nowrap}

/* SECTIONS */
.section{padding:20px 28px 0}
.section-head{
  font-size:9px;font-weight:700;letter-spacing:0.12em;text-transform:uppercase;
  color:var(--t3);margin-bottom:14px;
  display:flex;align-items:center;gap:10px;
}
.section-head::after{content:'';flex:1;height:1px;background:var(--b1)}
.section-head .badge{
  font-size:8px;font-weight:700;padding:2px 6px;border-radius:4px;
  background:var(--blue-glow);color:var(--blue);border:1px solid rgba(79,139,255,0.2);
  letter-spacing:0.06em;
}

/* CARDS */
.card{
  background:var(--s1);border:1px solid var(--b1);border-radius:var(--rad-lg);
  padding:18px;transition:border-color .2s;
}
.card:hover{border-color:var(--b2)}
.card-title{font-size:9px;font-weight:700;letter-spacing:0.09em;text-transform:uppercase;color:var(--t3);margin-bottom:12px}

/* PRICE CHART */
.chart-wrap{position:relative;width:100%;height:200px}
.chart-canvas{width:100%;height:100%;display:block}
.chart-overlay{
  position:absolute;inset:0;pointer-events:none;
  display:flex;align-items:flex-end;justify-content:space-between;
  padding:8px 0 4px;
}
.chart-label{font-size:9px;font-family:var(--mono);color:var(--t3)}
.chart-loading{position:absolute;inset:0;display:flex;align-items:center;justify-content:center;color:var(--t3);font-size:11px;gap:8px}
.chart-tabs{display:flex;gap:2px;margin-bottom:10px;background:var(--s2);border-radius:7px;padding:2px;width:fit-content}
.chart-tab{padding:3px 10px;border-radius:5px;font-size:10px;font-weight:500;color:var(--t3);cursor:pointer;transition:all .15s}
.chart-tab.on{background:var(--s4);color:var(--t1)}

/* TECH DASHBOARD */
.tech-grid{display:grid;grid-template-columns:180px 1fr 1fr;gap:12px}
.rsi-panel{display:flex;flex-direction:column;align-items:center;gap:6px;padding:8px 0}
.rsi-label-val{font-family:var(--serif);font-size:36px;font-style:italic;line-height:1;margin-top:4px}
.rsi-label-txt{font-size:10px;font-weight:600;letter-spacing:0.06em;text-transform:uppercase}
.ma-section{}
.ma-row{display:flex;align-items:center;gap:10px;margin-bottom:10px}
.ma-name{font-size:10px;color:var(--t3);font-family:var(--mono);width:30px}
.ma-bar-track{flex:1;height:5px;background:var(--s3);border-radius:3px;overflow:hidden}
.ma-bar-fill{height:100%;border-radius:3px;transition:width .5s ease}
.ma-pct{font-size:10px;font-family:var(--mono);width:50px;text-align:right}
.macd-section{}
.score-big{
  font-family:var(--serif);font-size:64px;font-style:italic;
  line-height:1;text-align:center;margin:8px 0 4px;
}
.score-ring-wrap{display:flex;justify-content:center;margin-bottom:8px}
.momentum-label{font-size:10px;text-align:center;color:var(--t3);font-weight:600;letter-spacing:0.06em;text-transform:uppercase}
.sr-row{display:flex;align-items:center;justify-content:space-between;padding:6px 0;border-bottom:1px solid var(--b1)}
.sr-row:last-child{border:none}
.sr-badge{font-size:8px;font-weight:700;padding:2px 6px;border-radius:4px;letter-spacing:0.05em;text-transform:uppercase}
.sr-badge.res{background:var(--red-glow);color:var(--red)}
.sr-badge.sup{background:var(--green-glow);color:var(--green)}
.sr-price{font-family:var(--mono);font-size:13px;font-weight:500}
.sr-note{font-size:10px;color:var(--t3)}

/* RADAR */
.radar-wrap{display:flex;flex-direction:column;align-items:center;gap:8px}
.axis-row{display:flex;align-items:center;gap:8px;margin-bottom:7px}
.axis-name{font-size:10px;color:var(--t2);width:150px;flex-shrink:0}
.axis-track{flex:1;height:4px;background:var(--s3);border-radius:2px;overflow:hidden}
.axis-fill{height:100%;border-radius:2px;transition:width .6s ease}
.axis-num{font-size:10px;font-family:var(--mono);color:var(--t3);width:18px;text-align:right}

/* SCENARIOS */
.scenario-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:10px;margin-top:16px}
.sc-card{border-radius:var(--rad);padding:14px}
.sc-card.bull{background:var(--green-glow);border:1px solid rgba(61,214,140,0.2)}
.sc-card.base{background:var(--s2);border:1px solid var(--b2)}
.sc-card.bear{background:var(--red-glow);border:1px solid rgba(240,86,110,0.2)}
.sc-label{font-size:9px;font-weight:700;letter-spacing:0.09em;text-transform:uppercase;margin-bottom:8px}
.sc-card.bull .sc-label{color:var(--green)}
.sc-card.base .sc-label{color:var(--t2)}
.sc-card.bear .sc-label{color:var(--red)}
.sc-target{font-family:var(--serif);font-size:28px;font-style:italic;margin-bottom:5px}
.sc-card.bull .sc-target{color:var(--green)}
.sc-card.bear .sc-target{color:var(--red)}
.sc-assume{font-size:10px;color:var(--t2);line-height:1.5}

/* ANALYST BAR */
.analyst-bar{display:grid;grid-template-columns:repeat(5,1fr);gap:8px}
.ab-cell{background:var(--s2);border:1px solid var(--b1);border-radius:var(--rad-sm);padding:12px;text-align:center}
.ab-label{font-size:9px;text-transform:uppercase;letter-spacing:0.07em;color:var(--t3);margin-bottom:8px}
.ab-num{font-family:var(--serif);font-size:28px;font-style:italic}

/* NARRATIVE */
.narrative-card{
  background:var(--s1);border:1px solid var(--b1);border-radius:var(--rad-lg);
  padding:24px;margin:0 28px;
}
.narrative-text{font-size:13px;line-height:1.9;color:var(--t2);white-space:pre-wrap;word-break:break-word}
.cursor{display:inline-block;width:2px;height:14px;background:var(--blue);margin-left:2px;animation:blink 1s step-end infinite;vertical-align:text-bottom}
@keyframes blink{50%{opacity:0}}

/* TRADE PARAMS */
.trade-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:10px}
.tg-cell{background:var(--s2);border:1px solid var(--b1);border-radius:var(--rad);padding:14px}
.tg-label{font-size:9px;font-weight:700;letter-spacing:0.09em;text-transform:uppercase;color:var(--t3);margin-bottom:8px}
.tg-val{font-family:var(--serif);font-size:20px;font-style:italic}

/* CATALYST */
.cal-item{display:flex;gap:12px;align-items:flex-start;padding:10px 0;border-bottom:1px solid var(--b1)}
.cal-item:last-child{border:none}
.cal-date{font-size:10px;font-family:var(--mono);color:var(--t3);width:76px;flex-shrink:0;padding-top:2px}
.cal-dot{width:7px;height:7px;border-radius:50%;flex-shrink:0;margin-top:5px}
.cal-dot.bull{background:var(--green)}
.cal-dot.bear{background:var(--red)}
.cal-dot.neut{background:var(--t3)}
.cal-body{flex:1}
.cal-title{font-size:12px;color:var(--t1);font-weight:500;margin-bottom:3px}
.cal-badge{font-size:9px;font-weight:700;text-transform:uppercase;letter-spacing:0.06em;padding:1px 6px;border-radius:4px;display:inline-block}
.cal-badge.bull{background:var(--green-glow);color:var(--green)}
.cal-badge.bear{background:var(--red-glow);color:var(--red)}
.cal-badge.neut{background:var(--s3);color:var(--t2)}
.cal-detail{font-size:10px;color:var(--t3);margin-top:3px;line-height:1.5}

/* NEWS */
.news-item{background:var(--s1);border:1px solid var(--b1);border-radius:var(--rad);padding:12px 14px;margin-bottom:6px;cursor:pointer;transition:border-color .15s}
.news-item:hover{border-color:var(--b2)}
.news-head{display:flex;align-items:flex-start;justify-content:space-between;gap:10px;margin-bottom:4px}
.news-hl{font-size:12px;color:var(--t1);line-height:1.5;flex:1;font-weight:500}
.news-arrow{font-size:12px;color:var(--t3);flex-shrink:0;margin-top:2px}
.news-meta{font-size:10px;color:var(--t3);font-family:var(--mono)}

/* ── SIGNAL FEATURES ── */

/* SHORT INTEREST */
.si-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:10px;margin-bottom:14px}
.si-cell{background:var(--s2);border:1px solid var(--b1);border-radius:var(--rad);padding:14px}
.si-label{font-size:9px;font-weight:700;letter-spacing:0.09em;text-transform:uppercase;color:var(--t3);margin-bottom:8px}
.si-val{font-family:var(--serif);font-size:24px;font-style:italic}
.si-val.warn{color:var(--red)}
.si-val.ok{color:var(--green)}
.squeeze-meter{height:6px;background:var(--s3);border-radius:3px;overflow:hidden;margin-top:8px}
.squeeze-fill{height:100%;border-radius:3px;transition:width .5s ease;background:linear-gradient(90deg,var(--green),var(--gold),var(--red))}

/* RELATIVE STRENGTH */
.rs-grid{display:grid;grid-template-columns:repeat(5,1fr);gap:8px}
.rs-cell{background:var(--s2);border:1px solid var(--b1);border-radius:var(--rad);padding:12px;text-align:center}
.rs-period{font-size:9px;text-transform:uppercase;letter-spacing:0.07em;color:var(--t3);margin-bottom:6px}
.rs-val{font-family:var(--mono);font-size:14px;font-weight:600}
.rs-val.bull{color:var(--green)}
.rs-val.bear{color:var(--red)}
.rs-bar{height:3px;background:var(--s3);border-radius:2px;overflow:hidden;margin-top:6px}
.rs-bar-fill{height:100%;border-radius:2px}

/* EARNINGS HISTORY */
.er-table{width:100%;border-collapse:separate;border-spacing:0 4px}
.er-th{font-size:9px;font-weight:700;letter-spacing:0.09em;text-transform:uppercase;color:var(--t3);padding:6px 10px;text-align:left}
.er-td{padding:8px 10px;background:var(--s2);font-size:11px;font-family:var(--mono)}
.er-td:first-child{border-radius:var(--rad-sm) 0 0 var(--rad-sm)}
.er-td:last-child{border-radius:0 var(--rad-sm) var(--rad-sm) 0}
.er-beat{color:var(--green);font-weight:600}
.er-miss{color:var(--red);font-weight:600}
.er-inline{color:var(--gold);font-weight:600}
.er-move.pos{color:var(--green)}
.er-move.neg{color:var(--red)}

/* INSTITUTIONAL */
.inst-row{display:flex;align-items:center;gap:12px;padding:8px 0;border-bottom:1px solid var(--b1)}
.inst-row:last-child{border:none}
.inst-name{font-size:11px;color:var(--t1);font-weight:500;flex:1}
.inst-change{font-size:11px;font-family:var(--mono);font-weight:600;width:80px;text-align:right}
.inst-change.add{color:var(--green)}
.inst-change.red{color:var(--red)}
.inst-change.new{color:var(--blue)}
.inst-pct{font-size:10px;color:var(--t3);width:50px;text-align:right;font-family:var(--mono)}
.inst-tag{font-size:8px;font-weight:700;padding:2px 5px;border-radius:4px;letter-spacing:0.05em}
.inst-tag.add{background:var(--green-glow);color:var(--green)}
.inst-tag.red{background:var(--red-glow);color:var(--red)}
.inst-tag.new{background:var(--blue-glow);color:var(--blue)}

/* SECTOR HEATMAP */
.heatmap-grid{display:grid;grid-template-columns:repeat(5,1fr);gap:6px}
.hm-cell{border-radius:var(--rad-sm);padding:10px 8px;text-align:center;cursor:pointer;transition:all .15s}
.hm-name{font-size:9px;font-weight:600;letter-spacing:0.04em;margin-bottom:4px}
.hm-pct{font-size:13px;font-weight:700;font-family:var(--mono)}

/* GEX */
.gex-wrap{display:flex;flex-direction:column;height:100%;overflow:hidden;position:relative;background:var(--bg)}
.gex-topbar{display:flex;align-items:center;gap:6px;padding:10px 16px;border-bottom:1px solid var(--b1);flex-shrink:0;flex-wrap:wrap;background:var(--s1)}
.gex-ticker-btn{padding:4px 12px;border-radius:7px;font-size:11px;font-weight:500;border:1px solid var(--b1);color:var(--t2);transition:all .15s}
.gex-ticker-btn:hover{color:var(--t1);border-color:var(--b2)}
.gex-ticker-btn.on{background:var(--blue-glow);color:var(--blue2);border-color:rgba(79,139,255,0.3)}
.gex-spacer{flex:1}
.gex-status{display:flex;align-items:center;gap:5px;font-size:10px;color:var(--t3);font-family:var(--mono)}
.gex-dot{width:5px;height:5px;border-radius:50%;background:var(--t3)}
.gex-dot.live{background:var(--green);box-shadow:0 0 5px var(--green);animation:pulse 2s ease-in-out infinite}
.gex-dot.loading{background:var(--gold);animation:pulse 0.7s ease-in-out infinite}
.gex-btn{font-size:10px;font-weight:500;color:var(--t2);border:1px solid var(--b1);border-radius:6px;padding:3px 9px;transition:all .15s}
.gex-btn:hover{color:var(--t1);border-color:var(--b2)}
.demo-badge{font-size:9px;padding:2px 7px;border-radius:4px;background:var(--gold-glow);color:var(--gold);border:1px solid rgba(245,197,66,0.2);font-weight:600;letter-spacing:0.06em}
.key-levels{display:grid;grid-template-columns:repeat(5,1fr);gap:1px;background:var(--b1);border-bottom:1px solid var(--b1);flex-shrink:0}
.kl-cell{background:var(--s1);padding:10px 14px}
.kl-label{font-size:9px;font-weight:700;text-transform:uppercase;letter-spacing:0.09em;color:var(--t3);margin-bottom:5px}
.kl-val{font-size:16px;font-weight:600;font-family:var(--mono);letter-spacing:-0.3px}
.kl-val.call{color:var(--mag)}.kl-val.flip{color:var(--blue2)}.kl-val.dom{color:var(--gold)}.kl-val.put{color:var(--cyan)}
.regime-badge{display:inline-flex;align-items:center;gap:4px;font-size:9px;font-weight:700;padding:2px 8px;border-radius:4px;margin-top:4px;letter-spacing:0.04em;text-transform:uppercase}
.regime-badge.pos{background:var(--green-glow);color:var(--green);border:1px solid rgba(61,214,140,0.2)}
.regime-badge.neg{background:var(--red-glow);color:var(--red);border:1px solid rgba(240,86,110,0.2)}
.replay-bar{display:flex;align-items:center;gap:8px;padding:8px 14px;background:var(--s1);border-bottom:1px solid var(--b1);flex-shrink:0;flex-wrap:wrap}
.live-pill{display:flex;align-items:center;gap:4px;font-size:9px;font-weight:700;padding:3px 9px;border-radius:20px;border:1px solid rgba(61,214,140,0.25);background:var(--green-glow);color:var(--green);cursor:pointer;letter-spacing:0.05em;text-transform:uppercase}
.live-pill .dot{width:5px;height:5px;border-radius:50%;background:var(--green);animation:pulse 2s ease-in-out infinite}
.replay-btn{display:flex;align-items:center;justify-content:center;width:26px;height:26px;border-radius:7px;border:1px solid var(--b1);color:var(--t2);font-size:12px;flex-shrink:0}
.replay-btn:hover{color:var(--t1);border-color:var(--b2)}
.replay-btn.active{background:var(--green);color:var(--bg);border-color:var(--green)}
.replay-slider{flex:1;min-width:100px;height:3px;accent-color:var(--blue);cursor:pointer}
.replay-time{font-size:11px;font-family:var(--mono);color:var(--t1);width:56px;text-align:center;font-weight:500}
.replay-speed-btn,.replay-step-btn{font-size:9px;font-weight:600;color:var(--t2);border:1px solid var(--b1);border-radius:4px;padding:2px 7px;transition:all .15s}
.replay-speed-btn.on,.replay-step-btn.on{background:var(--s3);color:var(--t1)}
.gex-body{display:grid;grid-template-columns:1fr 220px;flex:1;overflow:hidden;min-height:0}
.ladder-wrap{overflow-y:auto;border-right:1px solid var(--b1)}
.ladder-header{display:grid;position:sticky;top:0;background:var(--s1);z-index:10;border-bottom:1px solid var(--b1)}
.ladder-row{display:grid;align-items:center;padding:0 12px;border-bottom:1px solid var(--b1);min-height:28px;transition:background .1s}
.ladder-row:hover{background:var(--s2)}
.ladder-row.spot-row{background:rgba(79,139,255,0.06);border-color:rgba(79,139,255,0.2)}
.ladder-row.dom-row{background:rgba(245,197,66,0.04)}
.lh-cell{padding:7px 6px;font-size:9px;font-weight:700;text-transform:uppercase;letter-spacing:0.07em;color:var(--t3)}
.lc-strike{font-size:11px;font-weight:600;padding:0 6px;white-space:nowrap;font-family:var(--mono)}
.lc-gex{padding:0 6px;display:flex;align-items:center;gap:5px;height:100%}
.gex-bar{height:12px;border-radius:2px;min-width:2px;flex-shrink:0}
.lc-gex-val{font-size:9px;color:var(--t3);white-space:nowrap;font-family:var(--mono)}
.cum-wrap{display:flex;flex-direction:column;padding:10px;overflow:hidden;background:var(--s1)}
.cum-title{font-size:9px;font-weight:700;text-transform:uppercase;letter-spacing:0.09em;color:var(--t3);margin-bottom:8px}
.cum-chart{flex:1;overflow-y:auto;min-height:0}
.cum-row{display:flex;align-items:center;gap:4px;padding:1px 0}
.cum-strike{font-size:9px;font-family:var(--mono);color:var(--t3);width:38px;text-align:right;flex-shrink:0}
.cum-bar-wrap{flex:1;height:9px;background:var(--s3);border-radius:2px;overflow:hidden}
.cum-bar-pos{height:100%;background:var(--mag);opacity:.7;border-radius:2px}
.cum-bar-neg{height:100%;background:var(--cyan);opacity:.7;border-radius:2px}
.cum-val{font-size:9px;width:30px;font-family:var(--mono);flex-shrink:0}
.cum-divider{border-top:1px dashed rgba(79,139,255,0.25);margin:3px 0}
.gex-settings-panel{position:absolute;top:44px;right:0;width:300px;background:var(--s2);border:1px solid var(--b2);border-radius:var(--rad-lg);padding:18px;z-index:100;box-shadow:0 16px 48px rgba(0,0,0,0.6)}
.gex-settings-title{font-size:12px;font-weight:600;margin-bottom:14px;display:flex;align-items:center;justify-content:space-between;color:var(--t1)}
.toggle-row{display:flex;align-items:center;justify-content:space-between;margin-bottom:14px}
.toggle-label{font-size:11px;color:var(--t2)}
.toggle{width:36px;height:20px;border-radius:10px;background:var(--s3);border:1px solid var(--b2);position:relative;cursor:pointer;transition:background .2s}
.toggle.on{background:var(--blue)}
.toggle-knob{width:14px;height:14px;border-radius:50%;background:white;position:absolute;top:2px;left:2px;transition:left .2s;box-shadow:0 1px 3px rgba(0,0,0,0.3)}
.toggle.on .toggle-knob{left:18px}

/* MANAGE TAB */
.manage-panel{padding:24px 28px}
.manage-title{font-family:var(--serif);font-size:36px;font-style:italic;margin-bottom:4px;color:var(--t1)}
.manage-sub{font-size:11px;color:var(--t3);margin-bottom:24px}
.mgrid{display:grid;grid-template-columns:repeat(4,1fr);gap:10px;margin-bottom:20px}
.mcard{background:var(--s1);border:1px solid var(--b1);border-radius:var(--rad-lg);padding:16px}
.mcard-label{font-size:9px;font-weight:700;letter-spacing:0.09em;text-transform:uppercase;color:var(--t3);margin-bottom:10px}
.mcard-val{font-family:var(--serif);font-size:28px;font-style:italic;color:var(--t1)}
.mcard-val.pos{color:var(--green)}
.mcard-sub{font-size:10px;color:var(--t3);margin-top:4px}
.alloc-section{background:var(--s1);border:1px solid var(--b1);border-radius:var(--rad-lg);padding:18px;margin-bottom:12px}
.alloc-title{font-size:9px;font-weight:700;letter-spacing:0.09em;text-transform:uppercase;color:var(--t3);margin-bottom:14px}
.alloc-row{display:flex;align-items:center;gap:10px;margin-bottom:10px}
.alloc-name{font-size:12px;font-weight:500;color:var(--t1);width:180px;flex-shrink:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.alloc-bar{flex:1;height:4px;background:var(--s3);border-radius:2px;overflow:hidden}
.alloc-fill{height:100%;border-radius:2px}
.alloc-pct{font-size:10px;font-family:var(--mono);color:var(--t2);width:36px;text-align:right}
.alloc-val{font-size:10px;font-family:var(--mono);color:var(--t3);width:68px;text-align:right}
.connect-box{background:var(--s1);border:1px dashed var(--b2);border-radius:var(--rad-lg);padding:22px;text-align:center;margin-top:12px}
.connect-title{font-family:var(--serif);font-size:20px;font-style:italic;margin-bottom:6px;color:var(--t2)}
.connect-body{font-size:11px;color:var(--t3);line-height:1.7;max-width:380px;margin:0 auto 16px}
.connect-steps{text-align:left;max-width:340px;margin:0 auto 16px;display:flex;flex-direction:column;gap:6px}
.connect-step{display:flex;gap:8px;font-size:11px;color:var(--t2);align-items:flex-start}
.connect-step-num{width:18px;height:18px;border-radius:50%;background:var(--s3);border:1px solid var(--b2);display:flex;align-items:center;justify-content:center;font-size:9px;color:var(--t3);flex-shrink:0;margin-top:1px}
.connect-btn{font-size:11px;font-weight:500;color:var(--blue2);border:1px solid rgba(79,139,255,0.25);border-radius:8px;padding:6px 14px;transition:all .15s}
.connect-btn:hover{background:var(--blue-glow)}

/* SKELETON */
@keyframes shimmer{0%{background-position:-600px 0}100%{background-position:600px 0}}
.sk{background:linear-gradient(90deg,var(--s2) 25%,var(--s3) 50%,var(--s2) 75%);background-size:600px 100%;animation:shimmer 1.6s ease-in-out infinite;border-radius:6px}

/* SPIN */
.spin{width:20px;height:20px;border:2px solid var(--b2);border-top-color:var(--blue);border-radius:50%;animation:spin .7s linear infinite;flex-shrink:0}
@keyframes spin{to{transform:rotate(360deg)}}
`;

/* ─── CONSTANTS ──────────────────────────────────────────────────────────── */
const DEFAULT_TICKERS = ["NVDA","FCEL","RKLB","MU","META"];
const GEX_TICKERS = ["SPY","QQQ","SPX","IWM","NVDA","AAPL","TSLA"];
const ALLOC_COLORS = ["#4f8bff","#3dd68c","#f5c542","#d966ff","#f0566e","#22e5d4"];
const REFRESH_MS  = 3*60*1000;
const REFRESH_FAST= 30*1000;
const CACHE_TTL   = 4*60*60*1000; // 4h
const CACHE_VER   = "v3";
const K401_DEFAULT = {
  total:125000, contributions:8400, ytdReturn:11.2, vested:125000,
  rothBalance:5800, sdbaBalance:25200,
  positions:[
    {name:"Vanguard S&P 500 Index", pct:55, val:68750},
    {name:"Vanguard Total Bond",    pct:15, val:18750},
    {name:"SDBA Brokerage Sleeve",  pct:20.2,val:25200},
    {name:"Target Date 2050",       pct:9.8, val:12300},
  ],
};

/* ─── HELPERS ────────────────────────────────────────────────────────────── */
const fmt   = (n,pre="",suf="") => n==null?"—":`${pre}${Number(n).toLocaleString("en-US",{maximumFractionDigits:2})}${suf}`;
const fmtM  = n => { if(n==null)return"—"; const a=Math.abs(n); if(a>=1e12)return`$${(n/1e12).toFixed(2)}T`; if(a>=1e9)return`$${(n/1e9).toFixed(2)}B`; if(a>=1e6)return`$${(n/1e6).toFixed(2)}M`; return`$${n.toLocaleString()}`; };
const fmtG  = n => { if(!n&&n!==0)return""; const a=Math.abs(n); if(a>=1e9)return`${(n/1e9).toFixed(1)}B`; if(a>=1e6)return`${(n/1e6).toFixed(0)}M`; if(a>=1e3)return`${(n/1e3).toFixed(0)}K`; return n.toFixed(0); };
const sign  = n => n>0?"+":"";
const todayStr  = () => new Date().toISOString().slice(0,10);
const inDaysStr = d => { const t=new Date(); t.setDate(t.getDate()+d); return t.toISOString().slice(0,10); };

/* ─── LOCALSTORAGE CACHE ─────────────────────────────────────────────────── */
function cacheGet(sym){
  try{ const raw=localStorage.getItem(`port_${CACHE_VER}_${sym}`); if(!raw)return null; const{data,ts}=JSON.parse(raw); if(Date.now()-ts>CACHE_TTL){localStorage.removeItem(`port_${CACHE_VER}_${sym}`);return null;} return data; }catch{return null;}
}
function cacheSet(sym,data){
  try{ localStorage.setItem(`port_${CACHE_VER}_${sym}`,JSON.stringify({data,ts:Date.now()})); }catch{}
}

/* ─── BLACK-SCHOLES ──────────────────────────────────────────────────────── */
function normPDF(x){ return Math.exp(-0.5*x*x)/Math.sqrt(2*Math.PI); }
function bsGamma(S,K,T,sigma){
  if(T<=0||sigma<=0||S<=0||K<=0)return 0;
  const d1=(Math.log(S/K)+(0.05+0.5*sigma*sigma)*T)/(sigma*Math.sqrt(T));
  return normPDF(d1)/(S*sigma*Math.sqrt(T));
}

/* ─── SPOT FETCH ─────────────────────────────────────────────────────────── */
async function fetchSpot(ticker){
  try{ const r=await fetch(`/.netlify/functions/spot?ticker=${encodeURIComponent(ticker)}`); if(r.ok){const d=await r.json();if(d.price&&d.price>0)return d.price;} }catch{}
  return null;
}

/* ─── GEX DEMO DATA ──────────────────────────────────────────────────────── */
function generateDemoData(ticker,liveSpot){
  const fallbacks={SPY:585,QQQ:500,SPX:5850,IWM:210,NVDA:130,AAPL:205,TSLA:280};
  const vols={SPY:0.14,QQQ:0.18,SPX:0.14,IWM:0.20,NVDA:0.55,AAPL:0.28,TSLA:0.65};
  const spot=liveSpot||fallbacks[ticker]||400,vol=vols[ticker]||0.20;
  const step=ticker==="SPX"?5:1;
  const expiries=[todayStr(),inDaysStr(7),inDaysStr(14)];
  const lo=Math.round(spot*0.97/step)*step,hi=Math.round(spot*1.03/step)*step;
  const strikes=[];for(let k=lo;k<=hi;k+=step)strikes.push(k);
  const rows=strikes.map(K=>{
    let netGEX=0;const byExp={};
    expiries.forEach(exp=>{
      const dte=Math.max(0.5,(new Date(exp)-new Date())/86400000);
      const T=dte/365,gamma=bsGamma(spot,K,T,vol);
      const oiC=Math.floor(Math.random()*10000+500),oiP=Math.floor(Math.random()*10000+500);
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
  // Top 20 by magnitude + spot neighbours
  const sorted=[...rows].sort((a,b)=>Math.abs(b.netGEX)-Math.abs(a.netGEX));
  const topSet=new Set(sorted.slice(0,20).map(r=>r.strike));
  rows.forEach(r=>{if(Math.abs(r.strike-spot)<=1)topSet.add(r.strike);});
  const filtered=rows.filter(r=>topSet.has(r.strike));
  return{spot,strikes:filtered,expiries,callWall,putWall,flipStrike,dominant,totalGEX,isPositive:totalGEX>0};
}

/* ─── POLYGON GEX ────────────────────────────────────────────────────────── */
async function fetchPolygonGEX(ticker,apiKey){
  const sr=await fetch(`https://api.polygon.io/v2/last/trade/${ticker}?apiKey=${apiKey}`);
  if(!sr.ok)throw new Error("Spot fetch failed");
  const sj=await sr.json();const spot=sj.results?.p;if(!spot)throw new Error("No spot");
  const lo=(spot*0.97).toFixed(2),hi=(spot*1.03).toFixed(2);
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
  const sorted=[...rows].sort((a,b)=>Math.abs(b.netGEX)-Math.abs(a.netGEX));
  const topSet=new Set(sorted.slice(0,20).map(r=>r.strike));
  rows.forEach(r=>{if(Math.abs(r.strike-spot)<=1)topSet.add(r.strike);});
  return{spot,strikes:rows.filter(r=>topSet.has(r.strike)),expiries,callWall,putWall,flipStrike,dominant,totalGEX,isPositive:totalGEX>0};
}

/* ─── FINNHUB ────────────────────────────────────────────────────────────── */
async function fhFetch(path,params){
  const q=new URLSearchParams({path,...params}).toString();
  try{const r=await fetch(`/.netlify/functions/finnhub?${q}`);return r.ok?r.json():null;}catch{return null;}
}
const getQuote  =(t,k)=>fhFetch("/api/v1/quote",{symbol:t,token:k});
const getProfile=(t,k)=>fhFetch("/api/v1/stock/profile2",{symbol:t,token:k});
const getMetrics=(t,k)=>fhFetch("/api/v1/stock/metric",{symbol:t,metric:"all",token:k});
const getNews   =(t,k)=>{const td=todayStr(),pd=new Date(Date.now()-7*86400000).toISOString().slice(0,10);return fhFetch("/api/v1/company-news",{symbol:t,from:pd,to:td,token:k});};
const getRec    =(t,k)=>fhFetch("/api/v1/stock/recommendation",{symbol:t,token:k});
const getCandles=(t,r,from,to,k)=>fhFetch("/api/v1/stock/candle",{symbol:t,resolution:r,from,to,token:k});

/* ─── AI CALLS ───────────────────────────────────────────────────────────── */
async function callAI(body){
  try{
    const ctrl=new AbortController();const timer=setTimeout(()=>ctrl.abort(),24000);
    const res=await fetch("/.netlify/functions/ai",{method:"POST",headers:{"Content-Type":"application/json"},signal:ctrl.signal,body:JSON.stringify({model:"claude-sonnet-4-5",...body})});
    clearTimeout(timer);
    if(!res.ok)return null;
    const data=await res.json();
    if(data.error)return null;
    return data.content?.filter(b=>b.type==="text").map(b=>b.text).join("")||"";
  }catch{return null;}
}
async function callAIJSON(prompt){
  const text=await callAI({max_tokens:1200,tools:[{type:"web_search_20250305",name:"web_search"}],messages:[{role:"user",content:prompt}]});
  if(!text)return null;
  try{return JSON.parse(text.replace(/```json|```/g,"").trim());}catch{return null;}
}
async function callAIText(prompt,onChunk,maxTokens=1200){
  onChunk("Researching…");
  const text=await callAI({max_tokens:maxTokens,tools:[{type:"web_search_20250305",name:"web_search"}],messages:[{role:"user",content:prompt}]});
  if(!text){onChunk("Analysis unavailable — try again.");return "";}
  const words=text.split(" ");let built="";
  for(let i=0;i<words.length;i++){built+=(i===0?"": " ")+words[i];if(i%5===0)onChunk(built);await new Promise(r=>setTimeout(r,12));}
  onChunk(text);return text;
}

/* ═══════════════════════════════════════════════════════════════════════════
   PRICE CHART
═══════════════════════════════════════════════════════════════════════════ */
function PriceChart({sym,apiKey,price}){
  const canvasRef=useRef(null);
  const [period,setPeriod]=useState("1D");
  const [loading,setLoading]=useState(true);
  const [candles,setCandles]=useState(null);

  useEffect(()=>{
    if(!sym||!apiKey)return;
    setLoading(true);
    const now=Math.floor(Date.now()/1000);
    const configs={
      "1D":{res:"5",from:now-86400},
      "1W":{res:"30",from:now-7*86400},
      "1M":{res:"D",from:now-30*86400},
      "3M":{res:"D",from:now-90*86400},
      "1Y":{res:"W",from:now-365*86400},
    };
    const {res,from}=configs[period];
    getCandles(sym,res,from,now,apiKey).then(d=>{
      if(d?.s==="ok")setCandles(d);
      setLoading(false);
    });
  },[sym,period,apiKey]);

  useEffect(()=>{
    if(!candles||!canvasRef.current)return;
    const canvas=canvasRef.current;
    const ctx=canvas.getContext("2d");
    const dpr=window.devicePixelRatio||1;
    const W=canvas.offsetWidth,H=canvas.offsetHeight;
    canvas.width=W*dpr;canvas.height=H*dpr;ctx.scale(dpr,dpr);

    const closes=candles.c;
    if(!closes||closes.length<2)return;
    const opens=candles.o;
    const minP=Math.min(...closes)*0.998,maxP=Math.max(...closes)*1.002;
    const toY=v=>H-((v-minP)/(maxP-minP)*(H-20))-10;
    const isUp=closes[closes.length-1]>=closes[0];
    const lineColor=isUp?"#3dd68c":"#f0566e";
    const gradColor=isUp?"rgba(61,214,140,":"rgba(240,86,110,";

    // gradient fill
    const grad=ctx.createLinearGradient(0,0,0,H);
    grad.addColorStop(0,gradColor+"0.15)");grad.addColorStop(1,gradColor+"0)");
    ctx.beginPath();
    ctx.moveTo(0,toY(closes[0]));
    closes.forEach((v,i)=>{ctx.lineTo((i/(closes.length-1))*W,toY(v));});
    ctx.lineTo(W,H);ctx.lineTo(0,H);ctx.closePath();
    ctx.fillStyle=grad;ctx.fill();

    // line
    ctx.beginPath();ctx.moveTo(0,toY(closes[0]));
    closes.forEach((v,i)=>{ctx.lineTo((i/(closes.length-1))*W,toY(v));});
    ctx.strokeStyle=lineColor;ctx.lineWidth=2;ctx.lineJoin="round";ctx.stroke();

    // zero line
    if(opens&&opens.length){
      const openY=toY(opens[0]);
      ctx.beginPath();ctx.moveTo(0,openY);ctx.lineTo(W,openY);
      ctx.strokeStyle="rgba(255,255,255,0.08)";ctx.lineWidth=1;ctx.setLineDash([4,4]);ctx.stroke();ctx.setLineDash([]);
    }

    // price label at end
    const lastY=toY(closes[closes.length-1]);
    ctx.fillStyle=lineColor;ctx.beginPath();ctx.arc(W-1,lastY,3.5,0,Math.PI*2);ctx.fill();
  },[candles]);

  return(
    <div className="card" style={{marginBottom:0}}>
      <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:12}}>
        <div className="card-title" style={{marginBottom:0}}>Price Chart</div>
        <div className="chart-tabs">
          {["1D","1W","1M","3M","1Y"].map(p=>(
            <div key={p} className={`chart-tab ${period===p?"on":""}`} onClick={()=>setPeriod(p)}>{p}</div>
          ))}
        </div>
      </div>
      <div className="chart-wrap" style={{height:180}}>
        {loading&&<div className="chart-loading"><div className="spin"/><span>Loading chart…</span></div>}
        {!loading&&!candles&&<div className="chart-loading" style={{color:"var(--t3)"}}>Add Finnhub key for live chart</div>}
        <canvas ref={canvasRef} className="chart-canvas" style={{width:"100%",height:"100%",display:loading||!candles?"none":"block"}}/>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   RSI GAUGE SVG
═══════════════════════════════════════════════════════════════════════════ */
function RSIGauge({rsi}){
  if(rsi==null)return(
    <div style={{textAlign:"center",color:"var(--t3)",fontSize:11,padding:"20px 0"}}>
      <div className="sk" style={{width:100,height:100,borderRadius:"50%",margin:"0 auto 8px"}}/>
      <div className="sk" style={{width:60,height:14,margin:"0 auto"}}/>
    </div>
  );
  const v=Math.min(Math.max(rsi,0),100);
  const cx=80,cy=80,r=60;
  const toXY=(deg)=>{const rad=deg*Math.PI/180;return[cx+r*Math.cos(rad),cy+r*Math.sin(rad)];};
  const arc=(from,to,color)=>{
    const[x1,y1]=toXY(from);const[x2,y2]=toXY(to);
    const large=Math.abs(to-from)>180?1:0;
    return<path d={`M${x1},${y1} A${r},${r} 0 ${large},1 ${x2},${y2}`} fill="none" stroke={color} strokeWidth="12" strokeLinecap="round"/>;
  };
  const needleAngle=-180+v*1.8;
  const[nx,ny]=toXY(needleAngle);
  const color=v<30?"var(--cyan)":v<45?"var(--green)":v<60?"var(--t2)":v<75?"var(--gold)":"var(--red)";
  const label=v<30?"Oversold":v<45?"Neutral-Low":v<60?"Neutral":v<75?"Overbought":"Extreme OB";
  return(
    <div className="rsi-panel">
      <svg width="160" height="95" viewBox="0 0 160 95">
        {arc(-180,-108,"rgba(34,229,212,0.2)")}
        {arc(-108,-72,"rgba(61,214,140,0.2)")}
        {arc(-72,-36,"rgba(245,197,66,0.2)")}
        {arc(-36,0,"rgba(240,86,110,0.2)")}
        {arc(-180,needleAngle,color)}
        <circle cx={nx} cy={ny} r="6" fill={color} opacity="0.9"/>
        <circle cx={cx} cy={cy} r="3" fill={color}/>
        {[0,25,50,75,100].map(tick=>{
          const a=-180+tick*1.8;const[tx,ty]=toXY(a);
          return<text key={tick} x={tx} y={ty} fill="rgba(84,94,130,0.8)" fontSize="8" textAnchor="middle" dominantBaseline="middle">{tick}</text>;
        })}
      </svg>
      <div className="rsi-label-val" style={{color}}>{v.toFixed(0)}</div>
      <div className="rsi-label-txt" style={{color}}>{label}</div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   RADAR CHART
═══════════════════════════════════════════════════════════════════════════ */
function RadarChart({scores}){
  const axes=["Revenue Growth","Margin Quality","Balance Sheet","Earnings Traj.","Valuation","Analyst Conv."];
  const n=axes.length,cx=110,cy=110,maxR=82;
  const pts=scores.map((s,i)=>{const a=(i/n)*2*Math.PI-Math.PI/2;const r=(s/10)*maxR;return[cx+r*Math.cos(a),cy+r*Math.sin(a)];});
  const grid=frac=>axes.map((_,i)=>{const a=(i/n)*2*Math.PI-Math.PI/2;return[cx+frac*maxR*Math.cos(a),cy+frac*maxR*Math.sin(a)];});
  const poly=pts=>`${pts.map(([x,y])=>`${x},${y}`).join(" ")}`;
  return(
    <svg width="220" height="220" viewBox="0 0 220 220">
      {[0.25,0.5,0.75,1].map(f=><polygon key={f} points={poly(grid(f))} fill="none" stroke="rgba(99,130,255,0.08)" strokeWidth="1"/>)}
      {axes.map((_,i)=>{const a=(i/n)*2*Math.PI-Math.PI/2;return<line key={i} x1={cx} y1={cy} x2={cx+maxR*Math.cos(a)} y2={cy+maxR*Math.sin(a)} stroke="rgba(99,130,255,0.06)" strokeWidth="1"/>;} )}
      <polygon points={poly(pts)} fill="rgba(79,139,255,0.12)" stroke="var(--blue)" strokeWidth="1.5"/>
      {pts.map(([x,y],i)=><circle key={i} cx={x} cy={y} r="4" fill="var(--blue)"/>)}
      {axes.map((label,i)=>{const a=(i/n)*2*Math.PI-Math.PI/2;const[lx,ly]=[cx+(maxR+20)*Math.cos(a),cy+(maxR+20)*Math.sin(a)];return<text key={i} x={lx} y={ly} fill="rgba(139,147,184,0.7)" fontSize="8.5" textAnchor="middle" dominantBaseline="middle">{label}</text>;})}
    </svg>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   SECTOR HEATMAP
═══════════════════════════════════════════════════════════════════════════ */
function SectorHeatmap(){
  const sectors=[
    {name:"Tech",    pct:1.82},{name:"Energy",  pct:-0.43},{name:"Finance", pct:0.91},
    {name:"Health",  pct:0.34},{name:"Comm",    pct:1.21},{name:"Ind",     pct:-0.18},
    {name:"Consum",  pct:0.67},{name:"Util",    pct:-0.82},{name:"Real Est",pct:-0.31},
    {name:"Material",pct:0.12},
  ];
  return(
    <div className="heatmap-grid">
      {sectors.map((s,i)=>{
        const pos=s.pct>=0;
        const intensity=Math.min(Math.abs(s.pct)/2,1);
        const bg=pos?`rgba(61,214,140,${0.06+intensity*0.2})`:`rgba(240,86,110,${0.06+intensity*0.2})`;
        const border=pos?`rgba(61,214,140,${0.1+intensity*0.2})`:`rgba(240,86,110,${0.1+intensity*0.2})`;
        return(
          <div key={i} className="hm-cell" style={{background:bg,border:`1px solid ${border}`}}>
            <div className="hm-name" style={{color:"var(--t2)",fontSize:9}}>{s.name}</div>
            <div className="hm-pct" style={{color:pos?"var(--green)":"var(--red)"}}>{sign(s.pct)}{s.pct.toFixed(2)}%</div>
          </div>
        );
      })}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   RESEARCH PAGE
═══════════════════════════════════════════════════════════════════════════ */
function ResearchPage({sym,stockData,apiKey,aiCache,setAiCache}){
  const sd    = stockData[sym];
  const q     = sd?.quote;
  const p     = sd?.profile;
  const m     = sd?.metrics?.metric;
  const news  = sd?.news||[];
  const rec   = sd?.rec;

  const price  = q?.c;
  const chg    = q?.d;
  const chgPct = q?.dp;
  const wkHigh = m?.["52WeekHigh"];
  const wkLow  = m?.["52WeekLow"];
  const rangePct = (wkHigh&&wkLow&&price)?((price-wkLow)/(wkHigh-wkLow)*100):50;

  // AI state — seed from localStorage instantly
  const ls = cacheGet(sym);
  const [techData,   setTechData  ] = useState(aiCache[sym]?.tech      || ls?.tech      || null);
  const [narrative1, setNarrative1] = useState(aiCache[sym]?.narrative1|| ls?.narrative1|| "");
  const [narrative2, setNarrative2] = useState(aiCache[sym]?.narrative2|| ls?.narrative2|| "");
  const [catalysts,  setCatalysts ] = useState(aiCache[sym]?.catalysts  || ls?.catalysts  || null);
  const [signals,    setSignals   ] = useState(aiCache[sym]?.signals    || ls?.signals    || null);
  const [techLoading,setTechLoading] = useState(false);
  const [nar1Loading,setNar1Loading] = useState(false);
  const [nar2Loading,setNar2Loading] = useState(false);
  const [catLoading, setCatLoading ] = useState(false);
  const [sigLoading, setSigLoading ] = useState(false);
  const loaded = useRef({});

  const momentumScore = techData?.momentumScore ?? null;
  const signalStr     = momentumScore==null?"—":momentumScore>=60?"Bullish":momentumScore<=40?"Bearish":"Neutral";
  const signalCls     = momentumScore==null?"neut":momentumScore>=60?"bull":momentumScore<=40?"bear":"neut";
  const scores        = techData?.scores ?? [5,5,5,5,5,5];
  const srLevels      = techData?.srLevels ?? [];
  const maDevs        = techData?.maDevs ?? [];
  const macdHist      = techData?.macdHist ?? [];
  const scenarios     = techData?.scenarios ?? null;
  const entryZone     = techData?.entry ?? null;
  const stopLevel     = techData?.stop  ?? null;
  const target3m      = techData?.target3m ?? null;

  useEffect(()=>{
    if(!sym||!price)return;
    const cached=cacheGet(sym);
    if(cached?.tech&&cached?.narrative1&&cached?.narrative2&&cached?.catalysts&&cached?.signals){
      if(!techData)   setTechData(cached.tech);
      if(!narrative1) setNarrative1(cached.narrative1);
      if(!narrative2) setNarrative2(cached.narrative2);
      if(!catalysts)  setCatalysts(cached.catalysts);
      if(!signals)    setSignals(cached.signals);
      return;
    }

    const mp=m?`P/E:${m.peBasicExclExtraTTM?.toFixed(1)},GM:${m.grossMarginTTM?.toFixed(1)}%,ROE:${m.roeTTM?.toFixed(1)}%,Beta:${m.beta?.toFixed(2)},52wH:${wkHigh},52wL:${wkLow}`:"no fundamentals";
    const rp=rec?`StrongBuy:${rec.strongBuy},Buy:${rec.buy},Hold:${rec.hold},Sell:${rec.sell}`:"no rec";

    // All 5 calls fire in parallel
    if(!loaded.current[`${sym}_tech`]&&!techData){
      loaded.current[`${sym}_tech`]=true; setTechLoading(true);
      callAIJSON(`Quant analyst. ${sym} at $${price?.toFixed(2)}. Return ONLY valid JSON no markdown:
{"rsi":<0-100>,"maScore":<0-100>,"momentumScore":<0-100>,"maDevs":[{"name":"20d","pct":<num>},{"name":"50d","pct":<num>},{"name":"200d","pct":<num>}],"macdHist":[<20 nums>],"srLevels":[{"type":"resistance","price":<num>,"note":"<str>"},{"type":"support","price":<num>,"note":"<str>"},{"type":"resistance","price":<num>,"note":"<str>"},{"type":"support","price":<num>,"note":"<str>"}],"scores":[<6 nums 0-10>],"scenarios":{"bull":{"target":<num>,"assumption":"<str>"},"base":{"target":<num>,"assumption":"<str>"},"bear":{"target":<num>,"assumption":"<str>"}},"entry":"<str>","stop":"<str>","target3m":"<str>"}
Fundamentals: ${mp}. Recs: ${rp}. Search latest ${sym} technicals.`)
        .then(d=>{if(d){setTechData(d);updateCache(sym,"tech",d);}setTechLoading(false);});
    }

    if(!loaded.current[`${sym}_nar1`]&&!narrative1){
      loaded.current[`${sym}_nar1`]=true; setNar1Loading(true);
      callAIText(
        `Equity analyst research note on ${sym} at $${price?.toFixed(2)}. Write 2 paragraphs, no headers, no bullets:\nPara 1: What's driving this stock RIGHT NOW — specific recent news, catalysts, dates.\nPara 2: Bull case — 2-3 specific upcoming catalysts with dates and price implications.`,
        t=>{setNarrative1(t);},900
      ).then(t=>{setNar1Loading(false);updateCache(sym,"narrative1",t);});
    }

    if(!loaded.current[`${sym}_nar2`]&&!narrative2){
      loaded.current[`${sym}_nar2`]=true; setNar2Loading(true);
      callAIText(
        `Equity analyst research note on ${sym} at $${price?.toFixed(2)}. Write 2 paragraphs, no headers, no bullets:\nPara 1: Bear case — 3 biggest risks ranked by probability, be specific.\nPara 2: Verdict — buy/hold/avoid, entry zone $X-Y, stop $Z, 3-month target $W with reasoning. Date: ${new Date().toLocaleDateString()}.`,
        t=>{setNarrative2(t);},900
      ).then(t=>{setNar2Loading(false);updateCache(sym,"narrative2",t);});
    }

    if(!loaded.current[`${sym}_cat`]&&!catalysts){
      loaded.current[`${sym}_cat`]=true; setCatLoading(true);
      callAIJSON(`Upcoming catalysts for ${sym}. Return ONLY JSON array no markdown:
[{"date":"<YYYY-MM-DD>","title":"<str>","tag":"bull|bear|neut","detail":"<1 sentence>"}]
Max 5 items. Include earnings, product launches, regulatory events.`)
        .then(d=>{if(Array.isArray(d)){setCatalysts(d);updateCache(sym,"catalysts",d);}setCatLoading(false);});
    }

    if(!loaded.current[`${sym}_sig`]&&!signals){
      loaded.current[`${sym}_sig`]=true; setSigLoading(true);
      callAIJSON(`For ${sym} at $${price?.toFixed(2)}, return ONLY JSON no markdown:
{"shortInterest":{"pct":<float>,"daysTocover":<float>,"borrowRate":<float>,"squeezeScore":<0-100>},"relativeStrength":[{"period":"5d","vs_spy":<float>},{"period":"20d","vs_spy":<float>},{"period":"60d","vs_spy":<float>},{"period":"YTD","vs_spy":<float>},{"period":"1Y","vs_spy":<float>}],"earningsHistory":[{"date":"<str>","beat":"beat|miss|inline","epsEst":<float>,"epsActual":<float>,"impliedMove":<float>,"actualMove":<float>}],"institutions":[{"name":"<fund>","action":"add|reduce|new","shares":<int>,"pctChange":<float>}]}
Search for current ${sym} short interest, institutional 13F filings, earnings history. Max 5 institutions, 6 earnings quarters.`)
        .then(d=>{if(d){setSignals(d);updateCache(sym,"signals",d);}setSigLoading(false);});
    }
  },[sym,price]);

  function updateCache(sym,key,val){
    const prev=cacheGet(sym)||{};
    const updated={...prev,[key]:val};
    cacheSet(sym,updated);
    setAiCache(p=>({...p,[sym]:{...p[sym],[key]:val}}));
  }

  const priceFmt = price?`$${price.toLocaleString("en-US",{minimumFractionDigits:2,maximumFractionDigits:2})}`:"—";

  const ShortInterestPanel = ()=>{
    const si = signals?.shortInterest;
    if(sigLoading&&!si)return <div className="si-grid">{[0,1,2,3].map(i=><div key={i} className="si-cell"><div className="sk" style={{height:12,width:"60%",marginBottom:10}}/><div className="sk" style={{height:28,width:"80%"}}/></div>)}</div>;
    if(!si)return <div style={{color:"var(--t3)",fontSize:11,padding:"12px 0"}}>Short interest data loading…</div>;
    const warn=si.pct>15;
    return(
      <>
        <div className="si-grid">
          <div className="si-cell"><div className="si-label">Short Float %</div><div className={`si-val ${warn?"warn":"ok"}`}>{si.pct?.toFixed(1)}%</div></div>
          <div className="si-cell"><div className="si-label">Days to Cover</div><div className={`si-val ${si.daysToCover>5?"warn":"ok"}`}>{si.daysToCover?.toFixed(1)}d</div></div>
          <div className="si-cell"><div className="si-label">Borrow Rate</div><div className="si-val">{si.borrowRate?.toFixed(1)}%</div></div>
          <div className="si-cell"><div className="si-label">Squeeze Score</div><div className="si-val" style={{color:`hsl(${120-si.squeezeScore*1.2},70%,60%)`}}>{si.squeezeScore}/100</div></div>
        </div>
        <div style={{marginTop:8}}>
          <div style={{display:"flex",justifyContent:"space-between",marginBottom:5}}>
            <span style={{fontSize:10,color:"var(--t3)"}}>Squeeze Potential</span>
            <span style={{fontSize:10,fontFamily:"var(--mono)",color:"var(--t2)"}}>{si.squeezeScore}/100</span>
          </div>
          <div className="squeeze-meter"><div className="squeeze-fill" style={{width:`${si.squeezeScore}%`}}/></div>
        </div>
      </>
    );
  };

  const RelativeStrengthPanel = ()=>{
    const rs=signals?.relativeStrength;
    if(sigLoading&&!rs)return <div className="rs-grid">{[0,1,2,3,4].map(i=><div key={i} className="rs-cell"><div className="sk" style={{height:10,width:"60%",margin:"0 auto 8px"}}/><div className="sk" style={{height:20,width:"70%",margin:"0 auto"}}/></div>)}</div>;
    if(!rs)return null;
    return(
      <div className="rs-grid">
        {rs.map((r,i)=>{
          const pos=r.vs_spy>=0;
          return(
            <div key={i} className="rs-cell">
              <div className="rs-period">{r.period}</div>
              <div className={`rs-val ${pos?"bull":"bear"}`}>{sign(r.vs_spy)}{r.vs_spy?.toFixed(1)}%</div>
              <div className="rs-bar"><div className="rs-bar-fill" style={{width:`${Math.min(100,Math.abs(r.vs_spy)*5+50)}%`,background:pos?"var(--green)":"var(--red)"}}/></div>
              <div style={{fontSize:9,color:"var(--t3)",marginTop:3}}>vs SPY</div>
            </div>
          );
        })}
      </div>
    );
  };

  const EarningsHistoryPanel = ()=>{
    const eh=signals?.earningsHistory;
    if(sigLoading&&!eh)return <div className="sk" style={{height:120,width:"100%"}}/>;
    if(!eh||eh.length===0)return null;
    return(
      <div style={{overflowX:"auto"}}>
        <table className="er-table">
          <thead>
            <tr>
              <th className="er-th">Date</th>
              <th className="er-th">Result</th>
              <th className="er-th">EPS Est</th>
              <th className="er-th">EPS Actual</th>
              <th className="er-th">Impl. Move</th>
              <th className="er-th">Actual Move</th>
            </tr>
          </thead>
          <tbody>
            {eh.slice(0,6).map((e,i)=>{
              const cls=e.beat==="beat"?"er-beat":e.beat==="miss"?"er-miss":"er-inline";
              const mvPos=(e.actualMove||0)>=0;
              return(
                <tr key={i}>
                  <td className="er-td">{e.date}</td>
                  <td className="er-td"><span className={cls}>{e.beat?.toUpperCase()}</span></td>
                  <td className="er-td">${e.epsEst?.toFixed(2)}</td>
                  <td className="er-td"><span className={cls}>${e.epsActual?.toFixed(2)}</span></td>
                  <td className="er-td">±{e.impliedMove?.toFixed(1)}%</td>
                  <td className="er-td"><span className={`er-move ${mvPos?"pos":"neg"}`}>{sign(e.actualMove||0)}{e.actualMove?.toFixed(1)}%</span></td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    );
  };

  const InstitutionalPanel = ()=>{
    const inst=signals?.institutions;
    if(sigLoading&&!inst)return <div className="sk" style={{height:100,width:"100%"}}/>;
    if(!inst||inst.length===0)return null;
    return(
      <>
        {inst.slice(0,5).map((ins,i)=>(
          <div key={i} className="inst-row">
            <div className="inst-name">{ins.name}</div>
            <span className={`inst-tag ${ins.action}`}>{ins.action==="new"?"NEW":ins.action==="add"?"ADD":"REDUCE"}</span>
            <div className={`inst-change ${ins.action}`}>{ins.action!=="reduce"?"+":""}{ins.shares?.toLocaleString()} sh</div>
            <div className="inst-pct">{sign(ins.pctChange)}{ins.pctChange?.toFixed(1)}%</div>
          </div>
        ))}
      </>
    );
  };

  const MACDBars = ()=>{
    if(!macdHist||macdHist.length===0)return <div className="sk" style={{height:50,width:"100%"}}/>;
    const max=Math.max(...macdHist.map(Math.abs),0.01);
    return(
      <svg width="100%" height="52" style={{display:"block",overflow:"visible"}}>
        {macdHist.slice(-20).map((v,i,arr)=>{
          const bW=Math.floor(100/arr.length);
          const h=Math.abs(v)/max*22;
          const pos=v>=0;
          const x=`${(i/arr.length)*100}%`;
          return <g key={i}><rect x={x} y={pos?26-h:26} width={`${bW*0.75}%`} height={h||1} fill={pos?"var(--green)":"var(--red)"} opacity="0.8" rx="1"/></g>;
        })}
        <line x1="0" y1="26" x2="100%" y2="26" stroke="rgba(99,130,255,0.15)" strokeWidth="1"/>
      </svg>
    );
  };

  return(
    <div className="rp">
      {/* ── HERO ── */}
      <div className="hero">
        <div className="hero-top">
          <div className="hero-left">
            <div className="hero-sym">{sym}</div>
            <div className="hero-name">{p?.name||sym} · {p?.exchange||"NASDAQ"} · {p?.finnhubIndustry||""}</div>
          </div>
          <div className="hero-right">
            <div className="hero-price" style={{color:chgPct==null?"var(--t1)":chgPct>=0?"var(--green)":"var(--red)"}}>{priceFmt}</div>
            {chg!=null&&<span className={`hero-chg ${chgPct>=0?"pos":"neg"}`}>{sign(chg)}{fmt(chg,"$")} ({sign(chgPct)}{fmt(chgPct,"","%")})</span>}
            <div className={`signal-pill ${signalCls}`}>
              {signalStr==="Bullish"?"▲ ":signalStr==="Bearish"?"▼ ":"— "}{signalStr}
              {momentumScore!=null&&<span style={{opacity:.7,fontSize:10}}>· {momentumScore}/100</span>}
            </div>
            <div className="hero-time">{new Date().toLocaleString("en-US",{month:"short",day:"numeric",hour:"2-digit",minute:"2-digit"})}</div>
          </div>
        </div>
        {wkHigh&&wkLow&&(
          <div className="range-wrap">
            <span className="range-lo">{fmt(wkLow,"$")}</span>
            <div className="range-track" style={{flex:1}}>
              <div className="range-gradient"/>
              <div className="range-dot" style={{left:`${Math.max(2,Math.min(98,rangePct))}%`}}/>
            </div>
            <span className="range-hi">{fmt(wkHigh,"$")}</span>
            <span className="range-label">52W Range</span>
          </div>
        )}
        <div className="meta-strip" style={{marginTop:14}}>
          {[
            {l:"Mkt Cap",  v:fmtM(p?.marketCapitalization?p.marketCapitalization*1e6:null)},
            {l:"Volume",   v:fmt(q?.v)},
            {l:"P/E",      v:fmt(m?.peBasicExclExtraTTM)},
            {l:"Beta",     v:fmt(m?.beta)},
            {l:"EPS TTM",  v:fmt(m?.epsTTM,"$")},
            {l:"Gross Margin",v:fmt(m?.grossMarginTTM,""," %")},
            {l:"52W High", v:fmt(wkHigh,"$")},
            {l:"52W Low",  v:fmt(wkLow,"$")},
          ].map((x,i)=>(
            <div key={i} className="meta-item">
              <span className="meta-label">{x.l}</span>
              <span className="meta-val">{x.v}</span>
            </div>
          ))}
        </div>
      </div>

      {/* ── PRICE CHART ── */}
      <div className="section">
        <PriceChart sym={sym} apiKey={apiKey} price={price}/>
      </div>

      {/* ── TECHNICAL DASHBOARD ── */}
      <div className="section">
        <div className="section-head">Technical Dashboard <span className="badge">LIVE DATA</span></div>
        <div className="tech-grid">
          {/* RSI */}
          <div className="card">
            <div className="card-title">RSI (14)</div>
            <RSIGauge rsi={techData?.rsi}/>
          </div>
          {/* MACD + MA Deviations */}
          <div className="card">
            <div className="card-title">MACD Histogram</div>
            <MACDBars/>
            <div style={{marginTop:16}}>
              <div className="card-title">MA Deviation from Price</div>
              {maDevs.length===0&&[0,1,2].map(i=><div key={i} className="sk" style={{height:10,marginBottom:10}}/>)}
              {maDevs.map((ma,i)=>{
                const pos=(ma.pct||0)>=0;
                return(
                  <div key={i} className="ma-row">
                    <span className="ma-name">{ma.name}</span>
                    <div className="ma-bar-track">
                      <div className="ma-bar-fill" style={{width:`${Math.min(100,Math.abs(ma.pct||0))}%`,background:pos?"var(--green)":"var(--red)"}}/>
                    </div>
                    <span className="ma-pct" style={{color:pos?"var(--green)":"var(--red)"}}>{sign(ma.pct||0)}{(ma.pct||0).toFixed(1)}%</span>
                  </div>
                );
              })}
            </div>
          </div>
          {/* Momentum + S/R */}
          <div className="card" style={{display:"flex",flexDirection:"column",gap:16}}>
            <div>
              <div className="card-title">Momentum Score</div>
              {momentumScore==null
                ?<div className="sk" style={{height:60,marginTop:8}}/>
                :<>
                  <div className="score-big" style={{color:momentumScore>=60?"var(--green)":momentumScore<=40?"var(--red)":"var(--gold)"}}>{momentumScore}</div>
                  <div className="momentum-label">{momentumScore>=70?"Strong Bullish":momentumScore>=55?"Moderate Bullish":momentumScore<=30?"Strong Bearish":momentumScore<=45?"Moderate Bearish":"Neutral"}</div>
                </>
              }
            </div>
            <div>
              <div className="card-title">Key Levels</div>
              {srLevels.length===0&&[0,1,2,3].map(i=><div key={i} className="sk" style={{height:10,marginBottom:8}}/>)}
              {srLevels.map((sr,i)=>(
                <div key={i} className="sr-row">
                  <span className={`sr-badge ${sr.type==="resistance"?"res":"sup"}`}>{sr.type==="resistance"?"R":"S"}</span>
                  <span className="sr-price">${(sr.price||0).toLocaleString()}</span>
                  <span className="sr-note">{sr.note}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ── SHORT INTEREST ── */}
      <div className="section">
        <div className="section-head">Short Interest <span className="badge">ALPHA SIGNAL</span></div>
        <div className="card"><ShortInterestPanel/></div>
      </div>

      {/* ── RELATIVE STRENGTH ── */}
      <div className="section">
        <div className="section-head">Relative Strength vs SPY</div>
        <div className="card"><RelativeStrengthPanel/></div>
      </div>

      {/* ── FUNDAMENTAL SCORECARD ── */}
      <div className="section">
        <div className="section-head">Fundamental Scorecard</div>
        <div style={{display:"grid",gridTemplateColumns:"240px 1fr",gap:12}}>
          <div className="card" style={{display:"flex",alignItems:"center",justifyContent:"center"}}>
            <RadarChart scores={scores}/>
          </div>
          <div className="card">
            <div className="card-title">Axis Scores</div>
            {["Revenue Growth","Margin Quality","Balance Sheet","Earnings Trajectory","Valuation vs Peers","Analyst Conviction"].map((ax,i)=>(
              <div key={i} className="axis-row">
                <span className="axis-name">{ax}</span>
                <div className="axis-track">
                  <div className="axis-fill" style={{width:`${(scores[i]||0)*10}%`,background:scores[i]>=7?"var(--green)":scores[i]>=4?"var(--blue)":"var(--red)"}}/>
                </div>
                <span className="axis-num">{scores[i]||0}</span>
              </div>
            ))}
            {scenarios&&(
              <div className="scenario-grid">
                {[{k:"bull",cls:"bull",l:"Bull"},{k:"base",cls:"base",l:"Base"},{k:"bear",cls:"bear",l:"Bear"}].map(s=>(
                  <div key={s.k} className={`sc-card ${s.cls}`}>
                    <div className="sc-label">{s.l} Case</div>
                    <div className="sc-target">${scenarios[s.k]?.target?.toLocaleString()||"—"}</div>
                    <div className="sc-assume">{scenarios[s.k]?.assumption||"—"}</div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ── EARNINGS HISTORY ── */}
      <div className="section">
        <div className="section-head">Earnings Reaction History</div>
        <div className="card"><EarningsHistoryPanel/></div>
      </div>

      {/* ── INSTITUTIONAL OWNERSHIP ── */}
      <div className="section">
        <div className="section-head">Institutional Ownership (Latest 13F)</div>
        <div className="card"><InstitutionalPanel/></div>
      </div>

      {/* ── ANALYST CONSENSUS ── */}
      {rec&&(
        <div className="section">
          <div className="section-head">Wall Street Consensus · {rec.period?.slice(0,7)}</div>
          <div className="analyst-bar">
            {[{l:"Strong Buy",v:rec.strongBuy,c:"var(--green)"},{l:"Buy",v:rec.buy,c:"#7de8a8"},{l:"Hold",v:rec.hold,c:"var(--gold)"},{l:"Sell",v:rec.sell,c:"#f59a9a"},{l:"Strong Sell",v:rec.strongSell,c:"var(--red)"}].map((x,i)=>(
              <div key={i} className="ab-cell">
                <div className="ab-label">{x.l}</div>
                <div className="ab-num" style={{color:x.c}}>{x.v??0}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── SECTOR HEATMAP ── */}
      <div className="section">
        <div className="section-head">Sector Rotation Heatmap</div>
        <div className="card"><SectorHeatmap/></div>
      </div>

      {/* ── RESEARCH NOTE ── */}
      <div className="section">
        <div className="section-head">Research Note <span className="badge">AI · WEB SEARCH</span></div>
      </div>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12,padding:"0 28px"}}>
        <div className="narrative-card">
          <div style={{fontSize:9,fontWeight:700,letterSpacing:"0.09em",textTransform:"uppercase",color:"var(--green)",marginBottom:10}}>▲ What's Driving It / Bull Case</div>
          {nar1Loading&&!narrative1&&(
            <div style={{display:"flex",flexDirection:"column",gap:7}}>
              {[100,85,92,70,88,60,78].map((w,i)=><div key={i} className="sk" style={{height:11,width:`${w}%`}}/>)}
            </div>
          )}
          {narrative1&&<div className="narrative-text">{narrative1}{nar1Loading&&<span className="cursor"/>}</div>}
        </div>
        <div className="narrative-card">
          <div style={{fontSize:9,fontWeight:700,letterSpacing:"0.09em",textTransform:"uppercase",color:"var(--red)",marginBottom:10}}>▼ Bear Case / Verdict</div>
          {nar2Loading&&!narrative2&&(
            <div style={{display:"flex",flexDirection:"column",gap:7}}>
              {[88,75,95,65,82,58].map((w,i)=><div key={i} className="sk" style={{height:11,width:`${w}%`}}/>)}
            </div>
          )}
          {narrative2&&<div className="narrative-text">{narrative2}{nar2Loading&&<span className="cursor"/>}</div>}
        </div>
      </div>

      {/* ── TRADE PARAMS ── */}
      {(entryZone||stopLevel||target3m)&&(
        <div className="section">
          <div className="section-head">Trade Parameters</div>
          <div className="trade-grid">
            <div className="tg-cell"><div className="tg-label">Entry Zone</div><div className="tg-val" style={{color:"var(--blue2)"}}>{entryZone||"—"}</div></div>
            <div className="tg-cell"><div className="tg-label">Stop Loss</div><div className="tg-val" style={{color:"var(--red)"}}>{stopLevel||"—"}</div></div>
            <div className="tg-cell"><div className="tg-label">3-Month Target</div><div className="tg-val" style={{color:"var(--green)"}}>{target3m||"—"}</div></div>
          </div>
        </div>
      )}

      {/* ── CATALYST CALENDAR ── */}
      <div className="section">
        <div className="section-head">Catalyst Calendar</div>
        <div className="card">
          {catLoading&&!catalysts&&(
            <div style={{display:"flex",flexDirection:"column",gap:10}}>
              {[0,1,2,3].map(i=><div key={i} style={{display:"flex",gap:10}}><div className="sk" style={{width:70,height:12}}/><div className="sk" style={{width:8,height:8,borderRadius:"50%"}}/><div className="sk" style={{flex:1,height:12}}/></div>)}
            </div>
          )}
          {catalysts&&catalysts.map((c,i)=>(
            <div key={i} className="cal-item">
              <div className="cal-date">{c.date}</div>
              <div className={`cal-dot ${c.tag||"neut"}`}/>
              <div className="cal-body">
                <div className="cal-title">{c.title}</div>
                <span className={`cal-badge ${c.tag||"neut"}`}>{c.tag==="bull"?"Bullish":c.tag==="bear"?"Bearish":"Neutral"}</span>
                {c.detail&&<div className="cal-detail">{c.detail}</div>}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── NEWS ── */}
      {news.length>0&&(
        <div className="section" style={{paddingBottom:40}}>
          <div className="section-head">Recent News</div>
          {news.slice(0,6).map((n,i)=>(
            <div key={i} className="news-item" onClick={()=>n.url&&window.open(n.url,"_blank")}>
              <div className="news-head"><div className="news-hl">{n.headline}</div><div className="news-arrow">↗</div></div>
              <div className="news-meta">{n.source} · {new Date(n.datetime*1000).toLocaleDateString()}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   GEX DASHBOARD
═══════════════════════════════════════════════════════════════════════════ */
function GexSettings({demoMode,setDemoMode,polyKey,setPolyKey,ticker,manualSpot,setManualSpot,onClose}){
  const [k,setK]=useState(polyKey);const [ms,setMs]=useState(manualSpot[ticker]||"");
  const save=()=>{setPolyKey(k);try{localStorage.setItem("polygon_api_key",k);}catch{}if(ms)setManualSpot(p=>({...p,[ticker]:ms}));else setManualSpot(p=>{const n={...p};delete n[ticker];return n;});onClose();};
  return(
    <div className="gex-settings-panel">
      <div className="gex-settings-title"><span>GEX Settings</span><button onClick={onClose} style={{color:"var(--t3)",fontSize:16}}>×</button></div>
      <div className="toggle-row"><span className="toggle-label">Demo mode (Black-Scholes)</span><div className={`toggle ${demoMode?"on":""}`} onClick={()=>setDemoMode(p=>!p)}><div className="toggle-knob"/></div></div>
      <div className="field"><label className="field-label">Manual spot override for {ticker}</label><input className="field-input" placeholder="e.g. 585.50" value={ms} onChange={e=>setMs(e.target.value)} type="number" step="0.01"/></div>
      <div className="field"><label className="field-label">Polygon.io API Key</label><input className="field-input" placeholder="Paste key…" value={k} onChange={e=>setK(e.target.value)}/></div>
      <div className="field-note">Polygon Starter ($29/mo) required for live options. Key stored in localStorage as polygon_api_key.</div>
      <div className="btn-row"><button className="btn pri" onClick={save}>Save & Refresh</button><button className="btn sec" onClick={onClose}>Cancel</button></div>
    </div>
  );
}

function KeyLevels({data}){
  const fmtK=v=>v?`$${v.toLocaleString()}`:"—";
  if(!data)return <div className="key-levels">{["Call Wall","Gamma Flip","Dominant 🧲","Put Wall","Regime"].map(l=><div className="kl-cell" key={l}><div className="kl-label">{l}</div><div className="kl-val" style={{color:"var(--t3)"}}>—</div></div>)}</div>;
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
  if(!data)return <div style={{display:"flex",alignItems:"center",justifyContent:"center",height:"100%",color:"var(--t3)",gap:10,flexDirection:"column"}}><div className="spin"/><div style={{fontSize:11}}>Computing strikes…</div></div>;
  const{strikes,expiries,spot,dominant}=data;
  const cols=expiries.slice(0,3);
  const allVals=strikes.flatMap(r=>cols.map(e=>Math.abs(r.byExp[e]||0)));
  const maxAbs=Math.max(...allVals,1);
  const colW=`68px repeat(${cols.length},1fr)`;
  const spotTol=spot*0.002;
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
            <div className="lc-strike" style={{color:isSpot?"var(--blue2)":isDom?"var(--gold)":"var(--t1)"}}>
              {row.strike.toLocaleString()}
              {isSpot&&<span style={{fontSize:8,color:"var(--blue)",marginLeft:3}}>◀</span>}
              {isDom&&!isSpot&&<span style={{fontSize:10}}> 🧲</span>}
            </div>
            {cols.map(exp=>{
              const v=row.byExp[exp]||0,pct=Math.abs(v)/maxAbs*100,pos=v>=0;
              const color=isDom?"var(--gold)":pos?"var(--mag)":"var(--cyan)";
              return(
                <div key={exp} className="lc-gex">
                  {v!==0&&<div className="gex-bar" style={{width:`${Math.max(pct,1.5)}%`,background:color,opacity:0.8}}/>}
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
  const{strikes,spot}=data;const spotTol=spot*0.002;
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
                <div className="cum-strike" style={{color:isSpot?"var(--blue2)":"var(--t3)"}}>{r.strike}</div>
                <div className="cum-bar-wrap">{pos?<div className="cum-bar-pos" style={{width:`${pct}%`}}/>:<div className="cum-bar-neg" style={{width:`${pct}%`}}/>}</div>
                <div className="cum-val" style={{color:pos?"var(--mag)":"var(--cyan)"}}>{fmtG(r.cum)}</div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function GexDashboard(){
  const [ticker,setTicker]     =useState("SPY");
  const [demoMode,setDemoMode] =useState(true);
  const [polyKey,setPolyKey]   =useState(()=>{try{return localStorage.getItem("polygon_api_key")||"";}catch{return "";}});
  const [gexData,setGexData]   =useState(null);
  const [loading,setLoading]   =useState(false);
  const [error,setError]       =useState(null);
  const [spotLabel,setSpotLabel]=useState(null);
  const [manualSpot,setManualSpot]=useState({});
  const [lastRefresh,setLastRefresh]=useState(null);
  const [showSettings,setShowSettings]=useState(false);
  const [rapidRefresh,setRapidRefresh]=useState(false);
  const [replayMode,setReplayMode]=useState(false);
  const [replayPlaying,setReplayPlaying]=useState(false);
  const [replayStep,setReplayStep]=useState("15m");
  const [replaySpeed,setReplaySpeed]=useState(1);
  const [replayPos,setReplayPos]=useState(100);
  const [replayTime,setReplayTime]=useState("");
  const timerRef=useRef(null);const replayRef=useRef(null);

  const posToTime=pos=>{const open=9*60+30,close=16*60,mins=Math.round(open+(close-open)*(pos/100));const h=Math.floor(mins/60),mn=mins%60;return`${h>12?h-12:h}:${mn.toString().padStart(2,"0")} ${h>=12?"PM":"AM"}`;};
  useEffect(()=>{if(replayPlaying&&replayMode){replayRef.current=setInterval(()=>{setReplayPos(p=>{if(p>=100){setReplayPlaying(false);return 100;}return Math.min(100,p+0.5*replaySpeed);});},500);}else clearInterval(replayRef.current);return()=>clearInterval(replayRef.current);},[replayPlaying,replayMode,replaySpeed]);
  useEffect(()=>{setReplayTime(posToTime(replayPos));},[replayPos]);

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
    }catch(e){setError(e.message);const ls=await fetchSpot(t).catch(()=>null);setGexData(generateDemoData(t,ls));}
    finally{setLoading(false);}
  },[]);

  useEffect(()=>{
    load(ticker,demoMode,polyKey,manualSpot);
    clearInterval(timerRef.current);
    timerRef.current=setInterval(()=>load(ticker,demoMode,polyKey,manualSpot),rapidRefresh?REFRESH_FAST:REFRESH_MS);
    return()=>clearInterval(timerRef.current);
  },[ticker,demoMode,polyKey,manualSpot,rapidRefresh]);

  const dotCls=loading?"loading":gexData?"live":"";

  return(
    <div className="gex-wrap">
      <div className="gex-topbar">
        {GEX_TICKERS.map(t=><button key={t} className={`gex-ticker-btn ${ticker===t?"on":""}`} onClick={()=>setTicker(t)}>{t}</button>)}
        <div className="gex-spacer"/>
        {demoMode&&<span className="demo-badge">Demo</span>}
        {spotLabel&&<span style={{fontSize:11,color:"var(--t1)",fontWeight:600,fontFamily:"var(--mono)"}}>{spotLabel}</span>}
        <div className="gex-status"><div className={`gex-dot ${dotCls}`}/><span>{loading?"Loading…":lastRefresh?lastRefresh.toLocaleTimeString():"—"}</span></div>
        <button className="gex-btn" onClick={()=>load(ticker,demoMode,polyKey,manualSpot)}>↺</button>
        <button className="gex-btn" onClick={()=>setRapidRefresh(p=>!p)} style={{color:rapidRefresh?"var(--green)":"var(--t2)",borderColor:rapidRefresh?"rgba(61,214,140,0.4)":"var(--b1)"}} title="Toggle 30s rapid refresh">{rapidRefresh?"⚡ 30s":"⚡"}</button>
        <button className="gex-btn" onClick={()=>setShowSettings(p=>!p)}>⚙</button>
      </div>
      {showSettings&&<GexSettings demoMode={demoMode} setDemoMode={setDemoMode} polyKey={polyKey} setPolyKey={setPolyKey} ticker={ticker} manualSpot={manualSpot} setManualSpot={setManualSpot} onClose={()=>setShowSettings(false)}/>}
      {/* REPLAY BAR */}
      <div className="replay-bar">
        <div className="live-pill" onClick={()=>{setReplayMode(false);setReplayPos(100);setReplayPlaying(false);}} style={{opacity:replayMode?0.5:1}}><div className="dot"/>LIVE</div>
        <button className="gex-btn" style={{fontSize:10,padding:"3px 10px",background:replayMode?"var(--s3)":"none"}} onClick={()=>{setReplayMode(p=>!p);setReplayPlaying(false);setReplayPos(0);}}>⏮ {replayMode?"Exit":"Historical Replay"}</button>
        {replayMode&&<>
          <button className="replay-btn" onClick={()=>setReplayPos(p=>Math.max(0,p-2))}>‹</button>
          <button className={`replay-btn ${replayPlaying?"active":""}`} onClick={()=>setReplayPlaying(p=>!p)}>{replayPlaying?"⏸":"▶"}</button>
          <button className="replay-btn" onClick={()=>setReplayPos(p=>Math.min(100,p+2))}>›</button>
          <input type="range" min="0" max="100" value={replayPos} className="replay-slider" onChange={e=>{setReplayPos(Number(e.target.value));setReplayPlaying(false);}}/>
          <span className="replay-time">{replayTime}</span>
          <span style={{fontSize:10,color:"var(--t3)"}}>{new Date().toLocaleDateString("en-US",{weekday:"short",month:"short",day:"numeric"})}</span>
          <div style={{display:"flex",gap:3}}>{["5m","15m","30m","1h"].map(s=><button key={s} className={`replay-step-btn ${replayStep===s?"on":""}`} onClick={()=>setReplayStep(s)}>{s}</button>)}</div>
          <div style={{display:"flex",gap:3}}>{[0.5,1,2].map(sp=><button key={sp} className={`replay-speed-btn ${replaySpeed===sp?"on":""}`} onClick={()=>setReplaySpeed(sp)}>{sp}x</button>)}</div>
        </>}
      </div>
      <KeyLevels data={gexData}/>
      {error&&<div style={{padding:"7px 16px",fontSize:11,color:"var(--red)",borderBottom:"1px solid var(--b1)",flexShrink:0}}>⚠ {error} — showing demo data.</div>}
      <div className="gex-body"><StrikeLadder data={gexData}/><CumChart data={gexData}/></div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   SETUP MODAL
═══════════════════════════════════════════════════════════════════════════ */
function SetupModal({onSave,onSkip}){
  const [key,setKey]=useState("");
  return(
    <div className="overlay">
      <div className="modal">
        <div className="modal-title">Connect market data</div>
        <div className="modal-sub">Port uses Finnhub for real-time quotes, charts, and fundamentals. Free keys give 60 req/min.</div>
        <div className="field"><label className="field-label">Finnhub API Key</label><input className="field-input" placeholder="d1abc23def456…" value={key} onChange={e=>setKey(e.target.value)} onKeyDown={e=>e.key==="Enter"&&key.trim()&&onSave(key.trim())}/></div>
        <div className="field-note">Get a free key in 30s → finnhub.io → Sign Up → Dashboard</div>
        <div className="btn-row"><button className="btn pri" onClick={()=>key.trim()&&onSave(key.trim())}>Connect</button><button className="btn sec" onClick={onSkip}>Use demo data</button></div>
        <div className="modal-link" onClick={()=>window.open("https://finnhub.io","_blank")}>Open finnhub.io ↗</div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   ROOT APP
═══════════════════════════════════════════════════════════════════════════ */
export default function App(){
  const [view,setView]          =useState("analysis");
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
          <div className="nav-brand">
            <div className="nav-logo">Port</div>
            <div className="nav-version">v2</div>
          </div>
          <div className="nav-tabs">
            {[["analysis","Analysis"],["gex","GEX Dashboard"],["manage","Manage"]].map(([v,l])=>(
              <button key={v} className={`nav-tab ${view===v?"on":""}`} onClick={()=>setView(v)}>{l}</button>
            ))}
          </div>
          <div className="nav-right">
            <div className="live-badge"><div className={`live-dot ${isLive?"on":""}`}/>{isLive?"Live":"Demo"}</div>
            <button className="nav-btn" onClick={()=>setShowSetup(true)}>⚙ Settings</button>
          </div>
        </nav>

        <div className={`shell${isGex?" wide":""}`}>
          {!isGex&&(
            <aside className="sidebar">
              <div className="sb-search">
                <div className="sb-input-wrap">
                  <span className="sb-icon">⌕</span>
                  <input className="sb-input" placeholder="Search ticker…" value={input}
                    onChange={e=>setInput(e.target.value)}
                    onKeyDown={e=>e.key==="Enter"&&addTicker()} maxLength={6}/>
                  <button className="sb-add" onClick={addTicker}>+</button>
                </div>
              </div>
              <div className="sb-label">Watchlist</div>
              <div className="ticker-list">
                {tickers.map(sym=>{
                  const qd=quotes[sym],chg=qd?qd.dp:null,pos=chg==null?null:chg>=0;
                  return(
                    <div key={sym}
                      className={`tr ${selected===sym&&view==="analysis"?"on":""}`}
                      onClick={()=>{setView("analysis");setSelected(sym);}}
                      onMouseEnter={()=>{if(apiKey&&!stockData[sym])fetchStock(sym,apiKey);}}>
                      <div className="tr-l">
                        <div className="tr-avatar">{sym.slice(0,4)}</div>
                        <div>
                          <div className="tr-sym">{sym}</div>
                          <div className="tr-price">{qd?fmt(qd.c,"$"):"—"}</div>
                        </div>
                      </div>
                      {chg!=null&&<span className={`tr-chg ${pos?"pos":"neg"}`}>{sign(chg)}{Math.abs(chg).toFixed(2)}%</span>}
                      <button className="tr-rm" onClick={e=>{e.stopPropagation();setTickers(p=>p.filter(x=>x!==sym));if(selected===sym)setSelected(tickers.find(x=>x!==sym)||null);}}>×</button>
                    </div>
                  );
                })}
              </div>
            </aside>
          )}

          <main className="main">
            {view==="gex"&&<GexDashboard/>}

            {view==="analysis"&&!selected&&(
              <div className="empty-state">
                <div className="empty-logo">Port</div>
                <div className="empty-sub">Search any ticker for institutional-grade analysis, options flow, and AI research notes</div>
                <div className="empty-hint">
                  {["NVDA","AAPL","TSLA","MSFT","META","FCEL"].map(t=>(
                    <div key={t} className="empty-chip" onClick={()=>{if(!tickers.includes(t))setTickers(p=>[...p,t]);setSelected(t);}}>
                      {t}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {view==="analysis"&&selected&&(
              <ResearchPage sym={selected} stockData={stockData} apiKey={apiKey} aiCache={aiCache} setAiCache={setAiCache}/>
            )}

            {view==="manage"&&(
              <div className="manage-panel">
                <div style={{display:"flex",alignItems:"flex-start",justifyContent:"space-between",marginBottom:4}}>
                  <div className="manage-title">Manage</div>
                  <button className="connect-btn" style={{marginTop:10}} onClick={()=>setShowK401Edit(p=>!p)}>{showK401Edit?"✓ Done":"✏ Edit all"}</button>
                </div>
                <div className="manage-sub">Empower · {new Date().toLocaleDateString("en-US",{month:"long",year:"numeric"})}</div>

                <div className="mgrid">
                  {[{label:"Total Balance",key:"total",fmt:fmtM,cls:""},
                    {label:"Vested Balance",key:"vested",fmt:fmtM,cls:""},
                    {label:"YTD Return",key:"ytdReturn",fmt:v=>`+${v}%`,cls:"pos"},
                    {label:"YTD Contributions",key:"contributions",fmt:fmtM,cls:""},
                  ].map((x,i)=>(
                    <div className="mcard" key={i}>
                      <div className="mcard-label">{x.label}</div>
                      {showK401Edit?(
                        <input className="field-input" type="number" style={{border:"1px solid var(--b2)",borderRadius:6,padding:"6px 8px",marginTop:4,fontSize:13,width:"100%"}} value={k401[x.key]} onChange={e=>setK401(p=>({...p,[x.key]:parseFloat(e.target.value)||0}))}/>
                      ):(
                        <div className={`mcard-val ${x.cls}`}>{x.fmt(k401[x.key])}</div>
                      )}
                      <div className="mcard-sub">{["All accounts","Fully vested","This year","Employee + employer"][i]}</div>
                    </div>
                  ))}
                </div>

                <div className="alloc-section">
                  <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:14}}>
                    <div className="alloc-title" style={{marginBottom:0}}>Allocation</div>
                    {showK401Edit&&<button className="connect-btn" onClick={()=>setK401(p=>({...p,positions:[...p.positions,{name:"New Fund",pct:0,val:0}]}))}>+ Add</button>}
                  </div>
                  {k401.positions.map((pos,i)=>(
                    <div key={i} style={{marginBottom:showK401Edit?10:0}}>
                      {showK401Edit?(
                        <div style={{display:"grid",gridTemplateColumns:"1fr 60px 80px 24px",gap:6,alignItems:"center",marginBottom:4}}>
                          <input className="field-input" style={{border:"1px solid var(--b1)",borderRadius:6,padding:"5px 8px",fontSize:11}} value={pos.name} onChange={e=>setK401(p=>({...p,positions:p.positions.map((pp,j)=>j===i?{...pp,name:e.target.value}:pp)}))} placeholder="Fund name"/>
                          <input className="field-input" type="number" style={{border:"1px solid var(--b1)",borderRadius:6,padding:"5px 8px",fontSize:11}} value={pos.pct} step="0.1" onChange={e=>setK401(p=>({...p,positions:p.positions.map((pp,j)=>j===i?{...pp,pct:parseFloat(e.target.value)||0,val:Math.round((parseFloat(e.target.value)||0)/100*p.total)}:pp)}))} placeholder="%"/>
                          <input className="field-input" type="number" style={{border:"1px solid var(--b1)",borderRadius:6,padding:"5px 8px",fontSize:11}} value={pos.val} onChange={e=>setK401(p=>({...p,positions:p.positions.map((pp,j)=>j===i?{...pp,val:parseFloat(e.target.value)||0}:pp)}))} placeholder="$"/>
                          <button onClick={()=>setK401(p=>({...p,positions:p.positions.filter((_,j)=>j!==i)}))} style={{color:"var(--red)",fontSize:16}}>×</button>
                        </div>
                      ):(
                        <div className="alloc-row">
                          <div className="alloc-name">{pos.name}</div>
                          <div className="alloc-bar"><div className="alloc-fill" style={{width:`${pos.pct}%`,background:ALLOC_COLORS[i%ALLOC_COLORS.length]}}/></div>
                          <div className="alloc-pct">{pos.pct}%</div>
                          <div className="alloc-val">{fmtM(pos.val)}</div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                <div className="alloc-section">
                  <div className="alloc-title">Accounts</div>
                  {[{label:"401k (Empower)",key:"total",sub:"Pre-tax"},{label:"Roth IRA (WeBull)",key:"rothBalance",sub:"After-tax"},{label:"SDBA Sleeve",key:"sdbaBalance",sub:"Self-directed"},].map((acct,i)=>(
                    <div key={i} className="alloc-row" style={{alignItems:"center"}}>
                      <div className="alloc-name" style={{width:180}}>{acct.label}</div>
                      {showK401Edit?(
                        <input className="field-input" type="number" style={{flex:1,border:"1px solid var(--b1)",borderRadius:6,padding:"5px 8px",fontSize:11,maxWidth:110}} value={k401[acct.key]??0} onChange={e=>setK401(p=>({...p,[acct.key]:parseFloat(e.target.value)||0}))}/>
                      ):(
                        <>
                          <div className="alloc-bar"><div className="alloc-fill" style={{width:`${Math.min(100,(k401[acct.key]??0)/2000)}%`,background:ALLOC_COLORS[i]}}/></div>
                          <div className="alloc-val" style={{width:80,textAlign:"right"}}>{fmtM(k401[acct.key]??0)}</div>
                        </>
                      )}
                      <div style={{fontSize:10,color:"var(--t3)",marginLeft:8,width:80}}>{acct.sub}</div>
                    </div>
                  ))}
                </div>

                <div className="connect-box">
                  <div className="connect-title">Connect live Empower data</div>
                  <div className="connect-body">Empower's developer API supports participant balance access. Here's how to request access:</div>
                  <div className="connect-steps">
                    {["Register at developer.empower-retirement.com","Request access to the Balance API","Empower emails OAuth credentials","Enter them here for live sync"].map((s,i)=>(
                      <div className="connect-step" key={i}><div className="connect-step-num">{i+1}</div><div>{s}</div></div>
                    ))}
                  </div>
                  <button className="connect-btn" onClick={()=>window.open("https://developer.empower-retirement.com","_blank")}>Open Empower Portal ↗</button>
                </div>
              </div>
            )}
          </main>
        </div>
      </div>
    </>
  );
}
