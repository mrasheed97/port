import { useState, useEffect, useCallback, useRef } from "react";

/* ─── DESIGN SYSTEM ──────────────────────────────────────────────────────── */
const G = `
@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;0,700;1,400;1,600&family=DM+Mono:wght@300;400;500&family=DM+Sans:wght@300;400;500;600&display=swap');

*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}

:root{
  --ink:#0f0e0c;
  --ink2:#2a2825;
  --ink3:#4a4845;
  --paper:#f5f0e8;
  --paper2:#ede8dc;
  --paper3:#e4ddd0;
  --paper4:#d9d1c3;
  --rule:rgba(15,14,12,0.12);
  --rule2:rgba(15,14,12,0.06);

  --red:#c0392b;
  --red-pale:#fdf0ee;
  --green:#1a6b3c;
  --green-pale:#eef6f1;
  --gold:#b8860b;
  --gold-pale:#fdf8ec;
  --blue:#1a3a6b;
  --blue-pale:#eef2f8;
  --orange:#c05c1a;

  --serif:'Playfair Display',Georgia,serif;
  --mono:'DM Mono',monospace;
  --sans:'DM Sans',sans-serif;

  --rad:4px;
  --rad-lg:8px;
}

html,body{height:100%;background:var(--paper);color:var(--ink);font-family:var(--sans);font-size:13px;line-height:1.5;-webkit-font-smoothing:antialiased;}
button{font-family:var(--sans);cursor:pointer;border:none;background:none;color:inherit;}
input{font-family:var(--mono);outline:none;background:none;border:none;color:inherit;}
::-webkit-scrollbar{width:4px;height:4px;}
::-webkit-scrollbar-thumb{background:var(--paper4);}
::-webkit-scrollbar-track{background:transparent;}

/* ── LAYOUT ── */
.app{display:grid;grid-template-rows:auto 1fr;min-height:100vh;background:var(--paper);}

/* ── MASTHEAD ── */
.masthead{
  border-bottom:3px solid var(--ink);
  padding:0 32px;
  background:var(--paper);
  position:sticky;top:0;z-index:100;
}
.masthead-top{
  display:flex;align-items:center;justify-content:space-between;
  padding:14px 0 10px;
  border-bottom:1px solid var(--rule);
}
.brand{display:flex;align-items:baseline;gap:8px;}
.brand-name{font-family:var(--serif);font-size:28px;font-weight:700;font-style:italic;letter-spacing:-0.5px;color:var(--ink);}
.brand-sub{font-size:10px;font-weight:500;letter-spacing:0.14em;text-transform:uppercase;color:var(--ink3);}
.masthead-nav{display:flex;gap:0;}
.nav-item{
  font-size:11px;font-weight:500;letter-spacing:0.08em;text-transform:uppercase;
  padding:6px 16px;color:var(--ink3);cursor:pointer;
  border-bottom:2px solid transparent;transition:all .15s;
}
.nav-item:hover{color:var(--ink);}
.nav-item.on{color:var(--ink);border-bottom-color:var(--ink);}
.masthead-right{display:flex;align-items:center;gap:12px;}
.mkt-pill{
  font-family:var(--mono);font-size:10px;
  padding:4px 10px;border:1px solid var(--rule);
  border-radius:2px;color:var(--ink3);
}
.mkt-pill span{font-weight:500;}
.mkt-pill.up span{color:var(--green);}
.mkt-pill.dn span{color:var(--red);}

/* ── SEARCH BAR ── */
.searchbar{
  padding:10px 0;
  display:flex;align-items:center;gap:12px;
}
.search-wrap{
  display:flex;align-items:center;gap:8px;flex:1;max-width:420px;
  border:1.5px solid var(--ink);border-radius:var(--rad);
  padding:8px 14px;background:var(--paper);
  transition:box-shadow .15s;
}
.search-wrap:focus-within{box-shadow:3px 3px 0 var(--ink);}
.search-icon{font-size:14px;color:var(--ink3);}
.search-input{
  flex:1;font-family:var(--sans);font-size:13px;font-weight:500;
  background:transparent;color:var(--ink);text-transform:uppercase;
}
.search-input::placeholder{text-transform:none;color:var(--ink3);font-weight:400;}
.search-btn{
  font-size:11px;font-weight:600;letter-spacing:0.06em;text-transform:uppercase;
  background:var(--ink);color:var(--paper);
  border-radius:var(--rad);padding:7px 16px;
  transition:opacity .15s;
}
.search-btn:hover{opacity:.85;}
.watchlist-chips{display:flex;gap:6px;flex-wrap:wrap;}
.chip{
  font-family:var(--mono);font-size:10px;font-weight:500;
  padding:4px 10px;border:1px solid var(--rule);
  border-radius:2px;cursor:pointer;color:var(--ink2);
  transition:all .12s;background:var(--paper2);
}
.chip:hover{background:var(--paper3);border-color:var(--ink3);}
.chip.on{background:var(--ink);color:var(--paper);border-color:var(--ink);}
.chip-rm{margin-left:4px;color:var(--ink3);font-size:11px;}

/* ── MAIN CONTENT ── */
.content{overflow-y:auto;padding:0 32px 60px;}

/* ── EMPTY STATE ── */
.empty{
  display:flex;flex-direction:column;align-items:center;justify-content:center;
  min-height:60vh;gap:20px;
}
.empty-headline{font-family:var(--serif);font-size:48px;font-style:italic;color:var(--paper3);letter-spacing:-1px;}
.empty-body{font-size:12px;color:var(--ink3);text-align:center;max-width:320px;line-height:1.8;}
.empty-tickers{display:flex;gap:8px;flex-wrap:wrap;justify-content:center;}

/* ── STOCK HEADER ── */
.stock-header{
  padding:24px 0 20px;
  border-bottom:2px solid var(--ink);
  display:grid;grid-template-columns:1fr auto;gap:24px;
  align-items:end;
}
.stock-ident{}
.stock-ticker{font-family:var(--serif);font-size:56px;font-weight:700;font-style:italic;letter-spacing:-2px;line-height:1;color:var(--ink);}
.stock-name{font-size:12px;color:var(--ink3);margin-top:4px;letter-spacing:0.02em;}
.stock-tags{display:flex;gap:6px;margin-top:8px;flex-wrap:wrap;}
.tag{font-size:9px;font-weight:600;letter-spacing:0.1em;text-transform:uppercase;padding:3px 8px;border:1px solid var(--rule);border-radius:2px;color:var(--ink3);}
.stock-price-block{text-align:right;}
.stock-price{font-family:var(--serif);font-size:44px;font-weight:600;line-height:1;letter-spacing:-1px;}
.stock-price.up{color:var(--green);}
.stock-price.dn{color:var(--red);}
.stock-chg{font-family:var(--mono);font-size:13px;font-weight:500;margin-top:4px;}
.stock-chg.up{color:var(--green);}
.stock-chg.dn{color:var(--red);}
.stock-time{font-size:10px;color:var(--ink3);margin-top:6px;font-family:var(--mono);}

/* ── VERDICT BANNER ── */
.verdict{
  margin:20px 0;
  border:2px solid var(--ink);
  border-radius:var(--rad);
  display:grid;grid-template-columns:auto 1fr auto;
  overflow:hidden;
}
.verdict-score-block{
  padding:20px 28px;
  display:flex;flex-direction:column;align-items:center;justify-content:center;gap:4px;
  border-right:2px solid var(--ink);min-width:120px;
}
.verdict-score-block.buy{background:var(--green);color:white;}
.verdict-score-block.hold{background:var(--gold);color:white;}
.verdict-score-block.sell{background:var(--red);color:white;}
.verdict-score-block.wait{background:var(--ink2);color:var(--paper);}
.verdict-score{font-family:var(--serif);font-size:42px;font-weight:700;font-style:italic;line-height:1;}
.verdict-label{font-size:10px;font-weight:600;letter-spacing:0.12em;text-transform:uppercase;opacity:.85;}
.verdict-body{padding:18px 24px;display:flex;flex-direction:column;justify-content:center;gap:6px;}
.verdict-headline{font-family:var(--serif);font-size:17px;font-weight:600;color:var(--ink);line-height:1.3;}
.verdict-text{font-size:12px;color:var(--ink3);line-height:1.7;max-width:680px;}
.verdict-meta{padding:18px 24px;display:flex;flex-direction:column;gap:8px;justify-content:center;border-left:1px solid var(--rule);min-width:160px;}
.vm-item{display:flex;flex-direction:column;gap:1px;}
.vm-label{font-size:9px;font-weight:600;letter-spacing:0.1em;text-transform:uppercase;color:var(--ink3);}
.vm-val{font-family:var(--mono);font-size:13px;font-weight:500;color:var(--ink);}

/* ── SECTION HEADER ── */
.sec-head{
  display:flex;align-items:center;gap:12px;
  padding:20px 0 12px;
}
.sec-title{font-size:10px;font-weight:700;letter-spacing:0.14em;text-transform:uppercase;color:var(--ink3);}
.sec-rule{flex:1;height:1px;background:var(--rule);}
.sec-badge{font-size:9px;font-weight:600;letter-spacing:0.1em;text-transform:uppercase;padding:2px 8px;border:1px solid var(--rule);border-radius:2px;color:var(--ink3);}

/* ── METRIC GRID ── */
.metric-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:1px;background:var(--rule);border:1px solid var(--rule);border-radius:var(--rad);}
.metric-grid.cols-5{grid-template-columns:repeat(5,1fr);}
.metric-grid.cols-3{grid-template-columns:repeat(3,1fr);}
.metric-cell{
  background:var(--paper);padding:16px 18px;
  display:flex;flex-direction:column;gap:6px;
  transition:background .1s;
}
.metric-cell:hover{background:var(--paper2);}
.mc-label{font-size:9px;font-weight:600;letter-spacing:0.1em;text-transform:uppercase;color:var(--ink3);}
.mc-val{font-family:var(--serif);font-size:26px;font-style:italic;line-height:1;color:var(--ink);}
.mc-val.good{color:var(--green);}
.mc-val.warn{color:var(--gold);}
.mc-val.bad{color:var(--red);}
.mc-val.na{color:var(--ink3);}
.mc-sub{font-size:10px;color:var(--ink3);font-family:var(--mono);}
.mc-bar{height:3px;background:var(--paper3);border-radius:2px;margin-top:4px;overflow:hidden;}
.mc-bar-fill{height:100%;border-radius:2px;transition:width .6s ease;}

/* ── SCORE CARDS ── */
.score-row{display:grid;grid-template-columns:repeat(5,1fr);gap:10px;margin-bottom:16px;}
.score-card{
  background:var(--paper);border:1px solid var(--rule);
  border-radius:var(--rad);padding:16px;
  display:flex;flex-direction:column;gap:8px;
}
.sc-name{font-size:9px;font-weight:700;letter-spacing:0.1em;text-transform:uppercase;color:var(--ink3);}
.sc-score{font-family:var(--serif);font-size:32px;font-style:italic;line-height:1;}
.sc-score.s-hi{color:var(--green);}
.sc-score.s-mid{color:var(--gold);}
.sc-score.s-lo{color:var(--red);}
.sc-bar{height:4px;background:var(--paper3);border-radius:2px;overflow:hidden;}
.sc-bar-fill{height:100%;border-radius:2px;}
.sc-note{font-size:10px;color:var(--ink3);line-height:1.5;}

/* ── PEER TABLE ── */
.peer-table{width:100%;border-collapse:collapse;}
.pt-head th{
  font-size:9px;font-weight:700;letter-spacing:0.1em;text-transform:uppercase;
  color:var(--ink3);padding:8px 14px;text-align:left;
  border-bottom:2px solid var(--ink);
}
.pt-head th:not(:first-child){text-align:right;}
.pt-row td{
  padding:10px 14px;border-bottom:1px solid var(--rule2);
  font-size:12px;font-family:var(--mono);color:var(--ink2);
}
.pt-row td:first-child{font-family:var(--sans);font-weight:600;color:var(--ink);}
.pt-row td:not(:first-child){text-align:right;}
.pt-row.highlight{background:var(--paper2);}
.pt-row.highlight td:first-child{color:var(--blue);}
.pt-val.good{color:var(--green);font-weight:500;}
.pt-val.bad{color:var(--red);font-weight:500;}
.pt-val.mid{color:var(--gold);font-weight:500;}

/* ── CHART ── */
.chart-area{position:relative;background:var(--paper);border:1px solid var(--rule);border-radius:var(--rad);padding:20px;}
.chart-tabs{display:flex;gap:0;margin-bottom:16px;border-bottom:1px solid var(--rule);}
.ct{font-size:10px;font-weight:500;letter-spacing:0.06em;padding:6px 14px;cursor:pointer;color:var(--ink3);border-bottom:2px solid transparent;margin-bottom:-1px;transition:all .12s;}
.ct:hover{color:var(--ink);}
.ct.on{color:var(--ink);border-bottom-color:var(--ink);font-weight:600;}
.chart-canvas-wrap{position:relative;height:220px;}
canvas{display:block;width:100%;height:100%;}
.chart-loading{position:absolute;inset:0;display:flex;align-items:center;justify-content:center;color:var(--ink3);font-size:11px;gap:8px;}
.chart-labels{display:flex;justify-content:space-between;margin-top:8px;}
.chart-label{font-family:var(--mono);font-size:9px;color:var(--ink3);}

/* ── ANALYSIS SPLIT ── */
.analysis-split{display:grid;grid-template-columns:1fr 1fr;gap:16px;margin-bottom:16px;}
.analysis-card{background:var(--paper);border:1px solid var(--rule);border-radius:var(--rad);padding:22px;}
.ac-head{font-size:9px;font-weight:700;letter-spacing:0.12em;text-transform:uppercase;margin-bottom:14px;display:flex;align-items:center;gap:6px;}
.ac-head.bull{color:var(--green);}
.ac-head.bear{color:var(--red);}
.ac-head::before{content:'';width:8px;height:8px;border-radius:50%;}
.ac-head.bull::before{background:var(--green);}
.ac-head.bear::before{background:var(--red);}
.ac-text{font-size:12px;color:var(--ink2);line-height:1.85;white-space:pre-wrap;}
.loading-lines{display:flex;flex-direction:column;gap:8px;}
.ll{height:11px;border-radius:2px;background:linear-gradient(90deg,var(--paper2) 25%,var(--paper3) 50%,var(--paper2) 75%);background-size:400px 100%;animation:shimmer 1.4s ease-in-out infinite;}
@keyframes shimmer{0%{background-position:-400px 0}100%{background-position:400px 0}}
.blink{display:inline-block;width:1.5px;height:13px;background:var(--ink);margin-left:1px;animation:blink 1s step-end infinite;vertical-align:text-bottom;}
@keyframes blink{50%{opacity:0}}

/* ── CATALYST LIST ── */
.catalyst-list{display:flex;flex-direction:column;gap:0;}
.cat-item{display:flex;gap:16px;padding:12px 0;border-bottom:1px solid var(--rule2);align-items:flex-start;}
.cat-item:last-child{border:none;}
.cat-date{font-family:var(--mono);font-size:10px;color:var(--ink3);width:80px;flex-shrink:0;padding-top:2px;}
.cat-marker{width:6px;height:6px;border-radius:50%;flex-shrink:0;margin-top:5px;}
.cat-marker.bull{background:var(--green);}
.cat-marker.bear{background:var(--red);}
.cat-marker.neut{background:var(--ink3);}
.cat-body{flex:1;}
.cat-title{font-size:12px;font-weight:500;color:var(--ink);margin-bottom:3px;}
.cat-badge{font-size:9px;font-weight:600;letter-spacing:0.08em;text-transform:uppercase;padding:1px 6px;border-radius:2px;display:inline-block;margin-bottom:4px;}
.cat-badge.bull{background:var(--green-pale);color:var(--green);}
.cat-badge.bear{background:var(--red-pale);color:var(--red);}
.cat-badge.neut{background:var(--paper3);color:var(--ink3);}
.cat-detail{font-size:11px;color:var(--ink3);line-height:1.6;}

/* ── EARNINGS TABLE ── */
.earn-table{width:100%;border-collapse:collapse;}
.et-th{font-size:9px;font-weight:700;letter-spacing:0.1em;text-transform:uppercase;color:var(--ink3);padding:7px 12px;text-align:left;border-bottom:1px solid var(--rule);}
.et-th:not(:first-child){text-align:right;}
.et-td{padding:9px 12px;border-bottom:1px solid var(--rule2);font-family:var(--mono);font-size:11px;color:var(--ink2);}
.et-td:not(:first-child){text-align:right;}
.beat{color:var(--green);font-weight:500;}
.miss{color:var(--red);font-weight:500;}
.inline{color:var(--gold);font-weight:500;}
.pos{color:var(--green);}
.neg{color:var(--red);}

/* ── NEWS ── */
.news-item{padding:12px 0;border-bottom:1px solid var(--rule2);cursor:pointer;display:grid;grid-template-columns:1fr auto;gap:12px;align-items:start;}
.news-item:hover .news-hl{text-decoration:underline;}
.news-hl{font-size:12px;font-weight:500;color:var(--ink);line-height:1.5;}
.news-meta{font-size:10px;color:var(--ink3);font-family:var(--mono);white-space:nowrap;margin-top:2px;}
.news-arrow{font-size:11px;color:var(--ink3);margin-top:2px;}

/* ── RANGE ── */
.range-wrap{display:flex;align-items:center;gap:10px;}
.range-lo,.range-hi{font-family:var(--mono);font-size:10px;color:var(--ink3);white-space:nowrap;}
.range-track{flex:1;height:4px;background:var(--paper3);border-radius:2px;position:relative;}
.range-dot{position:absolute;top:50%;transform:translate(-50%,-50%);width:10px;height:10px;border-radius:50%;background:var(--ink);box-shadow:0 0 0 2px var(--paper);}

/* ── SPINNER ── */
.spin{width:16px;height:16px;border:2px solid var(--rule);border-top-color:var(--ink3);border-radius:50%;animation:spin .6s linear infinite;flex-shrink:0;}
@keyframes spin{to{transform:rotate(360deg)}}

/* ── MANAGE TAB ── */
.manage-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:12px;margin-bottom:20px;}
.mgcard{background:var(--paper);border:1px solid var(--rule);border-radius:var(--rad);padding:18px;}
.mgcard-label{font-size:9px;font-weight:700;letter-spacing:0.1em;text-transform:uppercase;color:var(--ink3);margin-bottom:10px;}
.mgcard-val{font-family:var(--serif);font-size:28px;font-style:italic;color:var(--ink);}
.mgcard-val.pos{color:var(--green);}
.mgcard-sub{font-size:10px;color:var(--ink3);margin-top:4px;}

/* ── GEX TAB ── */
.gex-panel{padding:24px 0;}
.gex-topbar{display:flex;gap:6px;flex-wrap:wrap;margin-bottom:16px;align-items:center;}
.gex-tbtn{font-family:var(--mono);font-size:11px;font-weight:500;padding:5px 14px;border:1px solid var(--rule);border-radius:var(--rad);cursor:pointer;color:var(--ink2);transition:all .12s;background:var(--paper);}
.gex-tbtn:hover{background:var(--paper2);}
.gex-tbtn.on{background:var(--ink);color:var(--paper);border-color:var(--ink);}
.gex-levels{display:grid;grid-template-columns:repeat(5,1fr);gap:1px;background:var(--rule);border:1px solid var(--rule);border-radius:var(--rad);margin-bottom:16px;}
.gex-lv-cell{background:var(--paper);padding:14px 16px;}
.gex-lv-label{font-size:9px;font-weight:700;letter-spacing:0.1em;text-transform:uppercase;color:var(--ink3);margin-bottom:6px;}
.gex-lv-val{font-family:var(--serif);font-size:22px;font-style:italic;color:var(--ink);}
.gex-lv-val.call{color:var(--blue);}
.gex-lv-val.flip{color:var(--orange);}
.gex-lv-val.put{color:var(--green);}
.gex-regime{display:inline-flex;align-items:center;gap:5px;font-size:9px;font-weight:600;letter-spacing:0.08em;text-transform:uppercase;padding:3px 8px;border-radius:2px;margin-top:4px;}
.gex-regime.pos{background:var(--green-pale);color:var(--green);}
.gex-regime.neg{background:var(--red-pale);color:var(--red);}
.ladder-wrap{border:1px solid var(--rule);border-radius:var(--rad);overflow:hidden;}
.ladder-header{display:grid;background:var(--paper2);border-bottom:2px solid var(--ink);padding:7px 14px;font-size:9px;font-weight:700;letter-spacing:0.1em;text-transform:uppercase;color:var(--ink3);}
.ladder-row{display:grid;padding:5px 14px;border-bottom:1px solid var(--rule2);align-items:center;transition:background .1s;}
.ladder-row:hover{background:var(--paper2);}
.ladder-row.spot{background:var(--blue-pale);}
.lc-strike{font-family:var(--mono);font-size:11px;font-weight:500;color:var(--ink);}
.lc-bar{display:flex;align-items:center;gap:6px;}
.lbar{height:10px;border-radius:1px;min-width:2px;}
.lbar.pos{background:var(--blue);}
.lbar.neg{background:var(--orange);}
.lc-val{font-family:var(--mono);font-size:9px;color:var(--ink3);}

/* ── TRADE JOURNAL ── */
.journal-panel{padding:24px 0;}
.journal-add{display:grid;grid-template-columns:80px 1fr 1fr 1fr 1fr auto;gap:8px;align-items:end;margin-bottom:20px;background:var(--paper2);border:1px solid var(--rule);border-radius:var(--rad);padding:16px;}
.jfield{display:flex;flex-direction:column;gap:5px;}
.jfield label{font-size:9px;font-weight:700;letter-spacing:0.1em;text-transform:uppercase;color:var(--ink3);}
.jfield input,.jfield select{
  font-family:var(--mono);font-size:12px;color:var(--ink);
  background:var(--paper);border:1px solid var(--rule);
  border-radius:var(--rad);padding:7px 10px;width:100%;
}
.jfield input:focus,.jfield select:focus{border-color:var(--ink);outline:none;}
.jadd-btn{
  background:var(--ink);color:var(--paper);font-size:11px;font-weight:600;
  letter-spacing:0.06em;text-transform:uppercase;padding:8px 16px;
  border-radius:var(--rad);cursor:pointer;align-self:end;
  transition:opacity .15s;
}
.jadd-btn:hover{opacity:.85;}
.jtable{width:100%;border-collapse:collapse;}
.jth{font-size:9px;font-weight:700;letter-spacing:0.1em;text-transform:uppercase;color:var(--ink3);padding:8px 12px;text-align:left;border-bottom:2px solid var(--ink);}
.jth:not(:first-child){text-align:right;}
.jtd{padding:10px 12px;border-bottom:1px solid var(--rule2);font-family:var(--mono);font-size:11px;color:var(--ink2);}
.jtd:not(:first-child){text-align:right;}
.jtd:first-child{font-family:var(--sans);font-weight:600;color:var(--ink);}
.j-status{font-size:9px;font-weight:600;letter-spacing:0.08em;text-transform:uppercase;padding:2px 7px;border-radius:2px;}
.j-status.open{background:var(--blue-pale);color:var(--blue);}
.j-status.win{background:var(--green-pale);color:var(--green);}
.j-status.loss{background:var(--red-pale);color:var(--red);}
.j-remove{font-size:14px;color:var(--ink3);cursor:pointer;padding:0 4px;}
.j-remove:hover{color:var(--red);}
.pnl-summary{display:grid;grid-template-columns:repeat(4,1fr);gap:10px;margin-bottom:20px;}

/* ── LOADING SKELETON ── */
.sk{background:linear-gradient(90deg,var(--paper2) 25%,var(--paper3) 50%,var(--paper2) 75%);background-size:400px 100%;animation:shimmer 1.4s ease-in-out infinite;border-radius:3px;}
`;

