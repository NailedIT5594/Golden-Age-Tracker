const source = window.GA_BOSSES;
const pages = [
  ['home', 'Home / Dashboard'],
  ['about', 'About the Mod'],
  ['bosses', 'Bosses & Locations'],
  ['drops', 'Drops & Rewards'],
  ['talismans', 'Hidden Talismans'],
  ['progression', 'Progression & Unlocks'],
  ['prereqs', 'Prerequisites'],
  ['areas', 'Areas'],
  ['games', 'Bosses by Original Game'],
  ['achievements', 'Achievements'],
  ['journal', 'Journey Journal'],
  ['notes', 'Notes & To-Do List'],
  ['help', 'Help / FAQ'],
  ['settings', 'Settings & Data']
];

const slug = s => String(s).toLowerCase().normalize('NFKD').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
const externalNames = new Set(['External prerequisite', 'Elden Ring prerequisite']);
const seen = new Set();
const bosses = source.filter(b => {
  if (seen.has(b.name)) return false;
  seen.add(b.name);
  return true;
}).map(b => ({
  ...b,
  id: b.stableId || slug(b.name),
  external: externalNames.has(b.game)
}));
const byName = new Map(bosses.map(b => [b.name, b]));

const tasks = [...new Set(bosses.flatMap(b => b.taskReq || []))].map(name => ({
  id: 'task-' + slug(name),
  name
}));

let data = {};
try {
  data = JSON.parse(localStorage.getItem('goldenAgeSite_v3') || '{}');
} catch {}

const defaultSettings = {
  theme: 'dark',
  accent: 'gold',
  density: 'comfortable',
  showDecorativeImages: true,
  animations: !matchMedia('(prefers-reduced-motion: reduce)').matches,
  defaultBossView: 'region',
  defaultSort: 'area',
  rewardView: 'boss',
  hideCompletedBosses: false,
  collapseCompletedTasks: true,
  includeOptionalBosses: true,
  notifyAchievements: true,
  achievementSounds: true,
  notifyMilestones: false,
  confirmDestructive: true,
  dashboardFocus: 'available',
  appearancePreset: 'golden-age',
  appearanceColors: {},
  atmosphere: 'subtle',
  backgroundImage: false,
  backgroundImageOpacity: 0.16,
  backgroundPosition: 'center',
  backgroundScale: 100,
  overlayDarkness: 82,
  backgroundBlur: 0,
  typographyPreset: 'classic-fantasy',
  baseFontSize: 15,
  headingScale: 1,
  lineSpacing: 1.55,
  letterSpacing: 0,
  contentWidth: 'standard',
  cornerStyle: 'slight',
  borderStyle: 'standard',
  shadowStyle: 'subtle',
  cardStyle: 'gradient',
  sidebarWidth: 'standard',
  navigationDensity: 'standard',
  decorativeStyle: 'restrained',
  iconStyle: 'gold-line',
  showPageEmblems: true,
  reducedMotion: false,
  hoverTransitions: true,
  progressAnimations: true,
  achievementAnimations: true,
  journalSuggestions: true
};

let settingsState = {
  ...defaultSettings,
  ...(data.preferences || {})
};

if (!data.preferences?.appearancePreset) {
  settingsState.appearancePreset = ({
    ashen: 'tarnished-silver',
    golden: 'grace-of-gold',
    contrast: 'abyssal-night'
  }[settingsState.theme] || 'golden-age');
}

let state = data.bosses || JSON.parse(localStorage.getItem('goldenAgeInteractive_v2') || '{}'),
    ext = data.external || JSON.parse(localStorage.getItem('goldenAgeInteractive_v2_external') || '{}'),
    taskState = data.tasks || {},
    times = data.timestamps || {},
    notes = data.notes || [],
    todos = data.todos || [],
    journalEntries = Array.isArray(data.journal) ? data.journal : [],
    mode = data.preferences?.mode || settingsState.defaultBossView,
    rewardStates = data.rewards || {},
    earnedAchievements = data.achievements || {},
    lastBackupAt = data.lastBackupAt || null,
    pinnedAchievements = data.pinnedAchievements || {},
    bossPins = data.bossPins || {};

if (!data.bosses && !localStorage.getItem('goldenAgeInteractive_v2')) {
  source.filter(b => b.initial).forEach(b => state['boss:' + b.name] = true);
}

if (!data.tasks) {
  for (const b of bosses) {
    (b.taskReq || []).forEach((t, i) => {
      if (state['task:' + b.name + ':' + i]) taskState['task-' + slug(t)] = true;
    });
  }
}

