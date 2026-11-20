/* ============================================================
   TEACHER DASHBOARD — loaded only for teacher logins (openTeacher in app.js).
   Read-only: it fetches every student's profile and progress row (the database
   lets only teacher logins do this) and works out the numbers with the SAME
   functions the student site uses (xpTotal, skillPct, stageDone…), so a
   student's figures always match what they see.
   Routes: #teacher · #teacher/student/<id> · #teacher/questions · #teacher/history · #teacher/manage
   History (Phase 2) comes from progress_daily, which the database fills itself (002_history.sql).
   ============================================================ */
(()=>{
const CSS = `
.tdash h1{font-size:1.7rem;margin:0}
.tdash h1[tabindex="-1"]:focus{outline:none}
.ttop{display:flex;flex-wrap:wrap;align-items:center;gap:10px 14px;margin:18px 0 10px}
.ttop .spacer{flex:1}
.ttabs{display:flex;gap:6px;flex-wrap:wrap}
.ttabs a{padding:8px 14px;border-radius:12px;border:2px solid var(--rule-2);background:var(--paper);color:var(--ink);font-weight:800;text-decoration:none}
.ttabs a.on{background:var(--violet);border-color:var(--violet);color:#fff}
.tctl{display:flex;flex-wrap:wrap;align-items:center;gap:8px}
.tctl select{font:inherit;font-weight:700;padding:7px 10px;border-radius:12px;border:2px solid var(--rule-2);background:var(--paper);color:var(--ink)}
.tcards{display:grid;grid-template-columns:repeat(auto-fit,minmax(170px,1fr));gap:12px;margin-bottom:14px}
.tcard{background:var(--paper);border:2px solid var(--rule);border-radius:var(--r);padding:14px 16px;box-shadow:var(--shadow)}
.tcard b{display:block;font-size:1.7rem;line-height:1.1}
.tcard small{color:var(--ink-2);font-weight:800;text-transform:uppercase;letter-spacing:.05em;font-size:.72rem}
.tcard.warn b{color:var(--red)}
.thelp{list-style:none;padding:0;margin:8px 0 0;display:grid;gap:8px}
.thelp li{display:flex;flex-wrap:wrap;gap:6px 10px;align-items:baseline;padding:8px 10px;border-radius:12px;background:var(--wash)}
.thelp li>a{font-weight:900;min-width:150px}
.tchip{display:inline-block;font-size:.8rem;font-weight:800;padding:2px 9px;border-radius:99px;background:var(--amber-w);color:var(--ink);border:1px solid color-mix(in srgb,var(--amber) 50%,transparent)}
.tchip.k-inactive,.tchip.k-never{background:var(--red-w);border-color:color-mix(in srgb,var(--red) 45%,transparent)}
.tchip.k-behind{background:var(--blue-w);border-color:color-mix(in srgb,var(--blue) 45%,transparent)}
.tgridwrap{overflow:auto;max-height:75vh;border:2px solid var(--rule);border-radius:14px;background:var(--paper)}
table.tgrid{border-collapse:separate;border-spacing:0;font-size:.88rem;min-width:100%}
.tgrid th,.tgrid td{padding:6px 8px;border-bottom:1px solid var(--rule);white-space:nowrap;text-align:center}
.tgrid thead th{position:sticky;top:0;background:var(--wash);z-index:2;font-weight:900}
.tgrid th.tname,.tgrid td.tname{position:sticky;left:0;background:var(--paper);text-align:left;z-index:1;max-width:220px;overflow:hidden;text-overflow:ellipsis}
.tgrid thead th.tname{z-index:3;background:var(--wash)}
.tgrid td.tname a{font-weight:800}
.tgrid th button{all:unset;cursor:pointer;font-weight:900}
.tgrid th button:focus-visible{outline:2px solid var(--violet);outline-offset:2px;border-radius:4px}
.tgrid tbody tr:hover td{background:var(--wash)}
.tgrid .sk{min-width:34px;font-weight:800;font-size:.8rem;border-left:1px solid var(--rule)}
.tgrid td.st-none{color:var(--ink-3)}
.tgrid td.st-prog{background:color-mix(in srgb,var(--amber) calc(var(--p,0)*0.35%),var(--paper));}
.tgrid td.st-done{background:var(--green-w);color:var(--green-d)}
.tgrid td.st-tested{background:var(--violet-w);color:var(--violet-d)}
.tgrid td.st-catch{background:var(--orange-w);color:var(--orange-t)}
.tgrid td.pc{border-left:1px dashed var(--rule)}
.tgrid td small{font-size:.72rem;font-weight:900}
.tgrid th.tgrp{border-left:1px solid var(--rule);font-weight:900;padding-bottom:2px}
.tgrid tr.tsub th{font-size:.8rem;padding-top:2px}
.tgrid tr.never td{color:var(--ink-3)}
.tgrid td.late{color:var(--red);font-weight:800}
.tlegend{display:flex;flex-wrap:wrap;gap:6px 14px;font-size:.84rem;color:var(--ink-2);margin:8px 2px 0}
.tlegend i{display:inline-block;width:14px;height:14px;border-radius:4px;vertical-align:-2px;margin-right:4px;border:1px solid var(--rule-2)}
.tset{display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:10px;margin-top:10px}
.tset label{display:grid;gap:4px;font-weight:800;font-size:.9rem}
.tset input{font:inherit;padding:6px 8px;border-radius:10px;border:2px solid var(--rule-2);background:var(--paper);color:var(--ink);width:110px}
.tstu .meta{display:flex;flex-wrap:wrap;gap:6px 16px;color:var(--ink-2);font-weight:700}
.tbadges{display:flex;flex-wrap:wrap;gap:6px;margin-top:8px}
.tbadges span{font-size:.82rem;font-weight:800;background:var(--wash);border:1px solid var(--rule);border-radius:99px;padding:3px 10px}
details.tskill{border:2px solid var(--rule);border-radius:14px;background:var(--paper);margin-bottom:10px}
details.tskill>summary{cursor:pointer;padding:12px 14px;font-weight:800;display:flex;flex-wrap:wrap;gap:6px 12px;align-items:center}
details.tskill>summary .pct{margin-left:auto;font-weight:900}
details.tskill .tbody{padding:0 14px 14px}
table.tlist{border-collapse:collapse;width:100%;font-size:.9rem;margin:6px 0 12px}
.tlist th,.tlist td{text-align:left;padding:6px 8px;border-bottom:1px solid var(--rule);vertical-align:top}
.tlist th{font-weight:900;color:var(--ink-2);font-size:.8rem;text-transform:uppercase;letter-spacing:.04em}
.tlist td.num,.tlist th.num{text-align:right;white-space:nowrap}
.ok{color:var(--green-d);font-weight:800}.bad{color:var(--red);font-weight:800}.mid{color:var(--amber-d);font-weight:800}
.tcode summary{cursor:pointer;font-weight:800;color:var(--violet)}
.tsub{font-size:1.05rem;margin:12px 0 2px}
.tempty{color:var(--ink-3);font-style:italic}
.tact td.wk{min-width:58px;font-weight:800;background:color-mix(in srgb,var(--violet) calc(var(--d,0)*8%),var(--paper))}
.tact td.wk.zero{color:var(--ink-3);font-weight:600}
.tact tfoot td{font-weight:900;background:var(--wash);position:sticky;bottom:0}
.tchartwrap{overflow-x:auto;max-width:780px}
.tchart{width:100%;min-width:520px;height:auto;display:block;overflow:visible}
.tchart text{fill:var(--ink-2);font-size:12px;font-family:inherit;font-weight:700}
.tchart .grid{stroke:var(--rule);stroke-width:1}
.tchart .line{fill:none;stroke:var(--violet);stroke-width:2;stroke-linejoin:round;stroke-linecap:round}
.tchart .pt{fill:var(--violet);stroke:var(--paper);stroke-width:2;pointer-events:none}
.tchart .hit{fill:transparent}
.tchart .hit:hover{fill:color-mix(in srgb,var(--violet) 18%,transparent)}
.tstrip{display:flex;flex-wrap:wrap;gap:8px;margin:8px 0 4px}
.tstrip .wkg{display:flex;gap:3px}
.tstrip i{width:14px;height:14px;border-radius:4px;background:var(--wash);border:1px solid var(--rule)}
.tstrip i.on{background:var(--violet);border-color:var(--violet)}
.tstrip i.base{background:var(--violet-w);border-color:var(--violet-w)}
.tdone td.by{color:var(--ink-2);font-style:italic}
.tmsg{margin:0 0 12px;padding:10px 14px;border-radius:12px;font-weight:800;background:var(--green-w);color:var(--green-d)}
.tmsg.bad{background:var(--red-w);color:var(--red)}
.tmsg:empty{display:none}
.tform{display:flex;flex-wrap:wrap;gap:8px;align-items:end;margin-top:10px}
.tform label{display:grid;gap:4px;font-weight:800;font-size:.9rem}
.tform input,.tform select,.tadd textarea{font:inherit;padding:7px 10px;border-radius:12px;border:2px solid var(--rule-2);background:var(--paper);color:var(--ink)}
.tadd textarea{width:100%;min-height:130px;resize:vertical;box-sizing:border-box}
.tbulk{display:flex;flex-wrap:wrap;gap:8px;align-items:center;padding:8px 10px;border-radius:12px;background:var(--wash);margin-bottom:10px}
.tbulk select{font:inherit;font-weight:700;padding:6px 8px;border-radius:10px;border:2px solid var(--rule-2);background:var(--paper);color:var(--ink)}
.tacts{display:flex;flex-wrap:wrap;gap:6px}
.tgridwrap .tacts{flex-wrap:nowrap}
.tgridwrap td{white-space:nowrap}
.btn.danger{border-color:color-mix(in srgb,var(--red) 55%,transparent);color:var(--red)}
.tlogins{border-color:var(--amber)}
.tlogins td.pw{font-family:ui-monospace,Menlo,Consolas,monospace;font-weight:800;font-size:1rem}
.tslips{display:none}
@media print{
  body *{visibility:hidden !important}
  .tslips,.tslips *{visibility:visible !important}
  .tslips{display:grid !important;position:absolute;left:0;top:0;width:100%;grid-template-columns:1fr 1fr;gap:10px}
  .tslip{border:1.5px dashed #555;border-radius:8px;padding:12px 14px;break-inside:avoid;color:#000;background:#fff;font-size:12pt}
  .tslip b{font-family:ui-monospace,Menlo,Consolas,monospace;font-size:13pt}
}
`;
if (!document.getElementById("teachercss")){ const st=document.createElement("style"); st.id="teachercss"; st.textContent=CSS; document.head.appendChild(st); }

/* ---------- settings (kept in this browser) ---------- */
const FLAG_DEFAULTS = {inactiveDays:4, practiseTries:3, applyChecks:3, checkPct:60, behind:2};
const FLAG_LIMITS = {inactiveDays:[1,60], practiseTries:[2,20], applyChecks:[2,20], checkPct:[10,100], behind:[1,20]};
const store = {
  get(k, d){ try { const v=JSON.parse(localStorage.getItem(k)); return v==null ? d : v; } catch(e){ return d; } },
  set(k, v){ try { localStorage.setItem(k, JSON.stringify(v)); } catch(e){} }
};
function flagSettings(){
  const saved = store.get("ps-teacher-flags", {}), out = {};
  for (const [k,d] of Object.entries(FLAG_DEFAULTS)){
    const v = Number(saved[k]), [lo,hi] = FLAG_LIMITS[k];
    out[k] = Number.isFinite(v) && v>=lo && v<=hi ? Math.round(v) : d;
  }
  return out;
}

/* ---------- data ---------- */
const S = {roster:null, loadedAt:0, loading:null, error:null, sort:store.get("ps-teacher-sort",{key:"name",dir:1}),
           act:null, histErr:null, weekly:null, tl:new Map(), snapOld:false, snapV:false,
           classes:null, archived:[], manageErr:null, sel:new Set(), newLogins:null, msg:null};
const NO_CLASS = "No class", TEST_CLASS = "TEST";        // TEST holds the automated tests' logins: hidden here
const DAY = 864e5;

/* ---------- history (Phase 2: progress_daily, written by the database on every save) ---------- */
// Days are school days in Qatar time (UTC+3), the same as the database uses. Weeks are rolling 7-day
// blocks ending today, so "this week" is always the last 7 days.
const TZ = "Asia/Qatar", WEEKS = 8;
const ymd = d => d.toLocaleDateString("en-CA", {timeZone: TZ});
const addDays = (s, n) => { const d = new Date(s + "T00:00:00Z"); d.setUTCDate(d.getUTCDate() + n); return d.toISOString().slice(0,10); };
const dayNum = s => Date.parse(s + "T00:00:00Z") / DAY;
const shortDate = s => new Date(s + "T00:00:00Z").toLocaleDateString("en-GB", {day:"numeric", month:"short", timeZone:"UTC"});
const today = () => ymd(new Date());
const histFrom = () => addDays(today(), -7*WEEKS + 1);
const weekStarts = from => Array.from({length: WEEKS}, (_, k) => addDays(from, 7*k));
const weekLabel = w => { const end = addDays(w, 6); return `${shortDate(w)} – ${shortDate(end > today() ? today() : end)}`; };
const histMessage = e => /http 404/.test(e && e.message || "") ? "History isn't switched on yet. Run source/supabase/002_history.sql in the Supabase SQL editor."
  : "Couldn't load the history. Try Refresh.";
// Is 004_units.sql in place? Without it the database's history copy (002) drops _v and the unit objects (s1pc …),
// so a snapshot of a new-format row arrives with question-id keys (practise.p1, check.c1) but no _v. Once any
// loaded snapshot has _v, 004 is running and the note goes (older snapshots from before it are expected).
function noteSnaps(list){
  list.forEach(raw=>{
    const d = object(raw);
    if (Object.prototype.hasOwnProperty.call(d, "_v")){ S.snapV = true; return; }
    if (Object.keys(d).some(k=>{
      if (!/^s\d{1,3}$/.test(k)) return false;
      const keys = ["practise","check"].flatMap(f=>Object.keys(object(object(d[k])[f])));
      return keys.some(x=>/^[pc]\d+$/.test(x)) && !keys.some(x=>/^\d+$/.test(x));
    })) S.snapOld = true;
  });
}
const unitsNote = () => S.snapOld && !S.snapV ? `<p class="errbox" role="status" id="tno004">History isn't recording pseudocode units yet: run source/supabase/004_units.sql in Supabase.</p>` : "";
// Every page of a REST result (the API returns at most 1000 rows per request).
async function getAll(path){
  const out = [];
  for (let off = 0; ; off += 1000){
    const r = await CLOUD.teacherGet(`${path}${path.includes("?") ? "&" : "?"}limit=1000&offset=${off}`) || [];
    out.push(...r); if (r.length < 1000) return out;
  }
}
async function loadActivity(){
  const from = histFrom(), rows = await getAll(`rpc/history_activity?p_from=${from}&order=user_id,week`);
  const act = new Map();
  rows.forEach(r=>{ if (!act.has(r.user_id)) act.set(r.user_id, new Map()); act.get(r.user_id).set(r.week, {days:r.days, saves:r.saves}); });
  return {from, map: act};
}
const actFor = (stu, w) => S.act && S.act.map.get(stu.id)?.get(w) || {days:0, saves:0};
const lastWeek = () => S.act ? weekStarts(S.act.from)[WEEKS-1] : null;

async function load(force){
  if (!force && S.roster && Date.now()-S.loadedAt < 120000) return;
  if (S.loading) return S.loading;
  S.loading = (async()=>{
    try {
      const [people, rows] = await Promise.all([
        CLOUD.teacherGet("students?select=*&order=display_name.asc"),
        CLOUD.teacherGet("progress?select=user_id,data,updated_at"),
        loadActivity().then(a=>{ S.act = a; S.histErr = null; }, e=>{ S.act = null; S.histErr = histMessage(e); }),
        CLOUD.teacherGet("classes?select=name&order=name.asc").then(r=>{ S.classes = (r||[]).map(c=>c.name).filter(n=>n!==TEST_CLASS); S.manageErr = null; },
          e=>{ S.classes = null; S.manageErr = /http 404/.test(e.message) ? "Class and student management isn't switched on yet. Run source/supabase/003_manage.sql and deploy the teacher-admin function (see the README)." : "Couldn't load the class list. Try Refresh."; })
      ]);
      S.weekly = null; S.tl.clear(); S.snapOld = S.snapV = false;
      const byId = new Map((rows||[]).map(r=>[r.user_id, r]));
      const all = (people||[]).filter(p=>!p.is_teacher && !/^test\./.test(p.username)).map(p=>{
        const row = byId.get(p.id), prog = cleanProgress(row ? row.data : {});
        const updated = row && row.updated_at ? new Date(row.updated_at) : null;
        return {id:p.id, username:p.username, name:p.display_name || p.username, cls:p.class_name || NO_CLASS, realCls:p.class_name || null,
                archivedAt:p.archived_at ? new Date(p.archived_at) : null, hasRow:!!row, updated, prog, st:stats(prog)};
      });
      S.roster = all.filter(s=>!s.archivedAt);            // archived students only appear under Manage
      S.archived = all.filter(s=>s.archivedAt);
      S.loadedAt = Date.now(); S.error = null;
    } catch(e){
      S.error = /signed out/.test(e.message) ? "You've been signed out. Sign in again to see the dashboard." : "Couldn't load student data. Check your internet connection and try Refresh. (If it keeps failing, the Supabase project may be paused: restore it from the Supabase dashboard.)";
    } finally { S.loading = null; }
  })();
  return S.loading;
}

// Run the student site's own progress functions against one student's saved progress.
function withProg(prog, fn){ const keep = PROG; PROG = prog; try { return fn(); } finally { PROG = keep; } }
// "Skills done" counts Python Skills 1, 2 … only when the skill AND its pseudocode unit are finished (or tested out).
// Skill 0 is an introduction with no unit: it has its own cell but isn't counted, so an existing student who skipped
// it (it shows "Optional · done" for them) and a new student who did it compare fairly.
const countedSkills = () => liveSkills().filter(id=>!isUnit(id) && id!=="s0");
function stats(prog){
  return withProg(prog, ()=>{
    const skills = {};
    let pctSum = 0;
    liveSkills().forEach(id=>{
      const s = SKILLS[id], p = P(id);
      const pct = skillPct(id), tested = testedOut(id), stages = {};
      stagesOf(id).forEach(x=>stages[x.id] = !!stageDone(id, x.id));   // Skill 0 has no Checkpoint stage
      const fin = itemDone(id);   // the Checkpoint done; Skill 0 by its own rule (game.js)
      const ck = s.check.reduce((a,c)=>{ if (c.type!=="selfmark" && p.check[c.id]!==undefined){ a.got+=p.check[c.id]; a.of+=c.marks; } return a; }, {got:0, of:0});
      const ap = s.apply.reduce((a,t)=>{ a.of+=t.marks; if (p.apply[t.id]) a.got+=p.apply[t.id].got; return a; }, {got:0, of:0});
      const state = fin ? "done" : tested ? "tested" : hasStarted(id) ? "prog" : "none";   // hasStarted: game.js
      // Replicate tasks at 'Nearly there' or better. A unit can count as done without them, because old Checkpoint
      // answers moved into it (Ruling 11), so the teacher can see who still has to replicate.
      const rep = isUnit(id) ? {got:s.apply.filter(a=>{ const r=p.apply[a.id]; return r && r.got/r.of>=0.6; }).length, of:s.apply.length} : null;
      pctSum += pct;
      skills[id] = {pct, state, stages, ck, ap, rep, catchUp:catchUp(id), practised:s.practise.filter(q=>p.practise[q.id]).length};
    });
    const fin = id => skills[id].state==="done" || skills[id].state==="tested";
    const done = countedSkills().filter(id=>fin(id) && (!unitOf(id) || fin(unitOf(id)))).length;
    const xp = xpTotal(), G = prog._game || {};
    return {xp, level:levelOf(xp), skills, done, overall:Math.round(pctSum/liveSkills().length), best:G.best||0, badges:G.badges||{}};
  });
}
// Short column labels for the CSV: "S0", "S1 Py", "S1 Pc".
const colLabel = id => id==="s0" ? "S0" : `S${SKILLS[id].n} ${isUnit(id) ? "Pc" : "Py"}`;
// A unit counted as done whose Replicate tasks aren't all at 'Nearly there': "R0/2".
const repShort = k => k.rep && k.state==="done" && k.rep.got<k.rep.of ? `R${k.rep.got}/${k.rep.of}` : "";
const daysSince = d => d ? Math.floor((Date.now()-d.getTime())/DAY) : null;
function flagsFor(stu, median, F){
  const out = [], days = daysSince(stu.updated), href = `#teacher/student/${stu.id}`;
  if (!stu.hasRow) return [{kind:"never", text:"Never signed in", href}];
  if (days>=F.inactiveDays) out.push({kind:"inactive", text:`No activity for ${days} days`, href});
  const stuck = [], apply = [], low = [];
  liveSkills().forEach(id=>{
    const s = SKILLS[id], p = stu.prog[id], k = stu.st.skills[id];
    const name = skillName(id);   // "Skill 3" or "Skill 3 Pseudocode"
    s.practise.forEach((q,i)=>{ if (!p.practise[q.id] && (p.att[q.id]||0)>=F.practiseTries) stuck.push(`${name} Practise Q${i+1} (${p.att[q.id]} tries)`); });
    s.apply.forEach(a=>{ const r=p.apply[a.id], n=p.tries[a.id]||0; if (n>=F.applyChecks && !(r && r.got/r.of>=0.6)) apply.push(`${name} “${a.title}” ${r?`${r.got}/${r.of}`:"0"} after ${n} checks`); });
    if (k.stages.check && k.ck.of && 100*k.ck.got/k.ck.of < F.checkPct) low.push(`${name} Checkpoint ${Math.round(100*k.ck.got/k.ck.of)}%`);
  });
  const more = (list, kind, label) => { if (list.length) out.push({kind, text: label + list.slice(0,2).join("; ") + (list.length>2?` (+${list.length-2} more)`:""), href}); };
  more(stuck, "stuck", "Stuck: "); more(apply, "apply", "Apply: "); more(low, "low", "Low: ");
  if (median!==null && median - stu.st.done >= F.behind) out.push({kind:"behind", text:`${median - stu.st.done} skills behind the class`, href});
  return out;
}

/* ---------- helpers ---------- */
const classes = () => [...new Set([...S.roster.map(s=>s.cls), ...(S.classes||[])])].filter(c=>c!==TEST_CLASS).sort((a,b)=>a.localeCompare(b, "en-GB", {numeric:true}));
function currentClass(){
  const list = classes(), saved = store.get("ps-teacher-class", null);
  return saved==="*" || list.includes(saved) ? saved : (list[0] || "*");
}
const inClass = cls => S.roster.filter(s=>cls==="*" || s.cls===cls);
function median(nums){ if (!nums.length) return null; const a=[...nums].sort((x,y)=>x-y), m=a.length>>1; return a.length%2 ? a[m] : Math.round((a[m-1]+a[m])/2); }
function when(d){
  if (!d) return "Never";
  const n = daysSince(d);
  return n<=0 ? "Today" : n===1 ? "Yesterday" : `${n} days ago`;
}
const stamp = d => d ? d.toLocaleString("en-GB", {day:"numeric", month:"short", year:"numeric", hour:"2-digit", minute:"2-digit"}) : "–";
const plain = (html, n=110) => { const t = String(html).replace(/<[^>]*>/g, " ").replace(/&[a-z#0-9]+;/gi, " ").replace(/\s+/g, " ").trim(); return esc(t.length>n ? t.slice(0,n-1)+"…" : t); };
const pctCls = v => v>=80 ? "ok" : v>=60 ? "mid" : "bad";

function header(tab, cls){
  const opts = classes().map(c=>`<option value="${esc(c)}" ${c===cls?"selected":""}>${esc(c)}</option>`).join("");
  return `<div class="ttop">
    <h1>📊 Teacher dashboard</h1>
    <nav class="ttabs" aria-label="Dashboard views"><a href="#teacher" class="${tab==="class"?"on":""}">Class overview</a><a href="#teacher/questions" class="${tab==="questions"?"on":""}">Question analysis</a><a href="#teacher/history" class="${tab==="history"?"on":""}">History</a><a href="#teacher/manage" class="${tab==="manage"?"on":""}">Manage</a></nav>
    <span class="spacer"></span>
    <div class="tctl">
      <label>Class <select id="tclass"><option value="*" ${cls==="*"?"selected":""}>All classes</option>${opts}</select></label>
      <button class="btn" id="trefresh" type="button">↻ Refresh</button>
      <span class="muted" style="font-size:.85rem">Updated ${new Date(S.loadedAt).toLocaleTimeString("en-GB",{hour:"2-digit",minute:"2-digit"})}</span>
    </div></div>`;
}
function wireHeader(){
  const sel = $("#tclass"); if (sel) sel.onchange = ()=>{ store.set("ps-teacher-class", sel.value); renderTeacher(); };
  const rb = $("#trefresh"); if (rb) rb.onclick = async()=>{ rb.disabled = true; rb.textContent = "Refreshing…"; await load(true); renderTeacher(); };
}

/* ---------- CSV export (opens in Excel) ---------- */
function csvCell(v){
  let s = v==null ? "" : String(v);
  if (/^[=+\-@\t\r]/.test(s)) s = "'" + s;              // stop spreadsheet formulas in names
  return /[",\r\n]/.test(s) ? `"${s.replace(/"/g,'""')}"` : s;
}
function download(name, rows){
  const text = "﻿" + rows.map(r=>r.map(csvCell).join(",")).join("\r\n") + "\r\n";
  const a = document.createElement("a");
  a.href = URL.createObjectURL(new Blob([text], {type:"text/csv;charset=utf-8"}));
  a.download = name; document.body.appendChild(a); a.click();
  setTimeout(()=>{ URL.revokeObjectURL(a.href); a.remove(); }, 1000);
}
const fileDate = () => new Date().toISOString().slice(0,10);
const fileCls = cls => cls==="*" ? "all-classes" : cls.replace(/[^A-Za-z0-9_-]+/g, "-");

/* ---------- class overview ---------- */
function renderClass(cls){
  const F = flagSettings(), list = inClass(cls), live = liveSkills();
  const med = median(list.filter(s=>s.hasRow).map(s=>s.st.done));
  list.forEach(s=>s.flags = flagsFor(s, med, F));
  const active = list.filter(s=>s.hasRow && daysSince(s.updated)<7).length;
  const signed = list.filter(s=>s.hasRow);
  const avg = signed.length ? Math.round(signed.reduce((n,s)=>n+s.st.overall,0)/signed.length) : 0;
  const help = list.filter(s=>s.flags.length);

  const key = S.sort.key, dir = S.sort.dir, lw = lastWeek();
  const wk = s => lw ? actFor(s, lw) : null;
  const val = s => key==="name" ? s.name.toLowerCase() : key==="active" ? (s.updated ? -s.updated.getTime() : Infinity)
    : key==="week" ? (lw ? wk(s).days*1e5 + wk(s).saves : 0)
    : key==="xp" ? s.st.xp : key==="done" ? s.st.done : key==="overall" ? s.st.overall : key==="flags" ? s.flags.length : s.st.skills[key] ? s.st.skills[key].pct : 0;
  const rows = [...list].sort((a,b)=>{ const x=val(a), y=val(b); return (x<y?-1:x>y?1:0)*dir || a.name.localeCompare(b.name); });
  // span: {rows:2} for the columns beside the two-row skill headings; label may be a short "Py"/"Pc" with a full aria name.
  const th = (k, label, title="", span={}, aria="") => `<th scope="col" class="${k==="name"?"tname":""}${SKILLS[k]?" sk":""}"${span.rows?` rowspan="${span.rows}"`:""} ${key===k?`aria-sort="${dir>0?"ascending":"descending"}"`:""}><button type="button" data-sort="${k}" title="${esc(title||label)}"${aria?` aria-label="${esc(aria)}"`:""}>${label}${key===k?(dir>0?" ▲":" ▼"):""}</button></th>`;
  const two = {rows:2};
  // Skill headings: "Skill N" over a Python and a Pseudocode column (Skill 0 has only Python, so one column).
  const pyIds = live.filter(id=>!isUnit(id));
  const groupHead = pyIds.map(id=>{ const sk = SKILLS[id];
    if (id==="s0") return th(id, "0", `Skill 0: ${sk.title}`, two, `Skill 0: ${sk.title}`);
    return `<th scope="colgroup" class="tgrp" colspan="${unitOf(id)?2:1}" title="${esc(`Skill ${sk.n}: ${sk.title}`)}">Skill ${sk.n}</th>`; }).join("");
  const subHead = pyIds.filter(id=>id!=="s0").map(id=>{ const n = SKILLS[id].n, u = unitOf(id);
    return th(id, "Py", `Skill ${n} in Python: ${SKILLS[id].title}`, {}, `Skill ${n} Python`) + (u ? th(u, "Pc", `Skill ${n} in pseudocode (Unit ${n})`, {}, `Skill ${n} Pseudocode`) : ""); }).join("");

  const cell = (s, id) => {
    const k = s.st.skills[id], sk = SKILLS[id], unit = isUnit(id), rs = repShort(k);
    const tip = `${skillName(id)} ${SKILLS[baseOf(id)].title}: ${k.pct}% · Learn ${k.stages.learn?"✓":"–"} · Practise ${k.practised}/${sk.practise.length}`
      + (unit ? ` · Replicate ${k.rep.got}/${k.rep.of} task${k.rep.of===1?"":"s"} at Nearly there (${k.ap.got}/${k.ap.of} marks)` : ` · Apply ${k.ap.got}/${k.ap.of}`)
      + (k.stages.check!==undefined ? ` · Checkpoint ${k.ck.of?`${k.ck.got}/${k.ck.of}`:"–"}` : "")
      + (k.state==="tested" ? " · tested out" : "") + (k.catchUp ? " · Catch up: a later Python skill is already started" : "")
      + (rs ? " · done from old Checkpoint answers, Replicate not finished" : "");
    const txt = k.state==="done" ? (rs ? `✓ <small>${rs}</small>` : "✓") : k.state==="tested" ? "⚡" : k.catchUp ? "Catch up" : k.state==="prog" ? k.pct : "";
    return `<td class="sk st-${k.state}${k.catchUp?" st-catch":""}${unit?" pc":""}" style="--p:${k.pct}" title="${esc(tip)}">${txt}</td>`;
  };
  const body = rows.map(s=>{
    const d = daysSince(s.updated);
    return `<tr class="${s.hasRow?"":"never"}">
      <td class="tname"><a href="#teacher/student/${s.id}">${esc(s.name)}</a>${cls==="*"?` <span class="muted">${esc(s.cls)}</span>`:""}</td>
      <td class="${d!==null && d>=F.inactiveDays || !s.hasRow ? "late" : ""}" title="${esc(stamp(s.updated))}">${when(s.updated)}</td>
      <td title="${lw ? esc(`${wk(s).days} of the last 7 days active, ${wk(s).saves} saves`) : "History not available"}">${lw ? `${wk(s).days}/7` : "–"}</td>
      <td>${s.hasRow ? `${s.st.level.n} · ${esc(s.st.level.title)}` : "–"}</td><td>${s.hasRow ? s.st.xp : "–"}</td>
      <td>${s.hasRow ? `${s.st.done}/${countedSkills().length}` : "–"}</td><td>${s.hasRow ? s.st.overall+"%" : "–"}</td>
      <td>${s.flags.length ? `<span class="tchip k-${s.flags[0].kind}">${s.flags.length}</span>` : ""}</td>
      ${live.map(id=>cell(s,id)).join("")}</tr>`;
  }).join("");

  $("#app").innerHTML = `<div class="tdash">${header("class", cls)}
    <div class="tcards">
      <div class="tcard"><b>${list.length}</b><small>Students</small></div>
      <div class="tcard"><b>${active}</b><small>Active in the last 7 days</small></div>
      <div class="tcard"><b>${avg}%</b><small>Average progress</small></div>
      <div class="tcard ${help.length?"warn":""}"><b>${help.length}</b><small>Need help</small></div>
    </div>
    <section class="panel"><h2>🚩 Who needs help</h2>
      ${help.length ? `<ul class="thelp">${help.sort((a,b)=>b.flags.length-a.flags.length || a.name.localeCompare(b.name)).map(s=>`<li><a href="#teacher/student/${s.id}">${esc(s.name)}</a>${s.flags.map(f=>`<span class="tchip k-${f.kind}">${esc(f.text)}</span>`).join("")}</li>`).join("")}</ul>` : `<p>Nobody is flagged right now. 🎉</p>`}
      <details style="margin-top:10px"><summary class="muted" style="cursor:pointer;font-weight:800">Adjust when students are flagged</summary>
        <div class="tset">
          <label>No activity for (days)<input type="number" data-flag="inactiveDays" value="${F.inactiveDays}" min="1" max="60"></label>
          <label>Practise tries without solving<input type="number" data-flag="practiseTries" value="${F.practiseTries}" min="2" max="20"></label>
          <label>Apply checks, still below 60%<input type="number" data-flag="applyChecks" value="${F.applyChecks}" min="2" max="20"></label>
          <label>Checkpoint below (%)<input type="number" data-flag="checkPct" value="${F.checkPct}" min="10" max="100"></label>
          <label>Skills behind the class median<input type="number" data-flag="behind" value="${F.behind}" min="1" max="20"></label>
        </div>
        <p><button class="btn small" type="button" id="tflagreset">Reset to defaults</button></p>
      </details>
    </section>
    <section class="panel"><div class="ttop" style="margin:0 0 10px"><h2 style="margin:0">Progress by skill</h2><span class="spacer"></span><button class="btn" type="button" id="tcsv">⬇ Download class grid (Excel/CSV)</button></div>
      ${list.length ? `<div class="tgridwrap"><table class="tgrid"><caption class="sr-only">Progress for each student and skill</caption>
        <thead><tr class="tgh">${th("name","Student","",two)}${th("active","Last active","",two)}${th("week","Last 7 days","Days active in the last 7 days",two)}<th scope="col" rowspan="2">Level</th>${th("xp","XP","",two)}${th("done","Skills done","Skills 1 onwards where the Python skill and its pseudocode unit are both finished (or tested out). Skill 0 isn't counted.",two)}${th("overall","Overall","",two)}${th("flags","🚩","Number of flags",two)}
        ${groupHead}</tr><tr class="tsub">${subHead}</tr></thead>
        <tbody>${body}</tbody></table></div>
      <div class="tlegend"><span><b>Py</b> Python skill · <b>Pc</b> its pseudocode unit</span><span><i style="background:var(--paper)"></i>Not started</span><span><i style="background:color-mix(in srgb,var(--amber) 25%,var(--paper))"></i>In progress (%)</span><span><i style="background:var(--green-w)"></i>✓ Checkpoint done</span><span><i style="background:var(--violet-w)"></i>⚡ Tested out</span><span><i style="background:var(--orange-w)"></i>Catch up: unit left behind</span><span><b>R1/2</b> unit done from old answers, Replicate tasks still to do</span><span>Hover a cell for details.</span></div>`
      : `<p class="tempty">No students in this class yet. Add logins with <code>node students.js add</code>.</p>`}
    </section>
    <p class="muted" style="font-size:.85rem">Marks are worked out in each student's browser, so treat them as a guide rather than exam evidence. Only signed-in work appears here.</p>
  </div>`;
  wireHeader();
  // The second heading row (Py / Pc) sticks just below the first.
  const grp = $(".tgrid thead th.tgrp");
  const stickSub = () => { const g2 = $(".tgrid thead th.tgrp"); if (g2) document.querySelectorAll(".tgrid thead tr.tsub th").forEach(t=>t.style.top = g2.offsetHeight + "px"); };
  if (grp) { stickSub(); if (window._stickSub) removeEventListener("resize", window._stickSub); window._stickSub = stickSub; addEventListener("resize", stickSub); }
  document.querySelectorAll("[data-sort]").forEach(b=>b.onclick=()=>{ const k=b.dataset.sort; S.sort = {key:k, dir: S.sort.key===k ? -S.sort.dir : (k==="name"?1:-1)}; store.set("ps-teacher-sort", S.sort); renderClass(cls); $(`[data-sort="${k}"]`)?.focus(); });
  // Redraw after the change event has finished (redrawing inside it removes the focused box mid-event),
  // then reopen the settings and put focus back where it was.
  const redraw = focusSel => setTimeout(()=>{ renderClass(cls); const d=$(".tset")?.closest("details"); if (d) d.open=true; if (focusSel) $(focusSel)?.focus(); }, 0);
  document.querySelectorAll("[data-flag]").forEach(inp=>inp.onchange=()=>{ const f=flagSettings(); f[inp.dataset.flag]=Number(inp.value); store.set("ps-teacher-flags", f); redraw(`[data-flag="${inp.dataset.flag}"]`); });
  $("#tflagreset").onclick = ()=>{ store.set("ps-teacher-flags", {}); redraw("#tflagreset"); };
  const csv = $("#tcsv"); if (csv) csv.onclick = ()=>{
    const head = ["Name","Username","Class","Last active","Days since active","Days active (last 7 days)","Saves (last 7 days)","Level","XP","Skills done","Overall %","Flags"];
    live.forEach(id=>{ const c=colLabel(id); head.push(`${c} %`, `${c} ${stageName(id,"apply")}`, `${c} Checkpoint`); });
    const out = [head, ...rows.map(s=>{
      const r = [s.name, s.username, s.cls, s.updated ? s.updated.toISOString().slice(0,10) : "Never", s.hasRow ? daysSince(s.updated) : "",
                 lw ? wk(s).days : "", lw ? wk(s).saves : "",
                 s.hasRow ? `${s.st.level.n} ${s.st.level.title}` : "", s.hasRow ? s.st.xp : "", s.hasRow ? s.st.done : "", s.hasRow ? s.st.overall : "", s.flags.map(f=>f.text).join("; ")];
      live.forEach(id=>{ const k=s.st.skills[id]; r.push(k.pct, `${k.ap.got}/${k.ap.of}`, k.ck.of ? `${k.ck.got}/${k.ck.of}` : ""); });
      return r;
    })];
    download(`programming-skills-${fileCls(cls)}-${fileDate()}.csv`, out);
  };
}

/* ---------- one student ---------- */
function renderStudent(id){
  const stu = S.roster.find(s=>s.id===id);
  if (!stu){ $("#app").innerHTML = `<div class="tdash">${header("", currentClass())}<section class="panel"><p>That student wasn't found. They may have been removed.</p><a class="btn" href="#teacher">← Back to the class</a></section></div>`; wireHeader(); return; }
  const F = flagSettings(), mates = S.roster.filter(s=>s.cls===stu.cls && s.hasRow);
  const flags = flagsFor(stu, median(mates.map(s=>s.st.done)), F);
  const badges = Object.entries(stu.st.badges).map(([b,d])=>{ const B=BADGES.find(x=>x.id===b); return B ? `<span title="${esc(B.desc)}">${B.icon} ${esc(B.name)} · ${esc(new Date(d).toLocaleDateString("en-GB",{day:"numeric",month:"short"}))}</span>` : ""; }).join("");
  const fast = Object.entries(stu.prog._fast||{}).filter(([,f])=>f && f.passed).map(([w,f])=>`<span>⚡ World ${esc(w)} challenge passed${f.best!=null?` (${esc(f.best)}%)`:""}</span>`).join("");

  const skills = liveSkills().map(sid=>{
    const s = SKILLS[sid], p = stu.prog[sid], k = stu.st.skills[sid];
    const open = k.state==="prog" ? "open" : "";
    const practise = s.practise.map((q,i)=>{
      const n = p.att[q.id]||0, res = p.practise[q.id] ? (p.first[q.id] ? `<span class="ok">✓ First time</span>` : `<span class="ok">✓ After ${n} tries</span>`) : n ? `<span class="bad">✗ ${n} ${n===1?"try":"tries"}</span>` : `<span class="tempty">Not tried</span>`;
      return `<tr><td>Q${i+1}</td><td>${esc(q.title)}</td><td>${res}</td></tr>`;
    }).join("");
    const apply = s.apply.map(a=>{
      const r = p.apply[a.id], n = p.tries[a.id]||0, code = p.drafts[a.id], at = p.draftAt[a.id];
      const score = r ? `<span class="${pctCls(100*r.got/r.of)}">${r.got}/${r.of}</span>` : `<span class="tempty">Not checked</span>`;
      return `<tr><td>${esc(a.title)}${p.low[a.id]==="notyet"?` <span class="tchip" title="Scored 'Not yet' at some point">had “Not yet”</span>`:""}</td><td class="num">${score}</td><td class="num">${n}</td>
        <td>${code ? `<details class="tcode"><summary>View code${at?` (edited ${esc(stamp(new Date(at)))})`:""}</summary>${codeFig(code, isUnit(sid)||a.lang==="pc" ? "pc" : "py")}</details>` : `<span class="tempty">No code saved</span>`}</td></tr>`;
    }).join("");
    const check = s.check.map((q,i)=>{
      const m = p.check[q.id];
      const res = m===undefined ? `<span class="tempty">Not answered</span>` : `<span class="${q.type==="selfmark"?"":pctCls(100*m/q.marks)}">${m}/${q.marks}</span>${q.type==="selfmark"?" <span class=\"muted\">(self-marked)</span>":""}`;
      return `<tr><td>Q${i+1}</td><td>${plain(q.prompt)}<br><span class="muted" style="font-size:.8rem">${esc(q.source==="exam-style"?"Exam-style":q.source||"")}</span></td><td class="num">${res}</td></tr>`;
    }).join("");
    const chip = (k.state==="done" ? `<span class="ok">✓ Done</span>` : k.state==="tested" ? `<span class="tchip k-behind">⚡ Tested out</span>` : k.state==="prog" ? `<span class="mid">In progress</span>` : `<span class="tempty">Not started</span>`)
      + (k.catchUp ? ` <span class="tchip" title="A later Python skill is already started">Catch up</span>` : "")
      + (repShort(k) ? ` <span class="tchip" title="Counted as done from old Checkpoint answers; the Replicate tasks aren't finished">Replicate ${k.rep.got}/${k.rep.of}</span>` : "");
    const ap = stageName(sid, "apply");   // "Replicate" in a unit
    return `<details class="tskill" ${open}><summary>${skillName(sid)} · ${esc(SKILLS[baseOf(sid)].title)} ${chip}
        <span class="muted">Learn ${k.stages.learn?"✓":"–"} · Practise ${k.practised}/${s.practise.length} · ${ap} ${k.ap.got}/${k.ap.of}${s.check.length ? ` · Checkpoint ${k.ck.of?`${k.ck.got}/${k.ck.of}`:"–"}` : ""}</span><span class="pct">${k.pct}%</span></summary>
      <div class="tbody">
        <h3 class="tsub">✏️ Practise <a class="muted" style="font-size:.8rem" href="?teacher#${sid}/practise">preview</a></h3>
        <table class="tlist"><thead><tr><th>#</th><th>Question</th><th>Result</th></tr></thead><tbody>${practise}</tbody></table>
        <h3 class="tsub">💻 ${ap} <a class="muted" style="font-size:.8rem" href="?teacher#${sid}/apply">preview</a></h3>
        <table class="tlist"><thead><tr><th>Task</th><th class="num">Best</th><th class="num">Checks</th><th>Code</th></tr></thead><tbody>${apply}</tbody></table>
        ${s.check.length ? `<h3 class="tsub">🎓 Checkpoint <a class="muted" style="font-size:.8rem" href="?teacher#${sid}/check">preview</a></h3>
        <table class="tlist"><thead><tr><th>#</th><th>Question</th><th class="num">Mark</th></tr></thead><tbody>${check}</tbody></table>` : ""}
      </div></details>`;
  }).join("");

  const back = currentClass();
  $("#app").innerHTML = `<div class="tdash">${header("", back)}
    <p><a href="#teacher">← Back to ${back==="*" ? "all classes" : esc(back)}</a></p>
    <section class="panel tstu">
      <h2 style="margin:0 0 6px">${esc(stu.name)}</h2>
      <div class="meta"><span>👤 ${esc(stu.username)}</span><span>🏫 ${esc(stu.cls)}</span><span title="${esc(stamp(stu.updated))}">🕒 Last active: ${when(stu.updated)}${stu.updated?` (${esc(stamp(stu.updated))})`:""}</span></div>
      ${stu.hasRow ? `<div class="tcards" style="margin-top:12px">
        <div class="tcard"><b>${stu.st.level.n}</b><small>Level · ${esc(stu.st.level.title)}</small></div>
        <div class="tcard"><b>${stu.st.xp}</b><small>XP</small></div>
        <div class="tcard" title="Skills 1 onwards with both the Python skill and its pseudocode unit finished (or tested out)"><b>${stu.st.done}/${countedSkills().length}</b><small>Skills done</small></div>
        <div class="tcard"><b>${stu.st.overall}%</b><small>Overall</small></div>
        <div class="tcard"><b>🔥 ${stu.st.best}</b><small>Best streak</small></div></div>` : `<p class="tempty">This student hasn't signed in yet, so there's no progress to show.</p>`}
      ${flags.length ? `<p style="margin:6px 0 0">${flags.map(f=>`<span class="tchip k-${f.kind}">${esc(f.text)}</span>`).join(" ")}</p>` : ""}
      ${badges||fast ? `<div class="tbadges">${badges}${fast}</div>` : ""}
    </section>
    ${stu.hasRow ? `<section class="panel" id="ttimeline" aria-live="polite"><h2>📈 Timeline</h2><p class="muted">Loading history…</p></section>` : ""}
    ${stu.hasRow ? skills : ""}
  </div>`;
  wireHeader();
  if (stu.hasRow) timeline(stu).then(html=>{ const box = $("#ttimeline"); if (box && location.hash===`#teacher/student/${id}`) box.innerHTML = html; });
}

/* ---------- history: chart, student timeline, class history ---------- */
// One-series line chart (0–100%) with dates on a true time axis. Each point has a hover/focus tooltip.
function lineChart(pts, label){
  if (!pts.length) return `<p class="tempty">No history yet.</p>`;
  const W = 760, H = 240, L = 46, R = 18, T = 14, B = 36, iw = W-L-R, ih = H-T-B;
  const x0 = dayNum(pts[0].x), x1 = dayNum(pts[pts.length-1].x);
  const X = s => L + (x1===x0 ? iw/2 : iw*(dayNum(s)-x0)/(x1-x0)), Y = v => T + ih - ih*Math.max(0, Math.min(v, 100))/100;
  const grid = [0,25,50,75,100].map(v=>`<line class="grid" x1="${L}" x2="${W-R}" y1="${Y(v)}" y2="${Y(v)}"/><text x="${L-8}" y="${Y(v)+4}" text-anchor="end">${v}%</text>`).join("");
  const n = pts.length, idx = [...new Set(n<=3 ? pts.map((_,i)=>i) : [0, Math.round((n-1)/2), n-1])];
  const xl = idx.map(i=>`<text x="${X(pts[i].x).toFixed(1)}" y="${H-12}" text-anchor="${n===1?"middle":i===0?"start":i===n-1?"end":"middle"}">${esc(shortDate(pts[i].x))}</text>`).join("");
  const line = n>1 ? `<path class="line" d="${pts.map((p,i)=>`${i?"L":"M"}${X(p.x).toFixed(1)},${Y(p.y).toFixed(1)}`).join("")}"/>` : "";
  const dots = pts.map(p=>{ const cx = X(p.x).toFixed(1), cy = Y(p.y).toFixed(1);
    return `<circle class="hit" cx="${cx}" cy="${cy}" r="11" tabindex="0" role="img" aria-label="${esc(p.tip)}"><title>${esc(p.tip)}</title></circle>${n<=60?`<circle class="pt" cx="${cx}" cy="${cy}" r="4"/>`:""}`; }).join("");
  return `<div class="tchartwrap"><svg class="tchart" viewBox="0 0 ${W} ${H}" role="group" aria-label="${esc(label)}">${grid}${xl}${line}${dots}</svg></div>`;
}

async function timeline(stu){
  let cached = S.tl.get(stu.id);
  if (!cached || Date.now()-cached.at > 120000){
    try {
      const rows = await getAll(`progress_daily?select=day,saves,data&user_id=eq.${encodeURIComponent(stu.id)}&order=day.asc`);
      noteSnaps(rows.map(r=>r.data));
      cached = {at: Date.now(), snaps: rows.map(r=>({day: r.day, saves: r.saves, st: stats(cleanProgress(r.data))}))};
      S.tl.set(stu.id, cached);
    } catch(e){ return `<h2>📈 Timeline</h2><p class="tempty">${esc(histMessage(e))}</p>`; }
  }
  const snaps = cached.snaps;
  if (!snaps.length) return `<h2>📈 Timeline</h2><p class="tempty">No history yet. It starts with this student's next save.</p>`;
  const base = snaps[0].saves===0 ? snaps[0].day : null;    // starting point copied at launch: earlier work has no exact date

  // Activity: the last 8 weeks, one square per day, newest on the right.
  const from = histFrom(), byDay = new Map(snaps.map(s=>[s.day, s]));
  const strip = weekStarts(from).map(w=>`<span class="wkg">${Array.from({length:7}, (_, k)=>{
      const d = addDays(w, k); if (d > today()) return "";
      const s = byDay.get(d), on = s && s.saves>0, isBase = s && s.day===base;
      return `<i class="${on?"on":isBase?"base":""}" title="${esc(`${shortDate(d)}: ${on ? `${s.saves} save${s.saves===1?"":"s"}` : isBase ? "starting point (work before history began)" : "no activity"}`)}"></i>`;
    }).join("")}</span>`).join("");
  const recent = snaps.filter(s=>s.day>=from && s.saves>0);

  // "Completed on": the first day each stage appears done.
  const firstDay = test => { const s = snaps.find(test); return s ? s.day : null; };
  const cellFor = d => d ? (d===base ? `<td class="by" title="Already done when history began">by ${esc(shortDate(d))}</td>` : `<td>${esc(shortDate(d))}</td>`) : `<td class="tempty">–</td>`;
  const doneRows = liveSkills().map(sid=>{
    const dates = STAGES.map(x=>firstDay(s=>s.st.skills[sid].stages[x.id]));
    const tested = firstDay(s=>s.st.skills[sid].state==="tested");
    if (!dates.some(Boolean) && !tested) return "";
    const ck = dates[3] ? cellFor(dates[3]) : tested ? (tested===base ? `<td class="by">⚡ tested out by ${esc(shortDate(tested))}</td>` : `<td>⚡ tested out ${esc(shortDate(tested))}</td>`) : cellFor(null);
    return `<tr><td>${skillName(sid)} · ${esc(SKILLS[baseOf(sid)].title)}</td>${dates.slice(0,3).map(cellFor).join("")}${ck}</tr>`;
  }).join("");

  const pts = snaps.map(s=>({x: s.day, y: s.st.overall, tip: `${shortDate(s.day)}: ${s.st.overall}% overall, ${s.st.xp} XP, ${s.st.done} skill${s.st.done===1?"":"s"} done${s.saves ? `, ${s.saves} save${s.saves===1?"":"s"}` : " (starting point)"}`}));
  return `<h2>📈 Timeline</h2>${unitsNote()}
    <h3 class="tsub">Activity, last ${WEEKS} weeks</h3>
    <div class="tstrip" aria-label="Days active in the last ${WEEKS} weeks">${strip}</div>
    <p class="muted" style="font-size:.85rem">${recent.length} day${recent.length===1?"":"s"} active, ${recent.reduce((n,s)=>n+s.saves,0)} saves. Each block is 7 days, newest on the right; hover a square for the date.</p>
    <h3 class="tsub">Overall progress</h3>
    ${lineChart(pts, `Overall progress of ${stu.name} over time`)}
    <h3 class="tsub">Completed on</h3>
    ${doneRows ? `<div class="tgridwrap" style="max-height:none"><table class="tlist tdone" style="margin:0"><thead><tr><th>Skill</th><th>Learn</th><th>Practise</th><th>Apply</th><th>Checkpoint</th></tr></thead><tbody>${doneRows}</tbody></table></div>` : `<p class="tempty">Nothing finished yet.</p>`}
    ${base ? `<p class="muted" style="font-size:.85rem">History began on ${esc(shortDate(base))}. “by ${esc(shortDate(base))}” means it was already done then, so the exact day isn't known.</p>` : ""}`;
}

async function loadWeekly(){
  if (S.weekly && Date.now()-S.weekly.at < 120000) return S.weekly;
  const from = histFrom(), rows = await getAll(`rpc/history_weekly?p_from=${from}&order=user_id,week`);
  const by = new Map();
  noteSnaps(rows.map(r=>r.data));
  rows.forEach(r=>{ if (!by.has(r.user_id)) by.set(r.user_id, new Map()); by.get(r.user_id).set(r.week, stats(cleanProgress(r.data)).overall); });
  return S.weekly = {at: Date.now(), from, by};
}

async function renderHistory(cls){
  $("#app").innerHTML = `<div class="tdash">${header("history", cls)}<section class="panel"><p class="muted">Loading history…</p></section></div>`;
  wireHeader();
  let wkly = null, err = S.histErr;
  if (!err) { try { wkly = await loadWeekly(); } catch(e){ err = histMessage(e); } }
  if (!location.hash.startsWith("#teacher/history")) return;
  if (err || !S.act){
    $("#app").innerHTML = `<div class="tdash">${header("history", cls)}<section class="panel"><h2>📈 History</h2><p class="errbox">${esc(err || "No history.")}</p></section></div>`;
    wireHeader(); return;
  }
  const list = inClass(cls), weeks = weekStarts(S.act.from), signed = list.filter(s=>s.hasRow);

  const totals = weeks.map(w=>list.reduce((a,s)=>{ const v = actFor(s, w); a.days += v.days; a.saves += v.saves; if (v.days) a.active++; return a; }, {days:0, saves:0, active:0}));
  // Class progress: each student's latest value by the end of each week (carried forward), averaged over
  // the same students every week (everyone in the class who has signed in), counting "not started yet" as 0%,
  // so the line only moves when work is done, not when someone new joins.
  const series = [], startKey = addDays(wkly.from, -7), n = signed.length;
  const at = (s, upto) => { const m = wkly.by.get(s.id); if (!m) return 0; let v = m.has(startKey) ? m.get(startKey) : 0; for (const w of weeks){ if (w > upto) break; if (m.has(w)) v = m.get(w); } return v; };
  const avgAt = upto => n ? Math.round(signed.reduce((a,s)=>a+at(s, upto), 0)/n) : 0;
  if (n && signed.some(s=>wkly.by.get(s.id)?.has(startKey))) series.push({x: addDays(wkly.from, -1), y: avgAt(startKey), week: null});
  if (n) weeks.forEach(w=>series.push({x: addDays(w, 6) > today() ? today() : addDays(w, 6), y: avgAt(w), week: w}));
  series.forEach(p=>p.tip = `${p.week ? `Week ${weekLabel(p.week)}` : `Before ${shortDate(wkly.from)}`}: class average ${p.y}% overall`);

  const now = totals[WEEKS-1], prev = totals[WEEKS-2];
  const rows = [...list].sort((a,b)=>a.name.localeCompare(b.name)).map(s=>`<tr class="${s.hasRow?"":"never"}"><td class="tname"><a href="#teacher/student/${s.id}">${esc(s.name)}</a>${cls==="*"?` <span class="muted">${esc(s.cls)}</span>`:""}</td>
      ${weeks.map(w=>{ const v = actFor(s, w); return `<td class="wk ${v.days?"":"zero"}" style="--d:${v.days}" title="${esc(`${s.name}, ${weekLabel(w)}: ${v.days} day${v.days===1?"":"s"} active, ${v.saves} saves`)}">${v.days}</td>`; }).join("")}</tr>`).join("");

  $("#app").innerHTML = `<div class="tdash">${header("history", cls)}${unitsNote()}
    <div class="tcards">
      <div class="tcard"><b>${now.active}</b><small>Active in the last 7 days (week before: ${prev.active})</small></div>
      <div class="tcard"><b>${now.days}</b><small>Student-days of work, last 7 days</small></div>
      <div class="tcard"><b>${now.saves}</b><small>Saves, last 7 days</small></div>
    </div>
    <section class="panel"><h2>📈 Class progress over time</h2>
      <p class="muted">The class's average overall progress at the end of each week, across the ${n} student${n===1?"":"s"} who have signed in (anyone who hadn't started yet counts as 0%). Hover a point for the figures.</p>
      ${lineChart(series, `Average overall progress over time${cls==="*"?"":` for ${cls}`}`)}
      <details style="margin-top:8px"><summary class="muted" style="cursor:pointer;font-weight:800">Show as a table</summary>
        <table class="tlist"><thead><tr><th>Week</th><th class="num">Class average overall</th><th class="num">Students active</th></tr></thead>
        <tbody>${series.map(p=>`<tr><td>${p.week ? esc(weekLabel(p.week)) : `Before ${esc(shortDate(wkly.from))}`}</td><td class="num">${p.y}%</td><td class="num">${p.week ? totals[weeks.indexOf(p.week)].active : "–"}</td></tr>`).join("")}</tbody></table>
      </details>
    </section>
    <section class="panel"><div class="ttop" style="margin:0 0 10px"><h2 style="margin:0">🗓 Days active each week</h2><span class="spacer"></span><button class="btn" type="button" id="thcsv">⬇ Download activity (Excel/CSV)</button></div>
      ${list.length ? `<div class="tgridwrap"><table class="tgrid tact"><caption class="sr-only">Days active per student in each of the last ${WEEKS} weeks</caption>
        <thead><tr><th scope="col" class="tname">Student</th>${weeks.map(w=>`<th scope="col" title="${esc(weekLabel(w))}">${esc(shortDate(w))}</th>`).join("")}</tr></thead>
        <tbody>${rows}</tbody>
        <tfoot><tr><td class="tname">Students active</td>${totals.map(t=>`<td>${t.active}</td>`).join("")}</tr></tfoot></table></div>
      <div class="tlegend"><span>Each column is 7 days, starting on the date shown; the last column is the last 7 days. Numbers are days with at least one save (0–7). Hover for saves.</span></div>`
      : `<p class="tempty">No students in this class yet.</p>`}
    </section>
    <p class="muted" style="font-size:.85rem">History is recorded by the database each time a student's progress changes, so these dates and counts can be trusted. It began when Phase 2 was switched on; earlier work counts as a starting point.</p>
  </div>`;
  wireHeader();
  const b = $("#thcsv"); if (b) b.onclick = ()=>{
    const out = [["Name","Username","Class", ...weeks.flatMap(w=>[`${weekLabel(w)} days active`, `${weekLabel(w)} saves`])]];
    [...list].sort((a,c)=>a.name.localeCompare(c.name)).forEach(s=>out.push([s.name, s.username, s.cls, ...weeks.flatMap(w=>{ const v = actFor(s, w); return [v.days, v.saves]; })]));
    download(`programming-skills-activity-${fileCls(cls)}-${fileDate()}.csv`, out);
  };
}

/* ---------- question analysis ---------- */
function renderQuestions(cls){
  const list = inClass(cls).filter(s=>s.hasRow), items = [];
  const rowsFor = sid => {
    const s = SKILLS[sid];
    const pr = s.practise.map((q,i)=>{
      const tried = list.filter(st=>(st.prog[sid].att[q.id]||0)>0), solved = tried.filter(st=>st.prog[sid].practise[q.id]), first = tried.filter(st=>st.prog[sid].first[q.id]);
      const avgTries = tried.length ? (tried.reduce((n,st)=>n+st.prog[sid].att[q.id],0)/tried.length).toFixed(1) : "–";
      const r = {kind:"Practise", sid, label:`Q${i+1} ${q.title}`, n:tried.length, a:tried.length?Math.round(100*solved.length/tried.length):null, b:tried.length?Math.round(100*first.length/tried.length):null, c:avgTries, href:`?teacher#${sid}/practise`};
      r.score = r.b; items.push(r); return r;
    });
    const ap = s.apply.map(t=>{
      const done = list.filter(st=>st.prog[sid].apply[t.id]);
      const avg = done.length ? Math.round(done.reduce((n,st)=>n+100*st.prog[sid].apply[t.id].got/t.marks,0)/done.length) : null;
      const full = done.length ? Math.round(100*done.filter(st=>st.prog[sid].apply[t.id].got===t.marks).length/done.length) : null;
      const checks = done.length ? (done.reduce((n,st)=>n+(st.prog[sid].tries[t.id]||0),0)/done.length).toFixed(1) : "–";
      const r = {kind:stageName(sid,"apply"), sid, label:t.title, n:done.length, a:avg, b:full, c:checks, href:`?teacher#${sid}/apply`};
      r.score = avg; items.push(r); return r;
    });
    const ck = s.check.map((q,i)=>{
      const done = list.filter(st=>st.prog[sid].check[q.id]!==undefined);
      const avg = done.length ? Math.round(done.reduce((n,st)=>n+100*st.prog[sid].check[q.id]/q.marks,0)/done.length) : null;
      const full = done.length ? Math.round(100*done.filter(st=>st.prog[sid].check[q.id]===q.marks).length/done.length) : null;
      const r = {kind:"Checkpoint", sid, label:`Q${i+1} ${String(q.prompt).replace(/<[^>]*>/g," ").replace(/\s+/g," ").trim().slice(0,70)}${q.type==="selfmark"?" (self-marked)":""}`, n:done.length, a:avg, b:full, c:"", href:`?teacher#${sid}/check`, self:q.type==="selfmark"};
      r.score = q.type==="selfmark" ? null : avg; items.push(r); return r;
    });
    return {pr, ap, ck};
  };
  const per = liveSkills().map(sid=>({sid, ...rowsFor(sid)}));
  const minN = Math.min(3, Math.max(1, list.length));
  const hardest = items.filter(r=>r.score!=null && r.n>=minN).sort((x,y)=>x.score-y.score || y.n-x.n).slice(0,10);
  const pc = v => v==null ? "–" : `<span class="${pctCls(v)}">${v}%</span>`;
  const table = (head, rows, cols) => rows.length ? `<table class="tlist"><thead><tr>${head.map((h,i)=>`<th class="${i?"num":""}">${h}</th>`).join("")}</tr></thead><tbody>${rows.map(r=>`<tr><td><a href="${r.href}">${esc(r.label)}</a></td>${cols(r)}</tr>`).join("")}</tbody></table>` : "";

  $("#app").innerHTML = `<div class="tdash">${header("questions", cls)}
    <section class="panel"><div class="ttop" style="margin:0 0 6px"><h2 style="margin:0">🧗 Hardest questions</h2><span class="spacer"></span><button class="btn" type="button" id="tqcsv">⬇ Download analysis (Excel/CSV)</button></div>
      <p class="muted">Lowest scores among questions at least ${minN} student${minN>1?"s":""} attempted. Practise uses “right first time”; Apply, Replicate and Checkpoint use the average mark. Click a question to preview it.</p>
      ${hardest.length ? `<table class="tlist"><thead><tr><th>Skill</th><th>Stage</th><th>Question</th><th class="num">Students</th><th class="num">Score</th></tr></thead><tbody>${hardest.map(r=>`<tr><td>${SKILLS[r.sid].n}${isUnit(r.sid)?" Pseudocode":""}</td><td>${r.kind}</td><td><a href="${r.href}">${esc(r.label)}</a></td><td class="num">${r.n}</td><td class="num">${pc(r.score)}</td></tr>`).join("")}</tbody></table>` : `<p class="tempty">Not enough answers yet.</p>`}
    </section>
    ${per.map(({sid,pr,ap,ck})=>{
      const s = SKILLS[sid], any = [...pr,...ap,...ck].some(r=>r.n);
      return `<details class="tskill"><summary>${skillName(sid)} · ${esc(SKILLS[baseOf(sid)].title)} <span class="muted">${any?"":"no answers yet"}</span></summary><div class="tbody">
        <h3 class="tsub">✏️ Practise</h3>${table(["Question","Tried","Solved","Right first time","Avg tries"], pr, r=>`<td class="num">${r.n}</td><td class="num">${pc(r.a)}</td><td class="num">${pc(r.b)}</td><td class="num">${r.c}</td>`)}
        <h3 class="tsub">💻 ${stageName(sid,"apply")}</h3>${table(["Task","Checked","Avg mark","Full marks","Avg checks"], ap, r=>`<td class="num">${r.n}</td><td class="num">${pc(r.a)}</td><td class="num">${pc(r.b)}</td><td class="num">${r.c}</td>`)}
        <h3 class="tsub">🎓 Checkpoint</h3>${table(["Question","Answered","Avg mark","Full marks"], ck, r=>`<td class="num">${r.n}</td><td class="num">${pc(r.a)}</td><td class="num">${pc(r.b)}</td>`)}
      </div></details>`;
    }).join("")}
    <p class="muted" style="font-size:.85rem">Based on ${list.length} signed-in student${list.length===1?"":"s"}${cls==="*"?" in all classes":` in ${esc(cls)}`}.</p>
  </div>`;
  wireHeader();
  $("#tqcsv").onclick = ()=>{
    const out = [["Skill","Skill title","Stage","Question","Students","Solved % / Avg mark %","Right first time % / Full marks %","Avg tries / checks"]];
    items.forEach(r=>out.push([colLabel(r.sid), SKILLS[r.sid].title, r.kind, r.label, r.n, r.a??"", r.b??"", r.c]));
    download(`programming-skills-questions-${fileCls(cls)}-${fileDate()}.csv`, out);
  };
}

/* ---------- manage classes and students (Phase 4) ----------
   Reads come from the database as usual; every change goes through CLOUD.teacherAdmin → the teacher-admin
   Edge Function, which checks the teacher login, only touches student logins and logs each action.
   New passwords are kept only in memory (S.newLogins) until "Done" or a page reload. */
const SITE_URL = "https://ahsan753.github.io/programming-skills/";
function loginsPanel(){
  const L = S.newLogins; if (!L) return "";
  const rows = L.list.map(x=>`<tr><td>${esc(x.name)}</td><td>${esc(x.cls||NO_CLASS)}</td><td>${esc(x.username)}</td><td class="pw">${esc(x.password)}</td></tr>`).join("");
  const slips = L.list.map(x=>`<div class="tslip"><div>🧩 Programming Skills · ${esc(x.cls||"")}</div><div style="font-size:14pt;font-weight:800;margin:4px 0">${esc(x.name)}</div>
      <div>Website: ${esc(SITE_URL)}</div><div>Username: <b>${esc(x.username)}</b></div><div>Password: <b>${esc(x.password)}</b></div></div>`).join("");
  return `<section class="panel tlogins"><h2>🔑 ${esc(L.title)}: shown once</h2>
    <p>Print, copy or download these now. They can't be shown again; if one gets lost, reset that student's password.</p>
    ${L.problems && L.problems.length ? `<p class="errbox">Not created: ${L.problems.map(p=>`${esc(p.name||"(blank)")}: ${esc(p.error)}`).join("; ")}</p>` : ""}
    ${L.list.length ? `<table class="tlist"><thead><tr><th>Name</th><th>Class</th><th>Username</th><th>Password</th></tr></thead><tbody>${rows}</tbody></table>
    <div class="tacts"><button class="btn primary" type="button" id="tprint">🖨 Print login slips</button><button class="btn" type="button" id="tlogcsv">⬇ Download (Excel/CSV)</button><button class="btn" type="button" id="tdone">Done: hide passwords</button></div>` : `<div class="tacts"><button class="btn" type="button" id="tdone">OK</button></div>`}
    <div class="tslips" id="tslips">${slips}</div></section>`;
}

function renderManage(cls){
  if (!S.classes){
    $("#app").innerHTML = `<div class="tdash">${header("manage", cls)}<section class="panel"><h2>⚙️ Manage classes and students</h2><p class="errbox">${esc(S.manageErr || "Not available.")}</p></section></div>`;
    wireHeader(); return;
  }
  const people = [...S.roster].filter(s=>cls==="*" || s.cls===cls).sort((a,b)=>a.name.localeCompare(b.name));
  const names = new Set(people.map(s=>s.username));
  for (const u of [...S.sel]) if (!names.has(u)) S.sel.delete(u);                      // selection only covers what's on screen
  const count = c => S.roster.filter(s=>s.realCls===c).length;
  const clsOpts = (selected, withNone=true) => (withNone ? `<option value="" ${selected===null?"selected":""}>${NO_CLASS}</option>` : "") + S.classes.map(c=>`<option value="${esc(c)}" ${c===selected?"selected":""}>${esc(c)}</option>`).join("");
  const addDefault = cls!=="*" && cls!==NO_CLASS ? cls : null;
  const label = cls==="*" ? "all classes" : cls;

  const classRows = S.classes.map(c=>`<tr><td><a href="#teacher/manage" data-pick="${esc(c)}">${esc(c)}</a></td><td class="num">${count(c)}</td>
      <td><div class="tacts"><button class="btn small" type="button" data-rename-class="${esc(c)}">Rename</button><button class="btn small danger" type="button" data-delete-class="${esc(c)}">Delete</button></div></td></tr>`).join("");
  const noClass = S.roster.filter(s=>!s.realCls).length;
  const stuRows = people.map(s=>`<tr><td><input type="checkbox" data-sel="${esc(s.username)}" aria-label="Select ${esc(s.name)}" ${S.sel.has(s.username)?"checked":""}></td>
      <td><a href="#teacher/student/${s.id}">${esc(s.name)}</a></td><td>${esc(s.username)}</td>${cls==="*"?`<td>${esc(s.cls)}</td>`:""}<td title="${esc(stamp(s.updated))}">${when(s.updated)}</td>
      <td><div class="tacts"><button class="btn small" type="button" data-reset="${esc(s.username)}">Reset password</button><button class="btn small" type="button" data-rename="${esc(s.username)}" data-name="${esc(s.name)}">Rename</button><button class="btn small danger" type="button" data-archive="${esc(s.username)}" data-name="${esc(s.name)}">Archive</button></div></td></tr>`).join("");
  const archRows = S.archived.sort((a,b)=>a.name.localeCompare(b.name)).map(s=>`<tr><td>${esc(s.name)}</td><td>${esc(s.username)}</td><td>${esc(s.cls)}</td><td>${esc(stamp(s.archivedAt))}</td>
      <td><div class="tacts"><button class="btn small" type="button" data-restore="${esc(s.username)}">Restore</button><button class="btn small danger" type="button" data-delete="${esc(s.username)}" data-name="${esc(s.name)}">Delete permanently</button></div></td></tr>`).join("");

  $("#app").innerHTML = `<div class="tdash">${header("manage", cls)}
    <p class="tmsg ${S.msg && S.msg.bad ? "bad" : ""}" id="tmsg" role="status" aria-live="polite">${S.msg ? esc(S.msg.text) : ""}</p>
    ${loginsPanel()}
    <section class="panel"><h2>🏫 Classes</h2>
      ${S.classes.length ? `<table class="tlist"><thead><tr><th>Class</th><th class="num">Students</th><th>Change</th></tr></thead><tbody>${classRows}</tbody></table>` : `<p class="tempty">No classes yet. Add one below.</p>`}
      ${noClass ? `<p class="muted">${noClass} student${noClass===1?"":"s"} in ${NO_CLASS}.</p>` : ""}
      <form class="tform" id="tnewclass"><label>New class name<input name="n" maxlength="30" required placeholder="e.g. 10C" autocomplete="off"></label><button class="btn primary" type="submit">Add class</button></form>
      <p class="muted" style="font-size:.85rem">Deleting a class moves its students to ${NO_CLASS}; their logins and work are kept.</p>
    </section>
    <section class="panel"><h2>👥 Students in ${esc(label)}</h2>
      <p class="muted" style="font-size:.85rem">Change class with the Class menu at the top. Tick students to move, reset or archive several at once.</p>
      ${people.length ? `<div class="tbulk"><b id="tselcount">${S.sel.size} selected</b>
          <label>Move to <select id="tmoveto">${clsOpts(addDefault)}</select></label><button class="btn small" type="button" id="tmove">Move</button>
          <button class="btn small" type="button" id="tresetsel">Reset passwords</button><button class="btn small danger" type="button" id="tarchsel">Archive</button></div>
        <div class="tgridwrap" style="max-height:none"><table class="tlist" style="margin:0"><thead><tr><th><input type="checkbox" id="tselall" aria-label="Select all" ${S.sel.size && S.sel.size===people.length?"checked":""}></th><th>Name</th><th>Username</th>${cls==="*"?"<th>Class</th>":""}<th>Last active</th><th>Change</th></tr></thead><tbody>${stuRows}</tbody></table></div>`
        : `<p class="tempty">No students here yet. Add them below.</p>`}
    </section>
    <section class="panel tadd"><h2>➕ Add students</h2>
      <p>One student per line. To choose a username, add it after a comma, for example <code>Ali Khan, ali.k</code>. Otherwise it's made from the name. Up to 40 at a time.</p>
      <textarea id="taddnames" aria-label="Student names, one per line" placeholder="Ali Khan&#10;Sara Lopez&#10;Tom Lee, tom.l"></textarea>
      <div class="tform"><label>Class <select id="taddcls">${clsOpts(addDefault)}</select></label><button class="btn primary" type="button" id="tadd">Create logins</button></div>
    </section>
    <section class="panel"><h2>🗄 Archived students (${S.archived.length})</h2>
      <p class="muted" style="font-size:.85rem">Archived students can't sign in or save, and don't appear in the dashboard, but their work is kept. Restore brings them back as they were. Deleting permanently removes the login, all work and history, and can't be undone.</p>
      ${S.archived.length ? `<table class="tlist"><thead><tr><th>Name</th><th>Username</th><th>Class</th><th>Archived</th><th>Change</th></tr></thead><tbody>${archRows}</tbody></table>` : `<p class="tempty">Nobody is archived.</p>`}
    </section>
  </div>`;
  S.msg = null;
  wireHeader();

  const say = (text, bad) => { const m = $("#tmsg"); if (m){ m.textContent = text; m.classList.toggle("bad", !!bad); } };
  async function run(action, body, done){
    const btns = [...document.querySelectorAll(".tdash button")]; btns.forEach(b=>b.disabled = true);
    say("Working…");
    try {
      const r = await CLOUD.teacherAdmin(action, body);
      S.msg = {text: done(r)}; S.sel.clear();
      if (r.created) S.newLogins = {title: `New login${r.created.length===1?"":"s"}`, list: r.created, problems: r.problems};
      if (r.reset) S.newLogins = {title: `New password${r.reset.length===1?"":"s"}`, list: r.reset, problems: []};
      await load(true);
    } catch(e){ S.msg = {text: e.message, bad: true}; }
    renderManage(currentClass());
    $("#tmsg")?.scrollIntoView({block: "nearest"});
  }
  const chosen = () => [...S.sel];
  const plural = (n, w) => `${n} ${w}${n===1?"":"s"}`;

  document.querySelectorAll("[data-pick]").forEach(a=>a.onclick = e=>{ e.preventDefault(); store.set("ps-teacher-class", a.dataset.pick); renderManage(a.dataset.pick); });
  $("#tnewclass").onsubmit = e=>{ e.preventDefault(); const n = e.target.n.value.trim(); if (!n) return;
    if (n.toLowerCase()===NO_CLASS.toLowerCase()) return say(`"${NO_CLASS}" is used for students without a class. Choose another name.`, true);
    run("createClass", {name: n}, ()=>`Class ${n} added.`); };
  document.querySelectorAll("[data-rename-class]").forEach(b=>b.onclick = ()=>{ const from = b.dataset.renameClass, to = (prompt(`New name for class ${from}:`, from) || "").trim();
    if (!to || to===from) return; if (to.toLowerCase()===NO_CLASS.toLowerCase()) return say(`"${NO_CLASS}" is used for students without a class.`, true);
    run("renameClass", {name: from, newName: to}, ()=>{ if (store.get("ps-teacher-class", null)===from) store.set("ps-teacher-class", to); return `Class ${from} is now ${to}.`; }); });
  document.querySelectorAll("[data-delete-class]").forEach(b=>b.onclick = ()=>{ const c = b.dataset.deleteClass, n = count(c);
    if (!confirm(`Delete class ${c}?${n ? `\n\nIts ${plural(n, "student")} will move to ${NO_CLASS}. Their logins and work are kept.` : ""}`)) return;
    run("deleteClass", {name: c}, r=>{ if (store.get("ps-teacher-class", null)===c) store.set("ps-teacher-class", "*"); return `Class ${c} deleted${r.moved ? `; ${plural(r.moved, "student")} moved to ${NO_CLASS}` : ""}.`; }); });

  const syncSel = () => { const c = $("#tselcount"); if (c) c.textContent = `${S.sel.size} selected`; const all = $("#tselall"); if (all) all.checked = S.sel.size>0 && S.sel.size===people.length; };
  document.querySelectorAll("[data-sel]").forEach(cb=>cb.onchange = ()=>{ cb.checked ? S.sel.add(cb.dataset.sel) : S.sel.delete(cb.dataset.sel); syncSel(); });
  const all = $("#tselall"); if (all) all.onchange = ()=>{ people.forEach(s=>all.checked ? S.sel.add(s.username) : S.sel.delete(s.username)); document.querySelectorAll("[data-sel]").forEach(cb=>cb.checked = all.checked); syncSel(); };
  const needSel = () => { if (!S.sel.size){ say("Tick at least one student first.", true); return false; } return true; };
  const mv = $("#tmove"); if (mv) mv.onclick = ()=>{ if (!needSel()) return; const to = $("#tmoveto").value || null;
    run("moveStudents", {usernames: chosen(), cls: to}, r=>`${plural(r.moved, "student")} moved to ${to || NO_CLASS}.`); };
  const rs = $("#tresetsel"); if (rs) rs.onclick = ()=>{ if (!needSel()) return;
    if (!confirm(`Give ${plural(S.sel.size, "student")} new passwords? Their old passwords will stop working.`)) return;
    run("resetPasswords", {usernames: chosen()}, r=>`New passwords for ${plural(r.reset.length, "student")}. Hand them out from the list below.`); };
  const as = $("#tarchsel"); if (as) as.onclick = ()=>{ if (!needSel()) return;
    if (!confirm(`Archive ${plural(S.sel.size, "student")}? They'll be signed out and can't sign in until restored. Their work is kept.`)) return;
    run("archiveStudents", {usernames: chosen()}, r=>`${plural(r.archived, "student")} archived.`); };
  document.querySelectorAll("[data-reset]").forEach(b=>b.onclick = ()=>{ const u = b.dataset.reset;
    if (!confirm(`Give ${u} a new password? The old one will stop working.`)) return;
    run("resetPasswords", {usernames: [u]}, ()=>`New password for ${u}. It's shown below.`); });
  document.querySelectorAll("[data-rename]").forEach(b=>b.onclick = ()=>{ const u = b.dataset.rename, name = (prompt(`New display name for ${u}:`, b.dataset.name) || "").trim();
    if (!name || name===b.dataset.name) return; run("renameStudent", {username: u, name}, ()=>`${u} is now shown as ${name}.`); });
  document.querySelectorAll("[data-archive]").forEach(b=>b.onclick = ()=>{ const u = b.dataset.archive;
    if (!confirm(`Archive ${b.dataset.name} (${u})? They'll be signed out and can't sign in until restored. Their work is kept.`)) return;
    run("archiveStudents", {usernames: [u]}, ()=>`${b.dataset.name} archived.`); });
  document.querySelectorAll("[data-restore]").forEach(b=>b.onclick = ()=>run("restoreStudents", {usernames: [b.dataset.restore]}, ()=>`${b.dataset.restore} restored and can sign in again with their old password.`));
  document.querySelectorAll("[data-delete]").forEach(b=>b.onclick = ()=>{ const u = b.dataset.delete;
    const typed = prompt(`Delete ${b.dataset.name} (${u}) permanently?\n\nThis removes the login, all their work and history. It can't be undone.\n\nType the username to confirm:`);
    if (typed===null) return; if (typed.trim().toLowerCase()!==u) return say("The username didn't match, so nothing was deleted.", true);
    run("deleteStudents", {usernames: [u]}, ()=>`${u} deleted permanently.`); });

  $("#tadd").onclick = ()=>{
    const lines = $("#taddnames").value.split(/\r?\n/).map(l=>l.trim()).filter(Boolean);
    if (!lines.length) return say("Type at least one name.", true);
    if (lines.length > 40) return say(`That's ${lines.length} names. Add up to 40 at a time.`, true);
    const list = lines.map(l=>{ const i = l.lastIndexOf(","); return i>0 ? {name: l.slice(0,i).trim(), username: l.slice(i+1).trim()} : {name: l}; });
    const to = $("#taddcls").value || null;
    run("addStudents", {cls: to, students: list}, r=>`${plural(r.created.length, "login")} created${r.problems.length ? `; ${r.problems.length} not created (see below)` : ""}.`);
  };
  if (S.newLogins){
    const done = $("#tdone"); if (done) done.onclick = ()=>{ if (S.newLogins.list.length && !confirm("Hide these passwords? They can't be shown again.")) return; S.newLogins = null; renderManage(cls); };
    const pr = $("#tprint"); if (pr) pr.onclick = ()=>window.print();
    const lc = $("#tlogcsv"); if (lc) lc.onclick = ()=>download(`programming-skills-logins-${fileDate()}.csv`,
      [["Name","Class","Username","Password","Website"], ...S.newLogins.list.map(x=>[x.name, x.cls||"", x.username, x.password, SITE_URL])]);
  }
}

/* ---------- entry ---------- */
window.renderTeacher = async function(){
  const parts = location.hash.slice(1).split("/");
  if (!S.roster || Date.now()-S.loadedAt >= 120000){
    if (!S.roster) $("#app").innerHTML = `<section class="panel"><p class="muted">Loading student progress…</p></section>`;
    await load();
  }
  if (!location.hash.startsWith("#teacher")) return;           // the teacher navigated away while loading
  if (S.error || !S.roster){
    $("#app").innerHTML = `<div class="tdash"><div class="ttop"><h1>📊 Teacher dashboard</h1></div><section class="panel"><p class="errbox">${esc(S.error||"No data.")}</p><button class="btn primary" id="tretry">Try again</button></section></div>`;
    $("#tretry").onclick = async()=>{ await load(true); renderTeacher(); };
    return;
  }
  const cls = currentClass();
  if (parts[1]==="student" && parts[2]) renderStudent(parts[2]);
  else if (parts[1]==="questions") renderQuestions(cls);
  else if (parts[1]==="history") renderHistory(cls);
  else if (parts[1]==="manage") renderManage(cls);
  else renderClass(cls);
};
})();
