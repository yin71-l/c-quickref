/* =========================================================================
 * C 结构速查 · 交互逻辑
 * 纯原生 JS，无依赖、无网络请求。支持 file:// 双击打开。
 * 视图状态全部由 URL 的 #锚点驱动，可收藏 / 刷新 / 前进后退。
 * ========================================================================= */
(function () {
  'use strict';

  var DATA = window.C_QUICKREF;
  var $ = function (id) { return document.getElementById(id); };

  if (!DATA || !Array.isArray(DATA.entries)) {
    document.body.innerHTML = '<p style="padding:40px;font-family:sans-serif">' +
      '内容文件未加载：请确认 <code>data/structures.js</code> 与本页面在同一目录下。</p>';
    return;
  }

  var categories = DATA.categories;
  var entries = DATA.entries;
  var byId = {};
  entries.forEach(function (e) { byId[e.id] = e; });

  /* --------------------------- 小工具 --------------------------- */
  function esc(s) {
    return String(s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }
  function low(s) { return String(s).toLowerCase(); }
  /* 补充说明里允许写 `代码` 反引号（纯文本里极轻量的一点强调，
   * 不引入 HTML，避免内容文件里出现标签导致 XSS 或转义麻烦） */
  function inlineCode(s) {
    return esc(s).replace(/`([^`]+)`/g, '<code>$1</code>');
  }

  /* 极轻量注释着色：只把 C 注释包一层 <span class="c-comment">，
   * 不做完整语法高亮。必须逐字符跳过字符串/字符常量，
   * 否则 printf("http://...") 里的 // 会被误当成注释。
   * 返回的是已转义的 HTML；纯文本仍从 textContent 取（复制按钮用）。 */
  function colorizeComments(code) {
    var out = '', i = 0, n = code.length;
    var inStr = false, inChar = false;
    function push(text) { out += esc(text); }
    while (i < n) {
      var c = code[i], d = code[i + 1];

      if (!inStr && !inChar && c === '/' && d === '/') {
        var j = code.indexOf('\n', i);
        if (j === -1) j = n;
        out += '<span class="c-comment">' + esc(code.slice(i, j)) + '</span>';
        i = j; continue;
      }
      if (!inStr && !inChar && c === '/' && d === '*') {
        var k = code.indexOf('*/', i + 2);
        var stop = k === -1 ? n : k + 2;
        out += '<span class="c-comment">' + esc(code.slice(i, stop)) + '</span>';
        i = stop; continue;
      }
      if (c === '\\' && (inStr || inChar)) { push(code.slice(i, i + 2)); i += 2; continue; }
      if (inStr) { push(c); if (c === '"') inStr = false; i++; continue; }
      if (inChar) { push(c); if (c === "'") inChar = false; i++; continue; }
      if (c === '"') { inStr = true; push(c); i++; continue; }
      if (c === "'") { inChar = true; push(c); i++; continue; }
      push(c); i++;
    }
    return out;
  }
  function countOf(catName) {
    return entries.filter(function (e) { return e.category === catName; }).length;
  }
  function catIdByName(name) {
    var c = categories.filter(function (x) { return x.name === name; })[0];
    return c ? c.id : '';
  }
  function catNameById(id) {
    var c = categories.filter(function (x) { return x.id === id; })[0];
    return c ? c.name : '';
  }

  /* 启动时做一次轻量自检：字段缺失 / 分类写错 / id 重复 / 关联指向空 */
  (function validate() {
    var seen = {};
    entries.forEach(function (e) {
      ['id', 'name', 'category', 'aliases', 'summary', 'syntax', 'code', 'pitfalls', 'related']
        .forEach(function (k) {
          if (e[k] === undefined) console.warn('[数据校验] 条目 ' + e.id + ' 缺字段：' + k);
        });
      if (seen[e.id]) console.warn('[数据校验] id 重复：' + e.id);
      seen[e.id] = true;
      if (categories.filter(function (c) { return c.name === e.category; }).length === 0) {
        console.warn('[数据校验] 分类不存在：' + e.category + '（条目 ' + e.id + '）');
      }
      (e.related || []).forEach(function (r) {
        if (!byId[r]) console.warn('[数据校验] ' + e.id + ' 关联了不存在的条目：' + r);
      });
    });
  })();

  /* --------------------------- 预建搜索索引 --------------------------- */
  /* 命中范围只限「名称 + 别名」：说明 / 语法 / 代码 / 易错点里的字眼
   * 不参与过滤，否则搜「循环」会被一堆正文里带这个词的条目淹没，
   * 真正叫「for 循环」的条目反而被挤出前 20 条。 */
  var index = entries.map(function (e) {
    return {
      e: e,
      fields: [
        { key: '名称', weight: 100, text: low(e.name) },
        { key: '别名', weight: 60,  text: low((e.aliases || []).join(' ')) }
      ]
    };
  });

  function search(query) {
    var terms = low(query).trim().split(/\s+/).filter(Boolean);
    if (!terms.length) return [];
    var out = [];
    index.forEach(function (row) {
      var score = 0, hit = '', ok = true;
      terms.forEach(function (t) {
        var best = 0, bestKey = '';
        row.fields.forEach(function (f) {
          var v = f.weight;
          if (f.text === t) v += 40;                       // 完全相等
          else if (f.text.indexOf(t) === 0) v += 20;        // 前缀命中
          if (f.text.indexOf(t) !== -1 && v > best) { best = v; bestKey = f.key; }
        });
        if (best === 0) { ok = false; return; }
        score += best;
        if (!hit) hit = bestKey;
      });
      if (ok) out.push({ e: row.e, score: score, hit: hit });
    });
    out.sort(function (a, b) { return b.score - a.score || a.e.name.localeCompare(b.e.name, 'zh'); });
    return out;
  }

  function highlight(text, terms) {
    var html = esc(text);
    terms.filter(Boolean).forEach(function (t) {
      var safe = esc(t).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      if (!safe) return;
      html = html.replace(new RegExp(safe, 'gi'), function (m) { return '<mark>' + m + '</mark>'; });
    });
    return html;
  }

  /* --------------------------- 侧栏：收起 / 唤出 --------------------------- */
  /* 状态记在 localStorage；file:// 下某些浏览器禁用存储，读写都做兜底。
   * isNarrow 用 820px 与 style.css 的断点保持一致。 */
  var LS_KEY = 'c-quickref-sidebar';
  var isNarrow = function () { return window.innerWidth <= 820; };

  function readCollapsed() {
    try { return localStorage.getItem(LS_KEY) === 'collapsed'; }
    catch (err) { return false; }
  }
  function saveCollapsed(v) {
    try { localStorage.setItem(LS_KEY, v ? 'collapsed' : 'expanded'); }
    catch (err) { /* 无存储权限时忽略，本次会话内仍生效 */ }
  }

  var collapsed = false;   // 启动时定，见文件末尾 initSidebar()

  function applySidebar() {
    document.body.classList.toggle('sidebar-collapsed', collapsed);
    // 宽屏遮罩永远隐藏；窄屏且展开时才显示，点它即收起
    $('drawer-scrim').hidden = !(isNarrow() && !collapsed);
    var btn = $('sidebar-toggle');
    btn.setAttribute('aria-expanded', String(!collapsed));
    btn.setAttribute('aria-label', collapsed ? '唤出分类目录' : '收起分类目录');
    btn.setAttribute('title', (collapsed ? '唤出' : '收起') + '分类目录 (Ctrl+B)');
  }

  function toggleSidebar(force) {
    collapsed = (typeof force === 'boolean') ? force : !collapsed;
    if (collapsed) cancelPendingHover();   // 收起后不允许迟到的预览生效
    saveCollapsed(collapsed);
    applySidebar();
  }

  function initSidebar() {
    // 窄屏默认收起（除非用户明确存过「展开」），避免抽屉一上来就盖住内容
    var stored = null;
    try { stored = localStorage.getItem(LS_KEY); } catch (err) { stored = null; }
    collapsed = stored === null ? isNarrow() : stored === 'collapsed';
    applySidebar();

    $('sidebar-toggle').addEventListener('click', function () { toggleSidebar(); });
    $('drawer-scrim').addEventListener('click', function () { toggleSidebar(true); });
    window.addEventListener('resize', applySidebar);
  }

  /* --------------------------- 页面宽度：满屏 / 居中 --------------------------- */
  /* 这一步是可回退实验：CSS 默认就是满屏，只有 body.centered 才回到 1180px 居中。
   * 状态记在 localStorage，键名独立于侧栏，互不影响。
   * 还原方法见 tools/restore.mjs 与 README。 */
  var WIDTH_LS_KEY = 'c-quickref-width';

  function readCentered() {
    try { return localStorage.getItem(WIDTH_LS_KEY) === 'centered'; }
    catch (err) { return false; }        // 无存储权限时默认满屏
  }
  function saveCentered(v) {
    try { localStorage.setItem(WIDTH_LS_KEY, v ? 'centered' : 'full'); }
    catch (err) { /* 本次会话内仍生效 */ }
  }
  function applyWidth() {
    var btn = $('width-toggle');
    document.body.classList.toggle('centered', centered);
    btn.setAttribute('aria-pressed', String(!centered));
    btn.setAttribute('aria-label', centered ? '切换为满屏显示' : '切换为居中显示');
    btn.setAttribute('title', '切换满屏 / 居中 (Ctrl+Shift+W)');
    btn.textContent = centered ? '⤢ 满屏' : '⤡ 居中';
  }
  function toggleWidth() {
    centered = !centered;
    saveCentered(centered);
    applyWidth();
  }
  var centered = readCentered();   // 默认满屏（无存储记录 / 存储禁用时）
  function initWidth() {
    applyWidth();
    $('width-toggle').addEventListener('click', toggleWidth);
  }

  /* --------------------------- 视图：分类导航 --------------------------- */
  var activeCategoryId = '';   // 已「点击锁定」的分类（网址锚点），详情页返回用得上
  var previewCatId = null;     // 已生效的悬停预览分类；null = 没有预览
  var currentView = 'browse';  // browse / detail / about，用于屏蔽详情页的悬停干扰

  /* --- 悬停防抖：停留满 300ms 才展示，点击不等 ---
   * 状态机：mouseover 只登记「待触发目标 + 计时器」，到点才真正渲染。
   *   hoverTimer   != null  → 正在计时，尚未生效
   *   pendingCatId != null  → 正在计时的目标分类
   *   previewCatId != null  → 已生效的预览
   * 移到别的分类 / 离开左栏 / 收起 / 打开详情或搜索 / 点击 → 一律取消计时。
   */
  var HOVER_DELAY = 300;
  var hoverTimer = null;
  var pendingCatId = null;

  function cancelPendingHover() {
    if (hoverTimer !== null) { clearTimeout(hoverTimer); hoverTimer = null; }
    pendingCatId = null;
  }

  function applyPreview(id) {
    hoverTimer = null;
    pendingCatId = null;
    // 到点前可能已离开列表页 / 收起左栏，做二次确认，避免「迟到的切换」
    if (currentView !== 'browse' || collapsed) return;
    if (id === previewCatId) return;
    previewCatId = id;
    renderBrowse(id, true);
  }

  function buildNav() {
    var html = '<button type="button" class="nav-item" data-cat="">' +
      '<span>全部结构</span><span class="count">' + entries.length + '</span></button>';
    categories.forEach(function (c) {
      html += '<button type="button" class="nav-item" data-cat="' + esc(c.id) + '">' +
        '<span>' + esc(c.name) + '</span><span class="count">' + countOf(c.name) + '</span></button>';
    });
    $('category-nav').innerHTML = html;

    /* 点击 = 立即固定，完全不遵守 300ms 规则。
     * 先取消待触发的计时器，否则「点完约 0.3 秒后」会被迟到的预览覆盖掉。 */
    $('category-nav').addEventListener('click', function (ev) {
      var btn = ev.target.closest('.nav-item');
      if (!btn) return;
      cancelPendingHover();
      previewCatId = null;          // 清掉残留预览，保证「当前浏览」标签与锚点一致
      var id = btn.getAttribute('data-cat');
      go(id ? '#cat/' + id : '#all');
      if (isNarrow()) toggleSidebar(true);   // 窄屏点完自动收起抽屉
    });

    /* 悬停 = 停留满 HOVER_DELAY 才预览。用 mouseover 委托
     * （mouseenter 不冒泡，没法委托）。只在列表页生效。 */
    $('category-nav').addEventListener('mouseover', function (ev) {
      if (currentView !== 'browse' || collapsed) return;
      var btn = ev.target.closest('.nav-item');
      if (!btn) return;
      var id = btn.getAttribute('data-cat') || '';
      if (id === previewCatId || id === pendingCatId) return;  // 已生效 / 正在计时，别重复起表
      cancelPendingHover();
      pendingCatId = id;
      hoverTimer = setTimeout(function () { applyPreview(id); }, HOVER_DELAY);
    });

    /* 鼠标离开整个导航区 → 取消未生效的计时；已生效的预览回到锁定分类 */
    $('category-nav').addEventListener('mouseout', function (ev) {
      var to = ev.relatedTarget;
      if (to && to.closest && to.closest('#category-nav')) return;  // 只是移到另一个分类上
      cancelPendingHover();
      if (previewCatId !== null) clearPreview();
    });
  }

  function clearPreview() {
    if (previewCatId === null) return;
    previewCatId = null;
    renderBrowse(activeCategoryId, false);
  }

  /* 当前正在展示的分类：预览优先，否则是被点击锁定的那个 */
  function currentCatId() {
    return previewCatId !== null ? previewCatId : activeCategoryId;
  }

  function markNav(catId, previewId) {
    Array.prototype.forEach.call(document.querySelectorAll('.nav-item'), function (b) {
      var id = b.getAttribute('data-cat');
      b.classList.toggle('active', id === catId);
      b.classList.toggle('preview', previewId !== null && id === previewId);
    });
  }

  /* 搜索浮层底部的「当前浏览」标签：仅提示，不限制范围、不改排序 */
  function updateSearchContext() {
    var id = currentCatId();
    $('search-context').textContent = id ? '当前浏览：' + catNameById(id) : '';
  }

  /* --------------------------- 视图：卡片列表 --------------------------- */
  function cardHtml(e) {
    return '<button type="button" class="card" data-id="' + esc(e.id) + '">' +
      '<div class="card-top"><span class="card-name">' + esc(e.name) + '</span>' +
      '<span class="tag">' + esc(e.category) + '</span></div>' +
      '<p class="card-summary">' + esc(e.summary) + '</p>' +
      '<p class="card-syntax">' + esc(e.syntax.split('\n')[0]) + '</p>' +
      '</button>';
  }

  function renderBrowse(catId, isPreview) {
    /* isPreview=true 时只换中间内容，不改写「已锁定」状态与网址锚点 */
    if (!isPreview) activeCategoryId = catId || '';
    var catName = catId ? catNameById(catId) : '';
    if (catId && !catName) { go('#all'); return; }

    var list = catName ? entries.filter(function (e) { return e.category === catName; }) : entries;
    var desc = catName
      ? categories.filter(function (c) { return c.name === catName; })[0].desc
      : '按分类浏览，或按 Ctrl / ⌘ + K 直接搜索。共 ' + entries.length + ' 条结构、' + categories.length + ' 个分类。';

    $('view-title').textContent = catName || '全部结构';
    $('view-desc').textContent = desc || '';
    $('card-grid').innerHTML = list.map(cardHtml).join('');
    $('empty-state').hidden = list.length > 0;
    $('preview-badge').hidden = !isPreview;
    markNav(activeCategoryId, isPreview ? (catId || '') : null);
    showView('browse');
    updateSearchContext();
    if (!isPreview) document.title = (catName ? catName + ' · ' : '') + 'C 结构速查';
  }

  /* --------------------------- 视图：条目详情 --------------------------- */
  function renderDetail(id) {
    cancelPendingHover();        // 进详情页前取消待触发预览
    var e = byId[id];
    if (!e) { go('#all'); return; }

    $('detail-category').textContent = e.category;
    $('detail-name').textContent = e.name;
    $('detail-summary').textContent = e.summary;
    $('detail-syntax').textContent = e.syntax;
    /* 显示层用着色后的 HTML；textContent 仍是纯 C 源码，复制按钮取 textContent */
    $('detail-code').innerHTML = colorizeComments(e.code);
    $('detail-level').textContent = e.level === 'basic' ? '入门示例'
      : e.level === 'guided' ? '带注释示例'
      : e.level === 'detailed' ? '含难句解读' : '';

    /* 逐句解读：与代码里的 (1)(2) 编号呼应；没有就整块隐藏 */
    var walk = e.walkthrough || [];
    $('detail-walkthrough-section').hidden = walk.length === 0;
    $('detail-walkthrough').innerHTML = walk.map(function (w) {
      return '<li><span class="w-title"><span class="w-num">' + esc(w.n) +
        '</span>' + esc(w.title) + '</span>' +
        '<span class="w-text">' + inlineCode(w.text) + '</span></li>';
    }).join('');

    /* 参考来源：条目里的 references 用 source id 指向 DATA.sources。
     * 证据等级如实显示——「抓到正文」与「仅官方地址/正文截断」视觉上区分，
     * 避免把「列了来源」误读成「已逐条核对标准原文」。 */
    var sourceById = {};
    (DATA.sources || []).forEach(function (s) { sourceById[s.id] = s; });
    var refs = e.references || [];
    $('detail-refs-section').hidden = refs.length === 0;
    $('detail-refs').innerHTML = refs.map(function (r) {
      var s = sourceById[r.source];
      if (!s) return '';                    // 悬空引用不渲染，校验脚本会报
      var verified = s.verified === 'fetched-200';
      var label = verified ? '已抓取正文' : '未逐条核对';
      var note = verified ? '' : esc(s.note || '').replace(/`/g, '');
      return '<li>' +
        '<span class="ref-badge' + (verified ? '' : ' partial') + '">' + label + '</span>' +
        '<a href="' + esc(s.url) + '" target="_blank" rel="noopener noreferrer">' + esc(s.name) + '</a>' +
        '<span class="ref-topic"> · ' + esc(r.topic) + '</span>' +
        (r.section ? '<span class="ref-section">' + esc(r.section) + '</span>' : '') +
        (note ? '<span class="ref-note">' + note + '</span>' : '') +
        '</li>';
    }).join('');

    /* 可选字段 extra：补充说明（中性知识）。没有就整块隐藏 */
    var extras = e.extra || [];
    $('detail-extra-section').hidden = extras.length === 0;
    $('detail-extra').innerHTML = extras.map(function (x) {
      return '<li>' + inlineCode(x) + '</li>';
    }).join('');

    $('detail-pitfalls').innerHTML = (e.pitfalls || []).map(function (p) {
      return '<li>' + esc(p) + '</li>';
    }).join('');
    /* 别名只在搜索索引里使用，不在详情页展示（数据字段仍保留）。 */

    var rel = (e.related || []).filter(function (r) { return byId[r]; });
    $('detail-related-section').hidden = rel.length === 0;
    $('detail-related').innerHTML = rel.map(function (r) {
      return '<a class="related-link" href="#' + esc(r) + '">' + esc(byId[r].name) + ' →</a>';
    }).join('');

    $('back-link').href = activeCategoryId ? '#cat/' + esc(activeCategoryId) : '#all';

    /* 配套练习：题库里没覆盖的条目会自动隐藏整个区块 */
    if (window.Exercises && window.Exercises.mount) {
      try { window.Exercises.mount(id); } catch (err) { /* 练习出错不影响正文 */ }
    }

    previewCatId = null;                 // 进详情页前清掉预览，返回时状态干净
    markNav(catIdByName(e.category), null);
    showView('detail');
    document.title = e.name + ' · C 结构速查';
  }

  /* --------------------------- 视图：关于 --------------------------- */
  function renderAbout() {
    cancelPendingHover();
    $('about-version').textContent = '数据版本 ' + (DATA.version || '-') + ' · 共 ' + entries.length + ' 条';
    previewCatId = null;
    markNav('', null);
    showView('about');
    document.title = '关于 · C 结构速查';
  }

  function showView(which) {
    currentView = which;
    $('view-browse').hidden = which !== 'browse';
    $('view-detail').hidden = which !== 'detail';
    $('view-about').hidden = which !== 'about';
  }

  /* --------------------------- 路由 --------------------------- */
  function go(hash) {
    if (location.hash === hash) renderFromHash();
    else location.hash = hash;
  }

  function renderFromHash() {
    var h = decodeURIComponent(location.hash.replace(/^#/, ''));
    if (!h || h === 'all') renderBrowse('');
    else if (h === 'about') renderAbout();
    else if (h.indexOf('cat/') === 0) renderBrowse(h.slice(4));
    else renderDetail(h);
    window.scrollTo(0, 0);
  }

  /* --------------------------- 搜索浮层 --------------------------- */
  var results = [], cursor = -1, overlayOpen = false;

  function openSearch() {
    cancelPendingHover();       // 打开搜索时不允许迟到的预览改动中间内容
    overlayOpen = true;
    $('search-overlay').hidden = false;
    $('search-input').value = '';
    updateSearchContext();          // 搜索外观适配：显示「当前浏览」，不改匹配逻辑
    drawResults('');
    setTimeout(function () { $('search-input').focus(); }, 0);
  }
  function closeSearch() {
    overlayOpen = false;
    $('search-overlay').hidden = true;
    $('search-input').blur();
  }

  function drawResults(q) {
    var terms = low(q).trim().split(/\s+/).filter(Boolean);
    results = q.trim() ? search(q) : [];
    cursor = results.length ? 0 : -1;
    var box = $('search-results');

    if (!q.trim()) {
      var hot = ['for-loop', 'sizeof-operator', 'pointer-deref', 'malloc-free', 'operator-precedence']
        .filter(function (id) { return byId[id]; });
      box.innerHTML = '<div class="result-hint">常用条目</div>' + hot.map(function (id, i) {
        return '<button type="button" class="result-item' + (i === 0 ? ' cursor' : '') + '" data-id="' + esc(id) + '">' +
          '<div class="r-top"><span class="r-name">' + esc(byId[id].name) + '</span>' +
          '<span class="r-hit">' + esc(byId[id].category) + '</span></div>' +
          '<span class="r-summary">' + esc(byId[id].summary) + '</span></button>';
      }).join('');
      results = hot.map(function (id) { return { e: byId[id] }; });
      cursor = results.length ? 0 : -1;
      $('search-stat').textContent = '输入即出结果';
      return;
    }

    if (!results.length) {
      box.innerHTML = '<div class="result-empty">没有找到「' + esc(q) + '」<br><small>试试更短的关键字，例如「循环」「指针」「sizeof」</small></div>';
      $('search-stat').textContent = '0 条结果';
      return;
    }
    box.innerHTML = results.slice(0, 30).map(function (r, i) {
      return '<button type="button" class="result-item' + (i === cursor ? ' cursor' : '') + '" data-id="' + esc(r.e.id) + '">' +
        '<div class="r-top"><span class="r-name">' + highlight(r.e.name, terms) + '</span>' +
        '<span class="r-hit">' + esc(r.hit || r.e.category) + ' · ' + esc(r.e.category) + '</span></div>' +
        '<span class="r-summary">' + highlight(r.e.summary, terms) + '</span></button>';
    }).join('');
    $('search-stat').textContent = results.length + ' 条结果';
  }

  function moveCursor(delta) {
    if (!results.length) return;
    cursor = (cursor + delta + results.length) % results.length;
    Array.prototype.forEach.call(document.querySelectorAll('.result-item'), function (el, i) {
      el.classList.toggle('cursor', i === cursor);
      if (i === cursor) el.scrollIntoView({ block: 'nearest' });
    });
  }

  function openResult(id) {
    closeSearch();
    go('#' + id);
  }

  $('search-trigger').addEventListener('click', openSearch);
  $('search-overlay').addEventListener('mousedown', function (ev) {
    if (ev.target === $('search-overlay')) closeSearch();
  });
  $('search-input').addEventListener('input', function (ev) { drawResults(ev.target.value); });
  $('search-results').addEventListener('click', function (ev) {
    var btn = ev.target.closest('.result-item');
    if (btn) openResult(btn.getAttribute('data-id'));
  });

  document.addEventListener('keydown', function (ev) {
    var mod = ev.ctrlKey || ev.metaKey;
    var isK = mod && low(ev.key) === 'k';
    var isB = mod && low(ev.key) === 'b';
    var isW = mod && ev.shiftKey && low(ev.key) === 'w';
    if (isK) { ev.preventDefault(); overlayOpen ? closeSearch() : openSearch(); return; }
    if (isB) { ev.preventDefault(); toggleSidebar(); return; }
    if (isW) { ev.preventDefault(); toggleWidth(); return; }

    /* Esc 优先级：搜索浮层 > 窄屏抽屉 > 悬停预览 */
    if (ev.key === 'Escape') {
      if (overlayOpen) { ev.preventDefault(); closeSearch(); return; }
      if (isNarrow() && !collapsed) { ev.preventDefault(); toggleSidebar(true); return; }
      if (hoverTimer !== null || previewCatId !== null) {
        ev.preventDefault(); cancelPendingHover(); clearPreview(); return;
      }
      return;
    }
    if (!overlayOpen) return;
    if (ev.key === 'ArrowDown') { ev.preventDefault(); moveCursor(1); }
    else if (ev.key === 'ArrowUp') { ev.preventDefault(); moveCursor(-1); }
    else if (ev.key === 'Enter') {
      ev.preventDefault();
      if (results[cursor]) openResult(results[cursor].e.id);
    }
  });

  /* --------------------------- 其他绑定 --------------------------- */
  $('card-grid').addEventListener('click', function (ev) {
    var btn = ev.target.closest('.card');
    if (btn) go('#' + btn.getAttribute('data-id'));
  });
  $('brand-home').addEventListener('click', function (ev) { ev.preventDefault(); go('#all'); });
  $('show-all').addEventListener('click', function (ev) { ev.preventDefault(); go('#all'); });
  $('about-link').addEventListener('click', function (ev) { ev.preventDefault(); go('#about'); });
  $('about-back').addEventListener('click', function (ev) {
    ev.preventDefault(); go(activeCategoryId ? '#cat/' + activeCategoryId : '#all');
  });

  $('copy-btn').addEventListener('click', function () {
    // 用 textContent 而非 innerHTML：着色标签不会被复制进剪贴板
    var text = $('detail-code').textContent;
    function done() {
      var t = $('toast'); t.hidden = false;
      clearTimeout(done.timer);
      done.timer = setTimeout(function () { t.hidden = true; }, 1400);
    }
    // file:// 下 navigator.clipboard 常不可用，故保留 execCommand 兜底
    if (navigator.clipboard && window.isSecureContext) {
      navigator.clipboard.writeText(text).then(done, fallback);
    } else fallback();
    function fallback() {
      var ta = document.createElement('textarea');
      ta.value = text; ta.style.position = 'fixed'; ta.style.opacity = '0';
      document.body.appendChild(ta); ta.select();
      try { document.execCommand('copy'); done(); }
      catch (err) { $('toast').textContent = '复制失败，请手动选择'; done(); }
      document.body.removeChild(ta);
    }
  });

  window.addEventListener('hashchange', renderFromHash);

  /* --------------------------- 启动 --------------------------- */
  $('entry-count').textContent = entries.length + ' 条 · ' + categories.length + ' 类';
  initWidth();
  initSidebar();
  buildNav();
  renderFromHash();
})();