const mods = () => bosses.filter(b => !b.external),
      done = n => !!state['boss:' + n],
      td = n => !!taskState['task-' + slug(n)],
      met = n => byName.has(n) ? done(n) : !!ext[n],
      unknownReq = b => (b.taskReq || []).some(n => /check whether|version/i.test(n) && !td(n)),
      requirementsMet = b => (b.bossReq || []).every(met) && (b.taskReq || []).every(td),
      avail = b => !b.external && !done(b.name) && !unknownReq(b) && requirementsMet(b),
      statusOf = b => b.external ? (done(b.name) ? 'Defeated' : 'Unknown') : done(b.name) ? 'Defeated' : (b.bossReq || []).some(n => !met(n)) || (b.taskReq || []).some(n => !td(n) && !/check whether|version/i.test(n)) ? 'Locked' : unknownReq(b) ? 'Unknown' : requirementsMet(b) ? 'Available' : 'Locked';

const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
  "'": '&#39;'
}[c]));

function save() {
  if (window.GA_ACH_SYNC) window.GA_ACH_SYNC(false);
  localStorage.setItem('goldenAgeSite_v3', JSON.stringify({
    version: 3,
    bosses: state,
    external: ext,
    tasks: taskState,
    timestamps: times,
    notes,
    todos,
    journal: journalEntries,
    preferences: { ...settingsState, mode },
    rewards: rewardStates,
    achievements: earnedAchievements,
    lastBackupAt,
    pinnedAchievements,
    bossPins
  }));
  localStorage.setItem('goldenAgeInteractive_v2', JSON.stringify(state));
  localStorage.setItem('goldenAgeInteractive_v2_external', JSON.stringify(ext));
  update();
}

function update() {
  let m = mods(),
      d = m.filter(b => done(b.name)).length,
      p = m.length ? Math.round(d / m.length * 100) : 0;
  document.getElementById('progress').innerHTML = 'Boss completion ' + d + '/' + m.length + '<div class="meter"><i style="width:' + p + '%"></i></div>';
  document.getElementById('pageLabel').dataset.progress = p + '%';
}

const rewardRows = () => [...(window.GA_REWARDS || []), ...(window.GA_TALISMANS || [])];
const itemKey = r => {
  let name = String(r?.name || '').normalize('NFKC').toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim();
  return name.length >= 4 && !/^(armor|armor set|weapon|item|greatshield|shield|sword)$/.test(name) ? 'item:' + name : 'id:' + String(r?.id || '');
};

function rewardState(id) {
  let rows = rewardRows().filter(r => r.id === id);
  if (!rows.length) return rewardStates[id] || 'unknown';
  let keys = new Set(rows.map(itemKey)),
      related = rewardRows().filter(r => keys.has(itemKey(r))),
      values = related.map(r => rewardStates[r.id]).filter(Boolean);
  return values.includes('collected') ? 'collected' : values.includes('not collected') ? 'not collected' : values.includes('not applicable') ? 'not applicable' : 'unknown';
}

function setRewardState(id, value) {
  let row = rewardRows().find(r => r.id === id),
      key = row && itemKey(row);
  if (key) rewardRows().filter(r => itemKey(r) === key).forEach(r => rewardStates[r.id] = value);
  else rewardStates[id] = value;
  save();
}

const hasNoConditions = r => {
  let s = String(r.conditions ?? '').trim().toLowerCase();
  return !s || ['none', 'no conditions', 'n/a', '—', '-'].includes(s);
};

const isGuaranteedBossDrop = r => r && r.verification === 'Verified' && r.guaranteed === true && hasNoConditions(r) && !!(r.bossId || r.bossIds || r.sourceBossIds);

function applyBossDropCollection() {
  let changed = [],
      uncertain = [],
      defeated = new Set(bosses.filter(b => done(b.name)).map(b => b.id)),
      rows = window.GA_REWARDS || [],
      groups = new Map();

  for (const r of rows) {
    let key = itemKey(r);
    if (!groups.has(key)) groups.set(key, []);
    groups.get(key).push(r);
  }

  for (const group of groups.values()) {
    let linked = group.filter(isGuaranteedBossDrop).some(r => [...(Array.isArray(r.bossIds) ? r.bossIds : []), ...(Array.isArray(r.sourceBossIds) ? r.sourceBossIds : []), r.bossId].filter(Boolean).some(id => defeated.has(id)));
    if (linked && group.every(r => rewardState(r.id) === 'unknown')) {
      setRewardStateInMemory(group, 'collected');
      changed.push(...group.map(r => r.id));
    } else if (!linked && group.some(r => {
      let ids = [...(Array.isArray(r.bossIds) ? r.bossIds : []), ...(Array.isArray(r.sourceBossIds) ? r.sourceBossIds : []), r.bossId].filter(Boolean);
      return ids.some(id => defeated.has(id));
    }) && group.every(r => rewardState(r.id) !== 'collected')) {
      uncertain.push(...group.map(r => r.id));
    }
  }

  return {
    bossesProcessed: defeated.size,
    itemIds: [...new Set(changed)],
    uncertainItemIds: [...new Set(uncertain)]
  };
}

