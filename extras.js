(function() {
  const T = window.GA_TRACKER,
        TAL = window.GA_TALISMANS || [],
        R = [...(window.GA_REWARDS || []), ...TAL];
  
  const E = s => String(s ?? '').replace(/[&<>"']/g, c => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;'
  }[c]));

  const APPEARANCE_PRESETS = {
    'golden-age': {
      name: 'The Golden Age',
      colors: { bg: '#11120f', bg2: '#181914', panel: '#1b1d18', sidebar: '#171914', header: '#141610', text: '#eee8d8', muted: '#b8b19f', heading: '#ebd59e', accent: '#ddbf7b', accent2: '#907446', line: '#494838', button: '#24261f', buttonText: '#eee8d8', link: '#ddbf7b', progress: '#ddbf7b', success: '#9fc58a', warning: '#e2bc76', error: '#e3987a', locked: '#D08A70', available: '#8EBB7A', defeated: '#8FA8C9' }
    },
    'grace-of-gold': {
      name: 'Grace of Gold',
      colors: { bg: '#17130d', bg2: '#21190f', panel: '#282015', sidebar: '#20180f', header: '#1a140c', text: '#f4e7c8', muted: '#c5b58e', heading: '#f2d98f', accent: '#f1c85a', accent2: '#b98b38', line: '#6b532e', button: '#342819', buttonText: '#fff0c9', link: '#f0cd70', progress: '#e5bd54', success: '#aed08b', warning: '#f0c56c', error: '#e38b6f', locked: '#D08A70', available: '#8EBB7A', defeated: '#8FA8C9' }
    },
    'shadow-erdtree': {
      name: 'Shadow of the Erdtree',
      colors: { bg: '#151613', bg2: '#1e201b', panel: '#24261f', sidebar: '#1b1d18', header: '#171913', text: '#e7e6dc', muted: '#b6b9aa', heading: '#d5d0aa', accent: '#c7bb87', accent2: '#817b5e', line: '#4c4c40', button: '#292a23', buttonText: '#e7e6dc', link: '#d1c486', progress: '#bdb17a', success: '#9fb995', warning: '#d1b477', error: '#d38a79', locked: '#D08A70', available: '#8EBB7A', defeated: '#8FA8C9' }
    },
    'lands-between': {
      name: 'The Lands Between',
      colors: { bg: '#14140e', bg2: '#1b1c14', panel: '#232318', sidebar: '#191a13', header: '#15160f', text: '#e8e4d2', muted: '#b9b59c', heading: '#ddcf9b', accent: '#c5ad67', accent2: '#827345', line: '#4c4933', button: '#29291c', buttonText: '#eee6c8', link: '#d3bb73', progress: '#b8a65e', success: '#a7bd80', warning: '#d2b267', error: '#cf8068', locked: '#D08A70', available: '#8EBB7A', defeated: '#8FA8C9' }
    },
    'abyssal-night': {
      name: 'Abyssal Night',
      colors: { bg: '#0c1017', bg2: '#111824', panel: '#18202b', sidebar: '#111923', header: '#0e141e', text: '#e0e7ef', muted: '#aab7c5', heading: '#cad5df', accent: '#9bb6cc', accent2: '#617d96', line: '#394957', button: '#202b38', buttonText: '#e8eff5', link: '#a9c7df', progress: '#91b4cf', success: '#94c3ae', warning: '#d3bd88', error: '#d78e8e', locked: '#D08A70', available: '#8EBB7A', defeated: '#8FA8C9' }
    },
    'scarlet-rot': {
      name: 'Scarlet Rot',
      colors: { bg: '#160e11', bg2: '#211317', panel: '#29191d', sidebar: '#1d1216', header: '#190f12', text: '#eee0dd', muted: '#c2aaa5', heading: '#dfbbb0', accent: '#c98778', accent2: '#86534b', line: '#573a38', button: '#352124', buttonText: '#f1e2dd', link: '#d18d7f', progress: '#bd7569', success: '#a5b987', warning: '#d7ae73', error: '#e27670', locked: '#D08A70', available: '#8EBB7A', defeated: '#8FA8C9' }
    },
    'raya-lucaria': {
      name: 'Raya Lucaria',
      colors: { bg: '#0e1119', bg2: '#151a26', panel: '#1c2331', sidebar: '#141a25', header: '#101520', text: '#e3e8f0', muted: '#b0bdcc', heading: '#d4deeb', accent: '#9dbbd3', accent2: '#617f9c', line: '#3c4a5a', button: '#222d3c', buttonText: '#e8eff7', link: '#a7c9e2', progress: '#8eb8d5', success: '#9ec8b2', warning: '#d6bd84', error: '#dc8b83', locked: '#D08A70', available: '#8EBB7A', defeated: '#8FA8C9' }
    },
    'dragon-communion': {
      name: 'Dragon Communion',
      colors: { bg: '#11100e', bg2: '#1a1512', panel: '#211a16', sidebar: '#191411', header: '#14110f', text: '#eee2d4', muted: '#b9a99a', heading: '#dfc398', accent: '#c58a61', accent2: '#80523c', line: '#4a372d', button: '#2b211b', buttonText: '#f2e2cf', link: '#d29a6e', progress: '#c98758', success: '#a4bb83', warning: '#d9ae70', error: '#d77561', locked: '#D08A70', available: '#8EBB7A', defeated: '#8FA8C9' }
    },
    'roundtable': {
      name: 'The Roundtable Hold',
      colors: { bg: '#15120e', bg2: '#201a13', panel: '#292117', sidebar: '#1d1912', header: '#17130e', text: '#eee3cf', muted: '#c3b397', heading: '#e7ce9e', accent: '#d3ad70', accent2: '#8d6d43', line: '#55432e', button: '#33281b', buttonText: '#f3e6cd', link: '#d9b87b', progress: '#c7a66a', success: '#a4bd8a', warning: '#dfbd7a', error: '#d88b75', locked: '#D08A70', available: '#8EBB7A', defeated: '#8FA8C9' }
    },
    'tarnished-silver': {
      name: 'Tarnished Silver',
      colors: { bg: '#121416', bg2: '#1a1e21', panel: '#23282b', sidebar: '#191d20', header: '#14181b', text: '#e6e9e9', muted: '#b4bcbe', heading: '#d8dddd', accent: '#b9c4c6', accent2: '#768588', line: '#485153', button: '#292f32', buttonText: '#eff1f1', link: '#c2d0d2', progress: '#aab8bb', success: '#9fc0ab', warning: '#d6c28d', error: '#d28c87', locked: '#D08A70', available: '#8EBB7A', defeated: '#8FA8C9' }
    }
  };

  const APPEARANCE_COLOR_KEYS = ['bg', 'bg2', 'panel', 'sidebar', 'header', 'text', 'muted', 'heading', 'accent', 'accent2', 'line', 'button', 'buttonText', 'link', 'progress', 'success', 'warning', 'error', 'locked', 'available', 'defeated'];
  const APPEARANCE_SETTING_KEYS = ['appearancePreset', 'appearanceColors', 'atmosphere', 'backgroundImage', 'backgroundImageOpacity', 'backgroundPosition', 'backgroundScale', 'overlayDarkness', 'backgroundBlur', 'typographyPreset', 'baseFontSize', 'headingScale', 'lineSpacing', 'letterSpacing', 'contentWidth', 'density', 'cornerStyle', 'borderStyle', 'shadowStyle', 'cardStyle', 'sidebarWidth', 'navigationDensity', 'decorativeStyle', 'iconStyle', 'showPageEmblems', 'animations', 'reducedMotion', 'hoverTransitions', 'progressAnimations', 'achievementAnimations', 'showDecorativeImages'];

  const appearancePalette = () => {
    let p = APPEARANCE_PRESETS[T.settings.appearancePreset] || APPEARANCE_PRESETS['golden-age'];
    return {
      unknown: '#C7BDC0',
      ...p.colors,
      ...Object.fromEntries(Object.entries(T.settings.appearanceColors || {}).filter(([k, v]) => APPEARANCE_COLOR_KEYS.includes(k) && /^#[0-9a-f]{6}$/i.test(v)))
    };
  };

  const hexDistance = (a, b) => {
    let x = a.match(/[0-9a-f]{2}/ig).map(v => parseInt(v, 16)),
        y = b.match(/[0-9a-f]{2}/ig).map(v => parseInt(v, 16));
    return Math.hypot(x[0] - y[0], x[1] - y[1], x[2] - y[2]);
  };

  const luminance = hex => {
    let c = hex.match(/[0-9a-f]{2}/ig).map(v => parseInt(v, 16) / 255).map(v => v <= .04045 ? v / 12.92 : ((v + .055) / 1.055) ** 2.4);
    return .2126 * c[0] + .7152 * c[1] + .0722 * c[2];
  };

  const contrastRatio = (a, b) => {
    let x = luminance(a),
        y = luminance(b);
    return (Math.max(x, y) + .05) / (Math.min(x, y) + .05);
  };

  function applySettingEffects() {
    let s = T.settings,
        root = document.documentElement,
        p = appearancePalette(),
        vars = {
          bg: '--bg', bg2: '--bg2', panel: '--panel', sidebar: '--sidebar', header: '--header',
          text: '--text', muted: '--muted', heading: '--heading', accent: '--gold', accent2: '--gold2',
          line: '--line', button: '--button-bg', buttonText: '--button-text', link: '--link',
          progress: '--progress', success: '--success', warning: '--warning', error: '--error',
          locked: '--locked', available: '--available', defeated: '--defeated', unknown: '--unknown'
        };
    
    Object.entries(vars).forEach(([k, v]) => root.style.setProperty(v, p[k]));
    
    let fonts = {
      'classic-fantasy': ['Georgia, "Times New Roman", serif', 'Georgia, "Times New Roman", serif', 'system-ui, sans-serif'],
      modern: ['system-ui, -apple-system, "Segoe UI", sans-serif', 'system-ui, -apple-system, "Segoe UI", sans-serif', 'system-ui, sans-serif'],
      manuscript: ['Palatino Linotype, Book Antiqua, Georgia, serif', 'Cambria, Georgia, serif', 'Segoe UI, sans-serif'],
      minimal: ['Arial, Helvetica, sans-serif', 'Arial, Helvetica, sans-serif', 'Arial, sans-serif']
    }[s.typographyPreset] || ['Georgia, serif', 'Georgia, serif', 'system-ui, sans-serif'];

    root.style.setProperty('--font-heading', fonts[0]);
    root.style.setProperty('--font-body', fonts[1]);
    root.style.setProperty('--font-ui', fonts[2]);
    root.style.setProperty('--base-size', (Number(s.baseFontSize) || 15) + 'px');
    root.style.setProperty('--heading-scale', String(Number(s.headingScale) || 1));
    root.style.setProperty('--line-height', String(Number(s.lineSpacing) || 1.55));
    root.style.setProperty('--letter-spacing', (Number(s.letterSpacing) || 0) + 'em');
    root.style.setProperty('--sidebar-width', s.sidebarWidth === 'narrow' ? '205px' : '250px');
    root.style.setProperty('--image-opacity', String(Math.max(0, Math.min(0.4, Number(s.backgroundImageOpacity) || 0))));
    root.style.setProperty('--image-position', s.backgroundPosition || 'center');
    root.style.setProperty('--image-scale', Math.max(90, Math.min(150, Number(s.backgroundScale) || 100)) + '%');
    root.style.setProperty('--overlay-darkness', String(Math.max(0, Math.min(95, Number(s.overlayDarkness) || 0)) / 100));
    root.style.setProperty('--background-blur', Math.max(0, Math.min(8, Number(s.backgroundBlur) || 0)) + 'px');
    root.style.setProperty('--content-width', ({ narrow: '950px', standard: '1450px', wide: '1750px', full: 'none' }[s.contentWidth] || '1450px'));

    let motion = s.animations && !s.reducedMotion && !matchMedia('(prefers-reduced-motion: reduce)').matches;
    root.dataset.theme = 'dark';
    root.dataset.accent = 'gold';
    root.dataset.density = s.density || 'comfortable';
    root.dataset.images = s.showDecorativeImages ? 'on' : 'off';
    root.dataset.animations = motion ? 'on' : 'off';
    root.dataset.appearance = s.appearancePreset || 'golden-age';
    root.dataset.atmosphere = s.atmosphere || 'subtle';
    root.dataset.backgroundImage = s.backgroundImage ? 'on' : 'off';
    root.dataset.corners = s.cornerStyle || 'slight';
    root.dataset.borders = s.borderStyle || 'standard';
    root.dataset.shadows = s.shadowStyle || 'subtle';
    root.dataset.cardStyle = s.cardStyle || 'gradient';
    root.dataset.decorative = s.decorativeStyle || 'restrained';
    root.dataset.iconStyle = s.iconStyle || 'gold-line';
    root.dataset.pageEmblems = s.showPageEmblems ? 'on' : 'off';
    root.dataset.navDensity = s.navigationDensity || 'standard';
    root.dataset.hover = s.hoverTransitions ? 'on' : 'off';
    root.dataset.progressMotion = s.progressAnimations && motion ? 'on' : 'off';
    root.dataset.achievementMotion = s.achievementAnimations && motion ? 'on' : 'off';
    root.dataset.width = s.contentWidth || 'standard';
    root.dataset.serif = /fantasy|manuscript/.test(s.typographyPreset || 'classic-fantasy') ? 'on' : 'off';
  }

  const boss = id => T.bosses.find(b => b.id === id),
        state = r => T.rewardState(r.id),
        symbol = c => ({ 'Weapons': '⚔', 'Armor': '♜', 'Shields': '◈', 'Talismans & Rings': '✧', 'Talismans': '✧', 'Sorceries & Incantations': '✦', 'Spirit Ashes': '♧', 'Key Items & Other': '◇', 'Other': '✹' }[c] || '✧');
  
  const collectedTalismans = () => TAL.filter(x => state(x) === 'collected'),
        allSeven = () => ((TAL[7]?.prerequisiteIds) || TAL.slice(0, 7).map(x => x.id)).every(id => T.rewardStates[id] === 'collected'),
        effectText = x => Array.isArray(x.effect) ? x.effect.join(' ') : x.effect,
        setCollection = (id, value) => {
          if (id === TAL[7]?.id && value === 'collected' && !allSeven()) {
            alert('Collect the first seven hidden talismans before confirming Eccentric Corpse.');
            return false;
          }
          T.setRewardState(id, value);
          return true;
        };

  function bossReady(b) {
    return (b.bossReq || []).every(n => {
      let x = T.bosses.find(q => q.name === n);
      return x ? T.defeated(n) : T.availableByName(n);
    });
  }

  function rewardPage() {
    let v = document.getElementById('extras-content');
    if (!v) return;
    
    v.innerHTML = '<div class="small">FIELD GUIDE · REWARD LEDGER</div><h1>Drops &amp; Rewards</h1><p class="page-intro">Browse boss rewards and the eight hidden talismans. Item collection is tracked separately from boss victories.</p><p><a class="button-link" href="talismans.html">Open the Hidden Talismans field guide →</a></p><div class="toolbar"><input id="rwq" class="search" placeholder="Search item, boss, area, or location"><select id="rwview"><option value="boss">Browse by Boss</option><option value="item">Browse by Item</option></select><select id="rwcat"><option value="">All categories</option>' + Array.from(new Set(R.map(x => x.category))).sort().map(x => '<option>' + E(x) + '</option>').join('') + '</select><select id="rwarea"><option value="">All areas</option>' + Array.from(new Set(R.map(x => x.area))).sort().map(x => '<option>' + E(x) + '</option>').join('') + '</select><select id="rwtype"><option value="">All acquisition types</option><option value="boss">Boss rewards</option><option value="hidden pickup">Hidden talisman pickups</option><option value="collection reward">Final collection reward</option></select><select id="rwBoss"><option value="">Any boss state</option><option value="Defeated">Boss defeated</option><option value="Available">Boss available</option><option value="Locked">Boss locked</option><option value="Unknown">Boss unknown</option></select><select id="rwstate"><option value="">Any collection state</option><option value="collected">Collected</option><option value="uncollected">Not collected</option></select><select id="rwverify"><option value="">All verification</option><option>Partially verified</option><option>Unverified</option><option>Conflicting sources</option></select><select id="rwsort"><option value="item">Sort: item</option><option value="boss">Sort: boss</option><option value="area">Sort: area</option></select><button id="rwclear">Clear filters</button></div><div class="toolbar"><label class="small"><input id="rwgroup" type="checkbox"> Group by category</label><span class="small">' + collectedTalismans().length + ' / 8 hidden talismans collected</span></div><div id="reward-results" class="list"></div>';
    
    const ids = ['rwq', 'rwview', 'rwcat', 'rwarea', 'rwtype', 'rwBoss', 'rwstate', 'rwverify', 'rwsort', 'rwgroup'],
          els = ids.map(x => document.getElementById(x)),
          params = new URLSearchParams(location.search);
          
    if (params.has('boss')) els[0].value = params.get('boss');
    if (params.has('category')) els[2].value = params.get('category');
    
    function draw() {
      let q = els[0].value.toLowerCase(),
          view = els[1].value,
          cat = els[2].value,
          area = els[3].value,
          type = els[4].value,
          bossStatus = els[5].value,
          cs = els[6].value,
          ver = els[7].value,
          sort = els[8].value,
          group = els[9].checked;
          
      let list = R.filter(r => {
        let s = state(r),
            isTal = TAL.some(t => t.id === r.id),
            b = r.bossId ? boss(r.bossId) : null,
            bst = b ? T.statusOf(b) : 'Unknown',
            text = [r.name, r.bossName, r.area, r.location, r.category, r.acquisition, r.notes, effectText(r)].join(' ').toLowerCase();
            
        return (!q || text.includes(q)) && (!cat || r.category === cat) && (!area || r.area === area) && (!ver || r.verification === ver) && (!type || type === 'boss' && !isTal || r.acquisitionType === type) && (!bossStatus || !!b && bst === bossStatus) && (!cs || cs === 'collected' && s === 'collected' || cs === 'uncollected' && s !== 'collected');
      });
      
      list.sort((a, b) => sort === 'boss' ? String(a.bossName || '').localeCompare(String(b.bossName || '')) || a.name.localeCompare(b.name) : sort === 'area' ? a.area.localeCompare(b.area) || a.name.localeCompare(b.name) : a.name.localeCompare(b.name));
      
      let row = r => {
        let st = state(r),
            isTal = TAL.some(t => t.id === r.id),
            b = r.bossId ? boss(r.bossId) : null;
            
        return '<article class="reward-card ' + (isTal ? 'talisman-reward' : '') + '"><div class="reward-icon" aria-hidden="true">' + symbol(r.category) + '</div><div class="reward-copy"><div class="reward-title" ' + (!isTal ? 'data-reward="' + E(r.id) + '"' : '') + '>' + E(r.name) + '</div><div class="small">' + E(r.category) + ' · ' + E(r.verification) + (r.verificationBasis === 'User-confirmed' ? ' · user confirmed' : '') + '</div>' + (isTal ? '<p class="small">Hidden talisman · ' + E(r.area) + '</p><p>' + E(effectText(r)) + '</p><p><a href="talismans.html?item=' + encodeURIComponent(r.id) + '">Open location &amp; details →</a> · <a href="journal.html?item=' + encodeURIComponent(r.id) + '&amp;area=' + encodeURIComponent(r.area) + '&amp;create=1">Journal</a></p>' : '<p class="small">From <a href="bosses.html?boss=' + encodeURIComponent(r.bossName) + '">' + E(r.bossName) + '</a> · ' + E(r.area) + ' · <a href="journal.html?boss=' + encodeURIComponent(r.bossId || '') + '&amp;item=' + encodeURIComponent(r.id) + '&amp;area=' + encodeURIComponent(r.area) + '&amp;create=1">Journal</a></p><p>' + E(r.acquisition) + '</p><p class="small">Boss: ' + (T.defeated(r.bossName) ? 'Defeated' : T.availableByName(r.bossName) ? 'Available' : 'Locked') + '</p>') + '<p class="small">Collection: ' + E(st) + '</p><label class="small">Collection status <select data-reward-state="' + E(r.id) + '"><option value="unknown" ' + (st === 'unknown' ? 'selected' : '') + '>Unknown</option><option value="not collected" ' + (st === 'not collected' ? 'selected' : '') + '>Not collected</option><option value="collected" ' + (st === 'collected' ? 'selected' : '') + '>Collected</option></select></label></div></article>';
      };
      
      let out = document.getElementById('reward-results'),
          tal = list.filter(r => TAL.some(t => t.id === r.id)),
          normal = list.filter(r => !TAL.some(t => t.id === r.id));
          
      let catalog = view === 'boss' ? Array.from(new Set(normal.map(r => r.bossId))).map(id => {
        let b = boss(id),
            rr = normal.filter(x => x.bossId === id);
        return b ? '<details class="reward-boss"><summary><b>' + E(b.name) + '</b> <span class="pill">' + E(b.game) + '</span> · ' + E(b.area) + '</summary><div class="reward-grid">' + rr.map(row).join('') + '</div></details>' : '';
      }).join('') : group ? Array.from(new Set(normal.map(x => x.category))).map(c => '<section><h2>' + E(c) + '</h2><div class="reward-grid">' + normal.filter(x => x.category === c).map(row).join('') + '</div></section>').join('') : '<div class="reward-grid">' + normal.map(row).join('') + '</div>';
      
      out.innerHTML = (catalog || '') + (tal.length ? '<section><h2>Hidden Talismans <span class="small">' + tal.filter(x => state(x) === 'collected').length + ' / 8 collected</span></h2><div class="reward-grid">' + tal.map(row).join('') + '</div></section>' : '') || '<p>No rewards match those filters.</p>';
      
      out.querySelectorAll('[data-reward-state]').forEach(x => x.onchange = () => {
        setCollection(x.dataset.rewardState, x.value);
        draw();
      });
      out.querySelectorAll('[data-reward]').forEach(x => x.onclick = () => detail(R.find(r => r.id === x.dataset.reward)));
    }
    
    els.forEach(x => x.addEventListener('input', draw));
    document.getElementById('rwclear').onclick = () => {
      els.forEach(x => {
        if (x.type === 'checkbox') x.checked = false;
        else x.value = '';
      });
      draw();
    };
    draw();
  }

  function detail(r) {
    let b = boss(r.bossId),
        dlg = document.createElement('dialog');
    dlg.className = 'guide-dialog';
    let src = r.sourceUrl ? '<a href="' + E(r.sourceUrl) + '" target="_blank" rel="noreferrer">' + E(r.sourceTitle) + '</a>' : E(r.sourceTitle);
    
    dlg.innerHTML = '<button class="close">Close</button><h2>' + E(r.name) + '</h2><div class="reward-icon large">' + symbol(r.category) + '</div><p><b>Category:</b> ' + E(r.category) + ' · <b>Verification:</b> ' + E(r.verification) + (r.verificationBasis === 'User-confirmed' ? ' · user confirmed' : '') + '</p><p><b>Boss:</b> <a href="bosses.html?boss=' + encodeURIComponent(r.bossName) + '">' + E(r.bossName) + '</a> · ' + E(r.area) + '</p><p><b>Location:</b> ' + E(r.location) + '</p><p><b>Acquisition:</b> ' + E(r.acquisition) + '</p><p><b>Mod version:</b> ' + E(r.modVersion) + '</p><p>' + E(r.notes) + '</p><p><b>Source:</b> ' + src + '</p><label>Collection status <select class="dlgstate"><option>unknown</option><option>not collected</option><option>collected</option><option>not applicable</option></select></label><p><a href="bosses.html?boss=' + encodeURIComponent(r.bossName) + '">Open boss checklist →</a> · <a href="prereqs.html?boss=' + encodeURIComponent(r.bossName) + '">See related prerequisites →</a></p><h3>Known prerequisites</h3><p>' + E((b.bossReq || []).map(x => 'Defeat ' + x).concat(b.taskReq || []).join(' · ') || 'None listed in the current checklist.') + '</p>';
    
    document.body.append(dlg);
    dlg.querySelector('.dlgstate').value = state(r);
    dlg.querySelector('.dlgstate').onchange = e => { T.setRewardState(r.id, e.target.value); };
    dlg.querySelector('.close').onclick = () => dlg.close();
    dlg.onclose = () => dlg.remove();
    dlg.showModal();
  }

  const uniqueTasks = Array.from(new Map(T.bosses.flatMap(b => (b.taskReq || []).map(name => ['task-' + T.slug(name), { id: 'task-' + T.slug(name), name }]))).values());

  function taskCategory(n) {
    if (/speak|talk|dialogue|exhaust/i.test(n)) return 'Required interactions';
    if (/obtain|ring|bell|item/i.test(n)) return 'Required items';
    if (/ignite|grace|activate|unlock|progress|reach/i.test(n)) return 'Required area progression';
    if (/check whether|version/i.test(n)) return 'Unknown or unverified';
    return 'Multi-step quests and special conditions';
  }

  function prereqPage() {
    let v = document.getElementById('view'),
        owners = t => T.mods().filter(b => (b.taskReq || []).includes(t.name)),
        steps = uniqueTasks.filter(t => !T.taskDone(t.name)).map(t => ({ t, owners: owners(t) })).map(x => ({ ...x, ready: x.owners.filter(b => bossReady(b) && !T.defeated(b.name)).length }));
        
    let top = Math.max(0, ...steps.map(x => x.ready)),
        rec = steps.filter(x => x.ready === top && top > 0);
        
    v.innerHTML = '<div class="small">Shared progression guide</div><h1>Prerequisites</h1><p>Each task is one shared record, even when several bosses use it. Steps whose instructions are not established by the guide are labeled unverified.</p><section class="panel"><h2>Recommended Next Steps</h2><p>Recommendations rank incomplete tasks by how many undefeated linked bosses have their listed boss prerequisites met. This indicates likely relevance, not proof that the task is immediately doable in-game.</p><div class="grid">' + (rec.map(x => '<div class="row"><b>' + E(x.t.name) + '</b><p class="small">Could help unlock ' + x.ready + ' currently relevant boss' + (x.ready === 1 ? '' : 'es') + ': ' + x.owners.filter(b => bossReady(b) && !T.defeated(b.name)).map(b => E(b.name)).join(', ') + '</p><button data-task-focus="' + E(x.t.id) + '">View task</button></div>').join('') || '<p>No incomplete task can be prioritized from the currently known boss dependencies.</p>') + '</div></section><div class="toolbar"><input id="pq" class="search" placeholder="Search prerequisite, location, boss, or reward"><select id="ps"><option value="">All statuses</option><option value="incomplete">Incomplete</option><option value="completed">Completed</option><option value="inprogress">In progress</option><option value="available">Available now</option><option value="blocked">Linked bosses blocked</option><option value="unknown">Unknown / unverified</option></select><select id="pc"><option value="">All groups</option>' + Array.from(new Set(uniqueTasks.map(t => taskCategory(t.name)))).map(x => '<option>' + E(x) + '</option>').join('') + '</select><select id="pb"><option value="">Any boss</option>' + T.mods().map(b => '<option>' + E(b.name) + '</option>').join('') + '</select><select id="pa"><option value="">Any area</option>' + Array.from(new Set(T.mods().map(b => b.area))).map(a => '<option>' + E(a) + '</option>').join('') + '</select><select id="psort"><option value="relevance">Sort by relevance</option><option value="area">Sort by area</option><option value="name">Sort by task</option></select></div><div id="task-groups"></div><h2 class="section-title">Quest and progression chains</h2><div class="list">' + T.mods().filter(b => (b.taskReq || []).length > 1).map(b => '<details class="chain row"><summary><b>' + E(b.name) + ' chain</b> <span class="pill">' + (b.taskReq.filter(T.taskDone).length) + ' / ' + b.taskReq.length + ' steps</span></summary><p class="small">Encounter location: ' + E(b.location) + ' · Listed boss prerequisites: ' + ((b.bossReq || []).map(E).join(', ') || 'None') + '</p><ol>' + b.taskReq.map(n => '<li><label><input type="checkbox" data-shared-task="' + E(n) + '" ' + (T.taskDone(n) ? 'checked' : '') + '> ' + E(n) + '</label></li>').join('') + '</ol><p class="small">The source checklist gives these as steps but does not provide a verified step-by-step walkthrough. Source: existing project checklist.</p></details>').join('') + '</div>';
        
    let prm = new URLSearchParams(location.search);
    if (prm.has('boss')) document.getElementById('pb').value = prm.get('boss');
    
    function draw() {
      let q = document.getElementById('pq').value.toLowerCase(),
          status = document.getElementById('ps').value,
          cat = document.getElementById('pc').value,
          related = document.getElementById('pb').value,
          area = document.getElementById('pa').value,
          sort = document.getElementById('psort').value;
          
      let arr = uniqueTasks.filter(t => {
        let os = owners(t),
            isDone = T.taskDone(t.name),
            ready = os.some(b => bossReady(b) && !T.defeated(b.name)),
            blocked = os.length && !ready,
            text = [t.name, ...os.map(b => b.name + ' ' + b.area + ' ' + b.location), ...R.filter(r => os.some(b => b.name === r.bossName)).map(r => r.name)].join(' ').toLowerCase();
            
        return (!q || text.includes(q)) && (!status || status === 'completed' && isDone || status === 'incomplete' && !isDone || status === 'inprogress' && !isDone && os.some(b => b.taskReq.length > 1 && b.taskReq.some(T.taskDone) && !b.taskReq.every(T.taskDone)) || status === 'available' && !isDone && ready || status === 'blocked' && !isDone && !ready || status === 'unknown' && /check whether|version/i.test(t.name)) && (!cat || taskCategory(t.name) === cat) && (!related || os.some(b => b.name === related)) && (!area || os.some(b => b.area === area));
      });
      
      arr.sort((a, b) => sort === 'name' ? a.name.localeCompare(b.name) : sort === 'area' ? (owners(a)[0]?.area || '').localeCompare(owners(b)[0]?.area || '') || a.name.localeCompare(b.name) : (owners(b).filter(x => bossReady(x) && !T.defeated(x.name)).length - owners(a).filter(x => bossReady(x) && !T.defeated(x.name)).length));
      
      let group = document.getElementById('task-groups');
      group.innerHTML = Array.from(new Set(arr.map(t => taskCategory(t.name)))).map(c => '<section class="area"><h2>' + E(c) + '</h2><div class="grid">' + arr.filter(t => taskCategory(t.name) === c).map(t => {
        let os = owners(t),
            isDone = T.taskDone(t.name),
            ready = os.some(b => bossReady(b) && !T.defeated(b.name)),
            affected = os.map(b => b.name),
            blocked = os.flatMap(b => (b.bossReq || []).filter(n => !T.availableByName(n)));
            
        let label = isDone ? 'Completed' : ready ? 'Available now' : blocked.length ? 'Linked bosses blocked' : 'Not started';
        return '<details class="task-guide row" id="' + E(t.id) + '"><summary><label><input type="checkbox" data-shared-task="' + E(t.name) + '" ' + (isDone ? 'checked' : '') + '> <b>' + E(t.name) + '</b></label> <span class="pill">' + label + '</span> <span class="pill">Unverified guide item</span></summary><p><b>What:</b> ' + E(t.name) + '</p><p><b>Where:</b> ' + (os.length ? E(Array.from(new Set(os.map(b => b.area))).join('; ')) : 'Not specified by the current checklist') + '</p><p><b>Before you start:</b> ' + (blocked.length ? E(Array.from(new Set(blocked)).join(', ')) : 'No separate prerequisite for this task is recorded.') + '</p><p><b>How to confirm:</b> The checklist provides this task label only; a verified completion cue is not documented.</p><p><b>Unlocks:</b> ' + (affected.map(n => '<a href="bosses.html?boss=' + encodeURIComponent(n) + '">' + E(n) + '</a>').join(', ') || 'No linked boss') + '</p><p><b>Source:</b> Existing project checklist · <b>Verification:</b> Unverified unless separately sourced.</p><p class="small">Missing boss requirements: ' + (blocked.length ? E(Array.from(new Set(blocked)).join(', ')) : 'None known') + '</p></details>';
      }).join('') + '</div></section>').join('') || '<p>No prerequisites match these filters.</p>';
      
      group.querySelectorAll('[data-shared-task]').forEach(x => x.onchange = () => T.taskSet(x.dataset.sharedTask, x.checked));
    }
    
    ['pq', 'ps', 'pc', 'pb', 'pa', 'psort'].forEach(id => document.getElementById(id).oninput = draw);
    document.querySelectorAll('[data-task-focus]').forEach(x => x.onclick = () => {
      let d = document.getElementById(x.dataset.taskFocus);
      if (d) {
        d.open = true;
        d.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    });
    document.querySelectorAll('.chain [data-shared-task]').forEach(x => x.onchange = () => T.taskSet(x.dataset.sharedTask, x.checked));
    draw();
  }

  const achievementDefs = [];

  function bossCount() { return T.mods().filter(b => T.defeated(b.name)).length; }
  function taskCount() { return T.tasks.filter(t => T.taskDone(t.name)).length; }
  function rewardCount() { return new Set(R.filter(r => state(r) === 'collected').map(r => T.rewardKey(r))).size; }
  function representedAreas() { return Array.from(new Set(T.mods().map(b => b.area).filter(Boolean))); }

  function progression() {
    let m = T.mods(),
        tasks = T.tasks,
        areas = representedAreas(),
        collected = rewardCount(),
        cats = Array.from(new Set(R.map(r => r.category))),
        bosses = bossCount(),
        completedTasks = taskCount(),
        catsDone = cats.filter(c => R.some(r => r.category === c && state(r) === 'collected')).length;
        
    return {
      bosses,
      totalBosses: m.length,
      tasks: completedTasks,
      totalTasks: tasks.length,
      rewards: collected,
      totalRewards: new Set(R.map(r => T.rewardKey(r))).size,
      areas: areas.filter(a => m.some(b => b.area === a && T.defeated(b.name))).length,
      totalAreas: areas.length,
      categories: catsDone,
      totalCategories: cats.length
    };
  }

  function talismanDependencies() {
    let done = TAL.slice(0, 7).filter(x => state(x) === 'collected').length,
        ready = allSeven(),
        last = state(TAL[7]) === 'collected';
        
    return '<section class="talisman-dependency panel"><div class="page-kicker">COLLECTION GATE</div><h2>Eccentric Corpse · Final Offering</h2><p>' + done + ' / 7 required hidden talismans collected. The final talisman is a separate pickup confirmation and is never auto-marked.</p><div class="talisman-dependency-grid">' + TAL.slice(0, 7).map(x => '<a class="talisman-dependency-item ' + (state(x) === 'collected' ? 'is-collected' : '') + '" href="talismans.html?item=' + encodeURIComponent(x.id) + '"><span>' + (state(x) === 'collected' ? '✓' : '◇') + '</span>' + E(x.name) + '</a>').join('') + '</div><p class="pill ' + (last ? 'pill-done' : ready ? 'pill-ready' : 'pill-locked') + '">' + (last ? 'Final offering collected' : ready ? 'Ready to collect · confirm at Worldlink Atrium' : 'Locked · collect all first seven') + '</p><a href="talismans.html">Open hidden talisman guide →</a></section>';
  }

  function talismanPage() {
    let v = document.getElementById('extras-content');
    if (!v) return;
    
    let collected = collectedTalismans().length,
        finalReady = allSeven(),
        finalDone = state(TAL[7]) === 'collected';
        
    v.innerHTML = '<div class="small">FIELD GUIDE · WORLDLINK SECRETS</div><h1>Hidden Talismans</h1><p class="page-intro">Eight hidden talismans are recorded here. Mark each pickup only after you find it; the final offering has its own collection step.</p><section class="talisman-hero panel"><div><div class="page-kicker">THE HIDDEN RELIQUARY</div><h2>' + collected + ' / 8 collected</h2><p>Seven independent discoveries unlock a final interaction in the Worldlink Atrium.</p><div class="meter"><i style="width:' + Math.round(collected / 8 * 100) + '%"></i></div></div><div class="talisman-final-state ' + (finalDone ? 'is-collected' : finalReady ? 'is-ready' : '') + '"><span class="small">ECCENTRIC CORPSE</span><b>' + (finalDone ? 'Collected' : finalReady ? 'Ready at Worldlink Atrium' : 'Requires the first seven') + '</b><span>' + (finalDone ? 'Final offering confirmed' : finalReady ? 'Interact by the lit pillars, then confirm collection below.' : 'Collect all seven other talismans first.') + '</span></div></section><div class="talisman-grid">' + TAL.map((x, i) => {
      let st = state(x),
          isFinal = i === 7;
      return '<article class="talisman-card ' + (isFinal ? 'talisman-final' : '') + ' ' + (st === 'collected' ? 'is-collected' : '') + '" id="' + E(x.id) + '"><div class="talisman-card-head"><svg class="talisman-icon" aria-hidden="true"><use href="assets/talisman-emblems.svg#' + E(x.icon) + '"></use></svg><span class="pill">' + (isFinal ? (finalDone ? 'Collected' : finalReady ? 'Ready' : 'Gated by 7') : st === 'collected' ? 'Collected' : 'Hidden pickup') + '</span></div><h2>' + E(x.name) + '</h2><p class="talisman-area">' + E(x.area) + '</p><p><b>Grace:</b> ' + E(x.grace || x.location) + '</p><details class="talisman-details"><summary>Location &amp; effect details</summary><p><b>Location:</b> ' + E(x.location) + '</p><p><b>Directions:</b> ' + E(x.directions) + '</p><p><b>Effect:</b> ' + E(effectText(x)) + '</p>' + (x.effectNote ? '<p class="notice"><b>Unspecified details:</b> ' + E(x.effectNote) + '</p>' : '') + '<p><b>Prerequisites:</b> ' + E(x.prerequisites) + '</p><p><b>Verification:</b> ' + E(x.verification) + ' · ' + E(x.sourceTitle || 'Supplied checklist') + '</p></details><p><a class="button-link" href="journal.html?item=' + encodeURIComponent(x.id) + '&amp;area=' + encodeURIComponent(x.area) + '&amp;create=1">Write journal entry</a></p><label class="talisman-check"><input type="checkbox" data-talisman="' + E(x.id) + '" ' + (st === 'collected' ? 'checked' : '') + ' ' + (isFinal && !finalReady && !finalDone ? 'disabled' : '') + '><span>' + (isFinal ? 'I interacted with Eccentric Corpse and collected the final talisman' : 'I collected this talisman') + '</span></label>' + (isFinal && !finalReady && !finalDone ? '<p class="small">Collect the first seven to unlock this confirmation.</p>' : '') + '</article>';
    }).join('') + '</div><div class="notice"><b>Field notes</b><p>The tracker preserves uncertain wording from the supplied checklist. Some talisman effect values and Suitcase outcomes need confirmation in the relevant mod version.</p></div><p><a href="drops.html?category=Talismans">View talismans in Drops &amp; Rewards →</a></p>';
    
    v.querySelectorAll('[data-talisman]').forEach(c => c.onchange = () => {
      setCollection(c.dataset.talisman, c.checked ? 'collected' : 'not collected');
      talismanPage();
      if (window.GA_ACH_SYNC) window.GA_ACH_SYNC(false);
    });
    
    let params = new URLSearchParams(location.search);
    if (params.has('item')) {
      let card = document.getElementById(params.get('item'));
      if (card) {
        card.scrollIntoView({ block: 'center' });
        card.querySelector('details').open = true;
      }
    }
  }

  function dashboardPage() {
    let v = document.getElementById('dashboard-content');
    if (!v) return;
    
    let m = T.mods(),
        counts = T.statusCounts(m),
        openTasks = T.tasks.filter(x => !T.taskDone(x.name)).length,
        ready = m.filter(b => T.statusOf(b) === 'Available'),
        tDone = collectedTalismans().length,
        featured = ready.find(b => R.some(r => r.bossId === b.id)) || ready[0],
        fReward = featured && R.find(r => r.bossId === featured.id),
        total = m.length,
        pc = total ? Math.round(counts.Defeated / total * 100) : 0,
        next = ready.slice(0, 3);
        
    v.innerHTML = '<section class="dashboard-hero"><div class="dashboard-hero-copy"><div class="page-kicker">THE LANDS BETWEEN · FIELD JOURNAL</div><h1>The Golden Age</h1><p>Track your hunt, uncover hidden talismans, and follow the recorded paths through the Golden Age.</p><div class="dashboard-actions"><a class="button-link primary" href="bosses.html?status=Available&amp;scope=mod">Choose an available hunt</a><a class="button-link" href="talismans.html">Explore hidden talismans</a><a class="button-link" href="progression.html">Review progression</a></div></div><div class="dashboard-progress"><span class="small">MOD HUNT</span><b>' + counts.Defeated + ' <small>/ ' + total + '</small></b><span>encounters defeated</span><div class="meter"><i style="width:' + pc + '%"></i></div><span class="small">' + pc + '% complete</span></div></section><div class="dashboard-stats">' + [['Defeated', counts.Defeated, 'bosses.html?status=Defeated&scope=mod'], ['Available', counts.Available, 'bosses.html?status=Available&scope=mod'], ['Locked', counts.Locked, 'bosses.html?status=Locked&scope=mod'], ['Unknown', counts.Unknown, 'bosses.html?status=Unknown&scope=mod']].map(([n, c, u]) => '<a class="dashboard-stat" href="' + u + '"><span>' + E(n) + '</span><b>' + c + '</b></a>').join('') + '<a class="dashboard-stat" href="prereqs.html"><span>Open tasks</span><b>' + openTasks + '</b></a><a class="dashboard-stat" href="talismans.html"><span>Talismans</span><b>' + tDone + ' / 8</b></a></div><div class="dashboard-columns"><section class="dashboard-panel"><div class="page-kicker">YOUR NEXT STEPS</div><h2>Ready to pursue</h2><p>These encounters have no unmet recorded prerequisites.</p>' + (next.length ? '<ol class="dashboard-next">' + next.map(b => '<li><a href="bosses.html?boss=' + encodeURIComponent(b.name) + '"><b>' + E(b.name) + '</b><span>' + E(b.area) + ' · ' + E(b.game) + '</span></a></li>').join('') + '</ol>' : '<p>No undefeated boss currently meets all recorded requirements. Review the shared prerequisites and unknown entries.</p>') + '<p><a href="bosses.html?status=Available&amp;scope=mod">View all available bosses →</a></p></section><section class="dashboard-panel featured-hunt"><div class="page-kicker">FEATURED HUNT</div>' + (featured ? '<h2>' + E(featured.name) + '</h2><p>' + E(featured.area) + ' · ' + E(featured.game) + '</p><p>' + E(featured.location) + '</p><p class="small">Why this hunt: the recorded requirements are met, and this encounter has a documented route in the guide.</p>' + (fReward ? '<p><b>Recorded reward:</b> ' + E(fReward.name) + '</p>' : '<p>No specific reward is recorded for this encounter.</p>') + '<a href="bosses.html?boss=' + encodeURIComponent(featured.name) + '">Review hunt &amp; requirements →</a>' : '<h2>Read the field guide</h2><p>Begin with the boss checklist, then use prerequisites to resolve recorded locks.</p><a href="bosses.html">Open boss checklist →</a>') + '</section></div><section class="dashboard-discoveries"><div><div class="page-kicker">HIDDEN DISCOVERIES</div><h2>The eight hidden talismans</h2><p>' + tDone + ' / 8 collected · ' + (state(TAL[7]) === 'collected' ? 'Eccentric Corpse has been collected.' : allSeven() ? 'The Eccentric Corpse offering is ready at the Worldlink Atrium.' : (7 - collectedTalismans().filter(x => !x.finalReward).length) + ' of the first seven remain before the final offering.') + '</p></div><div class="discovery-seals">' + TAL.map(x => '<span class="discovery-seal ' + (state(x) === 'collected' ? 'is-collected' : '') + '" title="' + E(x.name) + '">' + (state(x) === 'collected' ? '✓' : '◇') + '</span>').join('') + '</div><a class="button-link" href="talismans.html">Open talisman guide →</a></section><div class="dashboard-links"><a href="about.html">About the mod</a><a href="drops.html">Drops &amp; Rewards</a><a href="achievements.html">Milestones</a><a href="settings.html">Back up progress</a></div>';
  }

  function aboutPage() {
    let v = document.getElementById('extras-content');
    if (!v) return;
    
    v.innerHTML = '<div class="page-kicker">COMPANION FIELD GUIDE</div><h1>About The Golden Age</h1><p class="page-intro">A multi-page companion for the Golden Age mod: a personal checklist for bosses, prerequisite routes, rewards, and hidden talismans.</p><section class="about-feature-grid"><article><span>⚔</span><h2>Follow the hunt</h2><p>Browse tracked mod encounters by region and original game. Defeated, available, locked, and unknown states stay distinct.</p><a href="bosses.html">Bosses &amp; Locations →</a></article><article><span>⌘</span><h2>Read the route</h2><p>Shared prerequisite checkboxes update linked boss guidance and reveal missing recorded steps.</p><a href="prereqs.html">Prerequisites →</a></article><article><span>✧</span><h2>Gather the hidden set</h2><p>Explore seven independent discoveries and the separately confirmed Eccentric Corpse final offering.</p><a href="talismans.html">Hidden Talismans →</a></article><article><span>▣</span><h2>Keep your ledger</h2><p>Track reward collection, personal notes, achievements, and portable JSON backups in this browser.</p><a href="settings.html">Settings &amp; Data →</a></article></section><section class="about-guide panel"><h2>Getting started</h2><ol><li>Mark confirmed victories in the Boss Checklist.</li><li>Check shared prerequisites when you complete them.</li><li>Record item collection independently from boss victories.</li><li>Export a backup from Settings &amp; Data when you want a portable copy.</li></ol><p>The companion does not inspect the game save. Requirement and talisman effect details are based on the supplied checklist and may vary by mod version. Unverified wording is kept visible so it can be checked against your installed version.</p></section><p><a href="home.html">Return to the dashboard →</a></p>';
  }

  function addAchievement(id, title, category, icon, description, requirement, current, target, condition, extra) {
    achievementDefs.push({ id, title, category, icon, description, requirement, current, target, condition, extra: extra || '' });
  }

  function buildAchievements() {
    achievementDefs.length = 0;
    let p = progression(),
        areas = representedAreas(),
        m = T.mods(),
        distinctRewards = new Set(R.map(r => T.rewardKey(r))).size,
        categories = Array.from(new Set(R.map(r => r.category))),
        areaCount = p.areas,
        allAreas = p.totalAreas > 0 && areaCount === p.totalAreas,
        chainBoss = m.filter(b => (b.taskReq || []).length >= 3).sort((a, b) => b.taskReq.length - a.taskReq.length)[0],
        chainDone = chainBoss ? chainBoss.taskReq.filter(T.taskDone).length : 0,
        weaponRows = Array.from(new Map(R.filter(r => r.category === 'Weapons').map(r => [T.rewardKey(r), r])).values()),
        weaponDone = new Set(weaponRows.filter(r => state(r) === 'collected').map(r => T.rewardKey(r))).size,
        doneCategories = categories.filter(c => R.some(r => r.category === c && state(r) === 'collected')).length,
        notes = T.notes.filter(n => String(n.text || '').trim()).length,
        combinedTotal = p.totalBosses + p.totalTasks + distinctRewards,
        combinedDone = p.bosses + p.tasks + p.rewards,
        combined = Math.floor(combinedDone / Math.max(1, combinedTotal) * 100);
        
    const add = (id, title, category, tier, icon, description, requirement, current, target, condition, extra = '', secret = false, hint = '') => achievementDefs.push({ id, title, category, tier, icon, description, requirement, current, target, condition, extra, secret, hint });
    
    add('first-steps', 'The First Tarnished Fall', 'Hunt & Discovery', 'Common', '✦', 'One name has been struck from the hunt.', 'Defeat your first tracked mod boss.', p.bosses, 1, p.bosses >= 1);
    add('worthy-pursuit', 'A Curious Relic', 'Treasures', 'Common', '◇', 'A first relic has found its way into your ledger.', 'Collect one unique reward record.', p.rewards, 1, p.rewards >= 1, 'Counts unique reward IDs from the current catalog.');
    add('taking-notes', 'The Chronicler', 'Fieldcraft', 'Common', '✎', 'A page has been added to your personal chronicle.', 'Create a non-empty saved note.', notes, 1, notes > 0);
    const personalized = T.settings.theme !== 'dark' || T.settings.accent !== 'gold' || T.settings.appearancePreset !== 'golden-age' || Object.keys(T.settings.appearanceColors || {}).length > 0;
    add('fresh-perspective', 'A Personal Touch', 'Fieldcraft', 'Common', '◉', 'The field guide now bears your chosen colors.', 'Choose a non-default appearance preset or custom color.', personalized ? 1 : 0, 1, personalized);
    add('far-wide', 'A Map of Misfortune', 'Hunt & Discovery', 'Uncommon', '⌖', 'Your hunt has crossed five distinct recorded areas.', 'Defeat at least one boss in 5 represented areas.', areaCount, 5, areaCount >= 5, 'Areas come from tracked boss records.');
    add('prereq-first-mark', 'The First Mark', 'Prerequisite Work', 'Common', '⌘', 'One shared checklist task has been completed.', 'Complete one unique shared prerequisite record.', p.tasks, 1, p.tasks >= 1);
    add('checklist-begins', 'The Thread Unravels', 'Prerequisite Work', 'Rare', '⌘', 'A linked quest line has been followed through its recorded steps.', 'Complete all ' + (chainBoss?.taskReq.length || 0) + ' shared task entries linked to ' + (chainBoss?.name || 'a tracked boss') + '.', chainDone, chainBoss?.taskReq.length || 1, !!chainBoss && chainDone === chainBoss.taskReq.length, chainBoss ? 'Checklist labels are tracked; their in-game order and verification are not established.' : 'No boss in the current dataset has a chain of three or more task records.');
    
    let hoardGoal = Math.max(5, Math.ceil(distinctRewards * .25));
    add('hoard-grows', 'The Hoard Grows', 'Treasures', 'Uncommon', '❖', 'A quarter of the known catalog is gathered.', 'Collect ' + hoardGoal + ' unique tracked reward records.', p.rewards, hoardGoal, p.rewards >= hoardGoal, 'Catalog completeness is limited to unique items included with this site.');
    add('formidable-pursuit', 'A Formidable Pursuit', 'Hunt & Discovery', 'Uncommon', '⚔', 'A meaningful portion of the roster has fallen.', 'Defeat at least 25% of tracked mod bosses.', p.bosses, Math.ceil(p.totalBosses * .25), p.bosses >= Math.ceil(p.totalBosses * .25));
    add('curated-collection', 'One of Everything', 'Treasures', 'Rare', '✧', 'Every represented reward category is in your collection.', 'Collect at least one unique reward from each of ' + categories.length + ' catalog categories.', doneCategories, categories.length, categories.length > 0 && doneCategories === categories.length, 'Categories reflect the current reward catalog.');
    add('across-lands', 'The Long Road', 'Hunt & Discovery', 'Rare', '✥', 'You have left a mark in every represented area.', 'Defeat at least one tracked boss in all ' + p.totalAreas + ' represented areas.', areaCount, p.totalAreas, p.totalAreas > 0 && allAreas);
    add('archivist', 'The Archivist', 'Fieldcraft', 'Uncommon', '▤', 'Five entries now preserve your own field observations.', 'Keep 5 non-empty notes in the journal.', notes, 5, notes >= 5);
    add('almost-there', 'The Unbroken Hunt', 'Hunt & Discovery', 'Rare', '♜', 'Half of the tracked roster is behind you.', 'Defeat at least 50% of tracked mod bosses.', p.bosses, Math.ceil(p.totalBosses * .5), p.bosses >= Math.ceil(p.totalBosses * .5));
    add('ready-anything', 'Every Thread Followed', 'Prerequisite Work', 'Epic', '⌘', 'Every shared prerequisite checkbox in the guide is complete.', 'Complete all ' + p.totalTasks + ' unique tracked prerequisite records.', p.tasks, p.totalTasks, p.totalTasks > 0 && p.tasks === p.totalTasks, 'Some guide labels are explicitly unverified or version-dependent. This is tracker completion, not proof that every step is mandatory.');
    add('collectors-burden', 'The Collector’s Burden', 'Treasures', 'Epic', '❖', 'Seven tenths of the reward ledger has been claimed.', 'Collect at least 70% of the unique tracked reward catalog.', p.rewards, Math.ceil(distinctRewards * .7), p.rewards >= Math.ceil(distinctRewards * .7), 'Only the website’s ' + distinctRewards + ' catalog IDs are counted.');
    add('no-stone-unturned', 'A World Unmade', 'Hunt & Discovery', 'Legendary', '⚔', 'Every tracked mod encounter has been marked complete.', 'Defeat all ' + p.totalBosses + ' tracked mod bosses.', p.bosses, p.totalBosses, p.totalBosses > 0 && p.bosses === p.totalBosses);
    add('armory-awakens', 'The Armory Sleeps No More', 'Treasures', 'Epic', '♧', 'Every weapon record in the tracked catalog is collected.', 'Collect all ' + weaponRows.length + ' unique weapons.', weaponDone, weaponRows.length, weaponRows.length > 0 && weaponDone === weaponRows.length, 'Repeated listings of the same named item count once.');
    add('golden-archive', 'The Golden Archive', 'Treasures', 'Legendary', '▣', 'The tracked reward ledger is complete.', 'Collect all ' + distinctRewards + ' unique catalog items.', p.rewards, distinctRewards, distinctRewards > 0 && p.rewards === distinctRewards, 'This describes the site catalog only; it does not claim to list every item in the mod.');
    add('golden-age', 'The Last Name on the List', 'Completion', 'Legendary', '☼', 'Every tracked mod boss and every shared prerequisite record is complete.', 'Defeat all tracked mod bosses and complete all ' + p.totalTasks + ' tracked task records.', p.bosses + p.tasks, p.totalBosses + p.totalTasks, p.totalBosses > 0 && p.bosses === p.totalBosses && p.totalTasks > 0 && p.tasks === p.totalTasks, 'Prerequisite records may include unverified/version-check prompts.');
    add('nothing-left-unmarked', 'Nothing Left Unmarked', 'Completion', 'Legendary', '✹', 'Bosses, prerequisite records, and the tracked reward ledger are all complete.', 'Complete all tracked mod bosses, tasks, and unique catalog rewards.', combinedDone, combinedTotal, combinedTotal > 0 && combinedDone === combinedTotal, 'Catalog and checklist completion are limited to this site’s records.');
    add('backup-keeper', 'The Careful Keeper', 'Fieldcraft', 'Common', '⬡', 'A portable record of your journey has been created.', 'Successfully export a progress backup.', T.lastBackupAt ? 1 : 0, 1, !!T.lastBackupAt);
    
    if (chainBoss) {
      add('unwritten-page', 'The Unwritten Page', 'Hidden Milestones', 'Rare', '⌘', 'A long recorded chain is complete, and a personal chronicle preserves the journey.', 'Complete the longest tracked chain (' + chainBoss.taskReq.length + ' tasks for ' + chainBoss.name + ') and keep at least one non-empty note.', (chainDone === chainBoss.taskReq.length ? 1 : 0) + (notes > 0 ? 1 : 0), 2, chainDone === chainBoss.taskReq.length && notes > 0, 'This hidden milestone combines tracked task checkboxes and a saved note; it does not imply an in-game secret.', true, 'Follow a long thread, then leave a mark in your chronicle.');
    }
    
    add('collectors-obsession', 'A Collector’s Obsession', 'Hidden Milestones', 'Epic', '❖', 'Every weapon entry and every represented reward category has been claimed.', 'Collect all ' + weaponRows.length + ' unique weapon records and at least one reward in each of ' + categories.length + ' tracked categories.', weaponDone + doneCategories, weaponRows.length + categories.length, weaponRows.length > 0 && weaponDone === weaponRows.length && doneCategories === categories.length, 'The secret concerns the website catalog, not every weapon in the mod.', true, 'A complete armory is more than a handful of trophies.');
    add('final-ember', 'The Final Ember', 'Hidden Milestones', 'Legendary', '☼', 'The tracked world is cleared, its reward ledger is full, every task record is checked, and five notes chronicle the route.', 'Complete every tracked boss, task record, and reward record, then keep 5 non-empty notes.', combinedDone + Math.min(notes, 5), combinedTotal + 5, combinedTotal > 0 && combinedDone === combinedTotal && notes >= 5, 'All conditions refer to unique records tracked by this site; the journal requirement is personal.', true, 'When the last ledgers are full, leave five marks in your chronicle.');
    
    let ts = collectedTalismans(),
        wing = TAL[0] && state(TAL[0]) === 'collected',
        suit = TAL[5] && state(TAL[5]) === 'collected',
        final = TAL[7] && state(TAL[7]) === 'collected';
        
    add('first-secret-common', 'First Secret', 'Hidden Talismans', 'Common', '◇', 'A first hidden talisman has been added to the ledger.', 'Collect any hidden talisman.', Math.min(ts.length, 1), 1, ts.length >= 1);
    add('wingbeat-in-dark', 'A Wingbeat in the Dark', 'Hidden Talismans', 'Uncommon', '✧', 'The seven-shadowed butterfly is found.', 'Collect Seven-Shadowed Butterfly.', wing ? 1 : 0, 1, !!wing, '', true, 'A wingbeat stirs by an unawakened spirit.');
    add('dangerous-curiosity', 'A Dangerous Curiosity', 'Hidden Talismans', 'Uncommon', '▣', 'A curious case of fortune and misfortune is claimed.', 'Collect Suitcase.', suit ? 1 : 0, 1, !!suit);
    add('seven-hidden-truths', 'Seven Hidden Truths', 'Hidden Talismans', 'Rare', '✦', 'The seven independent discoveries are complete.', 'Collect the first seven hidden talismans.', ts.filter(x => !x.finalReward).length, 7, allSeven());
    add('final-offering', 'Final Offering', 'Hidden Talismans', 'Epic', '♜', 'The last offering is claimed after the seven discoveries.', 'Collect all first seven talismans and separately collect Eccentric Corpse.', ts.length, 8, allSeven() && !!final);
    add('complete-set', 'A Complete Set', 'Hidden Talismans', 'Epic', '❖', 'The hidden talisman ledger is complete.', 'Collect all eight hidden talismans.', ts.length, 8, ts.length === 8);
    
    const capId = 'lord-of-the-golden-age';
    const others = achievementDefs.filter(d => d.id !== capId);
    const othersEarned = others.filter(d => T.earnedAchievements[d.id]).length;
    add(capId, 'Lord of the Golden Age', 'Completion', 'Legendary', '♛', 'Every other milestone in the field guide has been earned. Nothing remains.', 'Earn every other achievement, secret ones included.', othersEarned, others.length, () => others.every(d => T.earnedAchievements[d.id]), 'Unlocking this triggers the 100% completion sound.');

    return achievementDefs;
  }

  // ---- Achievement sounds -------------------------------------------------
  // File names only; the folder is resolved below. One is picked at random per unlock.
  const SOUND_MAP = {
    common: ['common.mp3', 'common_2.mp3', 'common_3.mp3'],
    uncommon: ['uncommon.mp3', 'uncommon_2.mp3'],
    rare: ['rare.mp3', 'rare_2.mp3'],
    epic: ['epic.mp3', 'epic_2.mp3'],
    legendary: ['legendary.mp3', 'legendary_2.mp3', 'legendary_3.mp3'],
    complete: ['100%.mp3']
  };
  // Tried in order until one loads; the working one is remembered.
  const AUDIO_DIRS = ['Progression/audio/', 'audio/', '../Progression/audio/'];
  let audioDirIndex = 0;

  function playSoundFile(file, dirIdx) {
    dirIdx = dirIdx === undefined ? audioDirIndex : dirIdx;
    if (dirIdx >= AUDIO_DIRS.length) {
      console.warn('Achievement sound not found in any known folder:', file);
      return;
    }
    // encodeURIComponent matters: "100%.mp3" must become "100%25.mp3" or the URL is invalid.
    const audio = new Audio(AUDIO_DIRS[dirIdx] + encodeURIComponent(file));
    audio.volume = 0.5;
    let moved = false;
    const tryNext = () => {
      if (moved) return;
      moved = true;
      playSoundFile(file, dirIdx + 1);
    };
    audio.addEventListener('error', tryNext, { once: true });
    audio.play().then(() => { audioDirIndex = dirIdx; }).catch(err => {
      if (err && err.name === 'NotAllowedError') console.log('Audio blocked until the page is interacted with.');
      else tryNext();
    });
  }

  function playAchievementSound(kind) {
    if (T.settings.achievementSounds === false) return;
    const options = SOUND_MAP[String(kind || 'common').toLowerCase()] || SOUND_MAP.common;
    playSoundFile(options[Math.floor(Math.random() * options.length)]);
  }
  window.GA_PLAY_SOUND = playAchievementSound; // handy for testing in the console

  function announceAchievements(added, defs) {
    if (!added.length || window.GA_SILENT_ACHIEVEMENTS) return;
    // 100% sound plays only when every achievement in the tracker is earned.
    const all = defs.length > 0 && defs.every(d => T.earnedAchievements[d.id]);
    if (all) {
      playAchievementSound('complete');
      return;
    }
    // Otherwise one random sound from the highest tier unlocked this time.
    const order = ['common', 'uncommon', 'rare', 'epic', 'legendary'];
    const top = added.map(d => String(d.tier).toLowerCase()).sort((a, b) => order.indexOf(b) - order.indexOf(a))[0];
    playAchievementSound(top);
  }

  function toastAchievements(items) {
    if (!items.length || !T.settings.notifyAchievements || window.GA_SILENT_ACHIEVEMENTS) return;

    let old = document.getElementById('achievement-toast');
    if (old) old.remove();
    
    let d = items[0],
        box = document.createElement('div');
        
    box.id = 'achievement-toast';
    box.className = 'achievement-toast';
    box.setAttribute('role', 'status');
    box.setAttribute('aria-live', 'polite');
    box.innerHTML = '<button aria-label="Dismiss notification">×</button><span class="toast-seal tier-' + E(d.tier.toLowerCase()) + '">' + E(d.icon) + '</span><div><b>Achievement unlocked · ' + E(d.tier) + '</b><div>' + E(d.title) + (items.length > 1 ? ' + ' + (items.length - 1) + ' more' : '') + '</div><small>' + E(d.description) + '</small></div>';
    
    document.body.append(box);
    box.querySelector('button').onclick = () => box.remove();
    setTimeout(() => box.remove(), 6500);
  }

  function syncAchievements(historical) {
    let defs = buildAchievements(),
        earned = T.earnedAchievements,
        added = [];
        
    defs.forEach(d => {
      if (!earned[d.id] && (typeof d.condition === 'function' ? d.condition() : d.condition)) {
        earned[d.id] = { unlockedAt: historical ? null : new Date().toISOString(), historical: !!historical };
        added.push(d);
      }
    });
    
    if (added.length) {
      T.save();
      if (!historical) {
        toastAchievements(added);
        announceAchievements(added, defs);
      }
    }
    return added.length;
  }
  
  window.GA_ACH_SYNC = syncAchievements;

  function setSelect(id, value) {
    let e = document.getElementById(id);
    if (e) e.value = value;
  }

  function appearanceSettingsMarkup(s) {
    let palette = appearancePalette(),
        presetCards = Object.entries(APPEARANCE_PRESETS).map(([id, p]) => '<button type="button" class="preset-card ' + (s.appearancePreset === id ? 'selected' : '') + '" data-appearance-preset="' + E(id) + '" aria-pressed="' + (s.appearancePreset === id) + '"><span class="preset-swatches">' + ['bg', 'panel', 'heading', 'accent', 'accent2'].map(k => '<i style="background:' + p.colors[k] + '"></i>').join('') + '</span><b>' + E(p.name) + '</b><small>Coordinated field-guide palette</small></button>').join(''),
        colors = APPEARANCE_COLOR_KEYS.map(k => '<div class="appearance-color"><label for="hex-' + k + '"><b>' + E(({ bg: 'Primary background', bg2: 'Secondary background', panel: 'Card background', sidebar: 'Sidebar background', header: 'Header background', text: 'Primary text', muted: 'Secondary text', heading: 'Heading color', accent: 'Accent color', accent2: 'Secondary accent', line: 'Border color', button: 'Button background', buttonText: 'Button text', link: 'Link color', progress: 'Progress bar color', success: 'Success status', warning: 'Warning status', error: 'Error status', locked: 'Locked status', available: 'Available status', defeated: 'Defeated status' })[k]) + '</b></label><div class="color-control"><input type="color" data-color-picker="' + k + '" value="' + palette[k] + '" aria-label="Choose ' + E(k) + ' color"><input id="hex-' + k + '" type="text" inputmode="text" pattern="^#[0-9a-fA-F]{6}$" maxlength="7" data-color-hex="' + k + '" value="' + palette[k] + '" aria-describedby="color-msg-' + k + '"><button type="button" data-color-reset="' + k + '" aria-label="Reset ' + E(k) + ' to preset">↺</button></div><small id="color-msg-' + k + '" class="color-feedback" aria-live="polite">Uses the selected preset.</small></div>').join('');
        
    let control = (label, key, opts) => '<label class="appearance-control"><span>' + label + '</span><select data-appearance-control="' + key + '">' + opts.map(([v, n]) => '<option value="' + v + '" ' + (String(s[key]) === String(v) ? 'selected' : '') + '>' + n + '</option>').join('') + '</select></label>',
        range = (label, key, min, max, step) => '<label class="appearance-control"><span>' + label + ' <output data-range-output="' + key + '">' + E(s[key]) + '</output></span><input type="range" min="' + min + '" max="' + max + '" step="' + step + '" value="' + E(s[key]) + '" data-appearance-control="' + key + '"></label>',
        toggle = (label, key, help) => '<label class="appearance-toggle"><input type="checkbox" data-appearance-control="' + key + '" ' + (s[key] ? 'checked' : '') + '><span><b>' + label + '</b><small>' + help + '</small></span></label>';
        
    return '<section id="appearance" class="settings-section"><div class="section-heading"><span>✧</span><div><h2>Appearance &amp; Personalization</h2><p>Changes apply immediately and are saved in this browser. Your current preset can be customized without changing gameplay data.</p></div></div><h3>Theme presets</h3><div class="preset-grid">' + presetCards + '</div><div class="appearance-toolbar"><button type="button" data-reset-theme>Reset colors to this preset</button><button type="button" data-reset-appearance>Restore default appearance</button><button type="button" data-reload-appearance>Restore last saved appearance</button><span class="small" role="status">All valid changes save immediately.</span></div><details class="appearance-details"><summary>Custom colors · hexadecimal or picker</summary><p class="small">Contrast advice is shown below; your choices are never silently replaced. Boss status colors are checked for distinctness before saving.</p><div class="appearance-color-grid">' + colors + '</div><div id="appearance-contrast" class="notice" role="status" aria-live="polite"></div></details><details class="appearance-details"><summary>Background &amp; atmosphere</summary><div class="appearance-grid">' + control('Atmosphere', 'atmosphere', [['plain', 'Plain background'], ['subtle', 'Subtle dark-fantasy texture'], ['parchment', 'Parchment panels'], ['radial', 'Soft radial lighting'], ['ornate', 'Gold ornamentation']]) + toggle('Use local hero artwork', 'backgroundImage', 'Uses the existing local hero image, with adjustable opacity and overlay.') + control('Image position', 'backgroundPosition', [['center', 'Center'], ['top', 'Top'], ['bottom', 'Bottom'], ['left', 'Left'], ['right', 'Right']]) + range('Image opacity', 'backgroundImageOpacity', 0, 0.4, 0.01) + range('Image scale', 'backgroundScale', 90, 150, 1) + range('Overlay darkness', 'overlayDarkness', 0, 95, 1) + range('Background blur', 'backgroundBlur', 0, 8, 1) + '</div></details><details class="appearance-details"><summary>Typography</summary><div class="appearance-grid">' + control('Typography preset', 'typographyPreset', [['classic-fantasy', 'Classic Fantasy'], ['modern', 'Modern'], ['manuscript', 'Manuscript'], ['minimal', 'Minimal']]) + range('Base font size', 'baseFontSize', 13, 20, 1) + range('Heading scale', 'headingScale', 0.85, 1.35, 0.05) + range('Line spacing', 'lineSpacing', 1.35, 1.9, 0.05) + range('Letter spacing', 'letterSpacing', 0, 0.08, 0.005) + '</div><div class="appearance-preview typography-preview"><h3>Classic field notes</h3><p>Readable text, legendary headings, and clear interface labels preview the selected type settings.</p><button type="button">Interface button</button></div></details><details class="appearance-details"><summary>Layout &amp; surfaces</summary><div class="appearance-grid">' + control('Content width', 'contentWidth', [['narrow', 'Narrow'], ['standard', 'Standard'], ['wide', 'Wide'], ['full', 'Full width']]) + control('Card density', 'density', [['spacious', 'Spacious'], ['comfortable', 'Comfortable'], ['compact', 'Compact']]) + control('Corner style', 'cornerStyle', [['sharp', 'Sharp'], ['slight', 'Slightly rounded'], ['rounded', 'Rounded']]) + control('Border style', 'borderStyle', [['minimal', 'Minimal'], ['standard', 'Standard'], ['ornate', 'Ornate']]) + control('Shadows', 'shadowStyle', [['none', 'None'], ['subtle', 'Subtle'], ['pronounced', 'Pronounced']]) + control('Card appearance', 'cardStyle', [['flat', 'Flat'], ['layered', 'Layered'], ['gradient', 'Subtle gradient']]) + control('Sidebar width', 'sidebarWidth', [['narrow', 'Narrow'], ['standard', 'Standard']]) + control('Navigation density', 'navigationDensity', [['compact', 'Compact'], ['standard', 'Standard'], ['spacious', 'Spacious']]) + '</div></details><details class="appearance-details"><summary>Decorative style &amp; emblems</summary><div class="appearance-grid">' + control('Decorative flourishes', 'decorativeStyle', [['minimal', 'Minimal'], ['restrained', 'Restrained'], ['ornate', 'Ornate']]) + control('Icon treatment', 'iconStyle', [['monochrome', 'Monochrome'], ['gold-line', 'Gold line art'], ['bronze', 'Bronze engraved'], ['ornate', 'Fantasy emblems'], ['minimal', 'Minimal symbols']]) + toggle('Show page emblems', 'showPageEmblems', 'Keep page emblems recognizable and decorative.') + toggle('Show decorative reward seals', 'showDecorativeImages', 'Hide optional decorative emblems on compact pages.') + '</div></details><details class="appearance-details"><summary>Motion &amp; effects</summary><div class="appearance-grid">' + toggle('Allow animations', 'animations', 'Enables the page fade and restrained transitions.') + toggle('Reduced motion', 'reducedMotion', 'Forces motion off. The operating system reduced-motion preference is always respected.') + toggle('Hover transitions', 'hoverTransitions', 'Adds brief feedback when pointing to cards and controls.') + toggle('Progress animation', 'progressAnimations', 'Gently animates progress bar changes.') + toggle('Achievement animation', 'achievementAnimations', 'Allows achievement notices to enter with a short fade.') + '</div></details><section class="appearance-live"><div><div class="page-kicker">LIVE APPEARANCE PREVIEW</div><h3>Preview your field guide</h3></div><div class="appearance-preview"><h2>Grace and discovery</h2><p>Body copy and secondary details remain readable across the selected surfaces.</p><div class="preview-samples"><button type="button" class="primary">Primary action</button><a href="#appearance">Link color</a><span class="badge available-preview">✦ Available</span><span class="badge defeated-preview">✓ Defeated</span><span class="badge locked-preview">⌑ Locked</span><span class="badge unknown-preview">? Unknown</span></div><div class="meter"><i style="width:68%"></i></div><article class="achievement-card"><span class="achievement-crest">✧</span><div><b>Milestone card</b><p class="small">Icon, border, text, and surface preview</p></div></article></div></section><div class="appearance-transfer"><button id="appearance-export" type="button">Export appearance JSON</button><label class="button-like">Import appearance JSON<input id="appearance-import" type="file" accept="application/json,.json" hidden></label><span id="appearance-import-result" class="small" role="status"></span></div></section>';
  }

  function settingsPage() {
    let s = T.settings,
        view = document.getElementById('view');
        
    view.innerHTML = '<div class="page-kicker">LOCAL CONFIGURATION</div><h1>Settings &amp; Data</h1><p class="page-intro">Shape the field guide to your play style, then manage a portable backup of your tracker.</p><nav class="section-nav" aria-label="Settings sections"><a href="#appearance">Appearance</a><a href="#tracking">Tracking</a><a href="#feedback">Feedback</a><a href="#data">Data management</a></nav>' + appearanceSettingsMarkup(s) + '<section id="tracking" class="settings-section"><div class="section-heading"><span>⚔</span><div><h2>Gameplay &amp; Tracking</h2><p>Set how the checklist and guide open and display progress.</p></div></div><div class="settings-grid"><label class="setting-card"><span class="setting-icon">☷</span><span><b>Default boss checklist view</b><select data-setting="defaultBossView"><option value="region">Region view</option><option value="compact">Compact checklist</option></select></span></label><label class="setting-card"><span class="setting-icon">↕</span><span><b>Default boss sorting</b><select data-setting="defaultSort"><option value="area">Area order</option><option value="name">Boss name</option><option value="game">Original game</option><option value="completion">Completion</option><option value="availability">Availability</option></select></span></label><label class="setting-card"><span class="setting-icon">◇</span><span><b>Default reward catalog</b><select data-setting="rewardView"><option value="boss">Browse by Boss</option><option value="item">Browse by Item</option></select></span></label><label class="setting-card"><span class="setting-icon">✓</span><span><b>Completed bosses</b><select data-setting="hideCompletedBosses"><option value="false">Show normally</option><option value="true">Hide completed</option></select></span></label></div><p class="small">Optional bosses are not separately labeled in the source data.</p></section><section id="feedback" class="settings-section"><div class="section-heading"><span>✦</span><div><h2>Notifications &amp; Journal</h2><p>Choose which optional feedback appears.</p></div></div><div class="settings-grid"><label class="setting-card"><input type="checkbox" data-setting="notifyAchievements"><span><b>Achievement notices</b><small>Show a dismissible notice when a milestone is earned.</small></span></label><label class="setting-card"><input type="checkbox" data-setting="achievementSounds"><span><b>Achievement sounds</b><small>Play a rarity-based sound when a milestone is earned, and a special sound at 100%.</small></span></label><label class="setting-card"><input type="checkbox" data-setting="notifyMilestones"><span><b>Progress notices</b><small>Reserved for meaningful checklist milestones.</small></span></label><label class="setting-card"><input type="checkbox" data-setting="journalSuggestions"><span><b>Journey Journal suggestions</b><small>Suggest topics from current progress. Suggestions never create entries by themselves.</small></span></label></div></section><section id="data" class="settings-section"><div class="section-heading"><span>▣</span><div><h2>Data Management</h2><p>Save a backup or reset one layer of this browser’s tracker data.</p></div></div><div class="settings-grid data-grid"><div class="setting-card"><span class="setting-icon">⇩</span><div><b>Export a backup</b><small>Includes checklist progress, notes, rewards, hidden talismans, Journal entries, preferences, and achievements.</small><button id="settings-export" class="primary">Download JSON backup</button><p class="small">Last successful export: ' + E(T.lastBackupAt ? new Date(T.lastBackupAt).toLocaleString() : 'No backup recorded') + '</p></div></div><div class="setting-card"><span class="setting-icon">⇧</span><div><b>Import a backup</b><small>Merge adds recognized records; Replace swaps the data represented in the backup. Older backups remain supported.</small><select id="import-mode"><option value="merge">Merge with current data</option><option value="replace">Replace current data</option></select><input type="file" id="settings-import" accept="application/json,.json"><div id="import-result" role="status"></div></div></div></div><div class="settings-grid reset-grid"><div class="setting-card"><span class="setting-icon">↺</span><div><b>Reset preferences</b><small>Restore the default appearance and tracking controls. Keeps progress, notes, Journal entries, and collections.</small><button id="reset-preferences">Restore preferences</button></div></div><div class="setting-card danger-card"><span class="setting-icon">⚔</span><div><b>Reset gameplay progress</b><small>Clears boss/task/reward states and progress achievements. Keeps personal notes, Journal entries, preferences, and to-dos.</small><button id="reset-progress" class="danger">Reset gameplay progress</button></div></div><div class="setting-card danger-card"><span class="setting-icon">✕</span><div><b>Reset all local application data</b><small>Clears progress, achievements, notes, Journal entries, preferences, and backup metadata.</small><button id="reset-all" class="danger">Reset all local data</button></div></div></div><div class="notice storage-notice"><b>Storage and privacy</b><p>Appearance preferences and Journal entries use this browser’s localStorage. Backups stay local unless you choose where to save them. No journal content or images are uploaded; local image attachments are not supported.</p></div></section>';
        
    view.querySelectorAll('[data-setting]').forEach(el => {
      let k = el.dataset.setting;
      if (el.type === 'checkbox') el.checked = !!s[k];
      else if (k === 'hideCompletedBosses') el.value = String(!!s[k]);
      else el.value = s[k];
      
      el.onchange = () => {
        let val = el.type === 'checkbox' ? el.checked : k === 'hideCompletedBosses' ? el.value === 'true' : el.value;
        T.setSetting(k, val);
        applySettingEffects();
        if (k === 'theme') renderAchievementPageIfOpen();
      };
    });
    
    view.querySelectorAll('[data-appearance-control]').forEach(el => {
      let k = el.dataset.appearanceControl;
      if (el.type === 'checkbox') el.checked = !!s[k];
      else el.value = s[k];
      
      let commit = () => {
        let v = el.type === 'checkbox' ? el.checked : el.type === 'range' ? Number(el.value) : el.value;
        T.setSetting(k, v);
        applySettingEffects();
        let o = view.querySelector('[data-range-output="' + k + '"]');
        if (o) o.textContent = el.value;
      };
      
      el.oninput = el.type === 'range' ? commit : null;
      el.onchange = commit;
    });
    
    view.querySelectorAll('[data-appearance-preset]').forEach(b => b.onclick = () => {
      T.updateSettings({ appearancePreset: b.dataset.appearancePreset, appearanceColors: {} });
      settingsPage();
    });
    
    view.querySelectorAll('[data-color-picker]').forEach(el => el.oninput = () => setAppearanceColor(el.dataset.colorPicker, el.value));
    view.querySelectorAll('[data-color-hex]').forEach(el => el.oninput = () => {
      let msg = document.getElementById('color-msg-' + el.dataset.colorHex);
      if (!/^#[0-9a-f]{6}$/i.test(el.value)) {
        msg.textContent = 'Enter a six-digit hex color such as #DDBF7B.';
        msg.classList.add('error');
        return;
      }
      msg.textContent = 'Color saved immediately.';
      msg.classList.remove('error');
      setAppearanceColor(el.dataset.colorHex, el.value);
    });
    
    view.querySelectorAll('[data-color-reset]').forEach(b => b.onclick = () => {
      let colors = { ...(T.settings.appearanceColors || {}) };
      delete colors[b.dataset.colorReset];
      T.updateSettings({ appearanceColors: colors });
      settingsPage();
    });
    
    view.querySelector('[data-reset-theme]').onclick = () => {
      T.updateSettings({ appearanceColors: {} });
      settingsPage();
    };
    
    view.querySelector('[data-reset-appearance]').onclick = () => {
      restoreDefaultAppearance();
      settingsPage();
    };
    
    view.querySelector('[data-reload-appearance]').onclick = () => location.reload();
    view.querySelectorAll('[data-appearance-preset]').forEach(b => b.title = 'Apply ' + b.querySelector('b').textContent + ' preset');
    updateContrastFeedback();
    
    view.querySelector('#appearance-export').onclick = exportAppearance;
    view.querySelector('#appearance-import').onchange = importAppearance;
    document.getElementById('settings-export').onclick = () => T.exportData();
    document.getElementById('reset-preferences').onclick = () => {
      if (confirmSetting('Restore default appearance and tracking preferences? Progress, personal notes, collections, and Journal entries will be kept.')) {
        T.resetPreferences();
        applySettingEffects();
        settingsPage();
      }
    };
    
    document.getElementById('reset-progress').onclick = () => {
      if (confirmSetting('Clear boss completions, prerequisite checks, collected rewards and talismans, and earned achievements? Your preferences, notes, Journal entries, and to-dos will remain.')) {
        T.resetProgress();
        settingsPage();
      }
    };
    
    document.getElementById('reset-all').onclick = () => {
      if (confirmSetting('Erase all local tracker data, including progress, notes, Journal entries, to-dos, preferences, and achievements? This cannot be undone unless you have a backup.')) T.resetAll();
    };
    
    document.getElementById('settings-import').onchange = async e => {
      let f = e.target.files[0],
          msg = document.getElementById('import-result');
      if (!f) return;
      try {
        let d = JSON.parse(await f.text());
        if (!d || d.schemaVersion !== 3 || !d.bosses || typeof d.bosses !== 'object' || Array.isArray(d.bosses) || !d.tasks || typeof d.tasks !== 'object' || Array.isArray(d.tasks)) throw Error('This file is not a supported version 3 Golden Age backup.');
        for (let [id, val] of Object.entries(d.bosses)) {
          if (typeof val !== 'boolean') throw Error('Boss state for ' + id + ' must be true or false.');
        }
        if (d.notes != null && !Array.isArray(d.notes) || d.todos != null && !Array.isArray(d.todos) || d.journal != null && !validJournalEntries(d.journal) || d.rewards != null && (typeof d.rewards !== 'object' || Array.isArray(d.rewards))) throw Error('The backup contains malformed notes, todos, Journal entries, or reward data.');
        
        let merge = document.getElementById('import-mode').value === 'merge';
        if (!merge && confirmSetting('Replace current tracker data with this backup?')) {
          window.GA_SILENT_ACHIEVEMENTS = true;
          T.importBackup(d, false);
          window.GA_SILENT_ACHIEVEMENTS = false;
          render();
          msg.textContent = 'Backup replaced successfully.';
          msg.className = 'success';
        } else if (merge) {
          T.importBackup(d, true);
          render();
          msg.textContent = 'Recognized backup records merged with current data.';
          msg.className = 'success';
        }
      } catch (err) {
        window.GA_SILENT_ACHIEVEMENTS = false;
        msg.textContent = 'Import failed: ' + err.message;
        msg.className = 'error';
      }
      e.target.value = '';
    };
    
    view.querySelectorAll('.section-nav a').forEach(a => a.onclick = e => {
      e.preventDefault();
      document.querySelector(a.getAttribute('href'))?.scrollIntoView({ behavior: T.settings.animations && !T.settings.reducedMotion ? 'smooth' : 'auto', block: 'start' });
    });
  }

  function setAppearanceColor(key, value) {
    if (!APPEARANCE_COLOR_KEYS.includes(key) || !/^#[0-9a-f]{6}$/i.test(value)) return false;
    let p = appearancePalette();
    if (['available', 'defeated', 'locked', 'unknown'].includes(key)) {
      for (let other of ['available', 'defeated', 'locked', 'unknown']) {
        if (other !== key && hexDistance(value, p[other]) < 55) {
          let m = document.getElementById('color-msg-' + key);
          if (m) {
            m.textContent = 'Keep status colors visually distinct. Choose a color at least 55 RGB steps from ' + other + '.';
            m.classList.add('error');
          }
          return false;
        }
      }
    }
    
    let colors = { ...(T.settings.appearanceColors || {}), [key]: value.toUpperCase() };
    T.updateSettings({ appearanceColors: colors });
    applySettingEffects();
    
    let picker = document.querySelector('[data-color-picker="' + key + '"]'),
        hex = document.querySelector('[data-color-hex="' + key + '"]'),
        msg = document.getElementById('color-msg-' + key);
        
    if (picker) picker.value = value;
    if (hex) hex.value = value.toUpperCase();
    if (msg) {
      msg.textContent = 'Saved · contrast ' + contrastRatio(value, appearancePalette().bg).toFixed(1) + ':1 against primary background.';
      msg.classList.remove('error');
    }
    updateContrastFeedback();
    return true;
  }

  function updateContrastFeedback() {
    let host = document.getElementById('appearance-contrast');
    if (!host) return;
    let p = appearancePalette(),
        warnings = [];
        
    for (let k of ['text', 'muted', 'heading']) {
      let c = contrastRatio(p[k], p.panel);
      if (c < 4.5) warnings.push(k + ' contrast is ' + c.toFixed(1) + ':1 against cards (4.5:1 recommended).');
    }
    
    for (let a of ['available', 'defeated', 'locked', 'unknown']) {
      for (let b of ['available', 'defeated', 'locked', 'unknown']) {
        if (a < b && hexDistance(p[a], p[b]) < 55) warnings.push(a + ' and ' + b + ' status colors are too similar.');
      }
    }
    
    host.innerHTML = warnings.length ? '<b>Readability check</b><ul>' + warnings.map(E).map(x => '<li>' + x + '</li>').join('') + '</ul><p>For text, a higher-contrast alternative is ' + (luminance(p.panel) > .42 ? '#000000' : '#FFFFFF') + '. Apply it with the color control if you prefer.</p>' : '<b>Readability check</b><p>Text contrast and boss status colors are distinct for this palette.</p>';
  }

  function restoreDefaultAppearance() {
    T.updateSettings({
      appearancePreset: 'golden-age',
      appearanceColors: {},
      atmosphere: 'subtle',
      backgroundImage: false,
      backgroundImageOpacity: .16,
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
      density: 'comfortable',
      cornerStyle: 'slight',
      borderStyle: 'standard',
      shadowStyle: 'subtle',
      cardStyle: 'gradient',
      sidebarWidth: 'standard',
      navigationDensity: 'standard',
      decorativeStyle: 'restrained',
      iconStyle: 'gold-line',
      showPageEmblems: true,
      animations: !matchMedia('(prefers-reduced-motion: reduce)').matches,
      reducedMotion: false,
      hoverTransitions: true,
      progressAnimations: true,
      achievementAnimations: true,
      showDecorativeImages: true,
      theme: 'dark',
      accent: 'gold'
    });
  }

  function exportAppearance() {
    let appearance = Object.fromEntries(APPEARANCE_SETTING_KEYS.map(k => [k, T.settings[k]]));
    let a = document.createElement('a');
    a.href = URL.createObjectURL(new Blob([JSON.stringify({ schema: 'golden-age-appearance-v1', appearance }, null, 2)], { type: 'application/json' }));
    a.download = 'golden-age-appearance.json';
    a.click();
    URL.revokeObjectURL(a.href);
  }

  async function importAppearance(e) {
    let file = e.target.files?.[0],
        msg = document.getElementById('appearance-import-result');
    if (!file) return;
    try {
      let d = JSON.parse(await file.text());
      if (d?.schema !== 'golden-age-appearance-v1' || !d.appearance || typeof d.appearance !== 'object' || Array.isArray(d.appearance)) throw Error('This is not a Golden Age appearance file.');
      let incoming = d.appearance;
      if (!APPEARANCE_PRESETS[incoming.appearancePreset]) throw Error('Unknown appearance preset.');
      if (incoming.appearanceColors != null && (typeof incoming.appearanceColors !== 'object' || Array.isArray(incoming.appearanceColors) || Object.entries(incoming.appearanceColors).some(([k, v]) => !APPEARANCE_COLOR_KEYS.includes(k) || !/^#[0-9a-f]{6}$/i.test(v)))) throw Error('Appearance colors must be six-digit hexadecimal values.');
      
      let allowed = {
        atmosphere: ['plain', 'subtle', 'parchment', 'radial', 'ornate'],
        backgroundPosition: ['center', 'top', 'bottom', 'left', 'right'],
        typographyPreset: ['classic-fantasy', 'modern', 'manuscript', 'minimal'],
        contentWidth: ['narrow', 'standard', 'wide', 'full'],
        density: ['spacious', 'comfortable', 'compact'],
        cornerStyle: ['sharp', 'slight', 'rounded'],
        borderStyle: ['minimal', 'standard', 'ornate'],
        shadowStyle: ['none', 'subtle', 'pronounced'],
        cardStyle: ['flat', 'layered', 'gradient'],
        sidebarWidth: ['narrow', 'standard'],
        navigationDensity: ['compact', 'standard', 'spacious'],
        decorativeStyle: ['minimal', 'restrained', 'ornate'],
        iconStyle: ['monochrome', 'gold-line', 'bronze', 'ornate', 'minimal']
      };
      
      for (let [k, vals] of Object.entries(allowed)) {
        if (incoming[k] != null && !vals.includes(incoming[k])) throw Error('Invalid ' + k + ' option.');
      }
      
      for (let k of ['backgroundImage', 'showPageEmblems', 'animations', 'reducedMotion', 'hoverTransitions', 'progressAnimations', 'achievementAnimations', 'showDecorativeImages']) {
        if (incoming[k] != null && typeof incoming[k] !== 'boolean') throw Error('Invalid ' + k + ' setting.');
      }
      
      let numeric = {
        backgroundImageOpacity: [0, .4],
        backgroundScale: [90, 150],
        overlayDarkness: [0, 95],
        backgroundBlur: [0, 8],
        baseFontSize: [12, 22],
        headingScale: [.8, 1.4],
        lineSpacing: [1.2, 2],
        letterSpacing: [-.02, .12]
      };
      
      for (let [k, [min, max]] of Object.entries(numeric)) {
        if (incoming[k] != null && (!Number.isFinite(Number(incoming[k])) || Number(incoming[k]) < min || Number(incoming[k]) > max)) throw Error('Invalid ' + k + ' value.');
      }
      
      let patch = Object.fromEntries(APPEARANCE_SETTING_KEYS.filter(k => Object.prototype.hasOwnProperty.call(incoming, k)).map(k => [k, incoming[k]]));
      if (incoming.appearanceColors) {
        let p = { unknown: "#C7BDC0", ...APPEARANCE_PRESETS[incoming.appearancePreset].colors, ...incoming.appearanceColors };
        for (let a of ['available', 'defeated', 'locked', 'unknown']) {
          for (let b of ['available', 'defeated', 'locked', 'unknown']) {
            if (a < b && hexDistance(p[a], p[b]) < 55) throw Error('Boss status colors must remain visually distinct.');
          }
        }
      }
      
      T.updateSettings(patch);
      applySettingEffects();
      settingsPage();
      
      let result = document.getElementById('appearance-import-result');
      result.textContent = 'Appearance imported and saved. Tracker progress was not changed.';
      result.className = 'success';
    } catch (err) {
      msg.textContent = 'Import rejected: ' + err.message;
      msg.className = 'error';
    }
    e.target.value = '';
  }

  function validJournalEntries(v) {
    return Array.isArray(v) && v.every(x => x && typeof x === 'object' && !Array.isArray(x) && typeof x.id === 'string' && typeof x.title === 'string' && typeof x.text === 'string' && typeof x.type === 'string' && typeof x.date === 'string');
  }

  function confirmSetting(text) {
    return T.settings.confirmDestructive ? confirm(text) : confirm(text + '\n\nConfirmation setting is off, but this destructive action still requires your confirmation.');
  }

  function renderAchievementPageIfOpen() {
    if (document.body.dataset.page === 'achievements') achievementPage();
  }

  function achievementPage() {
    let v = document.getElementById('view'),
        defs = buildAchievements(),
        earned = T.earnedAchievements,
        pins = T.pinnedAchievements || {},
        unlocked = defs.filter(d => earned[d.id]),
        n = unlocked.length,
        pct = defs.length ? Math.round(n / defs.length * 100) : 0,
        tierOrder = ['Common', 'Uncommon', 'Rare', 'Epic', 'Legendary'],
        highest = tierOrder.slice().reverse().find(t => unlocked.some(d => d.tier === t)) || '—',
        recent = unlocked.filter(d => earned[d.id].unlockedAt).sort((a, b) => earned[b.id].unlockedAt.localeCompare(earned[a.id].unlockedAt))[0],
        featured = defs.filter(d => ['Epic', 'Legendary'].includes(d.tier) && !earned[d.id]).sort((a, b) => (b.current / Math.max(1, b.target)) - (a.current / Math.max(1, a.target)))[0],
        closest = defs.filter(d => !earned[d.id] && !d.secret).sort((a, b) => b.current / Math.max(1, b.target) - a.current / Math.max(1, a.target))[0],
        pinned = defs.filter(d => pins[d.id]);
        
    v.innerHTML = '<div class="page-kicker">A RECORD OF YOUR JOURNEY</div><div class="achievement-heading"><span class="large-seal" aria-hidden="true">✦</span><div><h1>Achievements</h1><p class="page-intro">Milestones and challenges for your Golden Age playthrough, calculated from the records in this companion. These are personal tracker achievements, not official game trophies.</p></div></div><div class="achievement-overview"><div class="achievement-total"><b>' + defs.length + '</b><small>Total achievements</small></div><div class="achievement-total"><b>' + n + '</b><small>Earned</small></div><div class="achievement-total"><b>' + (defs.length - n) + '</b><small>Remaining</small></div><div class="achievement-total"><b>' + pct + '%</b><small>Completion</small></div><div class="achievement-total"><b>' + E(highest) + '</b><small>Highest tier earned</small></div><div class="achievement-meter"><div class="meter-label"><span>Collection progress</span><b>' + pct + '%</b></div><div class="meter"><i style="width:' + pct + '%"></i></div></div></div><div class="grid recent-grid"><section class="panel showcase-panel"><h2>Personal Record</h2>' + (recent ? '<p><span class="emblem-mini tier-' + E(recent.tier.toLowerCase()) + '">' + E(recent.icon) + '</span><b>' + E(recent.title) + '</b><br><span class="small">Most recently earned · ' + E(recent.tier) + ' · ' + new Date(earned[recent.id].unlockedAt).toLocaleString() + '</span></p>' : '<p class="small">No dated achievement has been earned yet. Historical dates are left blank.</p>') + (pinned.length ? '<h3>Pinned</h3>' + pinned.map(d => '<p><span class="emblem-mini tier-' + E(d.tier.toLowerCase()) + '">' + E(d.icon) + '</span>' + E(d.title) + '</p>').join('') : '<p class="small">Pin up to 3 milestones to keep your current goals here.</p>') + '</section><section class="panel showcase-panel"><h2>Next Milestone</h2>' + (closest ? '<div class="feature-achievement"><span class="achievement-crest tier-' + E(closest.tier.toLowerCase()) + '">' + E(closest.icon) + '</span><div><b>' + E(closest.title) + '</b><p>' + E(closest.description) + '</p><div class="meter"><i style="width:' + Math.min(100, Math.floor(closest.current / Math.max(1, closest.target) * 100)) + '%"></i></div><small>' + closest.current + ' / ' + closest.target + ' · ' + E(closest.tier) + '</small></div></div>' : '<p>Every visible milestone is earned.</p>') + (featured ? '<h3>Featured Challenge</h3><b>' + E(featured.title) + '</b><p class="small">' + E(featured.requirement) + '</p>' : '') + '</section></div><div class="toolbar achievement-filters"><input id="ach-search" class="search" placeholder="Search achievements"><select id="ach-status"><option value="all">All statuses</option><option value="earned">Earned</option><option value="locked">Locked</option><option value="progress">In progress</option><option value="secret">Secret</option></select><select id="ach-category"><option value="">All categories</option>' + Array.from(new Set(defs.map(d => d.category))).map(c => '<option>' + E(c) + '</option>').join('') + '</select><select id="ach-tier"><option value="">All difficulties</option>' + tierOrder.map(t => '<option>' + t + '</option>').join('') + '</select><select id="ach-sort"><option value="default">Recommended order</option><option value="difficulty">Difficulty</option><option value="name">Alphabetical</option><option value="progress">Progress</option></select><label class="small"><input id="ach-hide" type="checkbox"> Hide earned</label></div><div id="achievement-categories"></div>';
        
    let search = document.getElementById('ach-search'),
        status = document.getElementById('ach-status'),
        category = document.getElementById('ach-category'),
        tier = document.getElementById('ach-tier'),
        sort = document.getElementById('ach-sort'),
        hide = document.getElementById('ach-hide');
        
    hide.checked = !!T.settings.hideUnlockedAchievements;
    
    function draw() {
      let list = defs.filter(d => {
        let e = !!earned[d.id],
            progress = !e && d.current > 0;
            
        return (!search.value || [d.title, d.description, d.category, d.requirement, d.extra, d.hint].join(' ').toLowerCase().includes(search.value.toLowerCase())) && (!category.value || d.category === category.value) && (!tier.value || d.tier === tier.value) && (!hide.checked || !e) && (status.value === 'all' || status.value === 'earned' && e || status.value === 'locked' && !e || status.value === 'progress' && progress && !d.secret || status.value === 'secret' && d.secret);
      });
      
      if (sort.value === 'name') list.sort((a, b) => a.title.localeCompare(b.title));
      if (sort.value === 'difficulty') list.sort((a, b) => tierOrder.indexOf(a.tier) - tierOrder.indexOf(b.tier));
      if (sort.value === 'progress') list.sort((a, b) => b.current / Math.max(1, b.target) - a.current / Math.max(1, a.target));
      
      let host = document.getElementById('achievement-categories');
      host.innerHTML = Array.from(new Set(list.map(d => d.category))).map(cat => '<section class="achievement-section"><h2>' + E(cat) + ' <span class="small">' + list.filter(d => d.category === cat && earned[d.id]).length + ' / ' + list.filter(d => d.category === cat).length + ' earned</span></h2><div class="achievement-grid">' + list.filter(d => d.category === cat).map(d => {
        let e = earned[d.id],
            hidden = d.secret && !e,
            pr = Math.min(100, Math.floor(d.current / Math.max(1, d.target) * 100));
            
        return '<article class="achievement-card ' + (e ? 'earned' : 'locked-achievement') + ' tier-card-' + E(d.tier.toLowerCase()) + (hidden ? ' secret-achievement' : '') + '"><div class="achievement-crest tier-' + E(d.tier.toLowerCase()) + '" aria-hidden="true">' + (hidden ? '?' : E(d.icon)) + '</div><div class="achievement-card-body"><div class="small">' + (hidden ? 'SECRET · HIDDEN' : E(d.category)) + ' · ' + E(d.tier) + ' · ' + (e ? 'EARNED' : hidden ? 'UNDISCOVERED' : 'LOCKED') + '</div><h3>' + E(hidden ? '????' : d.title) + '</h3><p>' + E(hidden ? d.hint : d.description) + '</p><p class="small"><b>' + (hidden ? 'Hint:' : 'Requirement:') + '</b> ' + E(hidden ? d.hint : d.requirement) + '</p>' + (d.extra && !hidden ? '<p class="small">' + E(d.extra) + '</p>' : '') + (!hidden ? '<div class="achievement-progress"><span>' + d.current + ' / ' + d.target + '</span><div class="meter"><i style="width:' + pr + '%"></i></div></div><p class="small">' + (e ? (earned[d.id].unlockedAt ? 'Earned ' + new Date(earned[d.id].unlockedAt).toLocaleString() : 'Earned historically · date unknown') : 'Progress ' + pr + '%') + '</p>' : '') + '<a class="button-link" href="journal.html?achievement=' + encodeURIComponent(d.id) + '&amp;create=1">Journal entry</a><button class="pin-achievement" data-pin-ach="' + E(d.id) + '" aria-pressed="' + !!pins[d.id] + '" ' + (!pins[d.id] && pinned.length >= 3 ? 'disabled' : '') + '>' + (pins[d.id] ? 'Unpin' : 'Pin milestone') + '</button></div></article>';
      }).join('') + '</div></section>').join('') || '<div class="empty-state">No achievements match. <button id="ach-clear">Clear filters</button></div>';
      
      host.querySelectorAll('[data-pin-ach]').forEach(b => b.onclick = () => {
        let id = b.dataset.pinAch;
        if (!pins[id] && Object.keys(pins).filter(k => pins[k]).length >= 3) return;
        if (T.setAchievementPin(id, !pins[id])) window.GA_EXTRAS_RENDER('achievements');
      });
      
      let c = document.getElementById('ach-clear');
      if (c) c.onclick = () => {
        search.value = '';
        status.value = 'all';
        category.value = '';
        tier.value = '';
        hide.checked = false;
        draw();
      };
    }
    
    [search, status, category, tier, sort, hide].forEach(x => x.oninput = draw);
    hide.onchange = () => {
      T.setSetting('hideUnlockedAchievements', hide.checked);
      draw();
    };
    draw();
  }

  function bossIntel(b) {
    if (!b) return;
    let old = document.getElementById('boss-intel-dialog');
    if (old) old.remove();
    
    let dlg = document.createElement('dialog');
    dlg.id = 'boss-intel-dialog';
    dlg.className = 'guide-dialog intel-dialog';
    
    function paint() {
      let missingBoss = (b.bossReq || []).filter(n => {
            let r = T.bosses.find(x => x.name === n);
            return r ? !T.defeated(n) : !T.availableByName(n);
          }),
          missingTasks = (b.taskReq || []).filter(n => !T.taskDone(n)),
          rewards = R.filter(r => r.bossId === b.id),
          notes = T.notes.filter(n => n.scope === 'Boss: ' + b.name && String(n.text || '').trim()),
          available = b.external ? T.defeated(b.name) : T.availableByName(b.name),
          locked = missingBoss.length + missingTasks.length > 0;
          
      dlg.innerHTML = '<button class="close" aria-label="Close boss intel">Close</button><div class="intel-portrait" aria-label="No boss portrait is stored; decorative initials fallback">' + E(b.name.split(/\s+/).map(x => x[0]).slice(0, 2).join('')) + '</div><div class="page-kicker">BOSS INTEL · ' + E(b.game) + '</div><h2>' + E(b.name) + '</h2><p class="intel-location"><b>' + E(b.area) + '</b><br>' + E(b.location) + '</p><div class="intel-status-grid"><span class="pill">' + (T.defeated(b.name) ? 'Defeated' : 'Not defeated') + '</span><span class="pill">' + (available ? 'Available' : locked ? 'Blocked by listed requirements' : 'No lock recorded') + '</span><span class="pill">' + E(b.game) + '</span><button class="boss-pin" data-boss-pin="' + E(b.name) + '" aria-pressed="' + T.isBossPinned(b.name) + '">' + (T.isBossPinned(b.name) ? '★ Pinned' : '☆ Pin boss') + '</button></div><section class="intel-section"><h3>Preparation</h3><p>' + (available ? 'The tracker sees no unmet listed requirements.' : locked ? 'This encounter has incomplete recorded requirements. The guide does not guarantee in-game unlock conditions.' : 'No prerequisites are listed in the current checklist.') + '</p>' + (missingBoss.length ? '<h4>Missing boss prerequisites</h4><ul>' + missingBoss.map(n => '<li>' + E(n) + ' <span class="small">' + (T.bosses.some(x => x.name === n) ? (T.bosses.find(x => x.name === n).external ? 'External prerequisite is incomplete in the tracker.' : 'Tracked boss prerequisite is incomplete.') : 'Not resolved in tracker data.') + '</span></li>').join('') + '</ul>' : '') + (missingTasks.length ? '<h4>Missing checklist steps</h4><ul class="intel-task-list">' + missingTasks.map(n => '<li><label><input type="checkbox" data-intel-task="' + E(n) + '"> ' + E(n) + '</label> <span class="small">Checklist label; verification may vary.</span></li>').join('') + '</ul>' : '') + '<p><a href="prereqs.html?boss=' + encodeURIComponent(b.name) + '">Open related prerequisite records →</a> · <a href="bosses.html?boss=' + encodeURIComponent(b.name) + '">Open checklist entry →</a></p></section><section class="intel-section"><h3>Known drops & rewards <span class="small">' + rewards.length + ' unique records</span></h3>' + (rewards.length ? '<div class="intel-rewards">' + rewards.map(r => '<article class="intel-reward"><b>' + E(r.name) + '</b><span class="pill">' + E(r.category) + '</span><p>' + E(r.acquisition) + '</p><label class="small">Collection <select data-intel-reward="' + E(r.id) + '"><option value="unknown" ' + (state(r) === 'unknown' ? 'selected' : '') + '>Unknown</option><option value="not collected" ' + (state(r) === 'not collected' ? 'selected' : '') + '>Not collected</option><option value="collected" ' + (state(r) === 'collected' ? 'selected' : '') + '>Collected</option><option value="not applicable" ' + (state(r) === 'not applicable' ? 'selected' : '') + '>Not applicable</option></select></label><p class="small">' + E(r.verification) + ' · ' + E(r.sourceTitle || 'No source title recorded') + (r.sourceUrl ? ' · <a href="' + E(r.sourceUrl) + '" target="_blank" rel="noreferrer">Source</a>' : '') + '</p><p class="small">' + E(r.notes || 'No additional notes.') + '</p></article>').join('') + '</div>' : '<p>No reward records in the catalog refer to this boss.</p>') + '</section><section class="intel-section"><h3>Personal notes</h3>' + (notes.map(n => '<p class="intel-note">' + E(n.text) + '</p>').join('') || '<p class="small">No boss-specific notes yet.</p>') + '<button class="intel-add-note">Add a boss note</button></section><p class="small intel-source"><b>Boss source:</b> Existing project checklist; no per-boss source URL or independent verification level is stored. Boss location and requirement wording may be uncertain or version-dependent.</p><div class="intel-actions"><button class="intel-defeat">' + (T.defeated(b.name) ? 'Unmark defeated' : 'Mark defeated') + '</button><a class="button-link" href="drops.html?boss=' + encodeURIComponent(b.name) + '">View rewards</a> <a class="button-link" href="journal.html?boss=' + encodeURIComponent(b.id) + '&amp;area=' + encodeURIComponent(b.area) + '&amp;create=1">Write journal entry</a></div>';
          
      dlg.querySelector('.close').onclick = () => dlg.close();
      dlg.querySelector('.boss-pin').onclick = () => {
        T.setBossPin(b.name, !T.isBossPinned(b.name));
        paint();
      };
      dlg.querySelector('.intel-defeat').onclick = () => {
        T.setBossState(b.name, !T.defeated(b.name));
        paint();
      };
      dlg.querySelector('.intel-add-note').onclick = () => {
        let text = prompt('Add a note for ' + b.name + ':');
        if (text && text.trim()) {
          T.addNote('Boss: ' + b.name, text.trim());
          paint();
        }
      };
      dlg.querySelectorAll('[data-intel-task]').forEach(x => x.onchange = () => {
        T.taskSet(x.dataset.intelTask, x.checked);
        paint();
      });
      dlg.querySelectorAll('[data-intel-reward]').forEach(x => x.onchange = () => {
        T.setRewardState(x.dataset.intelReward, x.value);
        paint();
      });
    }
    
    paint();
    document.body.append(dlg);
    dlg.onclose = () => dlg.remove();
    dlg.showModal();
  }
  
  window.GA_BOSS_INTEL = bossIntel;

  const FAQ = [
    ['Getting Started', 'What is this website for?', 'It is a local companion for the supplied Golden Age boss guide. It tracks boss checkboxes, shared prerequisite tasks, reward collection, notes, and your own achievements. It does not read the game save.', 'companion tracker checklist'],
    ['Getting Started', 'How should I use it during a playthrough?', 'Start with Home / Dashboard, then browse the Boss Checklist or Prerequisites. Mark a boss or task only when you have confirmed it in your playthrough. Use Drops & Rewards for separate item collection tracking, and Hidden Talismans for the eight discovery locations and final offering.', 'dashboard boss checklist rewards'],
    ['Getting Started', 'Does the website modify Elden Ring or my game save?', 'No. The tracker stores its own state in this browser’s localStorage and does not access the game files or save.', 'game save localStorage'],
    ['Bosses and Progression', 'What do Available, Locked, Defeated, and Unknown mean?', 'Available means all listed checkboxes are satisfied. Locked means known listed requirements remain incomplete. Defeated means you marked the boss. Unknown requirements appear when an explicitly version-checking requirement remains unresolved; the guide cannot verify the game state.', 'status available locked defeated unknown'],
    ['Bosses and Progression', 'How does the site determine whether a boss is unlocked?', 'It derives availability from that record’s listed prerequisite bosses and task checkboxes. It does not inspect your game. Requirements may be incomplete or version-dependent.', 'availability unlock'],
    ['Bosses and Progression', 'What should I do if a boss appears incorrectly locked?', 'Open its detail or the Progression page to see unmet requirements. Check the linked boss and shared task states, then consult the source guide for your mod version.', 'locked missing requirements'],
    ['Bosses and Progression', 'How do I find the next boss I can fight?', 'Use the Available filter on Bosses & Locations or the available section on the dashboard.', 'next available'],
    ['Prerequisites', 'What counts as a prerequisite?', 'The current guide lists prerequisite bosses and manual task steps. A task checkbox is shared wherever its exact task record appears.', 'task shared'],
    ['Prerequisites', 'How do multi-step prerequisites work?', 'The Prerequisites page groups checklist steps into boss-specific chains. Each step uses the same shared task record as the boss card; the chain counter updates as you check them.', 'multi-step chain'],
    ['Prerequisites', 'Why might a prerequisite be marked Unknown?', 'Some source entries literally ask you to check whether a condition applies in your version, and the guide does not fully document how to complete many task labels. The tracker marks these as unverified rather than treating them as confirmed facts.', 'unknown unverified version'],
    ['Hidden Talismans', 'How does the Eccentric Corpse talisman unlock?', 'Collect the first seven hidden talismans, then interact with the glowing object in the Worldlink Atrium. Its own collection checkbox remains separate and is never checked automatically.', 'hidden talismans final Eccentric Corpse seven Worldlink'],
    ['Hidden Talismans', 'How is hidden talisman progress saved?', 'Talisman collection uses the same reward ledger and JSON backup as other items. It is kept separate from boss victories.', 'talisman backup collection reward'],
    ['Drops and Rewards', 'How do I find a particular item?', 'Open Drops & Rewards, choose Browse by Item, then search or filter by category, area, verification, and boss state. Select an item name for its source and acquisition notes.', 'item search catalog'],
    ['Drops and Rewards', 'What is the difference between a boss drop and a nearby item?', 'The existing checklist has a single drops/rewards text field and does not reliably distinguish direct drops from nearby items or shops. The catalog retains that wording and flags acquisition details that were not verified.', 'nearby chest vendor acquisition'],
    ['Drops and Rewards', 'What do verification labels mean?', 'Partially verified means a community wiki search result supported part of the association but left a version or wording question. Conflicting sources means the checklist and wiki differ. Unverified means no independent confirmation was available.', 'verified conflict source'],
    ['Drops and Rewards', 'Why is an item image or description missing?', 'Exact, mod-specific item art was not available to verify for this catalog. It uses category emblems as placeholders and does not substitute a possibly misleading vanilla item image.', 'image placeholder description'],
    ['Drops and Rewards', 'Why is a reward not marked collected after its boss is defeated?', 'Boss completion and item collection are separate states by design. Choose a collection status on the reward card; defeating a boss never auto-collects its rewards.', 'collected reward'],
    ['Achievements', 'How are achievements earned?', 'They are evaluated from unique boss records, shared task records, unique reward IDs, notes, theme choice, and successful backup export. They are milestones within this website only.', 'achievement conditions'],
    ['Achievements', 'Are achievements based on game data?', 'No. They use only progress you check in the website.', 'game data'],
    ['Achievements', 'Can achievements be earned retroactively?', 'Yes. On first initialization, already-satisfied achievements are recorded as historical with no invented unlock time. Later milestones receive a timestamp.', 'retroactive historical'],
    ['Achievements', 'What happens if I import a previous save?', 'Merge or replace the tracker data using Settings & Data. Existing conditions are reevaluated; imported earned records retain their timestamps when present.', 'import achievements'],
    ['Progress and Data', 'Where is my progress saved?', 'In localStorage for this browser profile and device. It survives page refreshes but may be erased if browser data is cleared.', 'storage browser'],
    ['Progress and Data', 'How do I back up and restore progress?', 'Open Settings & Data and download a JSON backup. To restore, select that file and choose Merge or Replace. Replace asks for confirmation; merge keeps current entries and adds recognized records.', 'backup export import'],
    ['Progress and Data', 'Can I reset progress without resetting settings?', 'Yes. Settings & Data has separate Reset preferences, Reset gameplay progress, and Reset all local data actions. Each explains what it clears and asks for confirmation.', 'reset preferences'],
    ['Troubleshooting', 'Why does my progress appear to have disappeared?', 'Check that you are using the same browser profile and local HTML folder. If you have a JSON backup, restore it in Settings & Data.', 'disappeared backup'],
    ['Troubleshooting', 'Why does an image or external source link not load?', 'The companion’s local hero and category placeholders work offline. Source links require internet access and some community pages restrict automated access.', 'image offline links'],
    ['Troubleshooting', 'What should I do if an import fails?', 'Confirm it is a version 3 JSON backup from this tracker and that the file is intact. The import panel reports validation errors before replacing data.', 'import invalid'],
    ['Troubleshooting', 'Why might the guide differ from my mod?', 'The mod and its community spreadsheets can change across versions. Treat unverified and conflicting entries as research prompts; the tracker cannot confirm the installed version.', 'version mismatch mod'],
    ['Bosses and Progression', 'Why can a boss have multiple prerequisites?', 'The source guide lists some bosses with several linked bosses and task steps. The tracker requires every listed condition to be checked before showing that boss as available.', 'multiple requirements'],
    ['Prerequisites', 'What should I do if a listed requirement seems incorrect?', 'Leave it unchecked until you verify it for your mod version. The Prerequisites page shows which encounter uses it; uncertain prompts remain labeled for review.', 'incorrect verify version'],
    ['Progress and Data', 'What happens if I switch browsers or computers?', 'LocalStorage does not sync between devices. Export a JSON backup in the old browser and import it in the new browser.', 'switch browser device'],
    ['Progress and Data', 'What is the difference between Merge and Replace during import?', 'Merge keeps current records and adds recognized values from the backup. Replace overwrites the tracker data included in that backup and asks for confirmation.', 'merge replace import'],
    ['Troubleshooting', 'Why did a checkbox change not appear on another page?', 'Confirm you opened the page files from the same site folder and browser profile. The pages use shared tracker storage for this local site; different profiles keep separate local data.', 'checkbox synchronization shared pages']
  ];

  function faqPage() {
    let v = document.getElementById('view');
    v.innerHTML = '<div class="page-kicker">FIELD GUIDE HELP</div><h1>Help &amp; FAQ</h1><p class="page-intro">Practical answers about the tracker, its limits, and where to go next.</p><div class="toolbar faq-searchbar"><input id="faq-search" class="search" placeholder="Search questions, answers, or keywords"><button id="faq-clear">Clear search</button><select id="faq-category"><option value="">All categories</option>' + Array.from(new Set(FAQ.map(x => x[0]))).map(x => '<option>' + E(x) + '</option>').join('') + '</select></div><p id="faq-count" class="small"></p><div id="faq-list"></div><section class="settings-section"><div class="section-heading"><span>⌖</span><div><h2>Quick Help</h2><p>Jump straight to the relevant guide.</p></div></div><div class="quick-links"><a href="bosses.html">Boss Checklist</a><a href="prereqs.html">Prerequisites</a><a href="drops.html">Drops &amp; Rewards</a><a href="progression.html">Progression &amp; Unlocks</a><a href="achievements.html">Achievements</a><a href="settings.html">Settings &amp; Data</a></div></section><div class="notice"><b>Progress looks missing?</b><ol><li>Return to the same browser profile and local site folder.</li><li>Check whether browser local data was cleared.</li><li>Restore a prior JSON backup from Settings &amp; Data.</li></ol></div>';
    
    let q = document.getElementById('faq-search'),
        cat = document.getElementById('faq-category'),
        list = document.getElementById('faq-list');
        
    function draw() {
      let matches = FAQ.filter(x => (!cat.value || x[0] === cat.value) && (!q.value || x.join(' ').toLowerCase().includes(q.value.toLowerCase())));
      document.getElementById('faq-count').textContent = matches.length + ' answer' + (matches.length === 1 ? '' : 's');
      list.innerHTML = Array.from(new Set(matches.map(x => x[0]))).map(c => '<section class="faq-section"><h2>' + E(c) + '</h2>' + matches.filter(x => x[0] === c).map(x => '<details class="faq-item"><summary>' + E(x[1]) + '</summary><div class="faq-answer"><p>' + faqLinks(x[2]) + '</p></div></details>').join('') + '</section>').join('') || '<div class="empty-state">No answers match that search. Try a shorter term or clear the filters.</div>';
    }
    
    q.oninput = draw;
    cat.onchange = draw;
    document.getElementById('faq-clear').onclick = () => {
      q.value = '';
      cat.value = '';
      draw();
    };
    draw();
  }

  function faqLinks(text) {
    let safe = E(text);
    return safe.replace(/Settings &amp; Data/g, '<a href="settings.html">Settings &amp; Data</a>').replace(/Drops &amp; Rewards/g, '<a href="drops.html">Drops &amp; Rewards</a>').replace(/Bosses &amp; Locations/g, '<a href="bosses.html">Bosses &amp; Locations</a>').replace(/Progression page/g, '<a href="progression.html">Progression page</a>').replace(/Hidden Talismans/g, '<a href="talismans.html">Hidden Talismans</a>').replace(/Prerequisites page/g, '<a href="prereqs.html">Prerequisites page</a>');
  }

  const JOURNAL_TYPES = ['Discovery', 'Boss Encounter', 'Milestone', 'Theory', 'Plan', 'Freeform'];
  const journalId = () => globalThis.crypto?.randomUUID?.() || 'entry-' + Date.now().toString(36) + '-' + Math.random().toString(36).slice(2, 9);
  const journalDate = () => new Date().toLocaleDateString('en-CA');
  const journalEsc = E;

  function journalPage() {
    const host = document.getElementById('journal-content');
    if (!host) return;
    
    let all = T.journalEntries || [],
        params = new URLSearchParams(location.search),
        initial = { bossId: params.get('boss') || '', area: params.get('area') || '', itemId: params.get('item') || '', achievementId: params.get('achievement') || '' };
        
    const bosses = T.bosses,
          areas = [...new Set(bosses.map(b => b.area))].sort(),
          items = T.rewards(),
          achievements = typeof buildAchievements === 'function' ? buildAchievements() : [];
          
    const relation = e => {
      let b = bosses.find(x => x.id === e.bossId),
          i = items.find(x => x.id === e.itemId),
          a = achievements.find(x => x.id === e.achievementId);
      return [b?.name || e.bossNameSnapshot, i?.name || e.itemNameSnapshot, a?.title || e.achievementTitleSnapshot].filter(Boolean);
    };
    
    function render() {
      all = T.journalEntries || [];
      let types = ['', ...JOURNAL_TYPES],
          tags = [...new Set(all.flatMap(e => Array.isArray(e.tags) ? e.tags : []))].sort(),
          q = document.getElementById('journal-search')?.value.toLowerCase() || '',
          type = document.getElementById('journal-type-filter')?.value || '',
          area = document.getElementById('journal-area-filter')?.value || '',
          boss = document.getElementById('journal-boss-filter')?.value || '',
          tag = document.getElementById('journal-tag-filter')?.value || '',
          sort = document.getElementById('journal-sort')?.value || 'date',
          view = document.querySelector('[name="journal-view"]:checked')?.value || 'timeline';
          
      let entries = all.filter(e => (!q || [e.title, e.text, (e.tags || []).join(' '), e.area, ...relation(e)].join(' ').toLowerCase().includes(q)) && (!type || e.type === type) && (!area || e.area === area) && (!boss || e.bossId === boss) && (!tag || (e.tags || []).includes(tag)));
      entries.sort((a, b) => (b.pinned - a.pinned) || (sort === 'title' ? a.title.localeCompare(b.title) : String(b.date || '').localeCompare(String(a.date || ''))));
      
      let counts = { milestones: all.filter(e => e.type === 'Milestone').length, plans: all.filter(e => e.type === 'Plan').length };
      
      host.innerHTML = '<div class="page-kicker">FIELD NOTES · YOUR STORY IN THE LANDS BETWEEN</div><h1>Journey Journal</h1><p class="page-intro">Record discoveries, encounters, theories, milestones, and the next steps you choose for your own journey. Entries are saved in this browser and are never generated automatically.</p><div class="journal-stats"><article><b>' + all.length + '</b><span>Entries</span></article><article><b>' + counts.milestones + '</b><span>Milestones</span></article><article><b>' + counts.plans + '</b><span>Active goals</span></article><article><b>' + E(all.length ? new Date(Math.max(...all.map(e => Date.parse(e.updatedAt || e.date) || 0))).toLocaleDateString() : '—') + '</b><span>Latest update</span></article></div><div class="journal-actions"><button class="primary" id="journal-new">✦ Write an entry</button><a class="button-link" href="notes.html">Open Notes &amp; To-Do List</a><label class="small"><input type="checkbox" id="journal-suggestions" ' + (T.settings.journalSuggestions ? 'checked' : '') + '> Suggest topics from checklist progress</label></div><section id="journal-suggestion-area"></section><section class="journal-editor-wrap" id="journal-editor-wrap" hidden></section><section class="journal-section"><h2>Journal Entries</h2><div class="toolbar journal-filters"><input id="journal-search" class="search" placeholder="Search title, entry, tags, or linked records" value="' + E(document.getElementById('journal-search')?.value || '') + '"><select id="journal-type-filter"><option value="">All entry types</option>' + JOURNAL_TYPES.map(x => '<option>' + E(x) + '</option>').join('') + '</select><select id="journal-area-filter"><option value="">All areas</option>' + areas.map(x => '<option>' + E(x) + '</option>').join('') + '</select><select id="journal-boss-filter"><option value="">All related bosses</option>' + bosses.map(x => '<option value="' + E(x.id) + '">' + E(x.name) + '</option>').join('') + '</select><select id="journal-tag-filter"><option value="">All tags</option>' + tags.map(x => '<option>' + E(x) + '</option>').join('') + '</select><select id="journal-sort"><option value="date">Newest date</option><option value="title">Title</option></select><label>View <select id="journal-view"><option value="timeline" ' + (view === 'timeline' ? 'selected' : '') + '>Timeline</option><option value="list" ' + (view === 'list' ? 'selected' : '') + '>List</option></select></label><button id="journal-clear">Clear</button></div><div id="journal-entries" class="journal-entries ' + (view === 'list' ? 'is-list' : '') + '">' + (entries.length ? entries.map(e => '<article class="journal-entry ' + (e.pinned ? 'is-pinned' : '') + '"><div class="journal-entry-meta"><span class="pill">' + E(e.type) + '</span><time>' + E(e.date || 'Undated') + '</time>' + (e.importance && e.importance !== 'ordinary' ? '<span class="pill">' + E(e.importance) + '</span>' : '') + '</div><h3>' + E(e.title) + '</h3><p class="journal-entry-text">' + E(e.text).replace(/\n/g, '<br>') + '</p>' + (e.tags?.length ? '<div class="journal-tags">' + e.tags.map(t => '<button data-jtag="' + E(t) + '">#' + E(t) + '</button>').join('') + '</div>' : '') + (e.area ? '<p class="small">⌖ ' + E(e.area) + '</p>' : '') + (relation(e).length ? '<p class="small">Linked: ' + relation(e).map(E).join(' · ') + '</p>' : '') + '<div class="journal-entry-actions"><button data-journal-pin="' + E(e.id) + '">' + (e.pinned ? 'Unpin' : 'Pin') + '</button><button data-journal-edit="' + E(e.id) + '">Edit</button><button class="danger" data-journal-delete="' + E(e.id) + '">Delete</button></div></article>').join('') : '<div class="empty-state">' + (all.length ? 'No entries match these filters. Clear a filter or try another search.' : 'Your journal begins when you write the first entry. Add a discovery, a hard-won victory, or a plan for the next session.') + '</div>') + '</div></section>';
      
      for (let [id, val] of [['journal-search', q], ['journal-type-filter', type], ['journal-area-filter', area], ['journal-boss-filter', boss], ['journal-tag-filter', tag], ['journal-sort', sort], ['journal-view', view]]) {
        let el = document.getElementById(id);
        if (el) el.value = val;
      }
      
      const openEditor = (entry = {}, draft = false) => {
        let e = { type: 'Freeform', date: journalDate(), importance: 'ordinary', tags: [], ...entry },
            wrap = document.getElementById('journal-editor-wrap');
            
        wrap.hidden = false;
        wrap.innerHTML = '<form id="journal-form" class="journal-editor"><div class="journal-editor-heading"><div><h2>' + (e.id ? 'Edit entry' : draft ? 'Draft a suggested topic' : 'New journal entry') + '</h2><p class="small">Only save when the wording and date reflect your own notes.</p></div><button type="button" id="journal-cancel">Close</button></div><div class="journal-form-grid"><label>Title<input name="title" maxlength="120" required value="' + E(e.title || '') + '"></label><label>Entry type<select name="type">' + JOURNAL_TYPES.map(t => '<option ' + (e.type === t ? 'selected' : '') + '>' + E(t) + '</option>').join('') + '</select></label><label>Date<input name="date" type="date" value="' + E(e.date || journalDate()) + '"></label><label>Importance<select name="importance"><option value="ordinary">Ordinary</option><option value="memorable" ' + (e.importance === 'memorable' ? 'selected' : '') + '>Memorable</option><option value="major" ' + (e.importance === 'major' ? 'selected' : '') + '>Major milestone</option></select></label><label>Related boss<select name="bossId"><option value="">None</option>' + bosses.map(b => '<option value="' + E(b.id) + '" ' + (e.bossId === b.id ? 'selected' : '') + '>' + E(b.name) + '</option>').join('') + '</select></label><label>Related area<select name="area"><option value="">None</option>' + areas.map(a => '<option ' + (e.area === a ? 'selected' : '') + '>' + E(a) + '</option>').join('') + '</select></label><label>Related talisman or reward<select name="itemId"><option value="">None</option>' + items.map(i => '<option value="' + E(i.id) + '" ' + (e.itemId === i.id ? 'selected' : '') + '>' + E(i.name) + '</option>').join('') + '</select></label><label>Related achievement<select name="achievementId"><option value="">None</option>' + achievements.map(a => '<option value="' + E(a.id) + '" ' + (e.achievementId === a.id ? 'selected' : '') + '>' + E(a.title) + '</option>').join('') + '</select></label><label class="journal-wide">Tags<input name="tags" placeholder="comma, separated, tags" value="' + E((e.tags || []).join(', ')) + '"></label><label class="journal-wide">Your entry<textarea name="text" rows="7" maxlength="12000" placeholder="What happened? What do you want to remember?" required>' + E(e.text || '') + '</textarea></label></div><div class="journal-form-actions"><button class="primary" type="submit">Save entry</button><button type="button" id="journal-cancel-2">Cancel</button></div></form>';
        
        let form = document.getElementById('journal-form');
        form.onsubmit = ev => {
          ev.preventDefault();
          let fd = new FormData(form),
              now = new Date().toISOString(),
              bossId = fd.get('bossId'),
              itemId = fd.get('itemId'),
              achievementId = fd.get('achievementId'),
              b = bosses.find(x => x.id === bossId),
              i = items.find(x => x.id === itemId),
              a = achievements.find(x => x.id === achievementId),
              next = {
                ...(e.id ? e : {}),
                id: e.id || journalId(),
                title: String(fd.get('title')).trim(),
                text: String(fd.get('text')).trim(),
                type: String(fd.get('type')),
                date: String(fd.get('date') || journalDate()),
                area: String(fd.get('area') || ''),
                bossId: String(bossId || ''),
                itemId: String(itemId || ''),
                achievementId: String(achievementId || ''),
                bossNameSnapshot: b?.name || e.bossNameSnapshot || '',
                itemNameSnapshot: i?.name || e.itemNameSnapshot || '',
                achievementTitleSnapshot: a?.title || e.achievementTitleSnapshot || '',
                tags: [...new Set(String(fd.get('tags')).split(',').map(x => x.trim()).filter(Boolean))],
                importance: String(fd.get('importance')),
                createdAt: e.createdAt || now,
                updatedAt: now,
                pinned: !!e.pinned
              };
              
          let nextAll = [...all.filter(x => x.id !== next.id), next];
          T.setJournalEntries(nextAll);
          wrap.hidden = true;
          render();
        };
        
        document.getElementById('journal-cancel').onclick = document.getElementById('journal-cancel-2').onclick = () => {
          wrap.hidden = true;
        };
        form.elements.title.focus();
      };
      
      document.getElementById('journal-new').onclick = () => openEditor(initial);
      let sug = document.getElementById('journal-suggestions');
      sug.onchange = () => {
        T.setSetting('journalSuggestions', sug.checked);
        render();
      };
      
      let sugHost = document.getElementById('journal-suggestion-area');
      if (sug.checked) {
        let suggestions = [];
        for (let b of bosses.filter(x => !x.external && T.defeated(x.name)).slice(0, 4)) {
          if (!all.some(e => e.bossId === b.id)) suggestions.push({ title: 'Remember ' + b.name, type: 'Boss Encounter', bossId: b.id, area: b.area });
        }
        for (let item of TAL.filter(x => state(x) === 'collected')) {
          if (!all.some(e => e.itemId === item.id)) suggestions.push({ title: 'Record finding ' + item.name, type: 'Discovery', itemId: item.id, area: item.area });
        }
        for (let ach of achievements.filter(x => T.earnedAchievements[x.id])) {
          if (!all.some(e => e.achievementId === ach.id)) suggestions.push({ title: 'Mark the milestone: ' + ach.title, type: 'Milestone', achievementId: ach.id });
        }
        
        if (suggestions.length) {
          sugHost.innerHTML = '<section class="journal-suggestions"><h2>Possible topics</h2><p class="small">Based on current checklist state; these are prompts only and do not imply when an event happened.</p><div class="journal-suggestion-grid">' + suggestions.slice(0, 6).map((x, n) => '<article><b>' + E(x.title) + '</b><button data-journal-draft="' + n + '">Draft an entry</button></article>').join('') + '</div></section>';
        }
        
        sugHost.querySelectorAll('[data-journal-draft]').forEach(btn => btn.onclick = () => openEditor({ ...suggestions[Number(btn.dataset.journalDraft)], date: journalDate() }, true));
      }
      
      for (let id of ['journal-search', 'journal-type-filter', 'journal-area-filter', 'journal-boss-filter', 'journal-tag-filter', 'journal-sort', 'journal-view']) {
        document.getElementById(id).oninput = document.getElementById(id).onchange = () => {
          let state = {};
          for (let x of ['journal-search', 'journal-type-filter', 'journal-area-filter', 'journal-boss-filter', 'journal-tag-filter', 'journal-sort', 'journal-view']) state[x] = document.getElementById(x).value;
          render();
          for (let [k, v] of Object.entries(state)) {
            let el = document.getElementById(k);
            if (el) el.value = v;
          }
        };
      }
      
      document.getElementById('journal-clear').onclick = () => {
        for (let id of ['journal-search', 'journal-type-filter', 'journal-area-filter', 'journal-boss-filter', 'journal-tag-filter']) document.getElementById(id).value = '';
        render();
      };
      
      document.querySelectorAll('[data-journal-edit]').forEach(btn => btn.onclick = () => {
        let e = all.find(x => x.id === btn.dataset.journalEdit);
        if (e) openEditor(e);
      });
      
      document.querySelectorAll('[data-journal-delete]').forEach(btn => btn.onclick = () => {
        let e = all.find(x => x.id === btn.dataset.journalDelete);
        if (e && confirm('Permanently delete “' + e.title + '” from your journal?')) {
          T.setJournalEntries(all.filter(x => x.id !== e.id));
          render();
        }
      });
      
      document.querySelectorAll('[data-journal-pin]').forEach(btn => btn.onclick = () => {
        let e = all.find(x => x.id === btn.dataset.journalPin);
        if (e) {
          T.setJournalEntries(all.map(x => x.id === e.id ? { ...x, pinned: !x.pinned, updatedAt: new Date().toISOString() } : x));
          render();
        }
      });
      
      document.querySelectorAll('[data-jtag]').forEach(btn => btn.onclick = () => {
        document.getElementById('journal-tag-filter').value = btn.dataset.jtag;
        render();
      });
    }
    
    render();
    if (params.has('create')) document.getElementById('journal-new').click();
  }

  const pageSymbols = { home: 'flame', about: 'tome', bosses: 'sword', drops: 'reliquary', talismans: 'rings', progression: 'rings', prereqs: 'branch', areas: 'map', games: 'blades', achievements: 'seal', notes: 'quill', journal: 'quill', help: 'scroll', settings: 'gear' };

  function decoratePage(id) {
    let nav = document.getElementById('nav');
    if (nav) {
      nav.querySelectorAll('[data-page]').forEach(a => {
        let key = pageSymbols[a.dataset.page];
        if (key && !a.querySelector('svg')) a.insertAdjacentHTML('afterbegin', '<svg class="nav-emblem" aria-hidden="true"><use href="assets/page-emblems.svg#' + key + '"></use></svg>');
      });
    }
    
    let view = document.getElementById('view');
    if (!view) return;
    
    view.querySelectorAll('h1').forEach(h => {
      if (h.querySelector('.page-emblem')) return;
      let key = pageSymbols[id] || 'seal';
      h.insertAdjacentHTML('afterbegin', '<svg class="page-emblem" aria-hidden="true"><use href="assets/page-emblems.svg#' + key + '"></use></svg>');
    });
    
    view.querySelectorAll('[data-intel]').forEach(btn => {
      if (!btn.dataset.bound) {
        btn.dataset.bound = '1';
        btn.onclick = () => bossIntel(T.bosses.find(b => b.id === btn.dataset.intel));
      }
    });
  }

  window.GA_EXTRAS_RENDER = function(id) {
  if (id === 'home') {
    // Small delay ensures app.js has finished inserting <div id="dashboard-content"> into the DOM
    setTimeout(() => {
      dashboardPage();
    }, 0);
  }
  if (id === 'drops') rewardPage();
  if (id === 'talismans') talismanPage();
  if (id === 'about') aboutPage();
  if (id === 'prereqs') {
    prereqPage();
    let host = document.getElementById('view');
    if (host) host.insertAdjacentHTML('beforeend', talismanDependencies());
  }
  if (id === 'progression') {
    let host = document.getElementById('view');
    if (host && !host.querySelector('.talisman-dependency')) {
      host.insertAdjacentHTML('beforeend', talismanDependencies());
    }
  }
  if (id === 'settings') settingsPage();
  if (id === 'journal') journalPage();
  if (id === 'achievements') achievementPage();
  if (id === 'help') faqPage();

  if (typeof applySettingEffects === 'function') applySettingEffects();
  if (typeof decoratePage === 'function') decoratePage(id);
};

  applySettingEffects();
  window.GA_BOSS_DROP_MIGRATION = T.applyBossDropCollection();
  syncAchievements(true);
  T.save();
  
  if (document.body.dataset.page === 'drops') rewardPage();
  if (document.body.dataset.page === 'talismans') talismanPage();
  if (document.body.dataset.page === 'about') aboutPage();
  if (document.body.dataset.page === 'home') dashboardPage();
  if (document.body.dataset.page === 'prereqs') {
    prereqPage();
    document.getElementById('view').insertAdjacentHTML('beforeend', talismanDependencies());
  }
  if (document.body.dataset.page === 'progression') document.getElementById('view').insertAdjacentHTML('beforeend', talismanDependencies());
  if (document.body.dataset.page === 'settings') settingsPage();
  if (document.body.dataset.page === 'journal') journalPage();
  if (document.body.dataset.page === 'achievements') achievementPage();
  if (document.body.dataset.page === 'help') faqPage();
  
  decoratePage(document.body.dataset.page || 'home');
})();
