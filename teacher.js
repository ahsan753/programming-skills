/* ============================================================
   TEACHER DASHBOARD — loaded only for teacher logins (openTeacher in app.js).
   Read-only: it fetches every student's profile and progress row (the database
   lets only teacher logins do this) and works out the numbers with the SAME
   functions the student site uses (xpTotal, skillPct, stageDone…), so a
   student's figures always match what they see.
   Routes: #teacher · #teacher/student/<id> · #teacher/questions
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
const S = {roster:null, loadedAt:0, loading:null, error:null, sort:store.get("ps-teacher-sort",{key:"name",dir:1})};
const DAY = 864e5;
async function load(force){
  if (!force && S.roster && Date.now()-S.loadedAt < 120000) return;
  if (S.loading) return S.loading;
  S.loading = (async()=>{
    try {
      const [people, rows] = await Promise.all([
        CLOUD.teacherGet("students?select=id,username,display_name,class_name,is_teacher&order=display_name.asc"),
        CLOUD.teacherGet("progress?select=user_id,data,updated_at")
      ]);
      const byId = new Map((rows||[]).map(r=>[r.user_id, r]));
      S.roster = (people||[]).filter(p=>!p.is_teacher && !/^test\./.test(p.username)).map(p=>{
        const row = byId.get(p.id), prog = cleanProgress(row ? row.data : {});
        const updated = row && row.updated_at ? new Date(row.updated_at) : null;
        return {id:p.id, username:p.username, name:p.display_name || p.username, cls:p.class_name || "No class",
                hasRow:!!row, updated, prog, st:stats(prog)};
      });
      S.loadedAt = Date.now(); S.error = null;
    } catch(e){
      S.error = /signed out/.test(e.message) ? "You've been signed out. Sign in again to see the dashboard." : "Couldn't load student data. Check your internet connection and try Refresh. (If it keeps failing, the Supabase project may be paused: restore it from the Supabase dashboard.)";
    } finally { S.loading = null; }
  })();
  return S.loading;
}

// Run the student site's own progress functions against one student's saved progress.
function withProg(prog, fn){ const keep = PROG; PROG = prog; try { return fn(); } finally { PROG = keep; } }
function stats(prog){
  return withProg(prog, ()=>{
    const skills = {};
    let pctSum = 0, done = 0;
    liveSkills().forEach(id=>{
      const s = SKILLS[id], p = P(id);
      const pct = skillPct(id), tested = testedOut(id), stages = {};
      STAGES.forEach(x=>stages[x.id] = !!stageDone(id, x.id));
      const started = p.learn || Object.values(p.att).some(n=>n>0) || Object.values(p.tries).some(n=>n>0) || Object.keys(p.check).length>0;
      const ck = s.check.reduce((a,c,i)=>{ if (c.type!=="selfmark" && p.check[i]!==undefined){ a.got+=p.check[i]; a.of+=c.marks; } return a; }, {got:0, of:0});
      const ap = s.apply.reduce((a,t)=>{ a.of+=t.marks; if (p.apply[t.id]) a.got+=p.apply[t.id].got; return a; }, {got:0, of:0});
      const state = stages.check ? "done" : tested ? "tested" : started ? "prog" : "none";
      if (stages.check || tested) done++;
      pctSum += pct;
      skills[id] = {pct, state, stages, ck, ap, practised:s.practise.filter((_,i)=>p.practise[i]).length};
    });
    const xp = xpTotal(), G = prog._game || {};
    return {xp, level:levelOf(xp), skills, done, overall:Math.round(pctSum/liveSkills().length), best:G.best||0, badges:G.badges||{}};
  });
}
const daysSince = d => d ? Math.floor((Date.now()-d.getTime())/DAY) : null;
function flagsFor(stu, median, F){
  const out = [], days = daysSince(stu.updated), href = `#teacher/student/${stu.id}`;
  if (!stu.hasRow) return [{kind:"never", text:"Never signed in", href}];
  if (days>=F.inactiveDays) out.push({kind:"inactive", text:`No activity for ${days} days`, href});
  const stuck = [], apply = [], low = [];
  liveSkills().forEach(id=>{
    const s = SKILLS[id], p = stu.prog[id], k = stu.st.skills[id];
    s.practise.forEach((q,i)=>{ if (!p.practise[i] && (p.att[i]||0)>=F.practiseTries) stuck.push(`Skill ${s.n} Practise Q${i+1} (${p.att[i]} tries)`); });
    s.apply.forEach(a=>{ const r=p.apply[a.id], n=p.tries[a.id]||0; if (n>=F.applyChecks && !(r && r.got/r.of>=0.6)) apply.push(`Skill ${s.n} “${a.title}” ${r?`${r.got}/${r.of}`:"0"} after ${n} checks`); });
    if (k.stages.check && k.ck.of && 100*k.ck.got/k.ck.of < F.checkPct) low.push(`Skill ${s.n} Checkpoint ${Math.round(100*k.ck.got/k.ck.of)}%`);
  });
  const more = (list, kind, label) => { if (list.length) out.push({kind, text: label + list.slice(0,2).join("; ") + (list.length>2?` (+${list.length-2} more)`:""), href}); };
  more(stuck, "stuck", "Stuck: "); more(apply, "apply", "Apply: "); more(low, "low", "Low: ");
  if (median!==null && median - stu.st.done >= F.behind) out.push({kind:"behind", text:`${median - stu.st.done} skills behind the class`, href});
  return out;
}

/* ---------- helpers ---------- */
const classes = () => [...new Set(S.roster.map(s=>s.cls))].sort((a,b)=>a.localeCompare(b, "en-GB", {numeric:true}));
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
    <nav class="ttabs" aria-label="Dashboard views"><a href="#teacher" class="${tab==="class"?"on":""}">Class overview</a><a href="#teacher/questions" class="${tab==="questions"?"on":""}">Question analysis</a></nav>
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

  const key = S.sort.key, dir = S.sort.dir;
  const val = s => key==="name" ? s.name.toLowerCase() : key==="active" ? (s.updated ? -s.updated.getTime() : Infinity)
    : key==="xp" ? s.st.xp : key==="done" ? s.st.done : key==="overall" ? s.st.overall : key==="flags" ? s.flags.length : s.st.skills[key] ? s.st.skills[key].pct : 0;
  const rows = [...list].sort((a,b)=>{ const x=val(a), y=val(b); return (x<y?-1:x>y?1:0)*dir || a.name.localeCompare(b.name); });
  const th = (k, label, title="") => `<th scope="col" class="${k==="name"?"tname":""}${SKILLS[k]?" sk":""}" ${key===k?`aria-sort="${dir>0?"ascending":"descending"}"`:""}><button type="button" data-sort="${k}" title="${esc(title||label)}">${label}${key===k?(dir>0?" ▲":" ▼"):""}</button></th>`;

  const cell = (s, id) => {
    const k = s.st.skills[id], sk = SKILLS[id];
    const tip = `Skill ${sk.n} ${sk.title}: ${k.pct}% · Learn ${k.stages.learn?"✓":"–"} · Practise ${k.practised}/${sk.practise.length} · Apply ${k.ap.got}/${k.ap.of} · Checkpoint ${k.ck.of?`${k.ck.got}/${k.ck.of}`:"–"}${k.state==="tested"?" · tested out":""}`;
    const txt = k.state==="done" ? "✓" : k.state==="tested" ? "⚡" : k.state==="prog" ? k.pct : "";
    return `<td class="sk st-${k.state}" style="--p:${k.pct}" title="${esc(tip)}">${txt}</td>`;
  };
  const body = rows.map(s=>{
    const d = daysSince(s.updated);
    return `<tr class="${s.hasRow?"":"never"}">
      <td class="tname"><a href="#teacher/student/${s.id}">${esc(s.name)}</a>${cls==="*"?` <span class="muted">${esc(s.cls)}</span>`:""}</td>
      <td class="${d!==null && d>=F.inactiveDays || !s.hasRow ? "late" : ""}" title="${esc(stamp(s.updated))}">${when(s.updated)}</td>
      <td>${s.hasRow ? `${s.st.level.n} · ${esc(s.st.level.title)}` : "–"}</td><td>${s.hasRow ? s.st.xp : "–"}</td>
      <td>${s.hasRow ? `${s.st.done}/${live.length}` : "–"}</td><td>${s.hasRow ? s.st.overall+"%" : "–"}</td>
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
        <thead><tr>${th("name","Student")}${th("active","Last active")}<th scope="col">Level</th>${th("xp","XP")}${th("done","Skills done","Checkpoint finished or tested out")}${th("overall","Overall")}${th("flags","🚩","Number of flags")}
        ${live.map(id=>th(id, String(SKILLS[id].n), `Skill ${SKILLS[id].n}: ${SKILLS[id].title}`)).join("")}</tr></thead>
        <tbody>${body}</tbody></table></div>
      <div class="tlegend"><span><i style="background:var(--paper)"></i>Not started</span><span><i style="background:color-mix(in srgb,var(--amber) 25%,var(--paper))"></i>In progress (%)</span><span><i style="background:var(--green-w)"></i>✓ Checkpoint done</span><span><i style="background:var(--violet-w)"></i>⚡ Tested out</span><span>Hover a cell for details.</span></div>`
      : `<p class="tempty">No students in this class yet. Add logins with <code>node students.js add</code>.</p>`}
    </section>
    <p class="muted" style="font-size:.85rem">Marks are worked out in each student's browser, so treat them as a guide rather than exam evidence. Only signed-in work appears here.</p>
  </div>`;
  wireHeader();
  document.querySelectorAll("[data-sort]").forEach(b=>b.onclick=()=>{ const k=b.dataset.sort; S.sort = {key:k, dir: S.sort.key===k ? -S.sort.dir : (k==="name"?1:-1)}; store.set("ps-teacher-sort", S.sort); renderClass(cls); $(`[data-sort="${k}"]`)?.focus(); });
  // Redraw after the change event has finished (redrawing inside it removes the focused box mid-event),
  // then reopen the settings and put focus back where it was.
  const redraw = focusSel => setTimeout(()=>{ renderClass(cls); const d=$(".tset")?.closest("details"); if (d) d.open=true; if (focusSel) $(focusSel)?.focus(); }, 0);
  document.querySelectorAll("[data-flag]").forEach(inp=>inp.onchange=()=>{ const f=flagSettings(); f[inp.dataset.flag]=Number(inp.value); store.set("ps-teacher-flags", f); redraw(`[data-flag="${inp.dataset.flag}"]`); });
  $("#tflagreset").onclick = ()=>{ store.set("ps-teacher-flags", {}); redraw("#tflagreset"); };
  const csv = $("#tcsv"); if (csv) csv.onclick = ()=>{
    const head = ["Name","Username","Class","Last active","Days since active","Level","XP","Skills done","Overall %","Flags"];
    live.forEach(id=>{ const n=SKILLS[id].n; head.push(`S${n} %`, `S${n} Apply`, `S${n} Checkpoint`); });
    const out = [head, ...rows.map(s=>{
      const r = [s.name, s.username, s.cls, s.updated ? s.updated.toISOString().slice(0,10) : "Never", s.hasRow ? daysSince(s.updated) : "",
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
      const n = p.att[i]||0, res = p.practise[i] ? (p.first[i] ? `<span class="ok">✓ First time</span>` : `<span class="ok">✓ After ${n} tries</span>`) : n ? `<span class="bad">✗ ${n} ${n===1?"try":"tries"}</span>` : `<span class="tempty">Not tried</span>`;
      return `<tr><td>Q${i+1}</td><td>${esc(q.title)}</td><td>${res}</td></tr>`;
    }).join("");
    const apply = s.apply.map(a=>{
      const r = p.apply[a.id], n = p.tries[a.id]||0, code = p.drafts[a.id], at = p.draftAt[a.id];
      const score = r ? `<span class="${pctCls(100*r.got/r.of)}">${r.got}/${r.of}</span>` : `<span class="tempty">Not checked</span>`;
      return `<tr><td>${esc(a.title)}${p.low[a.id]==="notyet"?` <span class="tchip" title="Scored 'Not yet' at some point">had “Not yet”</span>`:""}</td><td class="num">${score}</td><td class="num">${n}</td>
        <td>${code ? `<details class="tcode"><summary>View code${at?` (edited ${esc(stamp(new Date(at)))})`:""}</summary>${codeFig(code, "py")}</details>` : `<span class="tempty">No code saved</span>`}</td></tr>`;
    }).join("");
    const check = s.check.map((q,i)=>{
      const m = p.check[i];
      const res = m===undefined ? `<span class="tempty">Not answered</span>` : `<span class="${q.type==="selfmark"?"":pctCls(100*m/q.marks)}">${m}/${q.marks}</span>${q.type==="selfmark"?" <span class=\"muted\">(self-marked)</span>":""}`;
      return `<tr><td>Q${i+1}</td><td>${plain(q.prompt)}<br><span class="muted" style="font-size:.8rem">${esc(q.source==="exam-style"?"Exam-style":q.source||"")}</span></td><td class="num">${res}</td></tr>`;
    }).join("");
    const chip = k.state==="done" ? `<span class="ok">✓ Done</span>` : k.state==="tested" ? `<span class="tchip k-behind">⚡ Tested out</span>` : k.state==="prog" ? `<span class="mid">In progress</span>` : `<span class="tempty">Not started</span>`;
    return `<details class="tskill" ${open}><summary>Skill ${s.n} · ${esc(s.title)} ${chip}
        <span class="muted">Learn ${k.stages.learn?"✓":"–"} · Practise ${k.practised}/${s.practise.length} · Apply ${k.ap.got}/${k.ap.of} · Checkpoint ${k.ck.of?`${k.ck.got}/${k.ck.of}`:"–"}</span><span class="pct">${k.pct}%</span></summary>
      <div class="tbody">
        <h3 class="tsub">✏️ Practise <a class="muted" style="font-size:.8rem" href="?teacher#${sid}/practise">preview</a></h3>
        <table class="tlist"><thead><tr><th>#</th><th>Question</th><th>Result</th></tr></thead><tbody>${practise}</tbody></table>
        <h3 class="tsub">💻 Apply <a class="muted" style="font-size:.8rem" href="?teacher#${sid}/apply">preview</a></h3>
        <table class="tlist"><thead><tr><th>Task</th><th class="num">Best</th><th class="num">Checks</th><th>Code</th></tr></thead><tbody>${apply}</tbody></table>
        <h3 class="tsub">🎓 Checkpoint <a class="muted" style="font-size:.8rem" href="?teacher#${sid}/check">preview</a></h3>
        <table class="tlist"><thead><tr><th>#</th><th>Question</th><th class="num">Mark</th></tr></thead><tbody>${check}</tbody></table>
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
        <div class="tcard"><b>${stu.st.done}/${liveSkills().length}</b><small>Skills done</small></div>
        <div class="tcard"><b>${stu.st.overall}%</b><small>Overall</small></div>
        <div class="tcard"><b>🔥 ${stu.st.best}</b><small>Best streak</small></div></div>` : `<p class="tempty">This student hasn't signed in yet, so there's no progress to show.</p>`}
      ${flags.length ? `<p style="margin:6px 0 0">${flags.map(f=>`<span class="tchip k-${f.kind}">${esc(f.text)}</span>`).join(" ")}</p>` : ""}
      ${badges||fast ? `<div class="tbadges">${badges}${fast}</div>` : ""}
    </section>
    ${stu.hasRow ? skills : ""}
  </div>`;
  wireHeader();
}