function setRewardStateInMemory(group, value) {
  for (const r of group) if (rewardState(r.id) === 'unknown') rewardStates[r.id] = value;
}

function toggle(b, v) {
  state['boss:' + b.name] = v;
  if (v && !times[b.id]) times[b.id] = new Date().toISOString();
  if (!v) delete times[b.id];
  if (v) applyBossDropCollection();
  save();
  render();
}

function task(name, v) {
  taskState['task-' + slug(name)] = v;
  save();
  render();
}

function card(b) {
  let d = done(b.name),
      a = avail(b);
  return '<article class="card ' + (d ? 'done' : '') + '"><div class="head"><input class="check" type="checkbox" aria-label="Mark ' + esc(b.name) + ' defeated" data-boss="' + esc(b.name) + '" ' + (d ? 'checked' : '') + '><div style="flex:1"><div class="name" data-detail="' + b.id + '">' + esc(b.name) + '</div><div class="small">' + esc(b.game) + ' · ' + esc(b.area) + '</div></div><button class="intel-button" data-intel="' + b.id + '">View Intel</button><span class="badge ' + (d ? 'green' : unknownReq(b) ? 'amber' : a ? '' : 'amber') + '">' + (statusOf(b)) + '</span></div><div class="body"><p><b>Location:</b> ' + esc(b.location) + '</p><p><b>Drops:</b> ' + esc(b.drops) + '</p>' + (b.external ? '<p class="small">External prerequisite · excluded from mod totals</p>' : '') + ((b.bossReq || []).length || (b.taskReq || []).length ? '<div class="reqs"><b>Prerequisites</b>' + [...(b.bossReq || []).map(n => byName.has(n) ? '<div class="req"><span class="pill">' + (met(n) ? '✓ ' : '') + 'Defeat ' + esc(n) + '</span></div>' : '<label class="req"><input type="checkbox" data-ext="' + esc(n) + '" ' + (met(n) ? 'checked' : '') + '>Defeat ' + esc(n) + ' (external)</label>'), ...(b.taskReq || []).map(n => '<label class="req"><input type="checkbox" data-task="' + esc(n) + '" ' + (td(n) ? 'checked' : '') + '>' + esc(n) + (/check whether|version/i.test(n) ? ' <b>(uncertain/version-dependent)</b>' : '') + '</label>')].join('') + '</div>' : '<p class="small">No prerequisites listed.</p>') + '</div></article>';
}

function bind() {
  document.querySelectorAll('[data-boss]').forEach(x => x.onchange = () => toggle(byName.get(x.dataset.boss), x.checked));
  document.querySelectorAll('[data-task]').forEach(x => x.onchange = () => task(x.dataset.task, x.checked));
  document.querySelectorAll('[data-ext]').forEach(x => x.onchange = () => {
    ext[x.dataset.ext] = x.checked;
    save();
    render();
  });
  document.querySelectorAll('[data-detail]').forEach(x => x.onclick = () => detail(x.dataset.detail));
}

function detail(id) {
  let b = bosses.find(x => x.id === id);
  if (!b) return;
  let d = document.createElement('dialog');
  d.style = 'max-width:700px;background:#1b1d18;color:#eee8d8;border:1px solid #907446;padding:22px';
  let missing = [...(b.bossReq || []).filter(n => !met(n)).map(n => 'Defeat ' + n), ...(b.taskReq || []).filter(n => !td(n))];
  d.innerHTML = '<button>Close</button><h2>' + esc(b.name) + '</h2><p>' + esc(b.game) + ' · ' + esc(b.area) + '</p><p><b>Location:</b> ' + esc(b.location) + '</p><p><b>Drops:</b> ' + esc(b.drops) + '</p><h3>Unlock requirements</h3><p>' + esc(missing.join(' · ') || 'All listed requirements complete') + '</p><label><input type="checkbox" data-boss="' + esc(b.name) + '" ' + (done(b.name) ? 'checked' : '') + '> Mark defeated</label>';
  document.body.append(d);
  d.showModal();
  d.querySelector('button').onclick = () => d.close();
  d.querySelector('[data-boss]').onchange = e => {
    toggle(b, e.target.checked);
    d.close();
  };
  d.onclose = () => d.remove();
}