/* ─── CONSTANTS ──────────────────────────────────────────────────────────── */
const DEFAULT_WATCHLIST = ["NVDA","AAPL","MSFT","TSLA","META"];
const GEX_TICKERS = ["SPY","QQQ","SPX","IWM","NVDA","AAPL","TSLA"];
const CACHE_TTL = 20 * 60 * 1000;
const CACHE_VER = "port_v5";

/* ─── HELPERS ────────────────────────────────────────────────────────────── */
const fmt = (n, pre="", suf="", dec=2) => n==null||isNaN(n) ? "—" : `${pre}${Number(n).toLocaleString("en-US",{maximumFractionDigits:dec,minimumFractionDigits:dec})}${suf}`;
const fmtM = n => { if(!n&&n!==0)return"—"; const a=Math.abs(n); if(a>=1e12)return`$${(n/1e12).toFixed(2)}T`; if(a>=1e9)return`$${(n/1e9).toFixed(2)}B`; if(a>=1e6)return`$${(n/1e6).toFixed(2)}M`; return`$${n.toLocaleString()}`; };
const fmtG = n => { if(!n&&n!==0)return""; const a=Math.abs(n); if(a>=1e9)return`${(n/1e9).toFixed(1)}B`; if(a>=1e6)return`${(n/1e6).toFixed(0)}M`; if(a>=1e3)return`${(n/1e3).toFixed(0)}K`; return n.toFixed(0); };
const sign = n => n>0?"+":"";
const today = () => new Date().toISOString().slice(0,10);
const inDays = d => { const t=new Date(); t.setDate(t.getDate()+d); return t.toISOString().slice(0,10); };
const scoreClass = s => s>=70?"s-hi":s>=45?"s-mid":"s-lo";
const scoreColor = s => s>=70?"var(--green)":s>=45?"var(--gold)":"var(--red)";

