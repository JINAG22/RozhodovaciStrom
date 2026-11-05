/* Průvodce adaptací obecního veřejného prostoru – aplikace
   Data: data/pruvodce.json (export ze sešitu průvodce, scripts/export_data.py).
   Pravidla R01–R18 odpovídají listu Pravidla v sešitu a engine2.py. */
(function () {
'use strict';
let D = null;
const app = document.getElementById('app');
const OK = {T:{n:'Teplo',c:'var(--T)',t:'var(--Tt)'},V:{n:'Voda',c:'var(--V)',t:'var(--Vt)'},Z:{n:'Zeleň',c:'var(--Z)',t:'var(--Zt)'},K:{n:'Krajina a půda',c:'var(--K)',t:'var(--Kt)'},S:{n:'Spolupráce',c:'var(--S)',t:'var(--St)'}};
const IMG = {T:'img/teplo.png',V:'img/voda.png',Z:'img/zelen.png',K:'img/krajina.png'};
const TIT = {T:'Rozpálená náves',V:'Sucho i přívaly',Z:'Chřadnoucí stromy',K:'Bahno a prach z polí'};
const POP = {T:'V létě se na návsi, u zastávky ani na hřišti nedá vydržet. Dlažba a asfalt sálají ještě večer.',V:'Po bouřce teče voda ulicí, v létě vysychá potok i studny. Dešťovka končí v kanále.',Z:'Stromy usychají, trávníky hnědnou a uschlé stromy nikdo nenahrazuje.',K:'Po bouřce teče z polí bahno do ulic, v suchu se práší. Chybí meze a aleje.'};
const HR = {1:'KR',2:'OB',3:'OB',4:'NAD'};
const RN = {1:'Začněte hned',2:'Malé úpravy',3:'Projekt',4:'Koncepce'};
const HL = {KR:'Krátkodobě',OB:'V rámci volebního období',NAD:'Nad rámec volebního období'};
const TT_PREF = {T:['O04','O45','O03'],V:['O08','O09'],Z:['O10','O07','O12','O06','O44'],K:['O32']};
const TTX = {O04:'Plachty nad lavičkami a pískovištěm – stín hned.',O45:'Osvěta a malý grant: strom a záhon místo kamene.',O03:'Pítko nebo mlžítko u hřiště a na návsi.',O08:'Sudy a nádrže u obecních budov na zálivku.',O09:'Přerušte obrubník, ať voda teče do zeleně.',O10:'Společná výsadba se spolkem nebo školou.',O07:'Zálivkové vaky a mulč pro mladé stromy.',O12:'Ochraňte kořeny a kmeny stávajících stromů.',O06:'Sečte méně a mozaikovitě, nechte kvést.',O44:'Ochraňte náletové stromky oplocením.',O32:'Zapište šetrné hospodaření do pachtovní smlouvy.',O11:'Zeptejte se lidí: anketa nebo procházka po obci.'};
const POMOC = {S:['K18','K16'],D:['K10','K15','K08'],P:['K19','K20','K01'],K:['K10','K23','K16']};
const KAPN = {S:'Svépomoc',D:'Žádost o dotaci',P:'Projekt nebo studie',K:'Strategický dokument',Z:'Podpora zastupitelstva',partner:'Spolupráce s okolím'};
const ODB = {T:['K01','K04'],V:['K02','K03'],Z:['K04','K01'],K:['K01','K17','K21']};
const DOT = {T:['OPŽP – sídelní zeleň','Sázíme budoucnost – stromy','MMR – obnova venkova','Jihomoravský kraj – adaptace'],V:['OPŽP – hospodaření se srážkovou vodou','Národní program ŽP','AOPK – tůně a mokřady','Jihomoravský kraj – adaptace'],Z:['Sázíme budoucnost – stromy','Nadace Partnerství – granty','OPŽP – sídelní zeleň','Národní program ŽP'],K:['AOPK – krajinné prvky','Státní pozemkový úřad – pozemkové úpravy','OPŽP','Jihomoravský kraj – adaptace']};
const PROC = {T:['Náves bude v létě k nevydržení. Nejvíc to odnesou senioři a malé děti.','Ostopovice obnovily náves se vzrostlými stromy a posezením.'],V:['Po přívalu bude voda ničit ulice a sklepy, v suchu vyschnou studny.','Bratčice proměnily hasičskou nádrž v jezírko na návsi.'],Z:['Stromy budou dál usychat a jejich náhrada bude stát víc než péče.','Žabeň vysadila devět alejí se 449 stromy.'],K:['Bahno z polí bude dál končit v ulicích a půda odnášet vodu.','Šardice se dohodly se zemědělcem na šetrném hospodaření.']};
const NAL = {hori:'Hoří to – začněte tím, co uleví hned, a souběžně připravte větší řešení.',zhor:'Máte čas na rozmyšlené kroky – začněte malou věcí a připravte projekt.',prev:'Výborně, že to řešíte včas: nejvíc vám dá zapsat adaptaci do strategického a územního plánu.'};
const NALN = {hori:'hoří to',zhor:'zhoršuje se',prev:'předcházíme'};
const BUDN = {A:'do 50 tis. Kč',B:'do 500 tis. Kč',D:'víc, s dotací'};
const TERM = {TT:'ihned – tento týden',KR:'do 6 měsíců',OB:'v rámci volebního období',NAD:'přesahuje volební období – začít teď'};
const KDO = {sami:['S'], dotace:['S','D','P'], vest:[]};
const KDON = {sami:'jen my a pár dobrovolníků', dotace:'zvládneme i dotaci a zadání projektu', vest:'potřebujeme, aby nás někdo provedl'};
const ZASTN = {ano:'zastupitelstvo je pro', ne:'zastupitelstvo zatím ne', nevim:'postoj zastupitelstva nevíme'};
const NEEDN = {S:'lidé', D:'dotace', P:'projektant', K:'zpracovatel koncepce', Z:'zastupitelstvo', partner:'partner'};
const HELP = [
  {id:'mas', n:'Místní akční skupina (MAS)', k:['S','D','K','partner'], tip:'pomůže s dotací, akčním plánem a spoluprací se sousedními obcemi – bezplatně'},
  {id:'proj', n:'Projektant – krajinářský architekt', k:['P'], tip:'navrhne řešení a připraví podklady pro stavbu i dotaci'},
  {id:'masproj', n:'MAS a projektant dohromady', k:['S','D','K','P','partner'], tip:'MAS pomůže s dotací, projektant s návrhem – tahle dvojice odemkne většinu projektů'},
  {id:'zast', n:'Zastupitelstvo', k:['Z'], tip:'koncepční kroky musí schválit – představte plán na zasedání nebo pozvěte zastupitele na procházku obcí'},
  {id:'lide', n:'Spolek, škola, hasiči', k:['S'], tip:'pomohou s výsadbou, péčí a akcemi s lidmi'}];
function kapOf(kdo, zast){ return (KDO[kdo] || []).concat(zast === 'ano' ? ['Z'] : []); }
function kapTxtOf(){ return S.kdo ? KDON[S.kdo] : (S.kap.filter((k) => k !== 'Z').map((k) => KAPN[k].toLowerCase()).join(', ') || 'nic – vše zadáme'); }
const PRIZ_SEL = ['P01','P10','P15','P25','P19','P20','P32','P33','P09','P30'];
const MAPS = [{id:'RegAdapt',q:'Jak zranitelná je vaše obec celkově?',u:'https://hymos.czechglobe.cz/regadapt/vypis.php',k:null},{id:'Vlny veder',q:'Kolik dní v roce je u vás tepelný stres?',u:'https://www.vlny-veder.cz',k:'T'},{id:'Intersucho',q:'Jak suchá je u vás půda?',u:'https://www.intersucho.cz',k:'V'},{id:'VÚMOP',q:'Ohrožuje obec eroze a bahno z polí?',u:'https://mapy.vumop.cz',k:'K'},{id:'Soupis stromů',q:'Víte, kolik máte stromů a v jakém jsou stavu?',u:'https://www.treecheck.eu',k:'Z'}];
const CI2_MET = 'https://adaptace.ci2.co.cz/sites/default/files/souboryredakce/adaptace_metodika_nahled.pdf';
const CI2_PRUV = 'https://adaptace.klimasemeni.cz/wp-content/uploads/sites/6/2025/01/Pruvodce-pro-samospravy_Jak-na-zmenu-klimatu_A4_web-1.0.2.2024-1.pdf';

/* ---------- stav (jen v prohlížeči) ---------- */
const DEF = {vel:null, okr:[], nal:null, kap:[], bud:null, hor:[], priz:[], mapv:{}, tab:0, open:{}, f:{vel:'vše',okr:'vše',r:'vše',m:'vše'}};
let S = load();
if (S.okr.length > 1) S.okr = S.okr.slice(0, 1);
if (S.hor.length) { const last = ['NAD','OB','KR'].find((h) => S.hor.indexOf(h) >= 0); S.hor = {KR:['KR'], OB:['KR','OB'], NAD:['KR','OB','NAD']}[last]; }
function load(){ try { const s = JSON.parse(localStorage.getItem('pruvodce-v1')); return Object.assign({}, DEF, s || {}); } catch (e) { return Object.assign({}, DEF); } }
function save(){ try { localStorage.setItem('pruvodce-v1', JSON.stringify(S)); } catch (e) {} }
function set(o){ Object.assign(S, o); save(); render(); }

/* ---------- pomocné ---------- */
const esc = (t) => String(t == null ? '' : t).replace(/[&<>"]/g, (c) => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const toggle = (arr, v, max) => { const a = arr.slice(); const i = a.indexOf(v); if (i >= 0) a.splice(i, 1); else { a.push(v); if (max && a.length > max) a.shift(); } return a; };
const M = (id) => D.meas.find((m) => m.id === id);
const ARROW = '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12h14"/><path d="M13 6l6 6-6 6"/></svg>';
const LOGO = '<a class="logo" href="#/">Průvodce<br>adaptací<br>obecního<br>veřejného<br>prostoru</a>';
function top(qn, branch){
  if (!qn) return '<div class="top">' + LOGO + '</div>';
  let d = ''; for (let i = 1; i <= 5; i++) d += '<span class="dot' + (i <= qn ? ' on' : '') + (i === qn ? ' cur' : '') + '"></span>';
  return '<div class="top">' + LOGO + '<div class="dots" aria-label="Otázka ' + qn + ' z 5">' + d + '<span style="margin-left:10px">' + (branch ? 'odbočka · ' : '') + qn + ' z 5</span></div></div>';
}
function nav(back, next, ok){
  return '<div class="nav"><a class="back" href="' + back + '">Zpět</a>' + (next ? '<button class="next" data-go="' + next + '" aria-label="Další krok"' + (ok ? '' : ' disabled') + '>' + ARROW + '</button>' : '') + '</div>';
}
function head(t, sub){ return '<div class="pad"><h1>' + t + '</h1>' + (sub ? '<p class="lead">' + sub + '</p>' : '') + '</div>'; }
function circ(label, size, on, act, val, color, sub){
  const st = 'width:' + size + 'px;height:' + size + 'px;' + (color ? 'border:3px solid ' + color + ';' + (on ? 'background:' + color + ';color:#fff;' : '') : '');
  return '<div class="choice"><button class="circ" style="' + st + 'max-width:42vw;max-height:42vw" aria-pressed="' + on + '" data-act="' + act + '" data-val="' + esc(val) + '">' + label + '</button>' + (sub ? '<span class="sub">' + sub + '</span>' : '') + '</div>';
}

/* ---------- rozhodovací pravidla ---------- */
function compute(){
  const okr = S.okr.length ? S.okr : ['T'];
  const kap = S.kap, hor = S.hor.length ? S.hor : ['KR'];
  const bud = {A:1,B:2,D:4}[S.bud || 'A'];
  const small = S.vel === 'do 500', big = S.vel === '2 500–10 000';
  const items = D.meas.filter((m) => okr.indexOf(m.okr) >= 0 || m.okr === 'S').map((m) => {
    const ch = m.kap.filter((k) => kap.indexOf(k) < 0);                         // R05
    if (m.cr > bud && kap.indexOf('D') < 0 && ch.indexOf('D') < 0) ch.push('D'); // R14
    if (small && m.cr >= 4) ch.push('partner');                                  // R06
    if (m.r === 4 && kap.indexOf('Z') < 0) ch.push('Z');                         // R15
    const stav = hor.indexOf(HR[m.r]) < 0 ? 'mimo' : (ch.length ? 'pomoc' : 'vase'); // R04
    let rec = false, alt = '';
    if (S.nal === 'prev' && (m.id === 'O42' || m.id === 'O39')) rec = true;        // R13
    if (big && (m.id === 'O38' || m.id === 'O40')) rec = true;                     // R06
    if (small && m.id === 'O38') alt = 'přes MAS nebo jako levnější studie adaptačního potenciálu';
    return Object.assign({}, m, {ch, stav, rec, alt});
  });
  const so = {vase:0, pomoc:1, mimo:2};
  const ttOrder = []; okr.forEach((k) => (TT_PREF[k] || []).forEach((id) => ttOrder.push(id)));
  const tti = (m) => { const i = ttOrder.indexOf(m.id); return i < 0 ? 99 : i; };
  const cmp = (a, b) => (so[a.stav] - so[b.stav]) || ((b.rec ? 1 : 0) - (a.rec ? 1 : 0)) || (tti(a) - tti(b)) || ((b.j ? 1 : 0) - (a.j ? 1 : 0)) || (a.id < b.id ? -1 : 1);
  const zeb = {1:[],2:[],3:[],4:[]};
  items.forEach((m) => zeb[m.r].push(m));
  Object.keys(zeb).forEach((r) => {                                              // R17 prokládání okruhů
    const groups = okr.map((k) => zeb[r].filter((m) => m.okr === k).sort(cmp));
    const merged = []; for (let i = 0; groups.some((g) => g.length > i); i++) groups.forEach((g) => { if (g[i]) merged.push(g[i]); });
    const all = merged.concat(zeb[r].filter((m) => m.okr === 'S').sort(cmp));
    zeb[r] = all.slice().sort((a, b) => (so[a.stav] - so[b.stav]) || ((b.rec ? 1 : 0) - (a.rec ? 1 : 0)) || (all.indexOf(a) - all.indexOf(b)));
  });
  const tt = [], pref = okr.map((k) => (TT_PREF[k] || []).slice());           // R07
  for (let i = 0; tt.length < 2 && i < 6; i++) pref.forEach((p) => { const id = p.shift(); if (id && tt.length < 2) { const m = items.find((x) => x.id === id); if (m) tt.push(m); } });
  const o11 = items.find((x) => x.id === 'O11'); if (o11) tt.push(o11);
  const need = []; items.forEach((m) => { if (m.stav === 'pomoc') m.ch.forEach((k) => { if (need.indexOf(k) < 0) need.push(k); }); });
  return {okr, items, zeb, tt, need, hor, small, big};
}
function planRows(R){                                                            // R11
  const rows = [], seen = {};
  const add = (m, hz) => { if (seen[m.id] || rows.length >= 6) return; seen[m.id] = 1;
    const pom = m.ch.filter((k) => POMOC[k]);
    let kdo = m.kap.length === 1 && m.kap[0] === 'S' ? 'svépomocí' : m.kdo;
    if (pom.length) kdo += ' · s pomocí: ' + POMOC[pom[0]].slice(0, 2).map((id) => D.kont[id]).join(', ');
    if (m.ch.indexOf('Z') >= 0) kdo += ' · nejdřív podpora zastupitelstva';
    rows.push({id: m.id, n: m.n, term: TERM[hz || HR[m.r]], cost: m.ct, fin: m.fin, kdo, uk: m.uk, zpr: m.zpr}); };
  R.tt.forEach((m) => add(m, 'TT'));
  [1,2,3,4].forEach((r) => { if (R.hor.indexOf(HR[r]) < 0 && !(S.nal === 'prev' && r === 4)) return;
    R.zeb[r].filter((m) => (m.stav === 'vase' && m.okr !== 'S') || m.rec).forEach((m) => add(m));
    const p = R.zeb[r].find((m) => m.stav === 'pomoc' && m.okr !== 'S'); if (p) add(p); });
  if (S.nal === 'prev') { const m = R.items.find((x) => x.id === 'O42'); if (m) add(m, 'NAD'); }
  return rows;
}

/* ---------- obrazovky ---------- */
function vIntro(){
  return '<div class="top">' + LOGO + '<span style="font-size:13px;background:#fff">Pro obce do 10 000 obyvatel</span></div>' +
  '<div class="hero"><div class="txt"><h1 style="font-size:clamp(30px,4.5vw,42px)">Plánujte prostranství, která jsou životu příjemnější</h1>' +
  '<p style="margin:0;font-size:16px;max-width:470px">Pět krátkých otázek o vaší obci. Na konci dostanete plán – s čím začít ještě tento týden a co dál.</p>' +
  '<div style="display:flex;gap:10px;flex-wrap:wrap"><a class="btn dark" href="#/q1">Začít</a><a class="btn" href="#/priklady">Prohlédnout příklady</a></div>' +
  '<span class="small">asi 5 minut · odpovědi zůstávají jen ve vašem prohlížeči · <a href="#/zdroje">z čeho průvodce vychází</a></span></div>' +
  '<div class="art" aria-hidden="true"><div class="circle-img c-obec"><img src="img/obec.png" alt=""></div><div class="circle-img c-kraj"><img src="img/krajina-uvod.png" alt=""></div></div></div>';
}
function vQ1(){
  const o = [['do 500',130,'často bez úředníka'],['500–2 500',165,'menší projekty s dotací'],['2 500–10 000',200,'větší investice, vlastní strategie']];
  return top(1) + head('Kolik má obec obyvatel?') + '<div class="choices">' + o.map((x) => circ(x[0], x[1], S.vel === x[0], 'vel', x[0], null, x[2])).join('') + '</div>' + nav('#/', 'q2', !!S.vel);
}
function vQ2(){
  const cards = ['T','V','Z','K'].map((k) => '<button class="card" aria-pressed="' + (S.okr.indexOf(k) >= 0) + '" data-act="okr" data-val="' + k + '"><span class="ring"><img src="' + IMG[k] + '" alt=""><span class="check" aria-hidden="true">✓</span></span><span class="meta"><span class="tag" style="color:' + OK[k].t + '">' + OK[k].n + '</span><span class="tit">' + TIT[k] + '</span><span class="pop">' + POP[k] + '</span></span></button>').join('');
  const nev = '<div class="nevim"><div class="q" aria-hidden="true">?</div><span class="meta" style="display:flex;flex-direction:column;gap:6px;background:#fff;align-items:center"><span class="tag">Nevím jistě</span><b>Zmapujte si to</b><a href="#/q2a" style="font-size:13px">Projít pár otázek →</a><a href="#/q2b" style="font-size:13px">Podívat se do map →</a></span></div>';
  return top(2) + head('Co vás nejvíc trápí?', 'Vyberte ten nejpalčivější. Na další se můžete vrátit později.') + '<div class="cards">' + cards + nev + '</div>' + nav('#/q1', 'q3', S.okr.length > 0);
}
function scoreA(){
  const sc = {T:0,V:0,Z:0,K:0};
  S.priz.forEach((id) => { const p = D.priz.find((x) => x.id === id); if (p) Object.keys(sc).forEach((k) => sc[k] += p.w[k]); });
  const top_ = Object.keys(sc).sort((a, b) => sc[b] - sc[a]);
  let ao = top_.filter((k) => sc[k] > 0).slice(0, 1);
  return {sc, ao, mx: Math.max(1, sc[top_[0]])};
}
function vQ2a(){
  const {sc, ao, mx} = scoreA();
  const list = PRIZ_SEL.map((id) => D.priz.find((p) => p.id === id)).filter(Boolean).map((p) => '<button class="chk" aria-pressed="' + (S.priz.indexOf(p.id) >= 0) + '" data-act="priz" data-val="' + p.id + '"><span class="box" aria-hidden="true">' + (S.priz.indexOf(p.id) >= 0 ? '✓' : '') + '</span>' + esc(p.t) + '</button>').join('');
  const bub = ['T','V','Z','K'].map((k) => { const s = 22 + Math.round(44 * sc[k] / mx); return '<div class="bub"><span style="width:' + s + 'px;height:' + s + 'px;border-radius:50%;background:' + OK[k].c + ';opacity:' + (ao.indexOf(k) >= 0 ? 1 : .3) + '"></span><span style="font-weight:' + (ao.indexOf(k) >= 0 ? 700 : 400) + '">' + OK[k].n + '</span></div>'; }).join('');
  const n = S.priz.length, sev = n >= 5 ? 'vysoká' : n >= 3 ? 'střední' : n ? 'nízká' : '–';
  return top(2, true) + head('Co v obci vidíte?', 'Zaškrtněte, co platí. Otázky vycházejí z publikací CESMOD, CI2 a Nadace Partnerství.') +
  '<div class="split"><div style="flex:1 1 0"><div class="rows" style="border-bottom:0">' + list + '</div></div><div class="side"><span class="cap" style="font-weight:700">Vychází vám</span><div class="bubbles">' + bub + '</div><span style="font-size:13px">Závažnost: <b>' + sev + '</b> · ' + n + ' z ' + PRIZ_SEL.length + '</span>' +
  (ao.length ? '<button class="btn dark" data-act="ago" style="font-size:13px">Pokračovat: ' + ao.map((k) => OK[k].n).join(' a ') + '</button>' : '') + '<a href="#/q2b" style="font-size:12px">Ověřit v mapách →</a></div></div>' + nav('#/q2', null);
}
function vQ2b(){
  const LV = ['nízké','střední','vysoké','nevím'];
  const mo = []; MAPS.forEach((m) => { const l = S.mapv[m.id]; if (m.k && (l === 'vysoké' || l === 'střední')) mo.push([m.k, l === 'vysoké' ? 2 : 1]); });
  mo.sort((a, b) => b[1] - a[1]); const bo = mo.slice(0, 1).map((x) => x[0]);
  const rows = MAPS.map((m) => '<div class="maprow"><span aria-hidden="true" style="flex:0 0 18px;height:18px;border-radius:50%;' + (m.k ? 'background:' + OK[m.k].c : 'border:2px solid var(--ink)') + '"></span><span style="flex:1;min-width:200px"><b style="font-size:14px">' + m.id + '</b>' + (m.k ? '' : ' <span style="font-size:11px;color:var(--Zt)">· začněte tady, 2 min</span>') + '<br><span style="font-size:13px">' + m.q + '</span></span><a class="pill" href="' + m.u + '" target="_blank" rel="noopener" style="text-decoration:none">otevřít ↗</a><span role="group" aria-label="Co mapa ukazuje u vás" style="display:flex;gap:4px">' + LV.map((l) => '<button class="pill" aria-pressed="' + (S.mapv[m.id] === l) + '" data-act="mapv" data-map="' + esc(m.id) + '" data-val="' + l + '">' + l + '</button>').join('') + '</span></div>').join('');
  return top(2, true) + head('Podívejte se do map', 'Začněte RegAdaptem – za dvě minuty uvidíte, kde je obec zranitelná. U každé mapy stačí jedna odpověď.') + '<div class="rows">' + rows + '</div>' +
  (bo.length ? '<button class="btn dark" data-act="bgo" data-val="' + bo.join(',') + '" style="align-self:flex-end">Vychází vám: ' + bo.map((k) => OK[k].n).join(' a ') + ' – pokračovat</button>' : '') + nav('#/q2', null);
}
function vQ3(){
  const o = [['hori','Hoří to','už to škodí – lidé si stěžují, voda zaplavuje','var(--T)'],['zhor','Zhoršuje se to','každý rok o něco horší','var(--dk)'],['prev','Spíš předcházíme','chceme být připravení','var(--Z)']];
  return top(3) + head('Jak naléhavé to je?', 'Projevují se dopady už teď, nebo se na ně chcete připravit?') + '<div class="choices" style="align-items:flex-start">' + o.map((x) => circ(x[1], 165, S.nal === x[0], 'nal', x[0], x[3], x[2])).join('') + '</div>' +
  '<span class="small" style="align-self:center;background:#fff">Podle <a href="' + CI2_MET + '" target="_blank" rel="noopener">Metodiky tvorby místní adaptační strategie (CI2) ↗</a></span>' + nav('#/q2', 'q4', !!S.nal);
}
function vQ4(){
  const kdo = [['sami','Jen my a pár dobrovolníků','sázení, úklid, akce s lidmi'],['dotace','Zvládneme i dotaci a zadat projekt','máme kdo napíše žádost a vybere projektanta'],['vest','Potřebujeme, aby nás někdo provedl','nemáme na to lidi ani zkušenosti']]
    .map((x) => '<button class="opt" aria-pressed="' + (S.kdo === x[0]) + '" data-act="kdo" data-val="' + x[0] + '"><b>' + x[1] + '</b><span>' + x[2] + '</span></button>').join('');
  const zast = [['ano','ano'],['ne','zatím ne'],['nevim','nevím']].map((x) => '<button class="pill" aria-pressed="' + (S.zast === x[0]) + '" data-act="zast" data-val="' + x[0] + '">' + x[1] + '</button>').join('');
  const bud = [['A','do 50 tis.'],['B','do 500 tis.'],['D','víc s dotací']].map((x) => '<button class="pill" aria-pressed="' + (S.bud === x[0]) + '" data-act="bud" data-val="' + x[0] + '">' + x[1] + '</button>').join('');
  return top(4) + head('Kdo to bude dělat?', 'Nic nevyřadíme – u toho, co sami nezvládnete, ukážeme, kdo pomůže.') +
  '<div class="opts">' + kdo + '</div>' +
  '<div class="kapgrp"><span class="lab">Podpoří to zastupitelstvo?</span><div style="display:flex;gap:6px;flex-wrap:wrap">' + zast + '</div></div>' +
  '<div class="kapgrp"><span class="lab">Peníze na první kroky</span><div style="display:flex;gap:6px;flex-wrap:wrap">' + bud + '</div></div>' + nav('#/q3', 'q5', !!S.kdo && !!S.bud);
}
function vQ5(){
  const o = [['KR','Krátkodobě',125,'dny až měsíce','var(--Z)'],['OB','V rámci volebního období',160,'malé úpravy a projekty',null],['NAD','Nad rámec volebního období',195,'koncepce, územní plán',null]];
  return top(5) + head('Na jaký časový horizont cílíte?', 'Stromy a voda se plánují na desítky let – metodika CI2 doporučuje dívat se i za volební období.') +
  '<div class="timeline">' + o.map((x) => circ(x[1], x[2], S.hor[S.hor.length - 1] === x[0], 'hor', x[0], x[4], x[3])).join('') + '</div>' +
  '<span style="font-size:13px;background:#fff;align-self:center;text-align:center">Delší horizont v sobě zahrnuje i ten kratší. Ať zvolíte cokoli, ukážeme i to, s čím začít ještě tento týden.</span>' + nav('#/q4', 'plan', S.hor.length > 0);
}
function unlocks(m, h){ return m.stav === 'pomoc' && m.ch.length && m.ch.every((k) => h.k.indexOf(k) >= 0); }
function pill(m, R){
  const cls = m.stav === 'vase' ? 'vase' : m.stav === 'pomoc' ? 'pomoc' : 'mimo';
  const h = S.hl && HELP.find((x) => x.id === S.hl), hl = h && unlocks(m, h);
  const need = m.ch.filter((k, i) => m.ch.indexOf(k) === i).map((k) => NEEDN[k]);
  return '<a class="mp ' + cls + (hl ? ' hl' : '') + (h && !hl && m.stav !== 'vase' ? ' dim' : '') + '" href="#/opatreni/' + m.id + '">' + (R.okr.length > 1 && m.okr !== 'S' ? '<span class="od" style="background:' + OK[m.okr].c + '"></span>' : '') + esc(m.n) + (m.alt ? ' – ' + m.alt : '') +
    (m.stav === 'pomoc' ? '<span class="t">' + (hl ? 'zvládnete s pomocí' : 'potřeba: ' + need.join(' + ')) + '</span>' : '') + (m.rec ? '<span class="t rec">doporučeno</span>' : '') + '</a>';
}
function helpBlock(R){
  const pom = R.items.filter((m) => m.stav === 'pomoc');
  if (!pom.length) return '';
  let hs = HELP.map((h) => Object.assign({}, h, {c: pom.filter((m) => unlocks(m, h)).length})).filter((h) => h.c > 0);
  if (S.kap.indexOf('Z') >= 0) hs = hs.filter((h) => h.id !== 'zast');
  hs.sort((a, b) => b.c - a.c); hs = hs.slice(0, 3);
  const vase = R.items.filter((m) => m.stav === 'vase' && m.okr !== 'S').length;
  return '<section class="unlock" aria-labelledby="ul"><div style="display:flex;justify-content:space-between;gap:12px;flex-wrap:wrap;align-items:baseline"><span id="ul" class="cap" style="font-weight:700">Kdo vám odemkne nejvíc</span><span class="small">sami teď zvládnete ' + vase + ' opatření, s pomocí dalších ' + pom.length + '</span></div><div class="ucards">' +
    hs.map((h) => '<div class="ucard' + (S.hl === h.id ? ' on' : '') + '"><span class="num">+' + h.c + '</span><div><b>' + h.n + '</b><br><span class="small">' + h.tip + '</span><br><button class="link" data-act="hl" data-val="' + h.id + '" aria-pressed="' + (S.hl === h.id) + '">' + (S.hl === h.id ? 'zrušit zvýraznění' : 'ukázat v žebříku ↓') + '</button></div></div>').join('') + '</div></section>';
}
function tipList(a, n){
  const li = (z) => '<div class="li"><b>' + esc(z.k) + '</b> – ' + esc(z.c) + '</div>';
  return a.slice(0, n).map(li).join('') + (a.length > n ? '<details class="more"><summary>další tipy (' + (a.length - n) + ')</summary>' + a.slice(n).map(li).join('') + '</details>' : '');
}
function vPlan(){
  if (!S.okr.length || !S.vel) return top() + head('Nejdřív odpovězte na otázky') + '<a class="btn dark" href="#/q1" style="align-self:flex-start">Začít</a>';
  const R = compute();
  const kapTxt = kapTxtOf();
  const ans = [['Obyvatel', S.vel], ['Problém', R.okr.map((k) => OK[k].n).join(' a ')], ['Naléhavost', NALN[S.nal] || '–'], ['Kdo to udělá', kapTxt + ' · ' + (BUDN[S.bud] || '') + (S.zast ? ' · ' + ZASTN[S.zast] : '')], ['Horizont', HL[R.hor[R.hor.length - 1]].toLowerCase()]];
  const none = S.kdo ? S.kdo === 'vest' : S.kap.filter((k) => k !== 'Z').length === 0;
  const tt = R.tt.map((m, i) => '<div class="it"><span class="no">' + (i + 1) + '</span><span><a href="#/opatreni/' + m.id + '" style="font-size:15px;font-weight:700">' + esc(m.n) + '</a><br><span style="font-size:12px">' + (TTX[m.id] || '') + '</span><br><span style="font-size:11px;opacity:.9">' + m.ct + ' · svépomocí</span></span></div>').join('');
  const rungs = [4,3,2,1].map((r) => {
    const act = R.hor.indexOf(HR[r]) >= 0, all = R.zeb[r], recs = all.filter((m) => m.rec);
    const showP = act || (S.nal === 'prev' && r === 4 && recs.length), oc = !!S.open['c' + r];
    if (!showP && !oc) return '<button class="rung coll" data-act="open" data-val="c' + r + '" aria-expanded="false"><span class="badge">' + r + '</span><span style="font-size:12px;color:var(--muted);flex:1;text-align:left">' + RN[r] + ' · ' + HL[HR[r]].toLowerCase() + ' · ' + all.length + ' opatření mimo zvolený horizont</span><span class="link" style="font-size:12px">ukázat ▾</span></button>';
    const op = !!S.open['r' + r], base = act || oc ? all : (op ? all : recs), shown = (op || oc || S.hl) ? base : base.slice(0, 3), more = act ? all.length - 3 : all.length - recs.length;
    return '<div class="rung' + (!showP ? ' open' : '') + '"><span class="badge">' + r + '</span><div class="rname"><b>' + RN[r] + '</b><span>' + HL[HR[r]] + (!showP ? ' · mimo zvolený horizont' : !act ? ' · doporučujeme i tak' : '') + '</span></div><div class="mpills">' + shown.map((m) => pill(m, R)).join('') +
      (!showP ? '<button class="link" data-act="open" data-val="c' + r + '" aria-expanded="true">skrýt ▴</button>' : more > 0 && !S.hl ? '<button class="link" data-act="open" data-val="r' + r + '" aria-expanded="' + op + '">' + (op ? 'méně ▴' : '+ ' + more + ' další ▾') + '</button>' : '') + '</div></div>';
  }).join('');
  const tabs = ['Proč začít','Kdo pomůže','Kde vzít peníze','Inspirace','Další tipy'];
  const odb = []; R.okr.forEach((k) => ODB[k].forEach((id) => { if (odb.indexOf(id) < 0) odb.push(id); }));
  const dot = []; R.okr.forEach((k) => DOT[k].forEach((d) => { if (dot.indexOf(d) < 0) dot.push(d); }));
  let ex = D.ex.filter((e) => R.okr.indexOf(e.okr) >= 0 && e.v === S.vel && e.mala); if (ex.length < 3) ex = ex.concat(D.ex.filter((e) => R.okr.indexOf(e.okr) >= 0 && e.v !== S.vel && e.mala));
  const seen = {}; ex = ex.filter((e) => { if (seen[e.o]) return false; seen[e.o] = 1; return true; }).slice(0, 3);
  const zdf = (typ, n) => D.zd.filter((z) => z.typ === typ && (!z.okr.length || z.okr.some((k) => R.okr.indexOf(k) >= 0))).slice(0, n);
  const panels = [
    '<div style="display:flex;flex-direction:column;gap:10px">' + R.okr.map((k) => '<div class="cols"><div><span class="cap">Co když nic neuděláte · ' + OK[k].n + '</span><div>' + PROC[k][0] + '</div></div><div><span class="cap">Co když se do toho pustíte</span><div>' + PROC[k][1] + ' <a href="#/priklady">Příklady →</a></div></div></div>').join('') + '</div>',
    '<div class="cols"><div><span class="cap">Odborníci pro váš problém</span>' + odb.slice(0, 3).map((id) => '<div class="li">' + esc(D.kont[id]) + '</div>').join('') + '</div><div><span class="cap">S čím nezvládnete sami</span>' +
      R.need.filter((k) => k !== 'Z').map((k) => '<div class="li"><b>' + KAPN[k] + '</b> – ' + (k === 'partner' ? 'Sousední obce a mikroregion, MAS' : POMOC[k].slice(0, 2).map((id) => esc(D.kont[id])).join(', ')) + '</div>').join('') +
      (R.need.indexOf('Z') >= 0 ? '<div class="li"><b>Podpora zastupitelstva</b> – představte plán na zasedání, pozvěte zastupitele na procházku obcí</div>' : '') + '<div class="li"><b>Bezplatně</b> – úřad územního plánování ORP, Česká komora architektů, MAS</div></div></div>',
    '<div class="cols"><div><span class="cap">Dotace pro váš problém</span>' + dot.slice(0, 5).map((t) => '<div class="li">' + t + '</div>').join('') + '</div><div><span class="cap">Jak se připravit</span><div class="li"><b>Konzultujte předem</b> – s poskytovatelem nebo MAS</div><div class="li"><b>Mějte projekt v šuplíku</b> – výzvy bývají krátké</div></div></div>',
    '<div class="cols"><div><span class="cap">Obce jako vy</span>' + ex.map(exLink).join('') + '<a href="#/priklady" style="font-size:12px">Galerie příkladů →</a><span class="cap" style="margin-top:10px">Databáze dalších příkladů</span>' + DBS.map((d) => '<div class="li"><a href="' + d[1] + '" target="_blank" rel="noopener">' + d[0] + ' ↗</a></div>').join('') + '</div><div><span class="cap">Metodiky</span><div class="li"><a href="https://cesmod.cz/zelen-voda/" target="_blank" rel="noopener">Zeleň a voda v malých obcích ↗</a> – CESMOD</div><div class="li"><a href="' + CI2_PRUV + '" target="_blank" rel="noopener">Jak na změnu klimatu ↗</a> – CI2</div><div class="li"><a href="https://www.lifetreecheck.eu/getattachment/8cfba0dc-fc40-49a6-9954-cb9752f1584e/Jak-pripravit-obec-na-klimatickou-zmenu" target="_blank" rel="noopener">Jak připravit obec ↗</a> – Nadace Partnerství</div><a href="#/zdroje" style="font-size:12px">Všechny zdroje →</a></div></div>',
    '<div class="cols"><div><span class="cap">Co s čím propojit</span>' + tipList(zdf('Propojení', 99), 3) + '</div><div><span class="cap">Nevlastníte pozemky?</span>' + tipList(zdf('Pozemky', 99), 2) + (R.small ? '<div class="li"><b>Nemusíte psát celou strategii</b> – menší obci stačí studie adaptačního potenciálu nebo akční plán přes MAS.</div>' : '') + '</div></div>'];
  const tab = Math.min(S.tab || 0, 4);
  return top() +
  '<div style="display:flex;justify-content:space-between;align-items:flex-end;gap:20px;flex-wrap:wrap"><div class="pad" style="display:flex;flex-direction:column;gap:8px"><h1>Váš plán</h1><div class="answers">' + ans.map((a) => '<span><b>' + a[0] + '</b> ' + esc(a[1]) + '</span>').join('') + '<a href="#/q1" style="font-size:12px">změnit</a></div></div><a class="btn dark" href="#/akcni-plan">Akční plán</a></div>' +
  '<span class="pad" style="font-size:14px;font-weight:700;color:' + (S.nal === 'hori' ? 'var(--Tt)' : S.nal === 'prev' ? 'var(--Zt)' : 'var(--ink)') + '">' + (NAL[S.nal] || '') + '</span>' +
  (none ? '<span class="pad" style="font-size:13px">Nevadí, že to sami nezvládnete – mnoho obcí začínalo stejně. Začněte tím, na co stačí pár dobrovolníků, a obraťte se na MAS: pomůže bezplatně.</span>' : '') +
  '<section class="week" aria-labelledby="wk"><span id="wk" class="cap" style="color:#fff;font-weight:700">S čím začít ještě tento týden</span><div class="items">' + tt + '</div></section>' +
  helpBlock(R) +
  '<div style="display:flex;justify-content:space-between;align-items:baseline;gap:12px;flex-wrap:wrap"><h2 class="pad">Žebřík opatření</h2><div class="legend"><span><i style="background:var(--ink)"></i>zvládnete sami</span><span><i style="border:1px solid var(--ink)"></i>s pomocí</span><span><i style="border:1px dashed #8A8A8A"></i>mimo horizont</span></div></div>' +
  '<div class="ladder">' + rungs + '</div>' +
  '<div style="background:#fff"><div class="tabs" role="tablist">' + tabs.map((t, i) => '<button class="tab" role="tab" aria-selected="' + (tab === i) + '" data-act="tab" data-val="' + i + '">' + t + '</button>').join('') + '</div><div class="panel" role="tabpanel">' + panels[tab] + '</div></div>' +
  '<div class="nav"><a class="back" href="#/q5">Zpět</a></div>';
}
function vOpatreni(id){
  const m = M(id); if (!m) return top() + head('Opatření nenalezeno') + nav('#/plan');
  const kv = [['Kolik', m.ct], ['Okruh', OK[m.okr].n], ['Kdo', m.kdo || '–'], ['Kde', m.mista || '–'], ['Peníze', m.fin]];
  const sec = (t, body) => body ? '<div style="display:flex;flex-direction:column;gap:6px"><h2>' + t + '</h2>' + body + '</div>' : '';
  const ul = (a) => a && a.length ? '<ul style="margin:0;padding-left:18px;font-size:14px">' + a.map((x) => '<li>' + esc(x) + '</li>').join('') + '</ul>' : '';
  const vt = {}; m.varianty.forEach((v) => { (vt[v.q] = vt[v.q] || []).push(v); });
  const src = m.zdroje.map((z) => { let link = '<a href="' + esc(z.u) + '" target="_blank" rel="noopener">otevřít celou publikaci ↗</a>';
    if (/klimasemeni/.test(z.u) && z.kde) { const p = [...z.kde.matchAll(/(karta \d+) \(s\. (\d+)\)/g)]; if (p.length) link = p.map((x) => '<a href="' + esc(z.u) + '#page=' + x[2] + '" target="_blank" rel="noopener">' + x[1] + ', s. ' + x[2] + ' ↗</a>').join(' · '); }
    return '<div class="li"><b style="font-size:13px">' + esc(z.n) + '</b><br>' + link + '</div>'; }).join('');
  return top() + '<a href="#/plan" style="font-size:13px;align-self:flex-start;background:#fff">← zpět na plán</a>' +
  '<div class="pad" style="display:flex;flex-direction:column;gap:8px;max-width:none"><div style="display:flex;gap:8px;align-items:center"><span class="tag" style="color:' + OK[m.okr].t + '">' + OK[m.okr].n + '</span><span style="font-size:12px;padding:3px 9px;border-radius:999px;background:var(--Z);color:#fff">příčka ' + m.r + ' · ' + RN[m.r] + '</span></div><h1>' + esc(m.n) + '</h1>' + (m.popis ? '<p class="lead" style="max-width:700px">' + esc(m.popis) + '</p>' : '') + '</div>' +
  '<div class="kv">' + kv.map((x) => '<div><span>' + x[0] + '</span>' + esc(x[1]) + '</div>').join('') + '</div>' +
  '<div class="det"><div class="main">' +
    sec('Jak na to', m.kroky.length ? '<ol class="steps">' + m.kroky.map((k, i) => '<li><span>' + (i + 1) + '</span>' + esc(k) + '</li>').join('') + '</ol>' : '') +
    sec('Co přinese', ul(m.prinosy)) +
    sec('Na co si dát pozor', m.pozor ? '<p style="margin:0;font-size:14px">' + esc(m.pozor) + '</p>' : '') +
    sec('Cena a čas podle katalogu', (m.cenaKat || m.cas) ? '<p style="margin:0;font-size:14px">' + esc([m.cenaKat, m.cas].filter(Boolean).join(' · ')) + '</p>' : '') +
    sec('Kam se hodí', m.kde ? '<p style="margin:0;font-size:14px">' + esc(m.kde) + '</p>' : '') +
    sec('S čím kombinovat', ul(m.kombi)) +
    (m.varianty.length ? sec('Které řešení se hodí k vašemu místu?', '<div class="vtree">' + Object.keys(vt).map((q) => '<div><b style="font-size:13px">' + esc(q) + '</b>' + vt[q].map((v) => '<div class="li"><span class="small">' + esc(v.k) + ' →</span><br>' + esc(v.z) + '</div>').join('') + '</div>').join('') + '</div><span class="small">Podle A Tactical Guide to Urban Cooling Infrastructure (APB, 2025)</span>') : '') +
    sec('Příklady', m.priklady.length ? m.priklady.map((i) => exLink(D.ex[i])).join('') : '<p style="margin:0;font-size:14px;color:var(--muted)">Ověřený příklad z malé obce zatím hledáme.</p>') +
    sec('Text do zpravodaje', m.zpr ? '<p style="margin:0;font-size:14px;font-style:italic">„' + esc(m.zpr) + '“</p>' : '') +
    (m.katalog ? '<span class="note">Popis, přínosy a ceny převzaty z: ' + esc(m.katalog) + '. Texty k ověření.</span>' : '') +
  '</div><aside class="aside"><h2>Zdroje</h2><span class="small">Odkazy vedou na celé publikace.</span>' + src +
    (m.dotace.length ? '<h2 style="margin-top:12px">Kde hledat peníze</h2>' + m.dotace.map((d) => '<div class="li">' + (d.u && d.u !== '—' ? '<a href="' + esc(d.u) + '" target="_blank" rel="noopener">' + esc(d.n) + ' ↗</a>' : esc(d.n)) + '</div>').join('') : '') +
  '</aside></div>' + nav('#/plan');
}
function vAkcni(){
  if (!S.okr.length || !S.vel) return top() + head('Akční plán vznikne z vašich odpovědí') + '<a class="btn dark" href="#/q1" style="align-self:flex-start">Začít</a>';
  const R = compute(), rows = planRows(R);
  const kapTxt = kapTxtOf();
  const partn = []; if (rows.some((r) => r.kdo.indexOf('svépomocí') === 0)) partn.push(D.kont.K18); R.need.forEach((k) => { if (POMOC[k]) POMOC[k].slice(0, 2).forEach((id) => { if (partn.indexOf(D.kont[id]) < 0) partn.push(D.kont[id]); }); });
  const F = (t) => '<span class="fill">' + t + '</span>';
  const sec = (n, t, b) => '<section class="sec"><span class="n">' + n + '</span><div class="b"><h2>' + t + '</h2>' + b + '</div></section>';
  const kv = (a) => '<div class="kv2">' + a.map((x) => '<span class="k">' + x[0] + '</span><span>' + x[1] + '</span>').join('') + '</div>';
  const cil = {T:'náves a hřiště budou v létě stinné a lidé se tam zastaví i za vedra',V:'voda z deště zůstane v obci a přívaly nebudou ničit ulice',Z:'stromy v obci budou zdravé a o jejich péči bude jasno',K:'z polí nepoteče bahno do obce a krajina kolem bude zadržovat vodu'};
  const dataUk = {T:'Vlny veder – kolik dní je u vás tepelný stres',V:'Intersucho – jak suchá je u vás půda',Z:'soupis stromů – kolik jich máte a v jakém jsou stavu',K:'VÚMOP – kudy poteče bahno z polí'};
  const ids = rows.map((r) => r.id); const used = []; ids.forEach((id) => { const m = M(id); (m ? m.zdroje : []).slice(0, 3).forEach((z) => { if (!used.some((u) => u.u === z.u)) used.push(z); }); });
  return top().replace('<div class="top">', '<div class="top noprint">') +
  '<div class="noprint" style="display:flex;justify-content:space-between;align-items:flex-end;gap:12px;flex-wrap:wrap"><div class="pad"><h1>Váš akční plán</h1><p class="lead">Hotová šablona z vašich odpovědí. Doplňte žlutá místa a předložte ji zastupitelstvu – plán nemusí být dlouhý, musí být konkrétní.</p></div><button class="btn dark" data-act="print">Uložit jako PDF / vytisknout</button></div>' +
  '<article class="doc"><div style="display:flex;justify-content:space-between;gap:12px;flex-wrap:wrap;padding-bottom:10px"><div><div class="cap">Akční plán adaptace na změnu klimatu</div><div style="font-size:26px;font-weight:700;text-transform:uppercase">Obec ' + F('[název obce]') + '</div><div style="font-size:13px">' + S.vel + ' obyvatel · na volební období ' + F('[od–do]') + ' · schváleno zastupitelstvem dne ' + F('[datum]') + ', usnesení č. ' + F('[…]') + '</div></div></div>' +
  sec(1, 'Výchozí situace', kv([['Hlavní problém', R.okr.map((k) => OK[k].n).join(' a ')], ['Naléhavost', NALN[S.nal] + ' – ' + NAL[S.nal].split(' – ').pop()], ['Co zvládneme sami', kapTxt + ' · na první kroky ' + BUDN[S.bud]]])) +
  sec(2, 'Co říkají data', '<div style="font-size:13px">' + R.okr.map((k) => '○ Ověřte v mapě: ' + dataUk[k]).join('<br>') + '</div><span class="small">Výsledky doplňte sem – pomohou i v žádosti o dotaci.</span>') +
  sec(3, 'Cíl na 3–5 let', '<span style="font-size:14px">' + R.okr.map((k) => cil[k]).join(' a ').replace(/^./, (c) => c.toUpperCase()) + '. ' + F('[upravte podle zastupitelstva]') + '</span>') +
  sec(4, 'Opatření', '<table class="plan"><thead><tr><th>Opatření</th><th>Termín</th><th>Odhad nákladů</th><th>Financování</th><th>Kdo to zvládne</th><th>Odpovídá</th><th>Jak poznáme, že to funguje</th></tr></thead><tbody>' + rows.map((r) => '<tr><td style="font-weight:700">' + esc(r.n) + '</td><td>' + r.term + '</td><td>' + r.cost + '</td><td>' + r.fin + '</td><td>' + esc(r.kdo) + '</td><td>' + F('[jméno]') + '</td><td>' + esc(r.uk) + '</td></tr>').join('') + '</tbody></table>') +
  sec(5, 'Partneři a návaznost', kv([['Koho oslovit', partn.map(esc).join(', ') || '–'], ['Navazuje na', 'strategie ORP / MAS / kraje (databaze-strategie.cz) · územní plán – při nejbližší změně · strategický plán (program rozvoje) obce']]) + (S.kap.indexOf('Z') < 0 ? '<span style="font-size:13px;color:var(--Tt)">Než plán předložíte, získejte podporu zastupitelstva – představte ho na zasedání nebo pozvěte zastupitele na procházku obcí.</span>' : '')) +
  sec(6, 'Komunikace, kontrola a vyhodnocení', kv([['Jak zapojit občany', 'Začněte malou akcí s lidmi – společná výsadba, anketa na návsi. Mluvte o horku, suchu a bahně, ne o „klimatu“.'], ['Text do zpravodaje', rows[0] && rows[0].zpr ? '<i>„' + esc(rows[0].zpr) + '“</i>' : F('[doplňte]')], ['Kontrola realizace', 'převzetí díla za účasti odborníka, záruční péče u výsadeb (min. 3 roky), kontrola po prvním létě a prvním přívalovém dešti'], ['Vyhodnocení', 'jednou ročně, před sestavením rozpočtu; odpovídá ' + F('[jméno]')]])) +
  sec(7, 'Zdroje a metodiky', '<ul style="margin:0;padding-left:18px;font-size:12px">' + used.slice(0, 8).map((z) => '<li><a href="' + esc(z.u) + '">' + esc(z.n) + '</a></li>').join('') + '<li><a href="' + CI2_MET + '">Metodika tvorby místní adaptační strategie (CI2)</a></li></ul>') +
  '<span class="small">Vygenerováno Průvodcem adaptací obecního veřejného prostoru. Struktura podle metodiky CI2 a pracovní pomůcky MŽP.</span></article>' +
  '<div class="nav noprint"><a class="back" href="#/plan">Zpět</a></div>';
}
function vPriklady(){
  const f = S.f; const VEL = ['vše','do 500','500–2 500','2 500–10 000']; const OKS = ['vše','T','V','Z','K','S']; const RS = ['vše','1','2','3','4'];
  const NAR = {'1':'hned, svépomocí','2':'malá úprava','3':'projekt','4':'koncepce'};
  let ex = D.ex.filter((e) => e.mala && (!f.m || f.m === 'vše' || e.m.indexOf(f.m) >= 0) && (f.vel === 'vše' || e.v === f.vel) && (f.okr === 'vše' || e.okr === f.okr) && (f.r === 'vše' || e.r === f.r));
  const sel = (lab, key, opts, name) => '<label>' + lab + '<select data-f="' + key + '">' + opts.map((o) => '<option value="' + o + '"' + (f[key] === o ? ' selected' : '') + '>' + (name ? name(o) : o) + '</option>').join('') + '</select></label>';
  return top() + head('Tady se to povedlo', 'Vyberte část obce, velikost a téma. Když projdete průvodce, vybereme obce jako ta vaše sami.') +
  '<div class="filters">' + sel('Část obce', 'm', ['vše'].concat(D.mista.filter((x) => D.ex.some((e) => e.mala && e.m.indexOf(x.id) >= 0)).map((x) => x.id)), (o) => o === 'vše' ? 'všechna místa' : D.mista.find((x) => x.id === o).n + ' (' + D.ex.filter((e) => e.mala && e.m.indexOf(o) >= 0).length + ')') + sel('Velikost obce', 'vel', VEL, (o) => o === 'vše' ? 'všechny' : o + ' ob.') + sel('Téma', 'okr', OKS, (o) => o === 'vše' ? 'vše' : OK[o].n) + sel('Náročnost', 'r', RS, (o) => o === 'vše' ? 'vše' : NAR[o]) + (S.okr.length && S.vel ? '<button class="link" data-act="fmine">podle mých odpovědí</button>' : '') + '<span class="small" style="padding-bottom:10px">' + ex.length + ' příkladů</span></div>' +
  '<div class="rows">' + ex.map((e) => '<a class="ex" href="#/priklad/' + e.i + '"><span class="d" style="background:' + OK[e.okr].c + '" aria-hidden="true"></span><span class="o">' + esc(e.o) + ' <span>· ' + e.p + ' ob.</span><br><span class="small" style="font-weight:400">' + mN(e) + '</span></span><span class="t">' + esc(e.t) + '<br><span class="small">' + esc(snip(e.co.replace(/^Adaptační opatření:\s*/, ''))) + '</span></span><span class="n">' + (NAR[e.r] || '') + '<br>' + e.zdr.length + (e.zdr.length === 1 ? ' zdroj' : e.zdr.length < 5 ? ' zdroje' : ' zdrojů') + ' →</span></a>').join('') + (ex.length ? '' : '<div class="ex">Pro tuto kombinaci zatím příklad nemáme.</div>') + '</div>' +
  '<div style="display:flex;flex-direction:column;gap:6px"><h2>Další příklady dobré praxe</h2><div class="cols4">' + DBS.map(dbLi).join('') + '</div></div>' +
  '<span class="small">Příklady z publikací CESMOD, Nadace Partnerství, Cena za krajinu a dalších · <a href="#/zdroje">zdroje</a></span>' + nav(S.okr.length ? '#/plan' : '#/');
}
const DBS = [['Adapterra Awards – databáze příkladů','https://www.adapterraawards.cz/databaze','adaptace v obcích, městech i krajině'],['Cena za krajinu','https://cenazakrajinu.cz/','zadržování vody v krajině, Jihomoravský kraj'],['DO PARKU – projekty','https://doparku.cz/projekty/','parky, návsi, školní zahrady, krajina'],['ČKA – architektonické soutěže','https://www.cka.cz/souteze','soutěže na náměstí, návsi a parky']];
function dbLi(d){ return '<div class="li"><a href="' + d[1] + '" target="_blank" rel="noopener">' + d[0] + ' ↗</a><br><span class="small">' + d[2] + '</span></div>'; }
function mN(e){ return e.m.map((id) => (D.mista.find((x) => x.id === id) || {}).n).filter(Boolean).join(', '); }
function fmtCo(t){ const parts = esc(t).split(/\s(?=(?:Adaptační opatření|Souvislosti):)/); return parts.map((x) => '<p style="margin:0;font-size:15px;max-width:680px">' + x.replace(/^(Adaptační opatření|Souvislosti):/, '<b>$1:</b>') + '</p>').join(''); }
function snip(t){ const f = String(t).split(/(?<=[.;])\s/)[0]; return f.length > 150 ? f.slice(0, 147).replace(/\s\S*$/, '') + '…' : f; }
function exLink(e){ return '<div class="li"><a href="#/priklad/' + e.i + '"><b>' + esc(e.o) + '</b> · ' + e.p + ' ob. – ' + esc(e.t) + ' →</a></div>'; }
function vPriklad(i){
  const e = D.ex[+i]; if (!e) return top() + head('Příklad nenalezen') + nav('#/priklady');
  const NAR = {'1':'hned, svépomocí','2':'malá úprava','3':'projekt','4':'koncepce'};
  const kv = [['Místo', mN(e) || '–'], ['Obec', esc(e.o) + (e.kraj ? ' · ' + esc(e.kraj) : '')], ['Obyvatel', e.p + ' (' + e.v + ')'], ['Téma', OK[e.okr].n], ['Náročnost', NAR[e.r] || '–']];
  const ms = e.ids.map((id) => M(id)).filter(Boolean);
  return top() + '<a href="' + (S.okr.length && S.vel ? '#/plan' : '#/priklady') + '" style="font-size:13px;align-self:flex-start;background:#fff" onclick="if(history.length>1){history.back();return false;}">← zpět</a>' +
  '<div class="pad" style="display:flex;flex-direction:column;gap:8px;max-width:none"><span class="tag" style="color:' + OK[e.okr].t + '">Tady se to povedlo · ' + OK[e.okr].n + '</span><h1>' + esc(e.o) + ': ' + esc(e.t) + '</h1></div>' +
  '<div class="kv">' + kv.map((x) => '<div><span>' + x[0] + '</span>' + x[1] + '</div>').join('') + '</div>' +
  '<div class="det"><div class="main">' +
    '<div style="display:flex;flex-direction:column;gap:6px"><h2>Co se udělalo</h2>' + fmtCo(e.co) + (e.pozn ? '<div class="note" style="font-size:13px"><b>Poznámka:</b> ' + esc(e.pozn) + '</div>' : '') + '</div>' +
    (ms.length ? '<div style="display:flex;flex-direction:column;gap:8px"><h2>Jaká opatření tu použili</h2><div class="mpills">' + ms.map((m) => '<a class="mp pomoc" href="#/opatreni/' + m.id + '">' + esc(m.n) + '</a>').join('') + '</div><span class="small">Klikněte na opatření – uvidíte, jak na to, kolik stojí a kde hledat peníze.</span></div>' : '') +
  '</div><aside class="aside"><h2>Zdroje</h2><span class="small">Kde se o příkladu dočtete víc.</span>' +
    e.zdr.map((z) => '<div class="li"><a href="' + esc(z.u) + '" target="_blank" rel="noopener">' + esc(z.n) + ' ↗</a></div>').join('') +
    '<h2 style="margin-top:12px">Další příklady dobré praxe</h2>' + DBS.map(dbLi).join('') +
  '</aside></div>' + nav('#/priklady');
}
function vZdroje(){
  const z = D.zdroje;
  const key = (r, k) => r[Object.keys(r).find((x) => x.indexOf(k) === 0)];
  return top() + head('Z čeho průvodce vychází', 'Každý odkaz vede na celou publikaci, u webových databází na jejich úvodní stránku.') +
  '<div class="zdroje"><ol>' + z.map((r, i) => '<li><span style="flex:0 0 24px;color:var(--muted);font-size:12px;text-align:right">' + (i + 1) + '</span><span><a href="' + esc(key(r, 'Odkaz')) + '" target="_blank" rel="noopener" style="font-weight:700;font-size:13px">' + esc(key(r, 'Plný název')) + ' ↗</a><br><span class="small">' + esc(key(r, 'K čemu') || '') + '</span></span></li>').join('') + '</ol></div>' + nav('#/');
}

/* ---------- směrování a události ---------- */
function render(){
  if (!D) return;
  const h = (location.hash || '#/').slice(1);
  let html;
  if (h === '/' || h === '') html = vIntro();
  else if (h === '/q1') html = vQ1(); else if (h === '/q2') html = vQ2(); else if (h === '/q2a') html = vQ2a(); else if (h === '/q2b') html = vQ2b();
  else if (h === '/q3') html = vQ3(); else if (h === '/q4') html = vQ4(); else if (h === '/q5') html = vQ5();
  else if (h === '/plan') html = vPlan(); else if (h.indexOf('/opatreni/') === 0) html = vOpatreni(h.split('/')[2]);
  else if (h === '/akcni-plan') html = vAkcni(); else if (h.indexOf('/priklad/') === 0) html = vPriklad(h.split('/')[2]); else if (h === '/priklady') html = vPriklady(); else if (h === '/zdroje') html = vZdroje();
  else html = vIntro();
  app.innerHTML = html;
  const t = app.querySelector('h1'); document.title = (t ? t.textContent + ' – ' : '') + 'Průvodce adaptací obecního veřejného prostoru';
  try { parent.postMessage({pruvodceHeight: document.documentElement.scrollHeight}, '*'); } catch (e) {}
}
let lastHash = location.hash;
window.addEventListener('hashchange', () => { render(); if (location.hash.split('/')[1] !== (lastHash || '').split('/')[1]) window.scrollTo(0, 0); lastHash = location.hash; const h1 = app.querySelector('h1'); if (h1) { h1.setAttribute('tabindex', '-1'); h1.focus({preventScroll: true}); } });
app.addEventListener('click', (e) => {
  const go = e.target.closest('[data-go]'); if (go && !go.disabled) { location.hash = '#/' + go.dataset.go; return; }
  const b = e.target.closest('[data-act]'); if (!b) return;
  const a = b.dataset.act, v = b.dataset.val;
  if (a === 'vel') set({vel: v});
  else if (a === 'okr') set({okr: [v]});
  else if (a === 'priz') set({priz: toggle(S.priz, v)});
  else if (a === 'ago') { const ao = scoreA().ao; S.okr = ao; if (S.priz.length >= 5) S.nal = 'hori'; save(); location.hash = '#/q3'; }
  else if (a === 'mapv') { const mv = Object.assign({}, S.mapv); mv[b.dataset.map] = v; set({mapv: mv}); }
  else if (a === 'bgo') { S.okr = v.split(','); save(); location.hash = '#/q3'; }
  else if (a === 'nal') set({nal: v});
  else if (a === 'kap') set({kap: toggle(S.kap, v), kapTouched: true});
  else if (a === 'none') set({kap: S.kap.indexOf('Z') >= 0 ? ['Z'] : [], kapTouched: true});
  else if (a === 'bud') set({bud: v});
  else if (a === 'kdo') set({kdo: v, kap: kapOf(v, S.zast)});
  else if (a === 'zast') set({zast: v, kap: kapOf(S.kdo, v)});
  else if (a === 'hl') set({hl: S.hl === v ? null : v});
  else if (a === 'hor') set({hor: {KR:['KR'], OB:['KR','OB'], NAD:['KR','OB','NAD']}[v]});
  else if (a === 'tab') set({tab: +v});
  else if (a === 'open') { const o = Object.assign({}, S.open); o[v] = !o[v]; set({open: o}); }
  else if (a === 'print') window.print();
  else if (a === 'fmine') set({f: {vel: S.vel, okr: S.okr[0], r: 'vše', m: 'vše'}});
});
app.addEventListener('change', (e) => { const s = e.target.closest('[data-f]'); if (s) { const f = Object.assign({}, S.f); f[s.dataset.f] = s.value; set({f}); } });
fetch('data/pruvodce.json').then((r) => r.json()).then((d) => { D = d; render(); }).catch(() => { app.innerHTML = '<p style="padding:40px">Data průvodce se nepodařilo načíst. Zkuste stránku obnovit.</p>'; });
})();