function bossPage() {
  return '<div class="small">Field guide</div><h1>Bosses & Locations</h1><p>Search, filter and sort the shared boss list.</p><div class="toolbar"><input class="search" id="q" placeholder="Search bosses, areas, games, locations, drops"><select id="area"><option value="">All areas</option>' + [...new Set(bosses.map(b => b.area))].map(x => '<option>' + esc(x) + '</option>').join('') + '</select><select id="game"><option value="">All games</option>' + [...new Set(bosses.map(b => b.game))].map(x => '<option>' + esc(x) + '</option>').join('') + '</select><select id="status"><option value="">All statuses</option><option>Defeated</option><option>Available</option><option>Locked</option><option>Unknown</option><option>Incomplete prerequisites</option></select><select id="sort"><option value="area">Area order</option><option value="name">Boss name</option><option value="game">Original game</option><option value="completion">Completion</option><option value="availability">Availability</option></select><button id="clear">Clear filters</button><button id="mode">' + (mode === 'region' ? 'Compact checklist' : 'Region view') + '</button></div><div id="bossList"></div>';
}

function drawBosses() {
  let q = document.getElementById('q');
  if (!q) return;
  const controls = ['area', 'game', 'status', 'sort'].map(id => document.getElementById(id));
  controls[3].value = settingsState.defaultSort || 'area';
  const params = new URLSearchParams(location.search);
  if (params.has('boss')) q.value = params.get('boss');
  if (params.has('area')) controls[0].value = params.get('area');
  if (params.has('game')) controls[1].value = params.get('game');
  if (params.has('status')) controls[2].value = params.get('status');

  function draw() {
    let a = bosses.filter(b => (!settingsState.hideCompletedBosses || !done(b.name)) && (!params.has('scope') || params.get('scope') !== 'mod' || !b.external) && (!q.value || [b.name, b.area, b.game, b.location, b.drops].join(' ').toLowerCase().includes(q.value.toLowerCase())) && (!controls[0].value || b.area === controls[0].value) && (!controls[1].value || b.game === controls[1].value) && (!controls[2].value || controls[2].value === 'Incomplete prerequisites' && ([...b.bossReq || [], ...b.taskReq || []].some(x => byName.has(x) ? !met(x) : !td(x)))) || controls[2].value !== 'Incomplete prerequisites' && statusOf(b) === controls[2].value);
    let s = controls[3].value;
    if (s === 'name') a.sort((x, y) => x.name.localeCompare(y.name));
    if (s === 'game') a.sort((x, y) => x.game.localeCompare(y.game));
    if (s === 'completion') a.sort((x, y) => Number(done(x.name)) - Number(done(y.name)));
    if (s === 'availability') a.sort((x, y) => Number(statusOf(y) === 'Available') - Number(statusOf(x) === 'Available') || statusOf(x).localeCompare(statusOf(y)));
    
    let out = document.getElementById('bossList');
    out.innerHTML = mode === 'compact' ? '<div class="list">' + a.map(b => '<div class="row"><label><input type="checkbox" data-boss="' + esc(b.name) + '" ' + (done(b.name) ? 'checked' : '') + '> <span class="name" data-detail="' + b.id + '">' + esc(b.name) + '</span></label> <span class="pill">' + esc(b.game) + ' · ' + esc(b.area) + '</span><button class="intel-button" data-intel="' + b.id + '">View Intel</button></div>').join('') + '</div>' : [...new Set(a.map(b => b.area))].map(ar => '<section class="area"><h2>' + esc(ar) + '</h2><div class="cards">' + a.filter(b => b.area === ar).map(card).join('') + '</div></section>').join('');
    bind();
  }

  [q, ...controls].forEach(x => x.oninput = draw);
  document.getElementById('clear').onclick = () => {
    q.value = '';
    controls.forEach(x => x.value = '');
    draw();
  };
  document.getElementById('mode').onclick = () => {
    mode = mode === 'region' ? 'compact' : 'region';
    save();
    render();
  };
  draw();
}

function statusCounts(list = mods()) {
  let c = { Defeated: 0, Available: 0, Locked: 0, Unknown: 0 };
  list.forEach(b => c[statusOf(b)]++);
  return c;
}

function stats() {
  let m = mods(),
      c = statusCounts(m),
      t = tasks.filter(x => !td(x.name)).length,
      pct = m.length ? Math.round(c.Defeated / m.length * 100) : 0;
  return [['Defeated', c.Defeated, 'Defeated'], ['Available', c.Available, 'Available'], ['Locked', c.Locked, 'Locked'], ['Unknown', c.Unknown, 'Unknown']].map(([label, value, key]) => '<a class="stat stat-link status-' + key.toLowerCase() + '" href="bosses.html?status=' + key + '&amp;scope=mod"><span class="stat-glyph" aria-hidden="true">' + ({ Defeated: '⚔', Available: '✦', Locked: '⌑', Unknown: '?' }[key]) + '</span><b>' + value + '</b><span>' + label + '</span></a>').join('') + '<a class="stat stat-link" href="bosses.html"><b>' + m.length + '</b><span>Tracked mod bosses</span></a><a class="stat stat-link" href="achievements.html"><b>' + pct + '%</b><span>Boss completion</span><span class="meter"><i style="width:' + pct + '%"></i></span></a><a class="stat stat-link" href="prereqs.html"><b>' + t + '</b><span>Incomplete tasks</span></a>';
}