/* ─── CACHE ──────────────────────────────────────────────────────────────── */
function cacheGet(key) {
  try {
    const raw = localStorage.getItem(`${CACHE_VER}_${key}`);
    if (!raw) return null;
    const { data, ts } = JSON.parse(raw);
    if (Date.now() - ts > CACHE_TTL) { localStorage.removeItem(`${CACHE_VER}_${key}`); return null; }
    return data;
  } catch { return null; }
}
function cacheSet(key, data) {
  try { localStorage.setItem(`${CACHE_VER}_${key}`, JSON.stringify({ data, ts: Date.now() })); } catch {}
}

/* ─── API CALLS ──────────────────────────────────────────────────────────── */
async function fetchSpot(ticker) {
  try {
    const r = await fetch(`/.netlify/functions/spot?ticker=${encodeURIComponent(ticker)}`);
    if (r.ok) { const d = await r.json(); if (d.price > 0) return d; }
  } catch {}
  return null;
}

async function fetchChart(ticker, period) {
  try {
    const r = await fetch(`/.netlify/functions/chart?ticker=${encodeURIComponent(ticker)}&period=${period}`);
    if (r.ok) { const d = await r.json(); if (d.s === "ok" && d.c?.length > 0) return d; }
  } catch {}
  return null;
}

async function callAI(messages, maxTokens = 1400) {
  try {
    const ctrl = new AbortController();
    const timer = setTimeout(() => ctrl.abort(), 28000);
    const res = await fetch("/.netlify/functions/ai", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      signal: ctrl.signal,
      body: JSON.stringify({ model: "claude-sonnet-4-6", max_tokens: maxTokens, messages })
    });
    clearTimeout(timer);
    if (!res.ok) return null;
    const data = await res.json();
    if (data.error) return null;
    return data.content?.filter(b => b.type === "text").map(b => b.text).join("") || "";
  } catch { return null; }
}

async function callAIJSON(prompt, maxTokens = 1400) {
  const text = await callAI([{ role: "user", content: prompt }], maxTokens);
  if (!text) return null;
  try { return JSON.parse(text.replace(/```json|```/g, "").trim()); }
  catch {
    const m = text.match(/\{[\s\S]*\}|\[[\s\S]*\]/);
    if (m) try { return JSON.parse(m[0]); } catch {}
    return null;
  }
}

async function callAIStream(prompt, onChunk, maxTokens = 1000) {
  onChunk("Analyzing…");
  const text = await callAI([{ role: "user", content: prompt }], maxTokens);
  if (!text) { onChunk("Analysis unavailable."); return ""; }
  const words = text.split(" ");
  let built = "";
  for (let i = 0; i < words.length; i++) {
    built += (i === 0 ? "" : " ") + words[i];
    if (i % 5 === 0) onChunk(built);
    await new Promise(r => setTimeout(r, 8));
  }
  onChunk(text);
  return text;
}

/* ─── BLACK-SCHOLES GEX ─────────────────────────────────────────────────── */
function normPDF(x) { return Math.exp(-0.5*x*x) / Math.sqrt(2*Math.PI); }
function bsGamma(S, K, T, sigma) {
  if (T <= 0 || sigma <= 0 || S <= 0 || K <= 0) return 0;
  const d1 = (Math.log(S/K) + (0.05 + 0.5*sigma*sigma)*T) / (sigma*Math.sqrt(T));
  return normPDF(d1) / (S * sigma * Math.sqrt(T));
}
function generateGEX(ticker, liveSpot) {
  const fallbacks = { SPY:585,QQQ:500,SPX:5850,IWM:210,NVDA:130,AAPL:205,TSLA:280 };
  const vols = { SPY:0.14,QQQ:0.18,SPX:0.14,IWM:0.20,NVDA:0.55,AAPL:0.28,TSLA:0.65 };
  const spot = liveSpot || fallbacks[ticker] || 400;
  const vol = vols[ticker] || 0.20;
  const step = ticker === "SPX" ? 5 : 1;
  const expiries = [today(), inDays(7), inDays(14)];
  const lo = Math.round(spot*0.97/step)*step, hi = Math.round(spot*1.03/step)*step;
  const strikes = [];
  for (let k = lo; k <= hi; k += step) strikes.push(k);
  const rows = strikes.map(K => {
    let netGEX = 0;
    expiries.forEach(exp => {
      const dte = Math.max(0.5, (new Date(exp)-new Date())/86400000);
      const T = dte/365, gamma = bsGamma(spot, K, T, vol);
      const oiC = Math.floor(Math.random()*10000+500), oiP = Math.floor(Math.random()*10000+500);
      netGEX += gamma*oiC*100*spot*spot*0.01 - gamma*oiP*100*spot*spot*0.01;
    });
    return { strike: K, netGEX };
  });
  const totalGEX = rows.reduce((s,r) => s+r.netGEX, 0);
  const above = rows.filter(r => r.strike > spot), below = rows.filter(r => r.strike < spot);
  const callWall = above.slice().sort((a,b) => b.netGEX-a.netGEX)[0]?.strike;
  const putWall = below.slice().sort((a,b) => a.netGEX-b.netGEX)[0]?.strike;
  let flipStrike = null, minD = Infinity;
  for (let i = 1; i < rows.length; i++) {
    if ((rows[i-1].netGEX < 0 && rows[i].netGEX >= 0) || (rows[i-1].netGEX >= 0 && rows[i].netGEX < 0)) {
      const d = Math.abs(rows[i].strike-spot);
      if (d < minD) { minD = d; flipStrike = rows[i].strike; }
    }
  }
  const dominant = rows.slice().sort((a,b) => Math.abs(b.netGEX)-Math.abs(a.netGEX))[0]?.strike;
  const sorted = [...rows].sort((a,b) => Math.abs(b.netGEX)-Math.abs(a.netGEX));
  const topSet = new Set(sorted.slice(0,20).map(r => r.strike));
  rows.forEach(r => { if (Math.abs(r.strike-spot) <= step) topSet.add(r.strike); });
  return { spot, strikes: rows.filter(r => topSet.has(r.strike)), callWall, putWall, flipStrike, dominant, totalGEX, isPositive: totalGEX > 0 };
}

