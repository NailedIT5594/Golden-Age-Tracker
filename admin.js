/* Golden Age admin terminal — for testing only.
 *
 * Open it with Ctrl+Shift+` (backtick), or tap the sidebar title 5 times quickly (phones).
 * First run: no password is configured, so it walks you through creating one and prints a
 * new ADMIN_CONFIG line. Paste that line below, re-upload this file, and setup mode turns off.
 *
 * Honest limits: this site is static, so every visitor can read this file. The password is
 * stored only as a salted, slow (PBKDF2) hash, which stops casual visitors and makes guessing
 * expensive, but it can't stop someone determined to edit the code in their own browser.
 * Anything the terminal changes lives only in that visitor's own browser storage.
 */
(function () {
  'use strict';

  // ---- Config (replace this line with the one the terminal prints during setup) ----
  const ADMIN_CONFIG = { iterations: 210000, salt: '', verifier: '' };

  const TRUST_DAYS = 30;     // how long "keep this browser authorized" lasts
  const MAX_FAILS = 5;       // wrong passwords before a lockout
  const LOCK_MS = 60000;     // lockout length
  const HOTKEY_CODE = 'Backquote';
  const LS = { trust: 'ga_admin_trust', fails: 'ga_admin_fails', snaps: 'ga_admin_snapshots' };
  const SAVE_KEY = 'goldenAgeSite_v3';

  // ---- Crypto ----
  const enc = new TextEncoder();
  const hex = buf => [...new Uint8Array(buf)].map(b => b.toString(16).padStart(2, '0')).join('');
  const unhex = h => new Uint8Array(h.match(/../g).map(x => parseInt(x, 16)));
  const configured = () => !!(ADMIN_CONFIG.salt && ADMIN_CONFIG.verifier);

  async function derive(password, saltHex, iterations) {
    const key = await crypto.subtle.importKey('raw', enc.encode(password), 'PBKDF2', false, ['deriveBits']);
    return hex(await crypto.subtle.deriveBits({ name: 'PBKDF2', hash: 'SHA-256', salt: unhex(saltHex), iterations }, key, 256));
  }
  async function verifierOf(keyHex) {
    return hex(await crypto.subtle.digest('SHA-256', unhex(keyHex)));
  }
  function same(a, b) {
    if (a.length !== b.length) return false;
    let d = 0;
    for (let i = 0; i < a.length; i++) d |= a.charCodeAt(i) ^ b.charCodeAt(i);
    return d === 0;
  }
  async function checkKey(keyHex) {
    try { return configured() && same(await verifierOf(keyHex), ADMIN_CONFIG.verifier); } catch (e) { return false; }
  }

  if (window.__GA_ADMIN_TEST__) window.__GA_ADMIN_TEST__ = { ADMIN_CONFIG, derive, verifierOf, checkKey, same };

  // ---- Storage helpers ----
  const lsGet = (k, d) => { try { const v = localStorage.getItem(k); return v ? JSON.parse(v) : d; } catch (e) { return d; } };
  const lsSet = (k, v) => { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) {} };
  const lsDel = k => { try { localStorage.removeItem(k); } catch (e) {} };

  // ---- State ----
  let unlocked = false;
  let pending = null;
  let history = [], histIdx = 0;
  let root, out, promptEl, input;

  const T = () => window.GA_TRACKER;
  const API = () => window.GA_ACH_API;
  const earned = () => T().earnedAchievements;
  const rerender = () => { if (typeof window.render === 'function') window.render(); };

  // ---- UI ----
  function build() {
    if (root) return;
    const style = document.createElement('style');
    style.textContent = '#ga-admin{position:fixed;left:0;right:0;bottom:0;height:min(58vh,440px);z-index:99999;display:none;flex-direction:column;background:#0a0b08f5;border-top:2px solid var(--gold,#ddbf7b);box-shadow:0 -10px 40px #000a;font:13px/1.5 ui-monospace,SFMono-Regular,Consolas,monospace;color:#d9e2cf}' +
      '#ga-admin .ga-bar{display:flex;justify-content:space-between;padding:6px 12px;background:#14160f;color:var(--gold,#ddbf7b);border-bottom:1px solid #3a3a2a}' +
      '#ga-admin .ga-out{flex:1;overflow:auto;padding:8px 12px;white-space:pre-wrap;word-break:break-word}' +
      '#ga-admin .ga-row{display:flex;gap:8px;padding:8px 12px;border-top:1px solid #2a2b20;align-items:center}' +
      '#ga-admin .ga-prompt{color:var(--gold,#ddbf7b);white-space:nowrap}' +
      '#ga-admin input{flex:1;background:transparent;border:0;outline:0;color:#fff;font:inherit;padding:0}' +
      '#ga-admin .ok{color:#9fc58a}#ga-admin .err{color:#e3987a}#ga-admin .warn{color:#e2bc76}#ga-admin .dim{color:#8d917f}#ga-admin .code{color:#9bb2c2;user-select:all}';
    document.head.append(style);

    root = document.createElement('div');
    root.id = 'ga-admin';
    root.setAttribute('role', 'dialog');
    root.setAttribute('aria-label', 'Admin terminal');
    root.innerHTML = '<div class="ga-bar"><span>Golden Age admin terminal</span><span class="dim">Esc to close · type help</span></div><div class="ga-out" aria-live="polite"></div><div class="ga-row"><span class="ga-prompt">admin&gt;</span><input autocomplete="off" autocapitalize="off" spellcheck="false" aria-label="Terminal input"></div>';
    document.body.append(root);
    out = root.querySelector('.ga-out');
    promptEl = root.querySelector('.ga-prompt');
    input = root.querySelector('input');

    input.addEventListener('keydown', e => {
      if (e.key === 'Enter') {
        const v = input.value;
        input.value = '';
        if (pending) {
          const r = pending;
          pending = null;
          setPrompt('admin>', false);
          r(v);
        } else if (v.trim()) {
          history.push(v);
          histIdx = history.length;
          print('admin> ' + v, 'dim');
          run(v);
        }
      } else if (e.key === 'ArrowUp' && !pending) {
        if (histIdx > 0) input.value = history[--histIdx];
        e.preventDefault();
      } else if (e.key === 'ArrowDown' && !pending) {
        histIdx = Math.min(history.length, histIdx + 1);
        input.value = history[histIdx] || '';
        e.preventDefault();
      }
    });
    root.addEventListener('keydown', e => { if (e.key === 'Escape') close(); });
  }

  function setPrompt(label, secret) {
    promptEl.textContent = label;
    input.type = secret ? 'password' : 'text';
  }
  function print(text, cls) {
    String(text).split('\n').forEach(line => {
      const d = document.createElement('div');
      if (cls) d.className = cls;
      d.textContent = line;
      out.append(d);
    });
    out.scrollTop = out.scrollHeight;
  }
  function ask(label, secret) {
    return new Promise(res => {
      pending = res;
      setPrompt(label, secret);
      input.value = '';
      input.focus();
    });
  }
  function close() {
    if (pending) { const r = pending; pending = null; r(null); }
    if (root) root.style.display = 'none';
  }

  // ---- Auth ----
  function lockRemaining() { return Math.max(0, lsGet(LS.fails, { n: 0, until: 0 }).until - Date.now()); }
  function recordFail() {
    const f = lsGet(LS.fails, { n: 0, until: 0 });
    f.n++;
    if (f.n >= MAX_FAILS) { f.until = Date.now() + LOCK_MS; f.n = 0; }
    lsSet(LS.fails, f);
  }
  async function tryTrusted() {
    const t = lsGet(LS.trust, null);
    if (t && t.exp > Date.now() && await checkKey(t.key)) return true;
    if (t) lsDel(LS.trust);
    return false;
  }
  async function newConfig() {
    const a = await ask('new password (12+ characters):', true);
    if (a === null) return null;
    if (a.length < 12) { print('Too short. Use at least 12 characters.', 'err'); return null; }
    const b = await ask('repeat password:', true);
    if (b !== a) { print('Passwords did not match.', 'err'); return null; }
    const salt = hex(crypto.getRandomValues(new Uint8Array(16)));
    const key = await derive(a, salt, ADMIN_CONFIG.iterations);
    return { salt, verifier: await verifierOf(key) };
  }
  function printConfig(c) {
    print('Replace the ADMIN_CONFIG line near the top of admin.js with this, then re-upload the file:', 'warn');
    print("const ADMIN_CONFIG = { iterations: " + ADMIN_CONFIG.iterations + ", salt: '" + c.salt + "', verifier: '" + c.verifier + "' };", 'code');
  }
  async function login() {
    if (await tryTrusted()) { unlocked = true; print('Authorized browser recognized. Type help.', 'ok'); return true; }
    if (!configured()) {
      print('No password is configured yet: setup mode.', 'warn');
      print('Until you paste the config line into admin.js, anyone who finds this terminal can run setup.', 'warn');
      const c = await newConfig();
      if (!c) return false;
      printConfig(c);
      unlocked = true;
      print('Unlocked for this session only. Type help.', 'ok');
      return true;
    }
    for (;;) {
      const rem = lockRemaining();
      if (rem) { print('Too many wrong attempts. Try again in ' + Math.ceil(rem / 1000) + 's.', 'err'); return false; }
      const pw = await ask('password:', true);
      if (!pw) return false;
      const key = await derive(pw, ADMIN_CONFIG.salt, ADMIN_CONFIG.iterations);
      if (await checkKey(key)) {
        lsDel(LS.fails);
        unlocked = true;
        const k = await ask('Keep this browser authorized for ' + TRUST_DAYS + ' days? (y/n):');
        if (k && /^y/i.test(k)) lsSet(LS.trust, { key, exp: Date.now() + TRUST_DAYS * 864e5 });
        print('Access granted. Type help.', 'ok');
        return true;
      }
      recordFail();
      print('Incorrect password.', 'err');
    }
  }
  async function open() {
    build();
    if (!(window.crypto && crypto.subtle)) {
      root.style.display = 'flex';
      print('This browser blocks secure hashing here. Use https:// or localhost.', 'err');
      return;
    }
    root.style.display = 'flex';
    if (unlocked) { input.focus(); return; }
    out.textContent = '';
    const ok = await login();
    if (!ok) { setTimeout(close, 1500); return; }
    input.focus();
  }
  function toggle() {
    if (root && root.style.display === 'flex') close(); else open();
  }

  // ---- Helpers for commands ----
  function tokens(s) {
    const r = [], re = /"([^"]*)"|(\S+)/g;
    let m;
    while ((m = re.exec(s))) r.push(m[1] !== undefined ? m[1] : m[2]);
    return r;
  }
  function pick(list, q, name, what) {
    const ql = q.toLowerCase();
    const exact = list.filter(x => name(x).toLowerCase() === ql);
    if (exact.length === 1) return exact[0];
    const part = list.filter(x => name(x).toLowerCase().includes(ql));
    if (part.length === 1) return part[0];
    if (!part.length) print('No ' + what + ' matches "' + q + '".', 'err');
    else print('Ambiguous. Matches: ' + part.slice(0, 8).map(name).join(' | ') + (part.length > 8 ? ' ...' : ''), 'err');
    return null;
  }
  function pickAch(q) {
    const defs = API().build();
    const byId = defs.find(d => d.id === q.toLowerCase());
    if (byId) return byId;
    return pick(defs, q, d => d.id + ' ' + d.title, 'achievement');
  }
  // Run a state change with sounds/toasts held back, then announce whatever unlocked, once.
  function bulk(fn) {
    const before = new Set(Object.keys(earned()).filter(k => earned()[k]));
    window.GA_SILENT_ACHIEVEMENTS = true;
    try { fn(); T().save(); } finally { window.GA_SILENT_ACHIEVEMENTS = false; }
    const defs = API().build();
    const newly = defs.filter(d => earned()[d.id] && !before.has(d.id));
    if (newly.length) {
      API().toast(newly);
      API().announce(newly, defs);
      print('Unlocked ' + newly.length + ': ' + newly.map(d => d.title).join(', '), 'ok');
    }
    rerender();
  }
  const yes = s => !!s && /^y/i.test(s);
  const flag = (args, f) => args.includes(f);
  const rest = (args, n) => args.slice(n).filter(a => !a.startsWith('--')).join(' ');

  // ---- Commands ----
  const HELP = [
    'status                         progress summary',
    'ach list [tier|earned|locked|text]',
    'ach unlock <id|title|all>      really unlock (toast + sound)',
    'ach lock <id|title|all>        remove (re-earns itself if its condition is still true)',
    'ach test <id|title>            toast + sound only, saves nothing',
    'sound <common|uncommon|rare|epic|legendary|complete>',
    'sfx on|off                     achievement sounds setting',
    'boss list [text] | boss defeat|reset <name|all> [--ext]',
    'task list [text] | task done|undo <name|all>',
    'reward list [text] | reward collect|reset <name|all>',
    'talisman collect|reset <name|all>',
    'snapshot save|restore|list|drop [name]   save/restore all progress (restore reloads)',
    'wipe                           reset gameplay progress (asks first)',
    'export                         download a JSON backup',
    'passwd                         generate a new password config line',
    'logout                         forget this browser and close',
    'clear | exit'
  ].join('\n');

  const commands = {
    help() { print(HELP); },

    status() {
      const t = T(), m = t.mods(), defs = API().build();
      const rewards = t.rewards(), keys = new Set(rewards.map(r => t.rewardKey(r)));
      const got = new Set(rewards.filter(r => t.rewardState(r.id) === 'collected').map(r => t.rewardKey(r)));
      print('Bosses       ' + m.filter(b => t.defeated(b.name)).length + ' / ' + m.length);
      print('Tasks        ' + t.tasks.filter(x => t.taskDone(x.name)).length + ' / ' + t.tasks.length);
      print('Rewards      ' + got.size + ' / ' + keys.size);
      print('Achievements ' + defs.filter(d => earned()[d.id]).length + ' / ' + defs.length);
    },

    ach(args) {
      const sub = (args[0] || '').toLowerCase(), q = rest(args, 1);
      const defs = API().build();
      if (sub === 'list') {
        const f = q.toLowerCase();
        const list = defs.filter(d => !f || d.tier.toLowerCase() === f || (f === 'earned' && earned()[d.id]) || (f === 'locked' && !earned()[d.id]) || (d.id + ' ' + d.title).toLowerCase().includes(f));
        list.forEach(d => print((earned()[d.id] ? '[x] ' : '[ ] ') + d.tier.padEnd(10) + d.id.padEnd(26) + d.title, earned()[d.id] ? 'ok' : ''));
        print(list.length + ' shown', 'dim');
      } else if (sub === 'unlock') {
        if (!q) return print('Usage: ach unlock <id|title|all>', 'err');
        const targets = q.toLowerCase() === 'all' ? defs : [pickAch(q)].filter(Boolean);
        if (!targets.length) return;
        bulk(() => targets.forEach(d => { if (!earned()[d.id]) earned()[d.id] = { unlockedAt: new Date().toISOString(), historical: false }; }));
      } else if (sub === 'lock') {
        if (!q) return print('Usage: ach lock <id|title|all>', 'err');
        const targets = q.toLowerCase() === 'all' ? defs : [pickAch(q)].filter(Boolean);
        if (!targets.length) return;
        bulk(() => targets.forEach(d => { delete earned()[d.id]; }));
        const back = targets.filter(d => earned()[d.id]);
        print('Locked ' + (targets.length - back.length) + '.', 'ok');
        if (back.length) print(back.length + ' re-earned automatically because their conditions are still met: ' + back.map(d => d.id).join(', '), 'warn');
      } else if (sub === 'test') {
        const d = q && pickAch(q);
        if (!d) return print('Usage: ach test <id|title>', 'err');
        API().toast([d]);
        if (typeof window.GA_PLAY_SOUND === 'function') window.GA_PLAY_SOUND(d.id === 'lord-of-the-golden-age' ? 'complete' : d.tier);
        print('Played test for "' + d.title + '" (' + d.tier + '). Nothing saved.', 'ok');
      } else print('Usage: ach list | unlock | lock | test', 'err');
    },

    sound(args) {
      const k = (args[0] || '').toLowerCase();
      if (!['common', 'uncommon', 'rare', 'epic', 'legendary', 'complete'].includes(k)) return print('Usage: sound <common|uncommon|rare|epic|legendary|complete>', 'err');
      window.GA_PLAY_SOUND(k);
      print('Playing a random "' + k + '" sound.', 'ok');
    },

    sfx(args) {
      const v = (args[0] || '').toLowerCase();
      if (v !== 'on' && v !== 'off') return print('Usage: sfx on|off', 'err');
      T().setSetting('achievementSounds', v === 'on');
      print('Achievement sounds ' + v + '.', 'ok');
    },

    boss(args) {
      const sub = (args[0] || '').toLowerCase(), q = rest(args, 1), t = T();
      if (sub === 'list') {
        const f = q.toLowerCase();
        const list = t.bosses.filter(b => !f || (b.name + ' ' + b.area).toLowerCase().includes(f));
        list.forEach(b => print((t.defeated(b.name) ? '[x] ' : '[ ] ') + b.name + '  (' + t.statusOf(b) + ')' + (b.external ? '  ext' : ''), t.defeated(b.name) ? 'ok' : ''));
        print(list.length + ' shown', 'dim');
      } else if (sub === 'defeat' || sub === 'reset') {
        const v = sub === 'defeat';
        if (!q) return print('Usage: boss ' + sub + ' <name|all> [--ext]', 'err');
        let targets;
        if (q.toLowerCase() === 'all') targets = flag(args, '--ext') ? t.bosses : t.mods();
        else { const b = pick(t.bosses, q, x => x.name, 'boss'); targets = b ? [b] : []; }
        if (!targets.length) return;
        bulk(() => targets.forEach(b => t.setBossState(b.name, v)));
        print((v ? 'Defeated ' : 'Reset ') + targets.length + ' boss(es).', 'ok');
      } else print('Usage: boss list | defeat | reset', 'err');
    },

    task(args) {
      const sub = (args[0] || '').toLowerCase(), q = rest(args, 1), t = T();
      if (sub === 'list') {
        const f = q.toLowerCase();
        const list = t.tasks.filter(x => !f || x.name.toLowerCase().includes(f));
        list.forEach(x => print((t.taskDone(x.name) ? '[x] ' : '[ ] ') + x.name, t.taskDone(x.name) ? 'ok' : ''));
        print(list.length + ' shown', 'dim');
      } else if (sub === 'done' || sub === 'undo') {
        const v = sub === 'done';
        if (!q) return print('Usage: task ' + sub + ' <name|all>', 'err');
        let targets;
        if (q.toLowerCase() === 'all') targets = t.tasks;
        else { const x = pick(t.tasks, q, y => y.name, 'task'); targets = x ? [x] : []; }
        if (!targets.length) return;
        bulk(() => targets.forEach(x => t.taskSet(x.name, v)));
        print((v ? 'Completed ' : 'Cleared ') + targets.length + ' task(s).', 'ok');
      } else print('Usage: task list | done | undo', 'err');
    },

    reward(args, source) {
      const sub = (args[0] || '').toLowerCase(), q = rest(args, 1), t = T();
      const pool = source || t.rewards();
      if (sub === 'list') {
        const f = q.toLowerCase();
        const list = pool.filter(r => !f || (r.name + ' ' + (r.bossName || '') + ' ' + r.area).toLowerCase().includes(f));
        list.slice(0, 60).forEach(r => print((t.rewardState(r.id) === 'collected' ? '[x] ' : '[ ] ') + r.name + (r.bossName ? '  <- ' + r.bossName : ''), t.rewardState(r.id) === 'collected' ? 'ok' : ''));
        print(list.length + ' match' + (list.length > 60 ? ' (first 60 shown)' : ''), 'dim');
      } else if (sub === 'collect' || sub === 'reset') {
        const v = sub === 'collect' ? 'collected' : 'unknown';
        if (!q) return print('Usage: ' + (source ? 'talisman' : 'reward') + ' ' + sub + ' <name|all>', 'err');
        let targets;
        if (q.toLowerCase() === 'all') targets = pool;
        else { const r = pick(pool, q, x => x.name, 'item'); targets = r ? [r] : []; }
        if (!targets.length) return;
        bulk(() => targets.forEach(r => t.setRewardState(r.id, v)));
        print((sub === 'collect' ? 'Collected ' : 'Reset ') + targets.length + ' item(s).', 'ok');
      } else print('Usage: ' + (source ? 'talisman' : 'reward') + ' list | collect | reset', 'err');
    },

    talisman(args) { commands.reward(args, T().talismans()); },

    snapshot(args) {
      const sub = (args[0] || '').toLowerCase(), name = args[1] || 'default';
      const snaps = lsGet(LS.snaps, {});
      if (sub === 'save') {
        T().save();
        snaps[name] = { at: new Date().toISOString(), raw: localStorage.getItem(SAVE_KEY) };
        lsSet(LS.snaps, snaps);
        print('Snapshot "' + name + '" saved.', 'ok');
      } else if (sub === 'restore') {
        if (!snaps[name]) return print('No snapshot named "' + name + '".', 'err');
        localStorage.setItem(SAVE_KEY, snaps[name].raw);
        print('Restoring "' + name + '" and reloading...', 'ok');
        setTimeout(() => location.reload(), 400);
      } else if (sub === 'list') {
        const names = Object.keys(snaps);
        if (!names.length) print('No snapshots yet.', 'dim');
        names.forEach(n => print(n + '  ' + new Date(snaps[n].at).toLocaleString()));
      } else if (sub === 'drop') {
        if (!snaps[name]) return print('No snapshot named "' + name + '".', 'err');
        delete snaps[name];
        lsSet(LS.snaps, snaps);
        print('Dropped "' + name + '".', 'ok');
      } else print('Snapshot save|restore|list|drop [name]', 'err');
    },

    async wipe() {
      print('This clears boss, task, reward and talisman progress (notes and settings stay). Tip: snapshot save first.', 'warn');
      if (!yes(await ask('Type y to confirm:'))) return print('Cancelled.', 'dim');
      T().resetProgress();
      rerender();
      print('Gameplay progress reset.', 'ok');
    },

    export() { T().exportData(); print('Backup download started.', 'ok'); },

    async passwd() {
      const c = await newConfig();
      if (c) printConfig(c);
    },

    logout() {
      lsDel(LS.trust);
      unlocked = false;
      print('Logged out. This browser is no longer authorized.', 'ok');
      setTimeout(close, 600);
    },

    clear() { out.textContent = ''; },
    exit() { close(); },
    quit() { close(); }
  };

  async function run(line) {
    const [cmd, ...args] = tokens(line);
    const fn = commands[(cmd || '').toLowerCase()];
    if (!fn) return print('Unknown command "' + cmd + '". Type help.', 'err');
    try { await fn(args); } catch (e) { print('Error: ' + (e && e.message || e), 'err'); }
  }

  // ---- Openers ----
  document.addEventListener('keydown', e => {
    if (e.ctrlKey && e.shiftKey && e.code === HOTKEY_CODE) { e.preventDefault(); toggle(); }
  });
  let taps = [];
  document.addEventListener('click', e => {
    if (!e.target.closest || !e.target.closest('.brand')) return;
    const now = Date.now();
    taps = taps.filter(t => now - t < 3000).concat(now);
    if (taps.length >= 5) { taps = []; toggle(); }
  });
})();