function home() {
  setTimeout(() => {
    if (typeof window.GA_EXTRAS_RENDER === 'function') {
      window.GA_EXTRAS_RENDER('home');
    }
  }, 0);
  return '<div id="dashboard-content"></div>';
}

function areaPage() {
  return '<h1>Areas</h1><div class="grid">' + [...new Set(mods().map(b => b.area))].map(a => {
    let bs = mods().filter(b => b.area === a),
        c = statusCounts(bs);
    return '<div class="panel"><h3>' + esc(a) + '</h3><p>' + c.Defeated + '/' + bs.length + ' defeated · ' + c.Available + ' available · ' + c.Locked + ' locked · ' + c.Unknown + ' unknown</p><button data-area="' + esc(a) + '">Browse area</button> <a class="button-link" href="journal.html?area=' + encodeURIComponent(a) + '&create=1">Write journal entry</a></div>';
  }).join('') + '</div>';
}

function gamePage() {
  return '<h1>Bosses by Original Game</h1><div class="grid">' + [...new Set(mods().map(b => b.game))].map(g => {
    let bs = mods().filter(b => b.game === g),
        c = statusCounts(bs),
        pct = bs.length ? Math.round(c.Defeated / bs.length * 100) : 0;
    return '<div class="panel"><h3>' + esc(g) + '</h3><p>' + bs.length + ' tracked · ' + c.Defeated + ' defeated · ' + c.Available + ' available · ' + c.Locked + ' locked · ' + c.Unknown + ' unknown · ' + pct + '%</p><button data-game="' + esc(g) + '">Browse</button></div>';
  }).join('') + '</div>';
}

function prereqPage() {
  return '<h1>Prerequisites</h1><p>One shared checkbox per prerequisite task. Uncertain requirements stay flagged.</p><div class="toolbar"><input id="tq" class="search" placeholder="Search tasks"><select id="ts"><option value="">All</option><option value="open">Incomplete</option><option value="done">Complete</option></select></div><div id="taskList" class="list"></div>';
}

function drawTasks() {
  let q = document.getElementById('tq');
  if (!q) return;
  let f = () => {
    let s = document.getElementById('ts');
    document.getElementById('taskList').innerHTML = tasks.filter(t => (!q.value || t.name.toLowerCase().includes(q.value.toLowerCase())) && (!s.value || (s.value === 'done') === td(t.name))).map(t => '<label class="row req"><input type="checkbox" data-task="' + esc(t.name) + '" ' + (td(t.name) ? 'checked' : '') + '><span>' + esc(t.name) + (/check whether|version/i.test(t.name) ? ' <b>(uncertain/version-dependent)</b>' : '') + '<div class="small">Used by ' + mods().filter(b => (b.taskReq || []).includes(t.name)).map(b => esc(b.name)).join(', ') + '</div></span></label>').join('') || '<p>No tasks match.</p>';
    bind();
  };
  q.oninput = f;
  document.getElementById('ts').oninput = f;
  f();
}

function progression() {
  return '<h1>Progression & Unlocks</h1><p>Current missing requirements are calculated from live progress. Defeated bosses stay defeated if their prerequisite chain changes.</p><div class="list">' + 
    mods().map(b => {
      let missing = [...(b.bossReq || []).filter(n => !met(n)).map(n => 'Defeat ' + n), ...(b.taskReq || []).filter(n => !td(n)).map(n => 'Complete ' + n)];
      let missingText = missing.length > 0 ? missing.join(' · ') : 'All listed requirements complete';
      let defeatedNote = (done(b.name) && !avail(b) ? 'Defeated; prerequisite chain currently incomplete. ' : '');
      
      return '<details class="row"><summary><b>' + esc(b.name) + '</b> <span class="pill">' + statusOf(b) + '</span></summary><p class="small">' + defeatedNote + missingText + '</p></details>';
    }).join('') + 
    '</div>';
}

function notesPage() {
  return '<h1>Notes & To-Do List</h1><div class="panel"><h3>Add note</h3><div class="toolbar"><select id="scope"><option value="general">General</option>' + bosses.map(b => '<option value="boss:' + b.id + '">Boss: ' + esc(b.name) + '</option>') + '</select><input class="search" id="newNote" placeholder="Your note"><button id="addNote">Save note</button></div></div><div class="panel"><h3>Add to-do</h3><div class="toolbar"><input class="search" id="newTodo" placeholder="To-do item"><input id="due" type="date"><button id="addTodo">Add</button></div></div><h2>Notes</h2><div id="notes" class="list"></div><h2>To-do</h2><div id="todos" class="list"></div>';
}