/* ---------- question analysis ---------- */
function renderQuestions(cls){
  const list = inClass(cls).filter(s=>s.hasRow), items = [];
  const rowsFor = sid => {
    const s = SKILLS[sid];
    const pr = s.practise.map((q,i)=>{
      const tried = list.filter(st=>(st.prog[sid].att[i]||0)>0), solved = tried.filter(st=>st.prog[sid].practise[i]), first = tried.filter(st=>st.prog[sid].first[i]);
      const avgTries = tried.length ? (tried.reduce((n,st)=>n+st.prog[sid].att[i],0)/tried.length).toFixed(1) : "–";
      const r = {kind:"Practise", sid, label:`Q${i+1} ${q.title}`, n:tried.length, a:tried.length?Math.round(100*solved.length/tried.length):null, b:tried.length?Math.round(100*first.length/tried.length):null, c:avgTries, href:`?teacher#${sid}/practise`};
      r.score = r.b; items.push(r); return r;
    });
    const ap = s.apply.map(t=>{
      const done = list.filter(st=>st.prog[sid].apply[t.id]);
      const avg = done.length ? Math.round(done.reduce((n,st)=>n+100*st.prog[sid].apply[t.id].got/t.marks,0)/done.length) : null;
      const full = done.length ? Math.round(100*done.filter(st=>st.prog[sid].apply[t.id].got===t.marks).length/done.length) : null;
      const checks = done.length ? (done.reduce((n,st)=>n+(st.prog[sid].tries[t.id]||0),0)/done.length).toFixed(1) : "–";
      const r = {kind:"Apply", sid, label:t.title, n:done.length, a:avg, b:full, c:checks, href:`?teacher#${sid}/apply`};
      r.score = avg; items.push(r); return r;
    });
    const ck = s.check.map((q,i)=>{
      const done = list.filter(st=>st.prog[sid].check[i]!==undefined);
      const avg = done.length ? Math.round(done.reduce((n,st)=>n+100*st.prog[sid].check[i]/q.marks,0)/done.length) : null;
      const full = done.length ? Math.round(100*done.filter(st=>st.prog[sid].check[i]===q.marks).length/done.length) : null;
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
      <p class="muted">Lowest scores among questions at least ${minN} student${minN>1?"s":""} attempted. Practise uses “right first time”; Apply and Checkpoint use the average mark. Click a question to preview it.</p>
      ${hardest.length ? `<table class="tlist"><thead><tr><th>Skill</th><th>Stage</th><th>Question</th><th class="num">Students</th><th class="num">Score</th></tr></thead><tbody>${hardest.map(r=>`<tr><td>${SKILLS[r.sid].n}</td><td>${r.kind}</td><td><a href="${r.href}">${esc(r.label)}</a></td><td class="num">${r.n}</td><td class="num">${pc(r.score)}</td></tr>`).join("")}</tbody></table>` : `<p class="tempty">Not enough answers yet.</p>`}
    </section>
    ${per.map(({sid,pr,ap,ck})=>{
      const s = SKILLS[sid], any = [...pr,...ap,...ck].some(r=>r.n);
      return `<details class="tskill"><summary>Skill ${s.n} · ${esc(s.title)} <span class="muted">${any?"":"no answers yet"}</span></summary><div class="tbody">
        <h3 class="tsub">✏️ Practise</h3>${table(["Question","Tried","Solved","Right first time","Avg tries"], pr, r=>`<td class="num">${r.n}</td><td class="num">${pc(r.a)}</td><td class="num">${pc(r.b)}</td><td class="num">${r.c}</td>`)}
        <h3 class="tsub">💻 Apply</h3>${table(["Task","Checked","Avg mark","Full marks","Avg checks"], ap, r=>`<td class="num">${r.n}</td><td class="num">${pc(r.a)}</td><td class="num">${pc(r.b)}</td><td class="num">${r.c}</td>`)}
        <h3 class="tsub">🎓 Checkpoint</h3>${table(["Question","Answered","Avg mark","Full marks"], ck, r=>`<td class="num">${r.n}</td><td class="num">${pc(r.a)}</td><td class="num">${pc(r.b)}</td>`)}
      </div></details>`;
    }).join("")}
    <p class="muted" style="font-size:.85rem">Based on ${list.length} signed-in student${list.length===1?"":"s"}${cls==="*"?" in all classes":` in ${esc(cls)}`}.</p>
  </div>`;
  wireHeader();
  $("#tqcsv").onclick = ()=>{
    const out = [["Skill","Skill title","Stage","Question","Students","Solved % / Avg mark %","Right first time % / Full marks %","Avg tries / checks"]];
    items.forEach(r=>out.push([SKILLS[r.sid].n, SKILLS[r.sid].title, r.kind, r.label, r.n, r.a??"", r.b??"", r.c]));
    download(`programming-skills-questions-${fileCls(cls)}-${fileDate()}.csv`, out);
  };
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
  else renderClass(cls);
};
})();