/* ═══════════════════════════════════════════════════════════════════════════
   PRICE CHART
═══════════════════════════════════════════════════════════════════════════ */
function PriceChart({ sym }) {
  const [period, setPeriod] = useState("1M");
  const [loading, setLoading] = useState(false);
  const [candles, setCandles] = useState(null);
  const canvasRef = useRef(null);

  useEffect(() => {
    if (!sym) return;
    setLoading(true); setCandles(null);
    fetchChart(sym, period).then(d => { setCandles(d); setLoading(false); });
  }, [sym, period]);

  useEffect(() => {
    if (!candles || !canvasRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const dpr = window.devicePixelRatio || 1;
    const W = canvas.offsetWidth, H = canvas.offsetHeight;
    canvas.width = W * dpr; canvas.height = H * dpr; ctx.scale(dpr, dpr);
    const closes = candles.c;
    if (!closes || closes.length < 2) return;
    const minP = Math.min(...closes) * 0.998, maxP = Math.max(...closes) * 1.002;
    const toY = v => H - ((v - minP) / (maxP - minP) * (H - 24)) - 12;
    const isUp = closes[closes.length-1] >= closes[0];
    const lineColor = isUp ? "#1a6b3c" : "#c0392b";
    const gradStart = isUp ? "rgba(26,107,60,0.12)" : "rgba(192,57,43,0.10)";
    ctx.clearRect(0, 0, W, H);
    // Fill
    const grad = ctx.createLinearGradient(0, 0, 0, H);
    grad.addColorStop(0, gradStart); grad.addColorStop(1, "rgba(0,0,0,0)");
    ctx.beginPath(); ctx.moveTo(0, toY(closes[0]));
    closes.forEach((v, i) => ctx.lineTo((i/(closes.length-1))*W, toY(v)));
    ctx.lineTo(W, H); ctx.lineTo(0, H); ctx.closePath();
    ctx.fillStyle = grad; ctx.fill();
    // Line
    ctx.beginPath(); ctx.moveTo(0, toY(closes[0]));
    closes.forEach((v, i) => ctx.lineTo((i/(closes.length-1))*W, toY(v)));
    ctx.strokeStyle = lineColor; ctx.lineWidth = 1.5; ctx.lineJoin = "round"; ctx.stroke();
    // Open baseline
    const openY = toY(closes[0]);
    ctx.beginPath(); ctx.moveTo(0, openY); ctx.lineTo(W, openY);
    ctx.strokeStyle = "rgba(15,14,12,0.1)"; ctx.lineWidth = 1; ctx.setLineDash([4,4]); ctx.stroke(); ctx.setLineDash([]);
    // Dot at end
    const lastY = toY(closes[closes.length-1]);
    ctx.beginPath(); ctx.arc(W-1, lastY, 3.5, 0, Math.PI*2);
    ctx.fillStyle = lineColor; ctx.fill();
    // Price labels
    ctx.fillStyle = "rgba(74,72,69,0.7)"; ctx.font = `9px 'DM Mono', monospace`;
    ctx.textAlign = "right";
    ctx.fillText(`$${maxP.toFixed(2)}`, W-4, 14);
    ctx.fillText(`$${minP.toFixed(2)}`, W-4, H-4);
  }, [candles]);

  const pChange = candles?.c?.length >= 2
    ? ((candles.c[candles.c.length-1] - candles.c[0]) / candles.c[0] * 100)
    : null;

  return (
    <div className="chart-area">
      <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:12 }}>
        <div className="chart-tabs">
          {["1D","1W","1M","3M","1Y"].map(p => (
            <div key={p} className={`ct ${period===p?"on":""}`} onClick={() => setPeriod(p)}>{p}</div>
          ))}
        </div>
        {pChange != null && (
          <span style={{ fontFamily:"var(--mono)", fontSize:11, fontWeight:500, color: pChange>=0?"var(--green)":"var(--red)" }}>
            {sign(pChange)}{pChange.toFixed(2)}%
          </span>
        )}
      </div>
      <div className="chart-canvas-wrap">
        {loading && <div className="chart-loading"><div className="spin"/><span>Loading…</span></div>}
        {!loading && !candles && <div className="chart-loading" style={{color:"var(--ink3)"}}>No chart data</div>}
        <canvas ref={canvasRef} style={{ width:"100%", height:"100%", display: loading||!candles?"none":"block" }} />
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   STOCK PAGE
═══════════════════════════════════════════════════════════════════════════ */
function StockPage({ sym }) {
  const [spotData, setSpotData] = useState(null);
  const [fundamentals, setFundamentals] = useState(null);
  const [verdictData, setVerdictData] = useState(null);
  const [bull, setBull] = useState("");
  const [bear, setBear] = useState("");
  const [catalysts, setCatalysts] = useState(null);
  const [earnings, setEarnings] = useState(null);
  const [peers, setPeers] = useState(null);
  const [loading, setLoading] = useState({ spot:true, fund:true, verdict:false, bull:false, bear:false, cat:false, earn:false, peers:false });
  const loaded = useRef({});

  const setL = (key, val) => setLoading(p => ({ ...p, [key]: val }));

  useEffect(() => {
    if (!sym) return;
    loaded.current = {};
    setSpotData(null); setFundamentals(null); setVerdictData(null);
    setBull(""); setBear(""); setCatalysts(null); setEarnings(null); setPeers(null);
    setLoading({ spot:true, fund:true, verdict:false, bull:false, bear:false, cat:false, earn:false, peers:false });

    // Spot price
    fetchSpot(sym).then(d => { setSpotData(d); setL("spot", false); });

    // All AI calls
    const priceHint = `Search for current ${sym} stock price and latest financial data.`;

    // Fundamentals
    if (!loaded.current.fund) {
      loaded.current.fund = true; setL("fund", true);
      callAIJSON(`You are a financial data analyst. Search the web for the most current ${sym} financial data and return ONLY valid JSON, no markdown, no explanation.
Return this exact structure:
{
  "companyName": "<full company name>",
  "sector": "<sector>",
  "industry": "<industry>",
  "exchange": "<exchange>",
  "marketCap": <number in USD>,
  "price": <current price>,
  "change": <day change $>,
  "changePct": <day change %>,
  "week52High": <number>,
  "week52Low": <number>,
  "volume": <number>,
  "avgVolume": <number>,
  "valuation": {
    "pe_ttm": <number or null>,
    "pe_forward": <number or null>,
    "pb": <number or null>,
    "ps": <number or null>,
    "ev_ebitda": <number or null>,
    "ev_revenue": <number or null>,
    "peg": <number or null>,
    "dcf_upside": <estimated % upside from DCF, number or null>
  },
  "profitability": {
    "gross_margin": <% number>,
    "operating_margin": <% number>,
    "net_margin": <% number>,
    "roe": <% number>,
    "roa": <% number>,
    "roic": <% number>
  },
  "growth": {
    "revenue_yoy": <% number>,
    "earnings_yoy": <% number>,
    "revenue_3yr_cagr": <% number or null>,
    "eps_3yr_cagr": <% number or null>,
    "fcf_growth": <% number or null>
  },
  "financial_health": {
    "debt_equity": <number>,
    "current_ratio": <number>,
    "quick_ratio": <number>,
    "interest_coverage": <number or null>,
    "net_debt_ebitda": <number or null>,
    "fcf_yield": <% number or null>
  },
  "analyst": {
    "strong_buy": <int>,
    "buy": <int>,
    "hold": <int>,
    "sell": <int>,
    "strong_sell": <int>,
    "price_target": <number or null>
  }
}
Ticker: ${sym}. Use the most recent available data. Return ONLY the JSON object.`, 1800)
        .then(d => { if (d) setFundamentals(d); setL("fund", false); });
    }

    // Verdict & scores
    if (!loaded.current.verdict) {
      loaded.current.verdict = true; setL("verdict", true);
      callAIJSON(`CFA-level stock analyst. Search for current ${sym} data and provide a comprehensive investment verdict.
Return ONLY valid JSON, no markdown:
{
  "overallScore": <0-100 integer>,
  "verdict": "BUY" | "HOLD" | "SELL" | "WAIT",
  "headline": "<one sharp sentence capturing the core thesis, max 12 words>",
  "summary": "<2-3 sentences: what the company does, why the score is what it is, and the #1 risk>",
  "entryZone": "<price range string e.g. '$140-$148'>",
  "stopLoss": "<price string>",
  "target12m": "<price string>",
  "scores": {
    "valuation": <0-100>,
    "quality": <0-100>,
    "growth": <0-100>,
    "momentum": <0-100>,
    "sentiment": <0-100>
  },
  "scoreNotes": {
    "valuation": "<1 sentence why>",
    "quality": "<1 sentence why>",
    "growth": "<1 sentence why>",
    "momentum": "<1 sentence why>",
    "sentiment": "<1 sentence why>"
  }
}
Ticker: ${sym}. Be direct and honest — a score of 100 is impossible, average is 50.`, 1200)
        .then(d => { if (d) setVerdictData(d); setL("verdict", false); });
    }

    // Bull case
    if (!loaded.current.bull) {
      loaded.current.bull = true; setL("bull", true);
      callAIStream(
        `Equity research. Write the bull case for ${sym} in 2 tight paragraphs. No headers, no bullets.
Para 1: What is driving the stock RIGHT NOW — specific recent catalysts, news, dates, numbers.
Para 2: The 2-3 most compelling reasons to own the stock over the next 6-12 months with specific price drivers and timeline.
Be specific, cite numbers, avoid generic language. Write as a senior analyst would for an investment committee.`,
        t => setBull(t), 800
      ).then(() => setL("bull", false));
    }

    // Bear case
    if (!loaded.current.bear) {
      loaded.current.bear = true; setL("bear", true);
      callAIStream(
        `Equity research. Write the bear case for ${sym} in 2 tight paragraphs. No headers, no bullets.
Para 1: The 3 biggest risks ranked by probability — be specific, cite numbers, avoid vague language.
Para 2: Your verdict — specific entry zone, stop loss level, 12-month price target, and what would change your mind.
Date: ${new Date().toLocaleDateString()}. Write as a senior risk analyst would.`,
        t => setBear(t), 800
      ).then(() => setL("bear", false));
    }

    // Catalysts
    if (!loaded.current.cat) {
      loaded.current.cat = true; setL("cat", true);
      callAIJSON(`Upcoming catalysts for ${sym} stock. Return ONLY a JSON array, no markdown, max 5 items:
[{"date":"<YYYY-MM-DD>","title":"<event name>","tag":"bull|bear|neut","detail":"<one specific sentence about impact>"}]
Include earnings date, product launches, regulatory decisions, conferences, contract announcements. Dates: ${today()} to ${inDays(90)}.`)
        .then(d => { if (Array.isArray(d)) setCatalysts(d); setL("cat", false); });
    }

    // Earnings history
    if (!loaded.current.earn) {
      loaded.current.earn = true; setL("earn", true);
      callAIJSON(`Earnings history for ${sym}. Return ONLY a JSON array, no markdown, last 6 quarters:
[{"date":"<YYYY-MM-DD>","quarter":"<e.g. Q3 2024>","epsEst":<float>,"epsActual":<float>,"beat":"beat|miss|inline","revEst":<billions float>,"revActual":<billions float>,"stockMove":<% float>}]`)
        .then(d => { if (Array.isArray(d)) setEarnings(d); setL("earn", false); });
    }

    // Peer comparison
    if (!loaded.current.peers) {
      loaded.current.peers = true; setL("peers", true);
      callAIJSON(`Peer comparison for ${sym}. Return ONLY a JSON array, no markdown. Include ${sym} plus 4-5 closest competitors:
[{"ticker":"<symbol>","name":"<short name>","marketCap":<USD number>,"pe_ttm":<float or null>,"pb":<float or null>,"ev_ebitda":<float or null>,"gross_margin":<% float>,"roe":<% float>,"revenue_growth":<% float>,"score":<0-100 int>}]
Put ${sym} first. Use realistic current data.`, 1200)
        .then(d => { if (Array.isArray(d)) setPeers(d); setL("peers", false); });
    }
  }, [sym]);

  const f = fundamentals;
  const price = spotData?.price || f?.price;
  const chg = spotData?.change || f?.change;
  const chgPct = spotData?.changePct || f?.changePct;
  const isUp = (chgPct || 0) >= 0;

  const verdictCls = verdictData ? verdictData.verdict.toLowerCase() : "wait";

  /* ── VALUATION HELPERS ── */
  const valClass = (metric, val) => {
    if (val == null) return "na";
    const thresholds = {
      pe_ttm: [15,25,35], pe_forward:[13,22,30], pb:[1,3,6],
      ps:[1,3,8], ev_ebitda:[8,14,20], peg:[0.8,1.5,2.5],
      debt_equity:[0.3,1,2.5], current_ratio:[2,1.5,1],
    };
    const t = thresholds[metric];
    if (!t) return "";
    const [g, w] = t;
    if (metric === "current_ratio") return val >= g?"good":val>=w?"warn":"bad";
    if (metric === "debt_equity") return val<=g?"good":val<=w?"warn":"bad";
    return val<=g?"good":val<=w?"warn":"bad";
  };

  const marginClass = v => v>=30?"good":v>=15?"warn":"bad";
  const growthClass = v => v>=20?"good":v>=8?"warn":"bad";
  const roClass = v => v>=15?"good":v>=8?"warn":"bad";

  return (
    <div>
      {/* ── STOCK HEADER ── */}
      <div className="stock-header">
        <div className="stock-ident">
          <div className="stock-ticker">{sym}</div>
          {loading.fund && !f && <div className="sk" style={{width:200,height:14,marginTop:6}}/>}
          {f && <div className="stock-name">{f.companyName} · {f.exchange}</div>}
          {f && (
            <div className="stock-tags">
              {f.sector && <span className="tag">{f.sector}</span>}
              {f.industry && <span className="tag">{f.industry}</span>}
              {f.marketCap && <span className="tag">{fmtM(f.marketCap)} Mkt Cap</span>}
            </div>
          )}
        </div>
        <div className="stock-price-block">
          {loading.spot && !price ? (
            <div className="sk" style={{width:150,height:44}}/>
          ) : (
            <>
              <div className={`stock-price ${isUp?"up":"dn"}`}>
                {price ? `$${price.toLocaleString("en-US",{minimumFractionDigits:2,maximumFractionDigits:2})}` : "—"}
              </div>
              {chg != null && (
                <div className={`stock-chg ${isUp?"up":"dn"}`}>
                  {sign(chg)}{fmt(Math.abs(chg),"$")} ({sign(chgPct)}{fmt(Math.abs(chgPct),"","%")})
                </div>
              )}
              {f?.week52High && f?.week52Low && (
                <div style={{marginTop:8}}>
                  <div className="range-wrap">
                    <span className="range-lo">{fmt(f.week52Low,"$")}</span>
                    <div className="range-track" style={{width:140}}>
                      <div className="range-dot" style={{left:`${Math.max(2,Math.min(98,((price-f.week52Low)/(f.week52High-f.week52Low)*100)))}%`}}/>
                    </div>
                    <span className="range-hi">{fmt(f.week52High,"$")}</span>
                  </div>
                  <div style={{fontSize:9,color:"var(--ink3)",marginTop:3,textAlign:"right",fontFamily:"var(--mono)"}}>52-week range</div>
                </div>
              )}
              <div className="stock-time">{new Date().toLocaleString("en-US",{month:"short",day:"numeric",hour:"2-digit",minute:"2-digit"})}</div>
            </>
          )}
        </div>
      </div>

      {/* ── VERDICT BANNER ── */}
      {loading.verdict && !verdictData ? (
        <div className="sk" style={{height:110,marginTop:20,borderRadius:"var(--rad)"}}/>
      ) : verdictData ? (
        <div className="verdict">
          <div className={`verdict-score-block ${verdictCls}`}>
            <div className="verdict-score">{verdictData.overallScore}</div>
            <div className="verdict-label">{verdictData.verdict}</div>
          </div>
          <div className="verdict-body">
            <div className="verdict-headline">{verdictData.headline}</div>
            <div className="verdict-text">{verdictData.summary}</div>
          </div>
          <div className="verdict-meta">
            <div className="vm-item"><div className="vm-label">Entry Zone</div><div className="vm-val">{verdictData.entryZone||"—"}</div></div>
            <div className="vm-item"><div className="vm-label">Stop Loss</div><div className="vm-val" style={{color:"var(--red)"}}>{verdictData.stopLoss||"—"}</div></div>
            <div className="vm-item"><div className="vm-label">12M Target</div><div className="vm-val" style={{color:"var(--green)"}}>{verdictData.target12m||"—"}</div></div>
          </div>
        </div>
      ) : null}

      {/* ── SCORE CARDS ── */}
      {verdictData?.scores && (
        <>
          <div className="sec-head"><span className="sec-title">Factor Scores</span><div className="sec-rule"/><span className="sec-badge">CFA Framework</span></div>
          <div className="score-row">
            {Object.entries(verdictData.scores).map(([key, val]) => (
              <div key={key} className="score-card">
                <div className="sc-name">{key.charAt(0).toUpperCase()+key.slice(1)}</div>
                <div className={`sc-score ${scoreClass(val)}`}>{val}</div>
                <div className="sc-bar"><div className="sc-bar-fill" style={{width:`${val}%`,background:scoreColor(val)}}/></div>
                <div className="sc-note">{verdictData.scoreNotes?.[key]||""}</div>
              </div>
            ))}
          </div>
        </>
      )}

      {/* ── CHART ── */}
      <div className="sec-head"><span className="sec-title">Price Chart</span><div className="sec-rule"/></div>
      <PriceChart sym={sym}/>

      {/* ── VALUATION ── */}
      <div className="sec-head"><span className="sec-title">Valuation</span><div className="sec-rule"/><span className="sec-badge">Multiples</span></div>
      {loading.fund && !f ? (
        <div className="sk" style={{height:90,borderRadius:"var(--rad)"}}/>
      ) : f?.valuation ? (
        <div className="metric-grid">
          {[
            {l:"P/E (TTM)",k:"pe_ttm",v:f.valuation.pe_ttm,suf:"x"},
            {l:"P/E (Fwd)",k:"pe_forward",v:f.valuation.pe_forward,suf:"x"},
            {l:"P/Book",k:"pb",v:f.valuation.pb,suf:"x"},
            {l:"P/Sales",k:"ps",v:f.valuation.ps,suf:"x"},
            {l:"EV/EBITDA",k:"ev_ebitda",v:f.valuation.ev_ebitda,suf:"x"},
            {l:"EV/Revenue",k:"ev_revenue",v:f.valuation.ev_revenue,suf:"x"},
            {l:"PEG Ratio",k:"peg",v:f.valuation.peg,suf:"x"},
            {l:"DCF Upside",k:"dcf",v:f.valuation.dcf_upside,suf:"%"},
          ].map((m,i) => (
            <div key={i} className="metric-cell">
              <div className="mc-label">{m.l}</div>
              <div className={`mc-val ${m.k==="dcf"?(m.v>0?"good":m.v<0?"bad":"na"):valClass(m.k,m.v)}`}>
                {m.v==null?"—":`${m.v.toFixed(m.k==="dcf"?1:1)}${m.suf}`}
              </div>
            </div>
          ))}
        </div>
      ) : null}

      {/* ── PROFITABILITY ── */}
      <div className="sec-head"><span className="sec-title">Profitability</span><div className="sec-rule"/><span className="sec-badge">Quality</span></div>
      {f?.profitability ? (
        <div className="metric-grid cols-3">
          {[
            {l:"Gross Margin",v:f.profitability.gross_margin,cls:marginClass(f.profitability.gross_margin)},
            {l:"Operating Margin",v:f.profitability.operating_margin,cls:marginClass(f.profitability.operating_margin)},
            {l:"Net Margin",v:f.profitability.net_margin,cls:marginClass(f.profitability.net_margin)},
            {l:"Return on Equity",v:f.profitability.roe,cls:roClass(f.profitability.roe)},
            {l:"Return on Assets",v:f.profitability.roa,cls:roClass(f.profitability.roa)},
            {l:"ROIC",v:f.profitability.roic,cls:roClass(f.profitability.roic)},
          ].map((m,i) => (
            <div key={i} className="metric-cell">
              <div className="mc-label">{m.l}</div>
              <div className={`mc-val ${m.cls}`}>{m.v==null?"—":`${m.v.toFixed(1)}%`}</div>
              {m.v!=null && <div className="mc-bar"><div className="mc-bar-fill" style={{width:`${Math.min(100,Math.max(0,m.v))}%`,background:m.cls==="good"?"var(--green)":m.cls==="warn"?"var(--gold)":"var(--red)"}}/></div>}
            </div>
          ))}
        </div>
      ) : loading.fund ? <div className="sk" style={{height:90,borderRadius:"var(--rad)"}}/> : null}

      {/* ── GROWTH ── */}
      <div className="sec-head"><span className="sec-title">Growth</span><div className="sec-rule"/></div>
      {f?.growth ? (
        <div className="metric-grid cols-5">
          {[
            {l:"Revenue YoY",v:f.growth.revenue_yoy},
            {l:"Earnings YoY",v:f.growth.earnings_yoy},
            {l:"Rev 3Y CAGR",v:f.growth.revenue_3yr_cagr},
            {l:"EPS 3Y CAGR",v:f.growth.eps_3yr_cagr},
            {l:"FCF Growth",v:f.growth.fcf_growth},
          ].map((m,i) => (
            <div key={i} className="metric-cell">
              <div className="mc-label">{m.l}</div>
              <div className={`mc-val ${m.v==null?"na":growthClass(m.v)}`}>
                {m.v==null?"—":`${m.v>0?"+":""}${m.v.toFixed(1)}%`}
              </div>
            </div>
          ))}
        </div>
      ) : loading.fund ? <div className="sk" style={{height:72,borderRadius:"var(--rad)"}}/> : null}

      {/* ── FINANCIAL HEALTH ── */}
      <div className="sec-head"><span className="sec-title">Financial Health</span><div className="sec-rule"/><span className="sec-badge">Balance Sheet</span></div>
      {f?.financial_health ? (
        <div className="metric-grid cols-5">
          {[
            {l:"Debt / Equity",k:"debt_equity",v:f.financial_health.debt_equity,suf:"x"},
            {l:"Current Ratio",k:"current_ratio",v:f.financial_health.current_ratio,suf:"x"},
            {l:"Quick Ratio",k:"quick_ratio",v:f.financial_health.quick_ratio,suf:"x"},
            {l:"Interest Coverage",k:"int_cov",v:f.financial_health.interest_coverage,suf:"x"},
            {l:"FCF Yield",k:"fcf",v:f.financial_health.fcf_yield,suf:"%"},
          ].map((m,i) => (
            <div key={i} className="metric-cell">
              <div className="mc-label">{m.l}</div>
              <div className={`mc-val ${m.k==="int_cov"?(m.v>5?"good":m.v>2?"warn":"bad"):m.k==="fcf"?(m.v>5?"good":m.v>2?"warn":"bad"):valClass(m.k,m.v)}`}>
                {m.v==null?"—":`${m.v.toFixed(1)}${m.suf}`}
              </div>
            </div>
          ))}
        </div>
      ) : loading.fund ? <div className="sk" style={{height:72,borderRadius:"var(--rad)"}}/> : null}

      {/* ── ANALYST CONSENSUS ── */}
      {f?.analyst && (
        <>
          <div className="sec-head"><span className="sec-title">Wall Street Consensus</span><div className="sec-rule"/></div>
          <div className="metric-grid cols-5">
            {[
              {l:"Strong Buy",v:f.analyst.strong_buy,c:"var(--green)"},
              {l:"Buy",v:f.analyst.buy,c:"#2e8b57"},
              {l:"Hold",v:f.analyst.hold,c:"var(--gold)"},
              {l:"Sell",v:f.analyst.sell,c:"#c07030"},
              {l:"Strong Sell",v:f.analyst.strong_sell,c:"var(--red)"},
            ].map((a,i) => (
              <div key={i} className="metric-cell" style={{textAlign:"center"}}>
                <div className="mc-label">{a.l}</div>
                <div className="mc-val" style={{color:a.c,textAlign:"center"}}>{a.v??0}</div>
              </div>
            ))}
          </div>
          {f.analyst.price_target && (
            <div style={{padding:"8px 0",fontFamily:"var(--mono)",fontSize:11,color:"var(--ink3)"}}>
              Consensus price target: <span style={{color:"var(--ink)",fontWeight:500}}>${f.analyst.price_target.toFixed(2)}</span>
              {price && <span style={{color:f.analyst.price_target>price?"var(--green)":"var(--red)",marginLeft:8}}>
                {sign(f.analyst.price_target-price)}{((f.analyst.price_target-price)/price*100).toFixed(1)}% vs current
              </span>}
            </div>
          )}
        </>
      )}

      {/* ── PEER COMPARISON ── */}
      <div className="sec-head"><span className="sec-title">Peer Comparison</span><div className="sec-rule"/><span className="sec-badge">Relative Value</span></div>
      {loading.peers && !peers ? (
        <div className="sk" style={{height:160,borderRadius:"var(--rad)"}}/>
      ) : peers ? (
        <table className="peer-table">
          <thead className="pt-head">
            <tr>
              <th>Company</th>
              <th>Mkt Cap</th>
              <th>P/E</th>
              <th>P/B</th>
              <th>EV/EBITDA</th>
              <th>Gross Margin</th>
              <th>ROE</th>
              <th>Rev Growth</th>
              <th>Score</th>
            </tr>
          </thead>
          <tbody>
            {peers.map((p, i) => {
              const isTarget = p.ticker === sym;
              const avgPE = peers.filter(x=>x.pe_ttm).reduce((s,x)=>s+x.pe_ttm,0) / peers.filter(x=>x.pe_ttm).length;
              return (
                <tr key={i} className={`pt-row ${isTarget?"highlight":""}`}>
                  <td>{p.ticker} <span style={{fontSize:10,color:"var(--ink3)",fontFamily:"var(--sans)"}}>{p.name}</span></td>
                  <td>{fmtM(p.marketCap)}</td>
                  <td className={`pt-val ${p.pe_ttm==null?"":p.pe_ttm<avgPE?"good":p.pe_ttm<avgPE*1.3?"mid":"bad"}`}>{p.pe_ttm?`${p.pe_ttm.toFixed(1)}x`:"—"}</td>
                  <td>{p.pb?`${p.pb.toFixed(1)}x`:"—"}</td>
                  <td>{p.ev_ebitda?`${p.ev_ebitda.toFixed(1)}x`:"—"}</td>
                  <td className={`pt-val ${p.gross_margin>40?"good":p.gross_margin>20?"mid":"bad"}`}>{p.gross_margin?`${p.gross_margin.toFixed(1)}%`:"—"}</td>
                  <td className={`pt-val ${p.roe>15?"good":p.roe>8?"mid":"bad"}`}>{p.roe?`${p.roe.toFixed(1)}%`:"—"}</td>
                  <td className={`pt-val ${p.revenue_growth>15?"good":p.revenue_growth>5?"mid":"bad"}`}>{p.revenue_growth?`${p.revenue_growth>0?"+":""}${p.revenue_growth.toFixed(1)}%`:"—"}</td>
                  <td><span style={{fontFamily:"var(--serif)",fontSize:15,fontStyle:"italic",color:scoreColor(p.score||50)}}>{p.score||"—"}</span></td>
                </tr>
              );
            })}
          </tbody>
        </table>
      ) : null}

      {/* ── RESEARCH NOTE ── */}
      <div className="sec-head"><span className="sec-title">Research Note</span><div className="sec-rule"/><span className="sec-badge">AI · Web Search</span></div>
      <div className="analysis-split">
        <div className="analysis-card">
          <div className="ac-head bull">Bull Case / Drivers</div>
          {loading.bull && !bull ? (
            <div className="loading-lines">
              {[100,88,94,76,91,65,82,70].map((w,i) => <div key={i} className="ll" style={{width:`${w}%`}}/>)}
            </div>
          ) : (
            <div className="ac-text">{bull}{loading.bull && <span className="blink"/>}</div>
          )}
        </div>
        <div className="analysis-card">
          <div className="ac-head bear">Bear Case / Risks</div>
          {loading.bear && !bear ? (
            <div className="loading-lines">
              {[92,79,97,68,85,60,88,72].map((w,i) => <div key={i} className="ll" style={{width:`${w}%`}}/>)}
            </div>
          ) : (
            <div className="ac-text">{bear}{loading.bear && <span className="blink"/>}</div>
          )}
        </div>
      </div>

      {/* ── CATALYST CALENDAR ── */}
      <div className="sec-head"><span className="sec-title">Catalyst Calendar</span><div className="sec-rule"/></div>
      {loading.cat && !catalysts ? (
        <div className="sk" style={{height:120,borderRadius:"var(--rad)"}}/>
      ) : catalysts ? (
        <div style={{background:"var(--paper)",border:"1px solid var(--rule)",borderRadius:"var(--rad)",padding:"4px 20px"}}>
          {catalysts.map((c,i) => (
            <div key={i} className="cat-item">
              <div className="cat-date">{c.date}</div>
              <div className={`cat-marker ${c.tag||"neut"}`}/>
              <div className="cat-body">
                <div className="cat-title">{c.title}</div>
                <span className={`cat-badge ${c.tag||"neut"}`}>{c.tag==="bull"?"Bullish":c.tag==="bear"?"Bearish":"Neutral"}</span>
                {c.detail && <div className="cat-detail">{c.detail}</div>}
              </div>
            </div>
          ))}
        </div>
      ) : null}

      {/* ── EARNINGS HISTORY ── */}
      <div className="sec-head"><span className="sec-title">Earnings History</span><div className="sec-rule"/></div>
      {loading.earn && !earnings ? (
        <div className="sk" style={{height:140,borderRadius:"var(--rad)"}}/>
      ) : earnings ? (
        <table className="earn-table">
          <thead>
            <tr>
              <th className="et-th">Quarter</th>
              <th className="et-th">Result</th>
              <th className="et-th">EPS Est</th>
              <th className="et-th">EPS Actual</th>
              <th className="et-th">Rev Est</th>
              <th className="et-th">Rev Actual</th>
              <th className="et-th">Stock Move</th>
            </tr>
          </thead>
          <tbody>
            {earnings.slice(0,6).map((e,i) => (
              <tr key={i}>
                <td className="et-td">{e.quarter}</td>
                <td className="et-td"><span className={e.beat==="beat"?"beat":e.beat==="miss"?"miss":"inline"}>{e.beat?.toUpperCase()}</span></td>
                <td className="et-td">${e.epsEst?.toFixed(2)}</td>
                <td className="et-td"><span className={e.beat==="beat"?"beat":e.beat==="miss"?"miss":"inline"}>${e.epsActual?.toFixed(2)}</span></td>
                <td className="et-td">${e.revEst?.toFixed(2)}B</td>
                <td className="et-td">${e.revActual?.toFixed(2)}B</td>
                <td className="et-td"><span className={(e.stockMove||0)>=0?"pos":"neg"}>{sign(e.stockMove||0)}{e.stockMove?.toFixed(1)}%</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : null}

      <div style={{height:48}}/>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   GEX DASHBOARD
═══════════════════════════════════════════════════════════════════════════ */
function GexPage() {
  const [ticker, setTicker] = useState("SPY");
  const [data, setData] = useState(null);
  const [spotLabel, setSpotLabel] = useState("");

  useEffect(() => {
    setData(null);
    fetchSpot(ticker).then(d => {
      const spot = d?.price || null;
      const gex = generateGEX(ticker, spot);
      setData(gex);
      setSpotLabel(spot ? `$${spot.toLocaleString("en-US",{minimumFractionDigits:2,maximumFractionDigits:2})} live` : "demo data");
    });
  }, [ticker]);

  if (!data) return <div className="gex-panel"><div className="sk" style={{height:400,borderRadius:"var(--rad)"}}/></div>;

  const { strikes, callWall, putWall, flipStrike, dominant, isPositive, spot } = data;
  const maxAbs = Math.max(...strikes.map(r => Math.abs(r.netGEX)), 1);
  const colTemplate = "80px 1fr auto";

  return (
    <div className="gex-panel">
      <div className="gex-topbar">
        {GEX_TICKERS.map(t => (
          <button key={t} className={`gex-tbtn ${ticker===t?"on":""}`} onClick={() => setTicker(t)}>{t}</button>
        ))}
        <div style={{flex:1}}/>
        <span style={{fontFamily:"var(--mono)",fontSize:11,color:"var(--ink3)"}}>Demo GEX · {spotLabel}</span>
      </div>

      <div className="gex-levels">
        <div className="gex-lv-cell"><div className="gex-lv-label">Spot</div><div className="gex-lv-val">${spot?.toLocaleString()}</div></div>
        <div className="gex-lv-cell"><div className="gex-lv-label">Call Wall</div><div className="gex-lv-val call">${callWall?.toLocaleString()}</div></div>
        <div className="gex-lv-cell"><div className="gex-lv-label">Gamma Flip</div><div className="gex-lv-val flip">${flipStrike?.toLocaleString()}</div></div>
        <div className="gex-lv-cell"><div className="gex-lv-label">Put Wall</div><div className="gex-lv-val put">${putWall?.toLocaleString()}</div></div>
        <div className="gex-lv-cell">
          <div className="gex-lv-label">Regime</div>
          <div className={`gex-regime ${isPositive?"pos":"neg"}`}>{isPositive?"▲ Positive":"▼ Negative"}</div>
        </div>
      </div>

      <div className="ladder-wrap">
        <div className="ladder-header" style={{gridTemplateColumns:colTemplate}}>
          <div>Strike</div><div>Net GEX</div><div>Value</div>
        </div>
        {[...strikes].reverse().map(row => {
          const isSpot = Math.abs(row.strike - spot) <= spot * 0.002;
          const pct = Math.abs(row.netGEX) / maxAbs * 180;
          const pos = row.netGEX >= 0;
          return (
            <div key={row.strike} className={`ladder-row ${isSpot?"spot":""}`} style={{gridTemplateColumns:colTemplate}}>
              <div className="lc-strike">
                {row.strike.toLocaleString()}
                {isSpot && <span style={{fontSize:9,color:"var(--blue)",marginLeft:4}}>◀ spot</span>}
              </div>
              <div className="lc-bar">
                <div className={`lbar ${pos?"pos":"neg"}`} style={{width:`${Math.max(2,pct)}px`}}/>
              </div>
              <div className="lc-val">{fmtG(row.netGEX)}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   TRADE JOURNAL
═══════════════════════════════════════════════════════════════════════════ */
const JOURNAL_KEY = "port_journal_v2";
function loadJournal() { try { return JSON.parse(localStorage.getItem(JOURNAL_KEY)||"[]"); } catch { return []; } }
function saveJournal(j) { try { localStorage.setItem(JOURNAL_KEY, JSON.stringify(j)); } catch {} }

function JournalPage() {
  const [trades, setTrades] = useState(loadJournal);
  const [form, setForm] = useState({ sym:"", entry:"", target:"", stop:"", size:"", thesis:"" });
  const [prices, setPrices] = useState({});

  useEffect(() => {
    const syms = [...new Set(trades.filter(t=>!t.exitPrice).map(t=>t.sym))];
    syms.forEach(s => fetchSpot(s).then(d => { if(d?.price) setPrices(p => ({...p,[s]:d.price})); }));
  }, [trades.length]);

  const addTrade = () => {
    if (!form.sym || !form.entry) return;
    const t = { id: Date.now(), sym: form.sym.toUpperCase(), entry: parseFloat(form.entry), target: parseFloat(form.target)||null, stop: parseFloat(form.stop)||null, size: parseFloat(form.size)||null, thesis: form.thesis, date: new Date().toISOString().slice(0,10), exitPrice: null };
    const updated = [t, ...trades];
    setTrades(updated); saveJournal(updated);
    setForm({ sym:"", entry:"", target:"", stop:"", size:"", thesis:"" });
  };

  const closeTrade = (id, exitPrice) => {
    const updated = trades.map(t => t.id===id ? {...t, exitPrice} : t);
    setTrades(updated); saveJournal(updated);
  };

  const removeTrade = id => {
    const updated = trades.filter(t => t.id !== id);
    setTrades(updated); saveJournal(updated);
  };

  const openTrades = trades.filter(t => !t.exitPrice);
  const closedTrades = trades.filter(t => t.exitPrice);
  const totalPnL = closedTrades.reduce((s,t) => s + ((t.exitPrice - t.entry) / t.entry * 100), 0);
  const winRate = closedTrades.length ? (closedTrades.filter(t=>t.exitPrice>t.entry).length / closedTrades.length * 100) : 0;

  return (
    <div className="journal-panel">
      <div className="sec-head" style={{paddingTop:0}}><span className="sec-title">New Trade</span><div className="sec-rule"/></div>
      <div className="journal-add">
        <div className="jfield"><label>Ticker</label><input value={form.sym} onChange={e=>setForm(p=>({...p,sym:e.target.value.toUpperCase()}))} placeholder="NVDA" maxLength={6}/></div>
        <div className="jfield"><label>Entry $</label><input type="number" value={form.entry} onChange={e=>setForm(p=>({...p,entry:e.target.value}))} placeholder="100.00"/></div>
        <div className="jfield"><label>Target $</label><input type="number" value={form.target} onChange={e=>setForm(p=>({...p,target:e.target.value}))} placeholder="115.00"/></div>
        <div className="jfield"><label>Stop $</label><input type="number" value={form.stop} onChange={e=>setForm(p=>({...p,stop:e.target.value}))} placeholder="92.00"/></div>
        <div className="jfield"><label>Size $</label><input type="number" value={form.size} onChange={e=>setForm(p=>({...p,size:e.target.value}))} placeholder="5000"/></div>
        <button className="jadd-btn" onClick={addTrade}>Log Trade</button>
      </div>

      {trades.length > 0 && (
        <>
          <div className="pnl-summary">
            {[
              {l:"Open Positions",v:openTrades.length,fmt:n=>n,c:""},
              {l:"Closed Trades",v:closedTrades.length,fmt:n=>n,c:""},
              {l:"Win Rate",v:winRate,fmt:n=>`${n.toFixed(0)}%`,c:winRate>=50?"var(--green)":"var(--red)"},
              {l:"Total P&L",v:totalPnL,fmt:n=>`${sign(n)}${n.toFixed(1)}%`,c:totalPnL>=0?"var(--green)":"var(--red)"},
            ].map((s,i)=>(
              <div key={i} className="mgcard">
                <div className="mgcard-label">{s.l}</div>
                <div className="mgcard-val" style={{color:s.c||"var(--ink)"}}>{s.fmt(s.v)}</div>
              </div>
            ))}
          </div>

          <div className="sec-head"><span className="sec-title">Open Positions</span><div className="sec-rule"/></div>
          <table className="jtable">
            <thead><tr>
              <th className="jth">Ticker</th>
              <th className="jth">Date</th>
              <th className="jth">Entry</th>
              <th className="jth">Current</th>
              <th className="jth">Target</th>
              <th className="jth">Stop</th>
              <th className="jth">P&L</th>
              <th className="jth">Status</th>
              <th className="jth"></th>
            </tr></thead>
            <tbody>
              {openTrades.map(t => {
                const cur = prices[t.sym];
                const pnl = cur ? ((cur - t.entry) / t.entry * 100) : null;
                const atTarget = cur && t.target && cur >= t.target;
                const atStop = cur && t.stop && cur <= t.stop;
                return (
                  <tr key={t.id}>
                    <td className="jtd">{t.sym}</td>
                    <td className="jtd">{t.date}</td>
                    <td className="jtd">${t.entry.toFixed(2)}</td>
                    <td className="jtd">{cur?`$${cur.toFixed(2)}`:"—"}</td>
                    <td className="jtd">{t.target?`$${t.target.toFixed(2)}`:"—"}</td>
                    <td className="jtd" style={{color:"var(--red)"}}>{t.stop?`$${t.stop.toFixed(2)}`:"—"}</td>
                    <td className="jtd" style={{color:pnl==null?"":pnl>=0?"var(--green)":"var(--red)"}}>{pnl==null?"—":`${sign(pnl)}${pnl.toFixed(1)}%`}</td>
                    <td className="jtd">
                      <span className={`j-status ${atTarget?"win":atStop?"loss":"open"}`}>
                        {atTarget?"▲ At Target":atStop?"▼ At Stop":"Open"}
                      </span>
                    </td>
                    <td className="jtd">
                      {cur && <button className="j-remove" onClick={() => closeTrade(t.id, cur)} title="Close at current price">✓</button>}
                      <button className="j-remove" onClick={() => removeTrade(t.id)}>×</button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>

          {closedTrades.length > 0 && (
            <>
              <div className="sec-head"><span className="sec-title">Closed Trades</span><div className="sec-rule"/></div>
              <table className="jtable">
                <thead><tr>
                  <th className="jth">Ticker</th>
                  <th className="jth">Entry Date</th>
                  <th className="jth">Entry</th>
                  <th className="jth">Exit</th>
                  <th className="jth">P&L</th>
                  <th className="jth">Result</th>
                  <th className="jth"></th>
                </tr></thead>
                <tbody>
                  {closedTrades.map(t => {
                    const pnl = ((t.exitPrice - t.entry) / t.entry * 100);
                    return (
                      <tr key={t.id}>
                        <td className="jtd">{t.sym}</td>
                        <td className="jtd">{t.date}</td>
                        <td className="jtd">${t.entry.toFixed(2)}</td>
                        <td className="jtd">${t.exitPrice.toFixed(2)}</td>
                        <td className="jtd" style={{color:pnl>=0?"var(--green)":"var(--red)"}}>{sign(pnl)}{pnl.toFixed(1)}%</td>
                        <td className="jtd"><span className={`j-status ${pnl>=0?"win":"loss"}`}>{pnl>=0?"WIN":"LOSS"}</span></td>
                        <td className="jtd"><button className="j-remove" onClick={() => removeTrade(t.id)}>×</button></td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </>
          )}
        </>
      )}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   PORTFOLIO / MANAGE
═══════════════════════════════════════════════════════════════════════════ */
const K401_DEFAULT = {
  total:127250, contributions:14934, ytdReturn:8.4, vested:127250,
  positions:[
    {name:"S&P 500 Index (Active)",pct:78.8,val:100233},
    {name:"SDBA Active Sleeve",pct:21.2,val:27017},
  ],
  roth:4000, hsa:4899, trading:26800, swissRe:44755,
};
const ALLOC_COLORS = ["#1a3a6b","#1a6b3c","#b8860b","#c0392b","#4a4845"];

function ManagePage() {
  const [k, setK] = useState(K401_DEFAULT);
  const [editing, setEditing] = useState(false);

  const totalSavings = k.total + k.roth + k.hsa + k.trading + k.swissRe;

  return (
    <div style={{paddingTop:24,paddingBottom:60}}>
      <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:20}}>
        <div>
          <div style={{fontFamily:"var(--serif)",fontSize:32,fontStyle:"italic",letterSpacing:"-0.5px"}}>Portfolio</div>
          <div style={{fontSize:11,color:"var(--ink3)",marginTop:3}}>Empower 401k · Roth IRA · HSA · Trading</div>
        </div>
        <button
          onClick={() => setEditing(p=>!p)}
          style={{fontSize:11,fontWeight:500,padding:"6px 14px",border:"1.5px solid var(--ink)",borderRadius:"var(--rad)",cursor:"pointer",background:editing?"var(--ink)":"transparent",color:editing?"var(--paper)":"var(--ink)",transition:"all .15s"}}
        >{editing?"✓ Save":"✏ Edit"}</button>
      </div>

      <div className="manage-grid">
        {[
          {l:"Total Savings",v:totalSavings,fmt:fmtM,c:""},
          {l:"401k Balance",v:k.total,fmt:fmtM,c:""},
          {l:"YTD Return",v:k.ytdReturn,fmt:v=>`+${v}%`,c:"pos"},
          {l:"YTD Contributions",v:k.contributions,fmt:fmtM,c:""},
        ].map((x,i) => (
          <div key={i} className="mgcard">
            <div className="mgcard-label">{x.l}</div>
            {editing ? (
              <input style={{fontFamily:"var(--mono)",fontSize:14,border:"1px solid var(--rule)",borderRadius:"var(--rad)",padding:"4px 8px",width:"100%",marginTop:4}} type="number" value={i===0?totalSavings:i===1?k.total:i===2?k.ytdReturn:k.contributions} onChange={e=>{const v=parseFloat(e.target.value)||0;setK(p=>({...p,[["_","total","ytdReturn","contributions"][i]]:v}));}}/>
            ) : (
              <div className={`mgcard-val ${x.c}`}>{x.fmt(x.v)}</div>
            )}
            <div className="mgcard-sub">{["All accounts","Pre-tax","This year","Employee + employer"][i]}</div>
          </div>
        ))}
      </div>

      <div className="sec-head"><span className="sec-title">Asset Breakdown</span><div className="sec-rule"/></div>
      <div style={{background:"var(--paper)",border:"1px solid var(--rule)",borderRadius:"var(--rad)",padding:"16px 20px",marginBottom:12}}>
        {[
          {l:"401k — S&P Index",v:k.total*0.788,note:"Active contribution, index funds"},
          {l:"401k — Active Sleeve",v:k.total*0.212,note:"Self-directed brokerage"},
          {l:"Roth IRA",v:k.roth,note:"WeBull, index funds"},
          {l:"HSA",v:k.hsa,note:"Invested, never spending"},
          {l:"Active Trading",v:k.trading,note:"Taxable brokerage"},
          {l:"SwissRe Stock",v:k.swissRe,note:"Vesting March 2027"},
        ].map((a,i) => {
          const pct = (a.v / totalSavings * 100);
          return (
            <div key={i} style={{display:"grid",gridTemplateColumns:"180px 1fr 60px 80px",gap:10,alignItems:"center",marginBottom:10}}>
              <div style={{fontSize:12,fontWeight:500,color:"var(--ink)",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{a.l}</div>
              <div style={{height:4,background:"var(--paper3)",borderRadius:2,overflow:"hidden"}}>
                <div style={{height:"100%",borderRadius:2,background:ALLOC_COLORS[i%ALLOC_COLORS.length],width:`${pct}%`}}/>
              </div>
              <div style={{fontFamily:"var(--mono)",fontSize:10,color:"var(--ink3)",textAlign:"right"}}>{pct.toFixed(1)}%</div>
              <div style={{fontFamily:"var(--mono)",fontSize:10,color:"var(--ink2)",textAlign:"right"}}>{fmtM(a.v)}</div>
            </div>
          );
        })}
      </div>

      {editing && (
        <div style={{background:"var(--paper2)",border:"1px solid var(--rule)",borderRadius:"var(--rad)",padding:"16px 20px"}}>
          <div style={{fontSize:9,fontWeight:700,letterSpacing:"0.1em",textTransform:"uppercase",color:"var(--ink3)",marginBottom:12}}>Update Balances</div>
          <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:10}}>
            {[["Roth IRA","roth"],["HSA","hsa"],["Active Trading","trading"],["SwissRe Stock","swissRe"]].map(([l,key])=>(
              <div key={key} className="jfield">
                <label>{l}</label>
                <input type="number" value={k[key]} onChange={e=>setK(p=>({...p,[key]:parseFloat(e.target.value)||0}))}/>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="sec-head"><span className="sec-title">Loan Tracker</span><div className="sec-rule"/></div>
      <div style={{background:"var(--paper)",border:"1px solid var(--rule)",borderRadius:"var(--rad)",padding:"16px 20px"}}>
        <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:10,marginBottom:16}}>
          {[
            {l:"Remaining Balance",v:"$84,000",c:"var(--red)"},
            {l:"Monthly Interest",v:"$329",c:"var(--gold)"},
            {l:"Payoff Date",v:"March 2027",c:"var(--green)"},
          ].map((s,i)=>(
            <div key={i} className="mgcard" style={{marginBottom:0}}>
              <div className="mgcard-label">{s.l}</div>
              <div className="mgcard-val" style={{color:s.c}}>{s.v}</div>
            </div>
          ))}
        </div>
        <div style={{fontSize:11,color:"var(--ink3)",lineHeight:1.7}}>
          Payoff plan: SwissRe vesting ($22k) + 2027 bonus (~$25k post-tax) clears balance in one shot March 2027. Blended rate 4.7% — below expected market returns, so no acceleration needed.
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   ROOT APP
═══════════════════════════════════════════════════════════════════════════ */
export default function App() {
  const [view, setView] = useState("analysis");
  const [watchlist, setWatchlist] = useState(() => {
    try { return JSON.parse(localStorage.getItem("port_watchlist")||JSON.stringify(DEFAULT_WATCHLIST)); } catch { return DEFAULT_WATCHLIST; }
  });
  const [selected, setSelected] = useState("NVDA");
  const [input, setInput] = useState("");

  const saveWatchlist = wl => { setWatchlist(wl); try { localStorage.setItem("port_watchlist", JSON.stringify(wl)); } catch {} };

  const addTicker = t => {
    const sym = (t || input).trim().toUpperCase().slice(0,6);
    if (!sym) return;
    if (!watchlist.includes(sym)) saveWatchlist([...watchlist, sym]);
    setSelected(sym); setView("analysis"); setInput("");
  };

  const removeTicker = sym => {
    const wl = watchlist.filter(x => x !== sym);
    saveWatchlist(wl);
    if (selected === sym) setSelected(wl[0] || null);
  };

  return (
    <>
      <style>{G}</style>
      <div className="app">

        {/* ── MASTHEAD ── */}
        <header className="masthead">
          <div className="masthead-top">
            <div className="brand">
              <div className="brand-name">Port</div>
              <div className="brand-sub">Equity Research Terminal</div>
            </div>
            <div className="masthead-nav">
              {[["analysis","Analysis"],["gex","GEX"],["journal","Journal"],["manage","Portfolio"]].map(([v,l])=>(
                <div key={v} className={`nav-item ${view===v?"on":""}`} onClick={()=>setView(v)}>{l}</div>
              ))}
            </div>
            <div className="masthead-right">
              <div className="mkt-pill up">SPY <span>+0.8%</span></div>
              <div className="mkt-pill up">QQQ <span>+1.1%</span></div>
              <div className="mkt-pill dn">VIX <span>18.2</span></div>
            </div>
          </div>

          <div className="searchbar">
            <div className="search-wrap">
              <span className="search-icon">⌕</span>
              <input
                className="search-input"
                placeholder="Search ticker…"
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={e => e.key === "Enter" && addTicker()}
                maxLength={6}
              />
              <button className="search-btn" onClick={() => addTicker()}>Look Up</button>
            </div>
            <div className="watchlist-chips">
              {watchlist.map(sym => (
                <div key={sym} className={`chip ${selected===sym&&view==="analysis"?"on":""}`} onClick={() => { setSelected(sym); setView("analysis"); }}>
                  {sym}
                  <span className="chip-rm" onClick={e => { e.stopPropagation(); removeTicker(sym); }}>×</span>
                </div>
              ))}
            </div>
          </div>
        </header>

        {/* ── CONTENT ── */}
        <main className="content">
          {view === "analysis" && !selected && (
            <div className="empty">
              <div className="empty-headline">Port</div>
              <div className="empty-body">Search any ticker for CFA-grade analysis — valuation, quality, growth, peers, and AI research notes.</div>
              <div className="empty-tickers">
                {["NVDA","AAPL","MSFT","TSLA","META","FCEL","ASTS"].map(t=>(
                  <div key={t} className="chip" onClick={() => addTicker(t)}>{t}</div>
                ))}
              </div>
            </div>
          )}
          {view === "analysis" && selected && <StockPage key={selected} sym={selected}/>}
          {view === "gex" && <GexPage/>}
          {view === "journal" && <JournalPage/>}
          {view === "manage" && <ManagePage/>}
        </main>
      </div>
    </>
  );
}