function drawNotes() {
  document.getElementById('notes').innerHTML = notes.map((n, i) => '<div class="note"><span class="pill">' + esc(n.scope) + '</span><textarea data-note="' + i + '">' + esc(n.text) + '</textarea><button data-delnote="' + i + '">Delete</button></div>').join('') || '<p>No notes.</p>';
  document.getElementById('todos').innerHTML = todos.map((t, i) => '<div class="row"><label><input type="checkbox" data-todo="' + i + '" ' + (t.done ? 'checked' : '') + '> ' + esc(t.text) + '</label> ' + esc(t.due || '') + ' <button data-deltodo="' + i + '">Delete</button></div>').join('') || '<p>No to-dos.</p>';
  document.getElementById('addNote').onclick = () => {
    let x = document.getElementById('newNote').value.trim();
    if (x) {
      notes.push({ scope: document.getElementById('scope').value, text: x });
      save();
      render();
    }
  };
  document.getElementById('addTodo').onclick = () => {
    let x = document.getElementById('newTodo').value.trim();
    if (x) {
      todos.push({ text: x, due: document.getElementById('due').value, done: false });
      save();
      render();
    }
  };
  document.querySelectorAll('[data-note]').forEach(x => x.oninput = () => {
    notes[x.dataset.note].text = x.value;
    save();
  });
  document.querySelectorAll('[data-delnote]').forEach(x => x.onclick = () => {
    notes.splice(+x.dataset.delnote, 1);
    save();
    render();
  });
  document.querySelectorAll('[data-todo]').forEach(x => x.onchange = () => {
    todos[x.dataset.todo].done = x.checked;
    save();
  });
  document.querySelectorAll('[data-deltodo]').forEach(x => x.onclick = () => {
    todos.splice(+x.dataset.deltodo, 1);
    save();
    render();
  });
}

function exportData() {
  lastBackupAt = new Date().toISOString();
  if (window.GA_ACH_SYNC) window.GA_ACH_SYNC(false);
  save();
  let d = {
    schemaVersion: 3,
    exportedAt: new Date().toISOString(),
    bosses: Object.fromEntries(mods().map(b => [b.id, done(b.name)])),
    external: ext,
    tasks: taskState,
    timestamps: times,
    notes,
    todos,
    journal: journalEntries,
    preferences: { ...settingsState, mode },
    rewards: rewardStates,
    achievements: earnedAchievements,
    lastBackupAt,
    pinnedAchievements,
    bossPins
  };
  let a = document.createElement('a');
  a.href = URL.createObjectURL(new Blob([JSON.stringify(d, null, 2)], { type: 'application/json' }));
  a.download = 'golden-age-progress.json';
  a.click();
  URL.revokeObjectURL(a.href);
}

function settings() {
  return '<h1>Settings & Data</h1><p>Saved locally in this browser. Export a backup before changing devices.</p><div class="panel"><button id="export">Export progress (JSON)</button><label>Import backup <input type="file" id="import" accept=".json,application/json"></label><div id="msg" role="status"></div></div><div class="panel"><h3>Reset</h3><p>Clear boss progress, tasks, timestamps, notes and to-dos.</p><button id="reset">Reset all progress</button></div>';
}

function bindSettings() {
  document.getElementById('export').onclick = exportData;
  document.getElementById('reset').onclick = () => {
    if (confirm('Reset all tracker progress and personal notes in this browser?')) {
      ['goldenAgeSite_v3', 'goldenAgeInteractive_v2', 'goldenAgeInteractive_v2_external'].forEach(k => localStorage.removeItem(k));
      location.reload();
    }
  };
  document.getElementById('import').onchange = async e => {
    let msg = document.getElementById('msg');
    try {
      let d = JSON.parse(await e.target.files[0].text());
      if (![2, 3].includes(d.schemaVersion) || !d.bosses || typeof d.bosses !== 'object' || !d.tasks) throw Error('Unsupported schema or missing data');
      if (!confirm('Replace current progress with this backup?')) return;
      state = {};
      Object.entries(d.bosses).forEach(([id, v]) => {
        let b = bosses.find(x => x.id === id);
        if (b && typeof v === 'boolean') state['boss:' + b.name] = v;
      });
      ext = d.external || {};
      taskState = d.tasks;
      times = d.timestamps || {};
      notes = d.notes || [];
      todos = d.todos || [];
      mode = d.preferences?.mode || 'region';
      rewardStates = d.rewards || {};
      save();
      msg.textContent = 'Backup imported.';
      render();
    } catch (err) {
      msg.textContent = 'Import failed: ' + err.message;
    }
  };
}

