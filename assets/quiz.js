/* =========================================================================
 * 试题模块（试行版）· 纯前端，无后端、无网络请求
 * 数据来自 data/quiz-bank.js；知识点链接回 index.html#<id>
 * ========================================================================= */
(function () {
  'use strict';

  var BANK = window.C_QUIZ_BANK;
  var DATA = window.C_QUICKREF;
  var $ = function (id) { return document.getElementById(id); };
  var esc = function (s) {
    return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;')
      .replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
  };
  var byId = {};
  (DATA.entries || []).forEach(function (e) { byId[e.id] = e; });

  /* 分类保持不变：仍是这套 9 个筛选范围，只是展示位置改到左侧栏目 */
  var topics = ['全部', 'C语言基础知识', '控制结构', '程序编程', '指针', '运算符',
    '数组与字符串', '函数', '变量作用域'];
  var selected = '全部';
  var LS_KEY = 'c-quickref-sidebar';   // 与速查页共用同一个收起状态

  /* 正在作答且尚未交卷：此时锁定左栏分类，避免误触打乱已作答内容。
   * 判据用「答题视图可见 + 未提交」，不依赖用户有没有填答案。 */
  function isAnswering() {
    var run = $('quiz-run');
    return !!run && run.hidden === false && submitted === false;
  }
  var active = [];        // 本次练习的题目
  var answers = {};       // id -> 用户答案
  var submitted = false;

  /* --------------------------- 顶部来源声明 --------------------------- */
  function renderOfficial() {
    var html = '<strong>考核范围（官方原文）</strong>：' + esc(BANK.official.subject) +
      ' · ' + esc(BANK.official.duration) + ' · ' + esc(BANK.official.coverage.join(' / ')) +
      '。' + esc(BANK.official.weighting) + '。';
    html += '<div class="quiz-src-list">' + BANK.sources.map(function (s) {
      if (!s.url) return '<span class="quiz-src">' + esc(s.title) + '（' + esc(s.note) + '）</span>';
      return '<a class="quiz-src" href="' + esc(s.url) +
        '" target="_blank" rel="noopener noreferrer">' + esc(s.title) + ' ↗</a>';
    }).join('') + '</div>';
    html += '<div class="quiz-structure">原卷结构：' + BANK.examStructure.map(function (x) {
      return esc(x.section + ' ' + x.type + '（' + x.no + '，' + x.score + '）');
    }).join('；') + '</div>';
    $('quiz-official').innerHTML = html;

    $('quiz-meta').textContent = '题库 ' + BANK.version + ' · 共 ' + BANK.questions.length +
      ' 题（判断 / 单选 / 填空 / 编程题标题）。每题标注原卷题号与改写说明。';
  }

  /* --------------------------- 选题 --------------------------- */
  function renderFilters() {
    /* 复用速查页左栏的 .nav-item 样式：分类在左侧、内容在右 */
    var locked = isAnswering();
    $('quiz-filters').innerHTML = topics.map(function (t) {
      var n = t === '全部' ? BANK.questions.length
        : BANK.questions.filter(function (q) { return q.topic === t; }).length;
      return '<button type="button" class="nav-item' + (t === selected ? ' active' : '') +
        (locked ? ' locked' : '') + '" data-topic="' + esc(t) + '"' +
        (locked ? ' aria-disabled="true" title="作答中已锁定分类，请先交卷或点重新选题"' : '') +
        '><span>' + esc(t) + '</span><span class="count">' + n + '</span></button>';
    }).join('');
    $('quiz-picked').textContent = locked
      ? '作答中 · 分类已锁定（' + selected + '，' + countOf(selected) + ' 题）'
      : '当前范围：' + selected + '（' + countOf(selected) + ' 题）';
  }

  function countOf(t) {
    return t === '全部' ? BANK.questions.length
      : BANK.questions.filter(function (q) { return q.topic === t; }).length;
  }

  /* --------------------------- 左栏收起 / 唤出（与速查页一致） --------------------------- */
  function readCollapsed() {
    try { return localStorage.getItem(LS_KEY) === '1'; } catch (e) { return false; }
  }
  function saveCollapsed(v) {
    try { localStorage.setItem(LS_KEY, v ? '1' : '0'); } catch (e) { /* 忽略隐私模式 */ }
  }
  function applySidebar() {
    var c = readCollapsed();
    document.body.classList[c ? 'add' : 'remove']('sidebar-collapsed');
    var btn = $('sidebar-toggle');
    if (btn) {
      btn.setAttribute('aria-expanded', c ? 'false' : 'true');
      btn.setAttribute('aria-label', c ? '唤出分类目录' : '收起分类目录');
      btn.title = (c ? '唤出分类目录' : '收起分类目录') + ' (Ctrl+B)';
    }
  }
  function initSidebar() {
    applySidebar();
    var btn = $('sidebar-toggle');
    if (btn) btn.addEventListener('click', function () {
      saveCollapsed(!readCollapsed());
      applySidebar();
    });
    document.addEventListener('keydown', function (ev) {
      if ((ev.ctrlKey || ev.metaKey) && !ev.shiftKey &&
          String(ev.key).toLowerCase() === 'b') {
        ev.preventDefault();
        saveCollapsed(!readCollapsed());
        applySidebar();
      }
    });
  }

  function pickQuestions() {
    var list = BANK.questions.filter(function (q) {
      return selected === '全部' || q.topic === selected;
    });
    // 编程题（仅标题）排到最后，不参与判分
    list.sort(function (a, b) {
      var pa = a.type === 'program' ? 1 : 0, pb = b.type === 'program' ? 1 : 0;
      return pa - pb;
    });
    return list;
  }

  /* --------------------------- 渲染题目 --------------------------- */
  function typeLabel(t) {
    return { single: '单选', judge: '判断', blank: '填空', program: '编程题（仅标题）' }[t] || t;
  }

  function renderQuestions() {
    $('quiz-list').innerHTML = active.map(function (q, i) {
      var head = '<div class="q-head"><span class="q-no">' + (i + 1) + '</span>' +
        '<span class="q-badge">' + typeLabel(q.type) + '</span>' +
        '<span class="q-src-no">原卷 ' + esc(q.sourceNo) + '</span>' +
        '<span class="q-origin ' + (q.origin === '真题标题' ? 'weak' : '') + '">' + esc(q.origin) + '</span>' +
        '<span class="q-topic">' + esc(q.topic) + '</span></div>';

      var code = q.code ? '<pre class="q-code"><code>' + esc(q.code) + '</code></pre>' : '';
      var stem = '<p class="q-stem">' + esc(q.stem) + '</p>';

      var body = '';
      if (q.type === 'single') {
        body = '<div class="q-options">' + q.options.map(function (o, k) {
          return '<label class="q-option"><input type="radio" name="q-' + esc(q.id) +
            '" value="' + k + '"><span>' + String.fromCharCode(65 + k) + '. ' + esc(o) + '</span></label>';
        }).join('') + '</div>';
      } else if (q.type === 'judge') {
        body = '<div class="q-options">' +
          '<label class="q-option"><input type="radio" name="q-' + esc(q.id) +
          '" value="true"><span>正确</span></label>' +
          '<label class="q-option"><input type="radio" name="q-' + esc(q.id) +
          '" value="false"><span>错误</span></label></div>';
      } else if (q.type === 'blank') {
        body = '<div class="q-blank"><input type="text" data-blank="' + esc(q.id) +
          '" placeholder="直接填答案，前后不要加空格" autocomplete="off" spellcheck="false"></div>';
      } else {
        body = '<p class="q-note">截图只给出题目标题，没有输入输出要求；这里不编造题面，只列出考查方向。</p>';
      }

      var explain = '<div class="q-explain" hidden>' +
        '<div class="q-explain-title">解析与考点</div>' +
        '<p>' + esc(q.explanation) + '</p>' +
        (q.adapted ? '<p class="q-adapted">改写说明：' + esc(q.adapted) + '</p>' : '') +
        '<div class="q-related">对应知识点：' + (q.related || []).map(function (r) {
          var e = byId[r];
          return e ? '<a href="index.html#' + esc(r) + '" target="_blank" rel="noopener noreferrer">' +
            esc(e.name) + ' →</a>' : '';
        }).join('') + '</div></div>';

      return '<li class="q-item" data-id="' + esc(q.id) + '">' + head + code + stem + body + explain + '</li>';
    }).join('');
  }

  /* --------------------------- 收集 / 判分 --------------------------- */
  function collect() {
    Object.keys(answers).forEach(function (k) { delete answers[k]; });
    active.forEach(function (q) {
      if (q.type === 'program') return;
      if (q.type === 'blank') {
        var inp = document.querySelector('[data-blank="' + q.id + '"]');
        answers[q.id] = inp ? inp.value.trim() : '';
      } else {
        var r = document.querySelector('input[name="q-' + q.id + '"]:checked');
        answers[q.id] = r ? r.value : null;
      }
    });
  }

  function isCorrect(q, a) {
    // 未作答一律判错：避免 null / 空串在某些比较里被误判为正确
    if (a === null || a === undefined || a === '') return false;
    if (q.type === 'single') return Number(a) === q.answer;
    if (q.type === 'judge') return a === String(q.answer);
    if (q.type === 'blank') return (q.acceptable || [q.answer]).indexOf(a) !== -1;
    return false;
  }

  function submit() {
    collect();
    submitted = true;
    renderFilters();          // 交卷 → 解除左栏锁定
    var graded = active.filter(function (q) { return q.type !== 'program'; });
    var right = 0;
    graded.forEach(function (q) {
      var ok = isCorrect(q, answers[q.id]);
      if (ok) right++;
      var li = document.querySelector('.q-item[data-id="' + q.id + '"]');
      li.classList.add(ok ? 'right' : 'wrong');
      li.querySelectorAll('input').forEach(function (i) { i.disabled = true; });
      var ex = li.querySelector('.q-explain');
      ex.hidden = false;
      ex.insertAdjacentHTML('afterbegin',
        '<div class="q-verdict ' + (ok ? 'ok' : 'no') + '">' +
        (ok ? '✓ 回答正确' : '✗ 回答错误') + '　正确答案：' +
        esc(q.type === 'single' ? String.fromCharCode(65 + q.answer) + '. ' + q.options[q.answer]
          : q.type === 'judge' ? (q.answer ? '正确' : '错误')
          : q.answer) + '</div>');
    });
    // 编程题只展开考点，不判分
    active.filter(function (q) { return q.type === 'program'; }).forEach(function (q) {
      var li = document.querySelector('.q-item[data-id="' + q.id + '"]');
      li.classList.add('info-only');
      li.querySelector('.q-explain').hidden = false;
    });

    var pct = graded.length ? Math.round(right * 100 / graded.length) : 0;
    $('quiz-score').innerHTML = '<strong>' + right + ' / ' + graded.length + '</strong>' +
      '<span>' + pct + '%</span>';
    $('quiz-result-note').textContent = '可判分 ' + graded.length + ' 题；编程题 ' +
      (active.length - graded.length) + ' 道仅展示标题，不计分。原卷为 120 分钟闭卷/机考，本页不计时。';
    $('quiz-setup').hidden = true;
    $('quiz-run').hidden = true;
    $('quiz-result').hidden = false;
    window.scrollTo(0, 0);
  }

  /* --------------------------- 视图切换 --------------------------- */
  function start() {
    active = pickQuestions();
    answers = {};
    submitted = false;
    renderQuestions();
    $('quiz-setup').hidden = true;
    $('quiz-result').hidden = true;
    $('quiz-run').hidden = false;
    renderFilters();          // 进入作答 → 左栏变锁定态
    updateProgress();
    window.scrollTo(0, 0);
  }

  function reset() {
    $('quiz-run').hidden = true;
    $('quiz-result').hidden = true;
    $('quiz-setup').hidden = false;
    submitted = false;
    renderFilters();          // 重新选题 → 解锁左栏
    window.scrollTo(0, 0);
  }

  function updateProgress() {
    collect();
    var graded = active.filter(function (q) { return q.type !== 'program'; });
    var done = graded.filter(function (q) {
      var a = answers[q.id];
      return a !== null && a !== undefined && a !== '';
    }).length;
    $('quiz-progress-text').textContent = '已作答 ' + done + ' / ' + graded.length +
      '（编程题 ' + (active.length - graded.length) + ' 道不计分）';
    $('quiz-progress-fill').style.width = (graded.length ? done * 100 / graded.length : 0) + '%';
  }

  /* --------------------------- 事件 --------------------------- */
  function init() {
    renderOfficial();
    renderFilters();
    initSidebar();
    var cnt = $('entry-count');
    if (cnt) cnt.textContent = '共 ' + BANK.questions.length + ' 题';

    $('quiz-filters').addEventListener('click', function (ev) {
      /* 按 data-topic 找按钮：点按钮里的文字 <span> 也能冒泡命中。 */
      var b = ev.target.closest('[data-topic]');
      if (!b) return;
      if (isAnswering()) {
        /* 作答未提交 → 不切换分类、不动已填答案，只给一句明确说明 */
        $('quiz-picked').textContent = '作答中 · 分类已锁定，请先交卷或点「重新选题」（当前：' +
          selected + '）';
        return;
      }
      selected = b.getAttribute('data-topic');
      renderFilters();
    });
    $('quiz-start').addEventListener('click', start);
    $('quiz-submit').addEventListener('click', submit);
    $('quiz-reset').addEventListener('click', reset);
    $('quiz-again').addEventListener('click', reset);
    $('quiz-review').addEventListener('click', function () {
      $('quiz-result').hidden = true;
      $('quiz-run').hidden = false;
      renderFilters();        // 已提交，左栏保持解锁
      window.scrollTo(0, 0);
    });
    $('quiz-list').addEventListener('change', updateProgress);
    $('quiz-list').addEventListener('input', function (ev) {
      if (ev.target.matches('[data-blank]')) updateProgress();
    });
  }

  init();
})();