function staticPage(title, content) {
  return '<h1>' + title + '</h1><div class="panel">' + content + '</div>';
}

function applySiteSettings() {
  document.documentElement.dataset.theme = settingsState.theme;
  document.documentElement.dataset.accent = settingsState.accent;
  document.documentElement.dataset.density = settingsState.density;
  document.documentElement.dataset.images = settingsState.showDecorativeImages ? 'on' : 'off';
  document.documentElement.dataset.animations = settingsState.animations ? 'on' : 'off';
}

function render() {
  applySiteSettings();
  let id = document.body.dataset.page || 'home';
  if (!pages.some(x => x[0] === id)) id = 'home';
  document.querySelectorAll('[data-page]').forEach(x => x.classList.toggle('active', x.dataset.page === id));
  document.getElementById('pageLabel').textContent = pages.find(x => x[0] === id)[1];
  update();
  let v = document.getElementById('view');
  if (id === 'home') v.innerHTML = home();
  else if (id === 'bosses') { v.innerHTML = bossPage(); drawBosses(); }
  else if (id === 'areas') v.innerHTML = areaPage();
  else if (id === 'games') v.innerHTML = gamePage();
  else if (id === 'prereqs') { v.innerHTML = prereqPage(); drawTasks(); }
  else if (id === 'progression') v.innerHTML = progression();
  else if (id === 'notes') { v.innerHTML = notesPage(); drawNotes(); }
  else if (id === 'settings') v.innerHTML = settings();
  else if (id === 'journal') v.innerHTML = '<div id="journal-content"></div>';
  else if (id === 'about') v.innerHTML = '<div id="extras-content"></div>';
  else if (id === 'talismans' || id === 'drops') v.innerHTML = '<div id="extras-content"></div>';
  else if (id === 'achievements') {
    let d = mods().filter(b => done(b.name)).length;
    v.innerHTML = staticPage('Achievements', 'Optional personal website milestones, not official game achievements.<div class="grid">' + [['First tracked boss', d >= 1 ? 'Complete' : '0/1'], ['Ten bosses', d >= 10 ? d + '/10' : d + '/10'], ['All tracked bosses', d + '/' + mods().length], ['All prerequisite tasks', tasks.filter(t => td(t.name)).length + '/' + tasks.length]].map(([a, b]) => '<div class="stat"><b>' + b + '</b><span>' + a + '</span></div>').join('') + '</div>');
  } else {
    v.innerHTML = staticPage('Help / FAQ', '<details><summary>What does Available mean?</summary><p>All listed requirements are checked.</p></details><details><summary>Why did a boss become locked again?</summary><p>Availability derives from current requirements; defeated status remains saved.</p></details><details><summary>Where is progress saved?</summary><p>Local storage in this browser. Export JSON for backup.</p></details><details><summary>Can the tracker verify my game?</summary><p>No. It reflects the guide and cannot inspect game state. Requirements can vary by version.</p></details>');
  }
  bind();
  v.querySelectorAll('[data-go]').forEach(x => x.onclick = () => location.href = x.dataset.go + '.html');
  v.querySelectorAll('[data-area]').forEach(x => x.onclick = () => location.href = 'bosses.html?area=' + encodeURIComponent(x.dataset.area));
  v.querySelectorAll('[data-game]').forEach(x => x.onclick = () => location.href = 'bosses.html?game=' + encodeURIComponent(x.dataset.game));
  let ex = document.getElementById('exportQuick');
  if (ex) ex.onclick = exportData;
  if (window.GA_EXTRAS_RENDER) window.GA_EXTRAS_RENDER(id);
}

window.GA_TRACKER = {
  bosses,
  mods,
  defeated: done,
  availableByName: n => byName.has(n) ? (byName.get(n).external ? done(n) : statusOf(byName.get(n)) === 'Available') : !!ext[n],
  unknownByName: n => byName.has(n) ? statusOf(byName.get(n)) === 'Unknown' : false,
  statusOf,
  statusCounts,
  taskDone: td,
  taskSet: task,
  setBossState: (n, v) => {
    let b = byName.get(n);
    if (b) toggle(b, v);
  },
  tasks,
  rewards: () => [...(window.GA_REWARDS || []), ...(window.GA_TALISMANS || [])],
  talismans: () => window.GA_TALISMANS || [],
  get rewardStates() { return rewardStates; },
  rewardState,
  setRewardState,
  get rewardKey() { return itemKey; },
  applyBossDropCollection,
  get dropMigrationReport() { return window.GA_BOSS_DROP_MIGRATION || null; },
  get settings() { return settingsState; },
  get notes() { return notes; },
  get todos() { return todos; },
  get journalEntries() { return journalEntries; },
  setJournalEntries: v => {
    journalEntries = Array.isArray(v) ? v : [];
    save();
  },
  setSetting: (k, v) => {
    settingsState[k] = v;
    if (k === 'defaultBossView') mode = v;
    save();
    applySiteSettings();
  },
  updateSettings: patch => {
    settingsState = { ...settingsState, ...patch };
    save();
    applySiteSettings();
  },
  get earnedAchievements() { return earnedAchievements; },
  get pinnedAchievements() { return pinnedAchievements; },
  setAchievementPin: (id, v) => {
    if (v && !pinnedAchievements[id] && Object.keys(pinnedAchievements).filter(k => pinnedAchievements[k]).length >= 3) return false;
    if (v) pinnedAchievements[id] = true;
    else delete pinnedAchievements[id];
    save();
    return true;
  },
  isBossPinned: n => !!bossPins[n],
  setExternalState: (n, v) => {
    ext[n] = v;
    save();
  },
  setBossPin: (n, v) => {
    if (v) bossPins[n] = true;
    else delete bossPins[n];
    save();
  },
  addNote: (scope, text) => {
    notes.push({ scope, text });
    save();
  },
  get lastBackupAt() { return lastBackupAt; },
  setAchievement: (id, v) => {
    earnedAchievements[id] = v;
    save();
  },
  save,
  exportData,
  resetPreferences: () => {
    settingsState = { ...defaultSettings };
    mode = settingsState.defaultBossView;
    save();
    applySiteSettings();
  },
  resetProgress: () => {
    state = {};
    ext = {};
    taskState = {};
    times = {};
    rewardStates = {};
    earnedAchievements = Object.fromEntries(Object.entries(earnedAchievements).filter(([id]) => ['backup-keeper', 'fresh-perspective', 'taking-notes'].includes(id)));
    save();
  },
  resetAll: () => {
    ['goldenAgeSite_v3', 'goldenAgeInteractive_v2', 'goldenAgeInteractive_v2_external'].forEach(k => localStorage.removeItem(k));
    location.reload();
  },
  importBackup: (d, merge) => {
    let next = merge ? { ...state } : {};
    for (const [id, val] of Object.entries(d.bosses)) {
      let b = bosses.find(x => x.id === id);
      if (b && typeof val === 'boolean') next['boss:' + b.name] = val;
    }
    state = next;
    ext = merge ? { ...ext, ...(d.external || {}) } : (d.external || {});
    taskState = merge ? { ...taskState, ...(d.tasks || {}) } : (d.tasks || {});
    rewardStates = merge ? { ...rewardStates, ...(d.rewards || {}) } : (d.rewards || {});
    notes = merge ? [...notes, ...(d.notes || [])] : Array.isArray(d.notes) ? d.notes : [];
    todos = merge ? [...todos, ...(d.todos || [])] : Array.isArray(d.todos) ? d.todos : [];
    times = merge ? { ...times, ...(d.timestamps || {}) } : (d.timestamps || {});
    earnedAchievements = merge ? { ...earnedAchievements, ...(d.achievements || {}) } : (d.achievements || {});
    pinnedAchievements = merge ? { ...pinnedAchievements, ...(d.pinnedAchievements || {}) } : (d.pinnedAchievements || {});
    bossPins = merge ? { ...bossPins, ...(d.bossPins || {}) } : (d.bossPins || {});
    journalEntries = merge ? [...journalEntries, ...(Array.isArray(d.journal) ? d.journal.filter(e => !journalEntries.some(x => x.id === e.id)) : [])] : Array.isArray(d.journal) ? d.journal : journalEntries;
    if (!merge) {
      settingsState = { ...defaultSettings, ...(d.preferences || {}) };
      mode = d.preferences?.mode || settingsState.defaultBossView;
      lastBackupAt = d.lastBackupAt || null;
    }
    applyBossDropCollection();
    save();
  },
  slug
};

document.getElementById('nav').innerHTML = pages.map(([i, n]) => '<a data-page="' + i + '" href="' + i + '.html">' + n + '</a>').join('');
document.getElementById('hamb').onclick = () => {
  document.getElementById('side').classList.add('open');
  document.getElementById('overlay').classList.add('show');
};
document.getElementById('overlay').onclick = () => {
  document.getElementById('side').classList.remove('open');
  document.getElementById('overlay').classList.remove('show');
};
document.getElementById('art').onpointermove = e => {
  let r = e.currentTarget.getBoundingClientRect();
  e.currentTarget.style.transform = 'scale(1.035) translate(' + ((e.clientX - r.left) / r.width - .5) * -8 + 'px,0)';
};
document.getElementById('art').onpointerleave = e => e.currentTarget.style.transform = '';
render();
